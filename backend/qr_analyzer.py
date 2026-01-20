"""
QR Code Analyzer Module
Decodes QR code images and analyzes embedded URLs for threats
"""

import io
import re
from PIL import Image
from typing import Dict, Optional
from url_analyzer import url_analyzer

# Try to import pyzbar, but make it optional
try:
    from pyzbar import pyzbar
    PYZBAR_AVAILABLE = True
except ImportError:
    PYZBAR_AVAILABLE = False
    print("⚠️  Warning: pyzbar not available. QR code scanning will be disabled.")
    print("   To enable QR scanning, install zbar: brew install zbar")

class QRAnalyzer:
    """Analyzes QR code images and extracts URLs for threat detection"""
    
    def __init__(self):
        self.url_pattern = re.compile(
            r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        )
    
    def analyze(self, image_bytes: bytes) -> Dict:
        """
        Main analysis function for QR code images
        
        Args:
            image_bytes: Raw image file bytes
            
        Returns:
            Comprehensive analysis results including extracted URL and threat assessment
        """
        # Check if pyzbar is available
        if not PYZBAR_AVAILABLE:
            return {
                'valid': False,
                'error': 'QR code scanning is not available. Please install zbar library: brew install zbar',
                'qr_detected': False
            }
        
        try:
            # Decode QR code from image
            decoded_data = self._decode_qr_image(image_bytes)
            
            if not decoded_data:
                return {
                    'valid': False,
                    'error': 'No QR code detected in image',
                    'qr_detected': False
                }
            
            # Extract URL from decoded data
            extracted_url = self._extract_url(decoded_data)
            
            if not extracted_url:
                return {
                    'valid': True,
                    'qr_detected': True,
                    'qr_data': decoded_data,
                    'url_found': False,
                    'message': 'QR code decoded but no URL found',
                    'risk_score': 0,
                    'risk_level': 'safe'
                }
            
            # Analyze the extracted URL using existing URL analyzer
            url_analysis = url_analyzer.analyze(extracted_url)
            
            if not url_analysis['valid']:
                return {
                    'valid': False,
                    'error': 'Extracted URL is invalid',
                    'qr_data': decoded_data,
                    'extracted_url': extracted_url
                }
            
            # Combine QR-specific info with URL analysis
            return {
                'valid': True,
                'qr_detected': True,
                'qr_data': decoded_data,
                'url_found': True,
                'extracted_url': extracted_url,
                'url': url_analysis['url'],
                'domain': url_analysis['domain'],
                'risk_score': url_analysis['risk_score'],
                'risk_level': url_analysis['risk_level'],
                'classification': url_analysis['risk_level'].upper(),
                'factors': url_analysis['factors'],
                'analysis_details': {
                    'qr_info': {
                        'data_type': 'URL',
                        'data_length': len(decoded_data),
                        'extraction_method': 'QR Code Scan'
                    },
                    'domain_analysis': url_analysis['domain_analysis'],
                    'pattern_analysis': url_analysis['pattern_analysis'],
                    'structure_analysis': url_analysis['structure_analysis']
                }
            }
            
        except Exception as e:
            return {
                'valid': False,
                'error': f'QR code analysis failed: {str(e)}',
                'qr_detected': False
            }
    
    def _decode_qr_image(self, image_bytes: bytes) -> Optional[str]:
        """
        Decode QR code from image bytes
        
        Args:
            image_bytes: Raw image file bytes
            
        Returns:
            Decoded string data from QR code, or None if no QR code found
        """
        try:
            # Open image from bytes
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Decode QR code
            decoded_objects = pyzbar.decode(image)
            
            if not decoded_objects:
                return None
            
            # Get data from first QR code found
            qr_data = decoded_objects[0].data.decode('utf-8')
            return qr_data
            
        except Exception as e:
            raise Exception(f"Failed to decode QR image: {str(e)}")
    
    def _extract_url(self, qr_data: str) -> Optional[str]:
        """
        Extract URL from QR code data
        
        Args:
            qr_data: Decoded QR code string
            
        Returns:
            Extracted URL or None if no URL found
        """
        # Check if the entire data is a URL
        if qr_data.startswith('http://') or qr_data.startswith('https://'):
            return qr_data
        
        # Try to find URL pattern in the data
        url_match = self.url_pattern.search(qr_data)
        if url_match:
            return url_match.group(0)
        
        return None
    
    def validate_image(self, image_bytes: bytes) -> tuple[bool, str]:
        """
        Validate that the uploaded file is a valid image
        
        Args:
            image_bytes: Raw file bytes
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Check image format
            if image.format not in ['PNG', 'JPEG', 'JPG', 'BMP', 'GIF', 'WEBP']:
                return False, f"Unsupported image format: {image.format}"
            
            # Check image size (max 10MB)
            if len(image_bytes) > 10 * 1024 * 1024:
                return False, "Image file too large (max 10MB)"
            
            # Check image dimensions (reasonable limits)
            width, height = image.size
            if width > 4096 or height > 4096:
                return False, "Image dimensions too large (max 4096x4096)"
            
            if width < 50 or height < 50:
                return False, "Image too small to contain readable QR code"
            
            return True, ""
            
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"

# Create singleton instance
qr_analyzer = QRAnalyzer()
