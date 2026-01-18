"""
URL Analyzer Module
Analyzes URLs for phishing and malicious patterns
"""

import re
import tldextract
import validators
from urllib.parse import urlparse, parse_qs
from typing import Dict, List, Tuple

class URLAnalyzer:
    """Analyzes URLs for suspicious patterns and phishing indicators"""
    
    # Suspicious keywords commonly found in phishing URLs
    SUSPICIOUS_KEYWORDS = [
        'verify', 'account', 'update', 'confirm', 'login', 'signin', 'banking',
        'ebayisapi', 'webscr', 'password', 'credential', 'urgent',
        'suspended', 'locked', 'unusual', 'click', 'here', 'now', 'immediately',
        'validate', 'restore', 'limited', 'expire', 'alert', 'notification'
    ]
    
    # Suspicious TLDs (top-level domains)
    SUSPICIOUS_TLDS = [
        'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'work', 'click', 'link',
        'download', 'racing', 'party', 'review', 'trade', 'webcam', 'win'
    ]
    
    # Trusted domains (whitelist)
    TRUSTED_DOMAINS = [
        'google.com', 'facebook.com', 'amazon.com', 'microsoft.com', 'apple.com',
        'github.com', 'stackoverflow.com', 'wikipedia.org', 'youtube.com',
        'twitter.com', 'linkedin.com', 'instagram.com', 'reddit.com', 'netflix.com',
        'paypal.com', 'ebay.com', 'yahoo.com', 'bing.com', 'adobe.com', 'dropbox.com'
    ]
    
    def __init__(self):
        self.risk_factors = []
    
    def analyze(self, url: str) -> Dict:
        """
        Main analysis function
        Returns comprehensive analysis results
        """
        self.risk_factors = []
        
        # Validate URL format
        if not self._is_valid_url(url):
            return {
                'valid': False,
                'error': 'Invalid URL format',
                'risk_score': 100,
                'risk_level': 'dangerous'
            }
        
        # Extract URL components
        parsed = urlparse(url)
        extracted = tldextract.extract(url)
        
        # Perform analysis
        domain_analysis = self._analyze_domain(extracted, parsed)
        pattern_analysis = self._analyze_patterns(url, parsed)
        structure_analysis = self._analyze_structure(url, parsed)
        
        # Calculate risk score
        risk_score = self._calculate_risk_score()
        risk_level = self._get_risk_level(risk_score)
        
        return {
            'valid': True,
            'url': url,
            'domain': f"{extracted.domain}.{extracted.suffix}",
            'subdomain': extracted.subdomain,
            'path': parsed.path,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'factors': self.risk_factors,
            'domain_analysis': domain_analysis,
            'pattern_analysis': pattern_analysis,
            'structure_analysis': structure_analysis
        }
    
    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format"""
        return validators.url(url) is True
    
    def _analyze_domain(self, extracted, parsed) -> Dict:
        """Analyze domain characteristics"""
        domain = f"{extracted.domain}.{extracted.suffix}"
        analysis = {
            'is_ip': self._is_ip_address(parsed.netloc),
            'is_trusted': domain in self.TRUSTED_DOMAINS,
            'has_suspicious_tld': extracted.suffix in self.SUSPICIOUS_TLDS,
            'domain_length': len(extracted.domain),
            'has_numbers': bool(re.search(r'\d', extracted.domain)),
            'has_hyphens': '-' in extracted.domain
        }
        
        # Add risk factors
        if analysis['is_ip']:
            self.risk_factors.append({
                'name': 'IP-based URL',
                'impact': 'negative',
                'description': 'URL uses IP address instead of domain name',
                'weight': 25
            })
        
        if analysis['is_trusted']:
            self.risk_factors.append({
                'name': 'Trusted Domain',
                'impact': 'positive',
                'description': 'Domain is in trusted whitelist',
                'weight': 30
            })
        
        if analysis['has_suspicious_tld']:
            self.risk_factors.append({
                'name': 'Suspicious TLD',
                'impact': 'negative',
                'description': f'TLD ".{extracted.suffix}" is commonly used in phishing',
                'weight': 20
            })
        
        if analysis['domain_length'] > 20:
            self.risk_factors.append({
                'name': 'Long Domain Name',
                'impact': 'negative',
                'description': 'Unusually long domain name',
                'weight': 10
            })
        
        return analysis
    
    def _analyze_patterns(self, url: str, parsed) -> Dict:
        """Analyze URL for suspicious patterns"""
        url_lower = url.lower()
        
        # Check for suspicious keywords
        found_keywords = [kw for kw in self.SUSPICIOUS_KEYWORDS if kw in url_lower]
        
        # Check for URL shorteners
        shortener_domains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly']
        is_shortened = any(domain in url_lower for domain in shortener_domains)
        
        # Check for obfuscation
        has_at_symbol = '@' in url
        has_double_slash = '//' in parsed.path
        excessive_subdomains = len(parsed.netloc.split('.')) > 4
        
        analysis = {
            'suspicious_keywords': found_keywords,
            'keyword_count': len(found_keywords),
            'is_shortened': is_shortened,
            'has_at_symbol': has_at_symbol,
            'has_double_slash': has_double_slash,
            'excessive_subdomains': excessive_subdomains
        }
        
        # Add risk factors
        if found_keywords:
            self.risk_factors.append({
                'name': 'Suspicious Keywords',
                'impact': 'negative',
                'description': f'Found keywords: {", ".join(found_keywords[:3])}',
                'weight': 15
            })
        
        if is_shortened:
            self.risk_factors.append({
                'name': 'URL Shortener',
                'impact': 'negative',
                'description': 'URL uses shortening service',
                'weight': 15
            })
        
        if has_at_symbol:
            self.risk_factors.append({
                'name': 'URL Obfuscation',
                'impact': 'negative',
                'description': 'URL contains @ symbol (obfuscation technique)',
                'weight': 20
            })
        
        if excessive_subdomains:
            self.risk_factors.append({
                'name': 'Excessive Subdomains',
                'impact': 'negative',
                'description': 'Unusually many subdomains',
                'weight': 15
            })
        
        return analysis
    
    def _analyze_structure(self, url: str, parsed) -> Dict:
        """Analyze URL structure"""
        analysis = {
            'url_length': len(url),
            'path_length': len(parsed.path),
            'has_query': bool(parsed.query),
            'query_params': len(parse_qs(parsed.query)),
            'has_fragment': bool(parsed.fragment),
            'uses_https': parsed.scheme == 'https'
        }
        
        # Add risk factors
        if analysis['url_length'] > 100:
            self.risk_factors.append({
                'name': 'Long URL',
                'impact': 'negative',
                'description': 'URL is unusually long',
                'weight': 10
            })
        
        if not analysis['uses_https']:
            self.risk_factors.append({
                'name': 'No HTTPS',
                'impact': 'negative',
                'description': 'URL does not use secure HTTPS protocol',
                'weight': 15
            })
        else:
            self.risk_factors.append({
                'name': 'HTTPS Protocol',
                'impact': 'positive',
                'description': 'URL uses secure HTTPS',
                'weight': 15
            })
        
        return analysis
    
    def _is_ip_address(self, netloc: str) -> bool:
        """Check if netloc is an IP address"""
        # Remove port if present
        host = netloc.split(':')[0]
        # Simple IP pattern check
        ip_pattern = r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$'
        return bool(re.match(ip_pattern, host))
    
    def _calculate_risk_score(self) -> int:
        """Calculate overall risk score (0-100)"""
        positive_score = sum(f['weight'] for f in self.risk_factors if f['impact'] == 'positive')
        negative_score = sum(f['weight'] for f in self.risk_factors if f['impact'] == 'negative')
        
        # Base score is 50 (neutral)
        base_score = 50
        
        # Adjust based on factors
        final_score = base_score + negative_score - positive_score
        
        # Clamp between 0 and 100
        return max(0, min(100, final_score))
    
    def _get_risk_level(self, score: int) -> str:
        """Determine risk level from score"""
        if score <= 30:
            return 'safe'
        elif score <= 70:
            return 'suspicious'
        else:
            return 'dangerous'

# Create singleton instance
url_analyzer = URLAnalyzer()
