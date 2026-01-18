"""
Input Validation and Sanitization
Security utilities for validating and sanitizing user inputs
"""

import re
from typing import Optional
from urllib.parse import urlparse

class InputValidator:
    """Validates and sanitizes user inputs"""
    
    # Maximum lengths
    MAX_URL_LENGTH = 2048
    MAX_EMAIL_LENGTH = 10000
    MAX_SMS_LENGTH = 1000
    MAX_SENDER_LENGTH = 100
    
    # Patterns
    URL_PATTERN = re.compile(
        r'^https?://'  # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
        r'localhost|'  # localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
        r'(?::\d+)?'  # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)
    
    EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    PHONE_PATTERN = re.compile(r'^\+?[0-9]{10,15}$')
    
    @staticmethod
    def sanitize_string(text: str, max_length: int = 10000) -> str:
        """
        Sanitize string input
        - Remove null bytes
        - Strip whitespace
        - Limit length
        - Remove control characters
        """
        if not text:
            return ""
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Remove other control characters except newlines and tabs
        text = ''.join(char for char in text if char.isprintable() or char in '\n\t')
        
        # Strip whitespace
        text = text.strip()
        
        # Limit length
        if len(text) > max_length:
            text = text[:max_length]
        
        return text
    
    @staticmethod
    def validate_url(url: str) -> tuple[bool, Optional[str]]:
        """
        Validate URL
        Returns: (is_valid, error_message)
        """
        if not url:
            return False, "URL is required"
        
        # Sanitize
        url = InputValidator.sanitize_string(url, InputValidator.MAX_URL_LENGTH)
        
        # Check length
        if len(url) > InputValidator.MAX_URL_LENGTH:
            return False, f"URL too long (max {InputValidator.MAX_URL_LENGTH} characters)"
        
        # Auto-add https:// if missing
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Check pattern - more lenient
        if not InputValidator.URL_PATTERN.match(url):
            # Try basic domain check
            try:
                parsed = urlparse(url)
                if not parsed.netloc:
                    return False, "Invalid URL format - must include a domain (e.g., example.com)"
            except Exception:
                return False, "Invalid URL format"
        
        # Parse URL
        try:
            parsed = urlparse(url)
            if not parsed.scheme in ['http', 'https']:
                return False, "URL must use HTTP or HTTPS"
            if not parsed.netloc:
                return False, "URL must have a domain"
        except Exception:
            return False, "Invalid URL"
        
        return True, None
    
    @staticmethod
    def validate_email_content(content: str, sender: Optional[str] = None) -> tuple[bool, Optional[str]]:
        """
        Validate email content
        Returns: (is_valid, error_message)
        """
        if not content:
            return False, "Email content is required"
        
        # Sanitize
        content = InputValidator.sanitize_string(content, InputValidator.MAX_EMAIL_LENGTH)
        
        # Check length
        if len(content) > InputValidator.MAX_EMAIL_LENGTH:
            return False, f"Email content too long (max {InputValidator.MAX_EMAIL_LENGTH} characters)"
        
        # Validate sender if provided
        if sender:
            sender = InputValidator.sanitize_string(sender, InputValidator.MAX_SENDER_LENGTH)
            if len(sender) > InputValidator.MAX_SENDER_LENGTH:
                return False, f"Sender email too long (max {InputValidator.MAX_SENDER_LENGTH} characters)"
            
            # Basic email format check
            if '@' in sender and not InputValidator.EMAIL_PATTERN.match(sender):
                return False, "Invalid sender email format"
        
        return True, None
    
    @staticmethod
    def validate_sms_content(content: str, sender: Optional[str] = None) -> tuple[bool, Optional[str]]:
        """
        Validate SMS content
        Returns: (is_valid, error_message)
        """
        if not content:
            return False, "SMS content is required"
        
        # Sanitize
        content = InputValidator.sanitize_string(content, InputValidator.MAX_SMS_LENGTH)
        
        # Check length
        if len(content) > InputValidator.MAX_SMS_LENGTH:
            return False, f"SMS content too long (max {InputValidator.MAX_SMS_LENGTH} characters)"
        
        # Validate sender if provided
        if sender:
            sender = InputValidator.sanitize_string(sender, InputValidator.MAX_SENDER_LENGTH)
            if len(sender) > InputValidator.MAX_SENDER_LENGTH:
                return False, f"Sender number too long (max {InputValidator.MAX_SENDER_LENGTH} characters)"
        
        return True, None

# Create singleton instance
validator = InputValidator()
