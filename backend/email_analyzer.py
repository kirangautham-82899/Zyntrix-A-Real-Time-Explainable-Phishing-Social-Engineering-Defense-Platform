"""
Email Analyzer Module
Analyzes email content for phishing and social engineering patterns
"""

import re
from email_validator import validate_email, EmailNotValidError
from typing import Dict, List
from urllib.parse import urlparse

class EmailAnalyzer:
    """Analyzes email content for phishing and social engineering indicators"""
    
    # Urgency and fear-based keywords
    URGENCY_KEYWORDS = [
        'urgent', 'immediately', 'act now', 'right now', 'asap', 'hurry',
        'limited time', 'expire', 'expires', 'expiring', 'deadline',
        'final notice', 'last chance', 'time sensitive', 'quick', 'fast'
    ]
    
    # Fear and threat keywords
    FEAR_KEYWORDS = [
        'suspended', 'locked', 'blocked', 'disabled', 'terminated',
        'unauthorized', 'unusual activity', 'suspicious', 'compromised',
        'security alert', 'fraud', 'fraudulent', 'illegal', 'violation'
    ]
    
    # Action-demanding keywords
    ACTION_KEYWORDS = [
        'verify', 'confirm', 'update', 'validate', 'click here', 'click now',
        'download', 'install', 'open attachment', 'reset password',
        'provide information', 'submit', 'respond', 'reply immediately'
    ]
    
    # Financial/credential keywords
    SENSITIVE_KEYWORDS = [
        'password', 'credit card', 'bank account', 'ssn', 'social security',
        'pin', 'account number', 'routing number', 'cvv', 'credentials',
        'login', 'username', 'billing', 'payment', 'refund', 'tax'
    ]
    
    # Trusted email domains
    TRUSTED_DOMAINS = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'icloud.com', 'protonmail.com', 'aol.com'
    ]
    
    def __init__(self):
        self.risk_factors = []
    
    def analyze(self, email_content: str, sender_email: str = None) -> Dict:
        """
        Main analysis function for email content
        Returns comprehensive analysis results
        """
        self.risk_factors = []
        
        # Analyze sender if provided
        sender_analysis = {}
        if sender_email:
            sender_analysis = self._analyze_sender(sender_email)
        
        # Analyze content
        content_analysis = self._analyze_content(email_content)
        keyword_analysis = self._analyze_keywords(email_content)
        url_analysis = self._analyze_urls(email_content)
        
        # Calculate risk score
        risk_score = self._calculate_risk_score()
        risk_level = self._get_risk_level(risk_score)
        
        return {
            'valid': True,
            'sender_email': sender_email,
            'risk_score': risk_score,
            'risk_level': risk_level,
            'factors': self.risk_factors,
            'sender_analysis': sender_analysis,
            'content_analysis': content_analysis,
            'keyword_analysis': keyword_analysis,
            'url_analysis': url_analysis
        }
    
    def _analyze_sender(self, sender_email: str) -> Dict:
        """Analyze sender email address"""
        analysis = {
            'is_valid': False,
            'domain': None,
            'is_trusted': False,
            'is_freemail': False
        }
        
        try:
            # Validate email
            validated = validate_email(sender_email, check_deliverability=False)
            analysis['is_valid'] = True
            analysis['domain'] = validated.domain
            
            # Check if trusted domain
            analysis['is_trusted'] = validated.domain in self.TRUSTED_DOMAINS
            
            # Check if free email service
            freemail_domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
            analysis['is_freemail'] = validated.domain in freemail_domains
            
            # Add risk factors
            if analysis['is_trusted']:
                self.risk_factors.append({
                    'name': 'Trusted Email Domain',
                    'impact': 'positive',
                    'description': f'Sender uses trusted domain: {validated.domain}',
                    'weight': 20
                })
            
        except EmailNotValidError:
            self.risk_factors.append({
                'name': 'Invalid Sender Email',
                'impact': 'negative',
                'description': 'Sender email address is invalid',
                'weight': 25
            })
        
        return analysis
    
    def _analyze_content(self, content: str) -> Dict:
        """Analyze email content characteristics"""
        content_lower = content.lower()
        
        analysis = {
            'length': len(content),
            'has_html': bool(re.search(r'<[^>]+>', content)),
            'has_links': bool(re.search(r'https?://', content)),
            'link_count': len(re.findall(r'https?://[^\s<>"]+', content)),
            'has_attachments_mention': any(word in content_lower for word in ['attachment', 'attached', 'download']),
            'excessive_caps': self._check_excessive_caps(content),
            'excessive_punctuation': self._check_excessive_punctuation(content)
        }
        
        # Add risk factors
        if analysis['link_count'] > 5:
            self.risk_factors.append({
                'name': 'Excessive Links',
                'impact': 'negative',
                'description': f'Email contains {analysis["link_count"]} links',
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
                'description': 'Excessive use of exclamation marks or question marks',
                'weight': 10
            })
        
        return analysis
    
    def _analyze_keywords(self, content: str) -> Dict:
        """Analyze presence of suspicious keywords"""
        content_lower = content.lower()
        
        # Find keywords in each category
        found_urgency = [kw for kw in self.URGENCY_KEYWORDS if kw in content_lower]
        found_fear = [kw for kw in self.FEAR_KEYWORDS if kw in content_lower]
        found_action = [kw for kw in self.ACTION_KEYWORDS if kw in content_lower]
        found_sensitive = [kw for kw in self.SENSITIVE_KEYWORDS if kw in content_lower]
        
        analysis = {
            'urgency_keywords': found_urgency,
            'urgency_count': len(found_urgency),
            'fear_keywords': found_fear,
            'fear_count': len(found_fear),
            'action_keywords': found_action,
            'action_count': len(found_action),
            'sensitive_keywords': found_sensitive,
            'sensitive_count': len(found_sensitive),
            'total_suspicious': len(found_urgency) + len(found_fear) + len(found_action) + len(found_sensitive)
        }
        
        # Add risk factors based on keyword categories
        if found_urgency:
            self.risk_factors.append({
                'name': 'Urgency Language',
                'impact': 'negative',
                'description': f'Found urgency keywords: {", ".join(found_urgency[:3])}',
                'weight': 15
            })
        
        if found_fear:
            self.risk_factors.append({
                'name': 'Fear-Based Language',
                'impact': 'negative',
                'description': f'Found fear keywords: {", ".join(found_fear[:3])}',
                'weight': 20
            })
        
        if found_action:
            self.risk_factors.append({
                'name': 'Action-Demanding Language',
                'impact': 'negative',
                'description': f'Demands immediate action: {", ".join(found_action[:3])}',
                'weight': 15
            })
        
        if found_sensitive:
            self.risk_factors.append({
                'name': 'Requests Sensitive Information',
                'impact': 'negative',
                'description': f'Asks for sensitive data: {", ".join(found_sensitive[:3])}',
                'weight': 25
            })
        
        return analysis
    
    def _analyze_urls(self, content: str) -> Dict:
        """Extract and analyze URLs in email"""
        # Find all URLs
        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+'
        urls = re.findall(url_pattern, content)
        
        analysis = {
            'url_count': len(urls),
            'urls': urls[:10],  # Limit to first 10
            'has_mismatched_urls': False,
            'has_ip_urls': False,
            'has_shortened_urls': False
        }
        
        # Check for suspicious URL patterns
        shortener_domains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly']
        
        for url in urls:
            # Check for IP addresses
            if re.search(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', url):
                analysis['has_ip_urls'] = True
            
            # Check for URL shorteners
            if any(domain in url.lower() for domain in shortener_domains):
                analysis['has_shortened_urls'] = True
        
        # Add risk factors
        if analysis['has_ip_urls']:
            self.risk_factors.append({
                'name': 'IP-Based URLs',
                'impact': 'negative',
                'description': 'Email contains URLs with IP addresses',
                'weight': 20
            })
        
        if analysis['has_shortened_urls']:
            self.risk_factors.append({
                'name': 'Shortened URLs',
                'impact': 'negative',
                'description': 'Email contains shortened URLs',
                'weight': 15
            })
        
        return analysis
    
    def _check_excessive_caps(self, content: str) -> bool:
        """Check for excessive capitalization"""
        if len(content) < 20:
            return False
        
        caps_count = sum(1 for c in content if c.isupper())
        caps_ratio = caps_count / len(content)
        
        return caps_ratio > 0.3  # More than 30% caps
    
    def _check_excessive_punctuation(self, content: str) -> bool:
        """Check for excessive punctuation"""
        exclamation_count = content.count('!')
        question_count = content.count('?')
        
        return exclamation_count > 3 or question_count > 3
    
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
email_analyzer = EmailAnalyzer()
