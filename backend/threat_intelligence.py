"""
Threat Intelligence Module
Integrates with external threat intelligence APIs for domain reputation checking
"""

import os
import requests
from typing import Dict, Optional
from datetime import datetime, timedelta
from cache import cache
from dotenv import load_dotenv

load_dotenv()

class ThreatIntelligence:
    """
    Queries external threat intelligence APIs for domain reputation
    Supports VirusTotal, Google Safe Browsing, and URLhaus
    """
    
    def __init__(self):
        self.virustotal_api_key = os.getenv('VIRUSTOTAL_API_KEY')
        self.safe_browsing_api_key = os.getenv('GOOGLE_SAFE_BROWSING_API_KEY')
        self.enabled = os.getenv('THREAT_INTEL_ENABLED', 'false').lower() == 'true'
        self.cache_ttl = 86400  # 24 hours
        
    def check_domain_reputation(self, domain: str) -> Dict:
        """
        Check domain reputation across multiple threat intelligence sources
        
        Args:
            domain: Domain name to check
            
        Returns:
            Dictionary with reputation data and risk indicators
        """
        if not self.enabled:
            return {
                'enabled': False,
                'reputation_score': 0,
                'is_malicious': False,
                'sources_checked': []
            }
        
        # Check cache first
        cache_key = cache.generate_cache_key('threat_intel', domain)
        cached_result = cache.get(cache_key)
        
        if cached_result:
            return cached_result
        
        result = {
            'enabled': True,
            'domain': domain,
            'reputation_score': 0,  # 0-100, higher is more dangerous
            'is_malicious': False,
            'sources_checked': [],
            'detections': [],
            'checked_at': datetime.utcnow().isoformat()
        }
        
        # Check VirusTotal
        if self.virustotal_api_key:
            vt_result = self._check_virustotal(domain)
            if vt_result:
                result['sources_checked'].append('VirusTotal')
                result['virustotal'] = vt_result
                result['reputation_score'] += vt_result.get('risk_score', 0)
                if vt_result.get('is_malicious'):
                    result['is_malicious'] = True
                    result['detections'].extend(vt_result.get('detections', []))
        
        # Check Google Safe Browsing
        if self.safe_browsing_api_key:
            gsb_result = self._check_safe_browsing(domain)
            if gsb_result:
                result['sources_checked'].append('Google Safe Browsing')
                result['safe_browsing'] = gsb_result
                result['reputation_score'] += gsb_result.get('risk_score', 0)
                if gsb_result.get('is_malicious'):
                    result['is_malicious'] = True
                    result['detections'].extend(gsb_result.get('detections', []))
        
        # Check URLhaus (free, no API key needed)
        urlhaus_result = self._check_urlhaus(domain)
        if urlhaus_result:
            result['sources_checked'].append('URLhaus')
            result['urlhaus'] = urlhaus_result
            result['reputation_score'] += urlhaus_result.get('risk_score', 0)
            if urlhaus_result.get('is_malicious'):
                result['is_malicious'] = True
                result['detections'].extend(urlhaus_result.get('detections', []))
        
        # Normalize reputation score (average across sources)
        if len(result['sources_checked']) > 0:
            result['reputation_score'] = min(100, result['reputation_score'] // len(result['sources_checked']))
        
        # Cache result
        cache.set(cache_key, result, ttl=self.cache_ttl)
        
        return result
    
    def _check_virustotal(self, domain: str) -> Optional[Dict]:
        """
        Check domain reputation using VirusTotal API
        """
        try:
            url = f"https://www.virustotal.com/api/v3/domains/{domain}"
            headers = {
                "x-apikey": self.virustotal_api_key
            }
            
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get('data', {}).get('attributes', {}).get('last_analysis_stats', {})
                
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                total = sum(stats.values())
                
                # Calculate risk score based on detection ratio
                risk_score = 0
                if total > 0:
                    detection_ratio = (malicious + suspicious) / total
                    risk_score = int(detection_ratio * 100)
                
                detections = []
                if malicious > 0:
                    detections.append(f"{malicious} security vendors flagged as malicious")
                if suspicious > 0:
                    detections.append(f"{suspicious} security vendors flagged as suspicious")
                
                return {
                    'risk_score': risk_score,
                    'is_malicious': malicious > 0,
                    'malicious_count': malicious,
                    'suspicious_count': suspicious,
                    'total_vendors': total,
                    'detections': detections
                }
            
            return None
            
        except Exception as e:
            print(f"VirusTotal API error: {e}")
            return None
    
    def _check_safe_browsing(self, domain: str) -> Optional[Dict]:
        """
        Check domain using Google Safe Browsing API
        """
        try:
            url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.safe_browsing_api_key}"
            
            payload = {
                "client": {
                    "clientId": "zyntrix",
                    "clientVersion": "1.0.0"
                },
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [
                        {"url": f"http://{domain}"},
                        {"url": f"https://{domain}"}
                    ]
                }
            }
            
            response = requests.post(url, json=payload, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                matches = data.get('matches', [])
                
                if matches:
                    threat_types = [match.get('threatType') for match in matches]
                    detections = [f"Google flagged as {threat}" for threat in threat_types]
                    
                    return {
                        'risk_score': 80,  # High risk if flagged by Google
                        'is_malicious': True,
                        'threat_types': threat_types,
                        'detections': detections
                    }
                else:
                    return {
                        'risk_score': 0,
                        'is_malicious': False,
                        'threat_types': [],
                        'detections': []
                    }
            
            return None
            
        except Exception as e:
            print(f"Google Safe Browsing API error: {e}")
            return None
    
    def _check_urlhaus(self, domain: str) -> Optional[Dict]:
        """
        Check domain using URLhaus API (free, no API key required)
        """
        try:
            url = "https://urlhaus-api.abuse.ch/v1/host/"
            data = {"host": domain}
            
            response = requests.post(url, data=data, timeout=5)
            
            if response.status_code == 200:
                result = response.json()
                
                if result.get('query_status') == 'ok':
                    urls = result.get('urls', [])
                    
                    if urls:
                        # Domain is in URLhaus database
                        malware_count = sum(1 for u in urls if u.get('url_status') == 'online')
                        
                        detections = [f"URLhaus database contains {len(urls)} malicious URL(s) from this domain"]
                        if malware_count > 0:
                            detections.append(f"{malware_count} currently active malware URL(s)")
                        
                        return {
                            'risk_score': min(100, len(urls) * 20),  # Scale risk by number of malicious URLs
                            'is_malicious': True,
                            'malicious_urls_count': len(urls),
                            'active_threats': malware_count,
                            'detections': detections
                        }
                    else:
                        return {
                            'risk_score': 0,
                            'is_malicious': False,
                            'malicious_urls_count': 0,
                            'detections': []
                        }
                else:
                    # Domain not in database (good sign)
                    return {
                        'risk_score': 0,
                        'is_malicious': False,
                        'malicious_urls_count': 0,
                        'detections': []
                    }
            
            return None
            
        except Exception as e:
            print(f"URLhaus API error: {e}")
            return None

# Create singleton instance
threat_intelligence = ThreatIntelligence()
