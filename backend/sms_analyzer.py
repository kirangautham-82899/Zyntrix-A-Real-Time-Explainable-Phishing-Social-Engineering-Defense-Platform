"""
SMS Analyzer Module
Analyzes SMS/text messages for social engineering and scam patterns
"""

import re
from typing import Dict, List
from urllib.parse import urlparse

class SMSAnalyzer:
    """Analyzes SMS messages for social engineering and scam indicators"""
    
    # Social engineering keywords
    SOCIAL_ENGINEERING_KEYWORDS = [
        'congratulations', 'winner', 'won', 'prize', 'reward', 'free',
        'claim', 'gift', 'lottery', 'selected', 'chosen', 'lucky'
    ]
    
    # Urgency keywords specific to SMS scams
    URGENCY_KEYWORDS = [
        'urgent', 'immediately', 'now', 'asap', 'hurry', 'quick',
        'expire', 'expires', 'expiring', 'today', 'tonight',
        'limited time', 'act fast', 'don\'t miss', 'last chance'
    ]
    
    # Fear and threat keywords
    FEAR_KEYWORDS = [
        'suspended', 'blocked', 'locked', 'deactivated', 'cancelled',
        'fraud', 'unauthorized', 'suspicious', 'unusual', 'alert',
        'warning', 'security', 'compromised', 'breach', 'violation'
    ]
    
    # Financial scam keywords
    FINANCIAL_KEYWORDS = [
        'bank', 'account', 'card', 'payment', 'refund', 'tax',
        'irs', 'debt', 'money', 'cash', 'deposit', 'transfer',
        'paypal', 'venmo', 'zelle', 'bitcoin', 'crypto'
    ]
    
    # Delivery/package scam keywords
    DELIVERY_KEYWORDS = [
        'package', 'delivery', 'shipped', 'tracking', 'fedex',
        'ups', 'usps', 'dhl', 'amazon', 'parcel', 'courier'
    ]
    
    # Authority impersonation keywords
    AUTHORITY_KEYWORDS = [
        'police', 'officer', 'government', 'irs', 'fbi', 'court',
        'legal', 'lawyer', 'attorney', 'warrant', 'arrest', 'fine'
    ]
    
    # Action-demanding keywords
    ACTION_KEYWORDS = [
        'click', 'tap', 'call', 'text', 'reply', 'respond',
        'verify', 'confirm', 'update', 'validate', 'download',
        'install', 'provide', 'send', 'submit'
    ]
    
    def __init__(self):
        self.risk_factors = []
    
    def analyze(self, sms_content: str, sender_number: str = None) -> Dict:
        """
        Main analysis function for SMS content
        Returns comprehensive analysis results
        """
        self.risk_factors = []
        
        # Analyze sender if provided
        sender_analysis = {}
        if sender_number:
            sender_analysis = self._analyze_sender(sender_number)
        
        # Analyze content
        content_analysis = self._analyze_content(sms_content)
        keyword_analysis = self._analyze_keywords(sms_content)
        url_analysis = self._analyze_urls(sms_content)
        pattern_analysis = self._analyze_patterns(sms_content)
        
        # Calculate risk score
        risk_score = self._calculate_risk_score()
        risk_level = self._get_risk_level(risk_score)
        
        return {
            'valid': True,
            'sender_number': sender_number,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'factors': self.risk_factors,
            'sender_analysis': sender_analysis,
            'content_analysis': content_analysis,
            'keyword_analysis': keyword_analysis,
            'url_analysis': url_analysis,
            'pattern_analysis': pattern_analysis
        }
    
    def _analyze_sender(self, sender_number: str) -> Dict:
        """Analyze sender number characteristics"""
        # Remove common formatting
        cleaned = re.sub(r'[^\d+]', '', sender_number)
        
        analysis = {
            'is_shortcode': len(cleaned) <= 6 and cleaned.isdigit(),
            'is_international': sender_number.startswith('+') and not sender_number.startswith('+1'),
            'is_email': '@' in sender_number,  # Some SMS come from email
            'length': len(cleaned)
        }
        
        # Add risk factors
        if analysis['is_shortcode']:
            # Shortcodes can be legitimate (banks, services) or scams
            self.risk_factors.append({
                'name': 'Shortcode Sender',
                'impact': 'neutral',
                'description': 'Message from shortcode (could be legitimate service or scam)',
                'weight': 0
            })
        
        if analysis['is_international']:
            self.risk_factors.append({
                'name': 'International Number',
                'impact': 'negative',
                'description': 'Message from international number',
                'weight': 15
            })
        
        if analysis['is_email']:
            self.risk_factors.append({
                'name': 'Email-to-SMS',
                'impact': 'negative',
                'description': 'Message sent from email address',
                'weight': 10
            })
        
        return analysis
    
    def _analyze_content(self, content: str) -> Dict:
        """Analyze SMS content characteristics"""
        analysis = {
            'length': len(content),
            'has_urls': bool(re.search(r'https?://|www\.', content)),
            'url_count': len(re.findall(r'https?://[^\s]+|www\.[^\s]+', content)),
            'has_phone_numbers': bool(re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content)),
            'phone_count': len(re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', content)),
            'excessive_caps': self._check_excessive_caps(content),
            'excessive_punctuation': self._check_excessive_punctuation(content),
            'has_emojis': bool(re.search(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]', content))
        }
        
        # Add risk factors
        if analysis['url_count'] > 0:
            self.risk_factors.append({
                'name': 'Contains URLs',
                'impact': 'negative',
                'description': f'SMS contains {analysis["url_count"]} URL(s)',
                'weight': 20
            })
        
        if analysis['phone_count'] > 1:
            self.risk_factors.append({
                'name': 'Multiple Phone Numbers',
                'impact': 'negative',
                'description': 'SMS contains multiple phone numbers',
                'weight': 15
            })
        
        if analysis['excessive_caps']:
            self.risk_factors.append({
                'name': 'Excessive Capitalization',
                'impact': 'negative',
                'description': 'Unusual use of capital letters',
                'weight': 10
            })
        
        if analysis['excessive_punctuation']:
            self.risk_factors.append({
                'name': 'Excessive Punctuation',
                'impact': 'negative',
                'description': 'Excessive use of exclamation marks',
                'weight': 10
            })
        
        return analysis
    
    def _analyze_keywords(self, content: str) -> Dict:
        """Analyze presence of scam-related keywords"""
        content_lower = content.lower()
        
        # Find keywords in each category
        found_social = [kw for kw in self.SOCIAL_ENGINEERING_KEYWORDS if kw in content_lower]
        found_urgency = [kw for kw in self.URGENCY_KEYWORDS if kw in content_lower]
        found_fear = [kw for kw in self.FEAR_KEYWORDS if kw in content_lower]
        found_financial = [kw for kw in self.FINANCIAL_KEYWORDS if kw in content_lower]
        found_delivery = [kw for kw in self.DELIVERY_KEYWORDS if kw in content_lower]
        found_authority = [kw for kw in self.AUTHORITY_KEYWORDS if kw in content_lower]
        found_action = [kw for kw in self.ACTION_KEYWORDS if kw in content_lower]
        
        analysis = {
            'social_engineering': found_social,
            'social_count': len(found_social),
            'urgency': found_urgency,
            'urgency_count': len(found_urgency),
            'fear': found_fear,
            'fear_count': len(found_fear),
            'financial': found_financial,
            'financial_count': len(found_financial),
            'delivery': found_delivery,
            'delivery_count': len(found_delivery),
            'authority': found_authority,
            'authority_count': len(found_authority),
            'action': found_action,
            'action_count': len(found_action),
            'total_suspicious': len(found_social) + len(found_urgency) + len(found_fear) + 
                               len(found_financial) + len(found_delivery) + len(found_authority) + len(found_action)
        }
        
        # Add risk factors
        if found_social:
            self.risk_factors.append({
                'name': 'Social Engineering Language',
                'impact': 'negative',
                'description': f'Prize/reward scam keywords: {", ".join(found_social[:3])}',
                'weight': 25
            })
        
        if found_urgency:
            self.risk_factors.append({
                'name': 'Urgency Language',
                'impact': 'negative',
                'description': f'Creates false urgency: {", ".join(found_urgency[:3])}',
                'weight': 15
            })
        
        if found_fear:
            self.risk_factors.append({
                'name': 'Fear-Based Language',
                'impact': 'negative',
                'description': f'Uses fear tactics: {", ".join(found_fear[:3])}',
                'weight': 20
            })
        
        if found_financial:
            self.risk_factors.append({
                'name': 'Financial Keywords',
                'impact': 'negative',
                'description': f'Financial scam indicators: {", ".join(found_financial[:3])}',
                'weight': 20
            })
        
        if found_delivery:
            self.risk_factors.append({
                'name': 'Delivery Scam Pattern',
                'impact': 'negative',
                'description': f'Fake delivery scam: {", ".join(found_delivery[:3])}',
                'weight': 20
            })
        
        if found_authority:
            self.risk_factors.append({
                'name': 'Authority Impersonation',
                'impact': 'negative',
                'description': f'Impersonates authority: {", ".join(found_authority[:3])}',
                'weight': 25
            })
        
        if found_action:
            self.risk_factors.append({
                'name': 'Action-Demanding',
                'impact': 'negative',
                'description': f'Demands immediate action: {", ".join(found_action[:3])}',
                'weight': 15
            })
        
        return analysis
    
    def _analyze_urls(self, content: str) -> Dict:
        """Extract and analyze URLs in SMS"""
        # Find all URLs (including shortened)
        url_pattern = r'https?://[^\s]+|www\.[^\s]+|bit\.ly/[^\s]+|tinyurl\.com/[^\s]+'
        urls = re.findall(url_pattern, content, re.IGNORECASE)
        
        analysis = {
            'url_count': len(urls),
            'urls': urls,
            'has_shortened_urls': False,
            'has_suspicious_domains': False
        }
        
        # Check for URL shorteners
        shortener_patterns = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'short.link']
        
        for url in urls:
            if any(shortener in url.lower() for shortener in shortener_patterns):
                analysis['has_shortened_urls'] = True
                break
        
        # Add risk factors
        if analysis['has_shortened_urls']:
            self.risk_factors.append({
                'name': 'Shortened URLs',
                'impact': 'negative',
                'description': 'Contains shortened URLs hiding destination',
                'weight': 20
            })
        
        return analysis
    
    def _analyze_patterns(self, content: str) -> Dict:
        """Analyze common scam patterns"""
        content_lower = content.lower()
        
        analysis = {
            'prize_scam': any(word in content_lower for word in ['won', 'winner', 'prize', 'claim']),
            'verification_scam': any(word in content_lower for word in ['verify', 'confirm', 'validate']),
            'package_scam': any(word in content_lower for word in ['package', 'delivery', 'shipped']),
            'bank_scam': any(word in content_lower for word in ['bank', 'account suspended', 'card blocked']),
            'tax_scam': any(word in content_lower for word in ['irs', 'tax refund', 'tax return']),
            'tech_support_scam': any(word in content_lower for word in ['virus', 'infected', 'tech support'])
        }
        
        # Count scam patterns
        scam_count = sum(1 for v in analysis.values() if v)
        analysis['scam_pattern_count'] = scam_count
        
        return analysis
    
    def _check_excessive_caps(self, content: str) -> bool:
        """Check for excessive capitalization"""
        if len(content) < 10:
            return False
        
        caps_count = sum(1 for c in content if c.isupper())
        caps_ratio = caps_count / len(content)
        
        return caps_ratio > 0.4  # More than 40% caps
    
    def _check_excessive_punctuation(self, content: str) -> bool:
        """Check for excessive punctuation"""
        exclamation_count = content.count('!')
        return exclamation_count > 2
    
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
sms_analyzer = SMSAnalyzer()
