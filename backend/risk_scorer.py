"""
Risk Scoring Engine
Unified risk scoring system that combines multiple analysis factors
"""

from typing import Dict, List, Tuple

class RiskScorer:
    """
    Unified risk scoring engine that combines factors from multiple analyzers
    and generates comprehensive risk assessments
    """
    
    # Factor weight categories
    CRITICAL_WEIGHT = 30  # Highest priority factors
    HIGH_WEIGHT = 25
    MEDIUM_WEIGHT = 20
    LOW_WEIGHT = 15
    MINIMAL_WEIGHT = 10
    
    # Risk level thresholds
    SAFE_THRESHOLD = 30
    SUSPICIOUS_THRESHOLD = 70
    
    def __init__(self):
        self.factors = []
    
    def calculate_score(self, factors: List[Dict]) -> Dict:
        """
        Calculate final risk score from list of factors
        
        Args:
            factors: List of factor dictionaries with 'impact' and 'weight'
        
        Returns:
            Dictionary with score, level, and analysis
        """
        self.factors = factors
        
        # Calculate positive and negative scores
        positive_score = sum(f['weight'] for f in factors if f['impact'] == 'positive')
        negative_score = sum(f['weight'] for f in factors if f['impact'] == 'negative')
        
        # Base score (neutral starting point)
        base_score = 50
        
        # Calculate final score
        final_score = base_score + negative_score - positive_score
        
        # Clamp between 0 and 100
        final_score = max(0, min(100, final_score))
        
        # Determine risk level
        risk_level = self._get_risk_level(final_score)
        
        # Get factor breakdown
        factor_breakdown = self._analyze_factors(factors)
        
        return {
            'risk_score': final_score,
            'risk_level': risk_level,
            'base_score': base_score,
            'positive_impact': positive_score,
            'negative_impact': negative_score,
            'factor_breakdown': factor_breakdown,
            'total_factors': len(factors)
        }
    
    def _get_risk_level(self, score: int) -> str:
        """Determine risk level from score"""
        if score <= self.SAFE_THRESHOLD:
            return 'safe'
        elif score <= self.SUSPICIOUS_THRESHOLD:
            return 'suspicious'
        else:
            return 'dangerous'
    
    def _analyze_factors(self, factors: List[Dict]) -> Dict:
        """Analyze and categorize factors"""
        breakdown = {
            'positive': [],
            'negative': [],
            'neutral': [],
            'critical': [],  # High-weight negative factors
            'protective': []  # High-weight positive factors
        }
        
        for factor in factors:
            impact = factor['impact']
            weight = factor.get('weight', 0)
            
            # Categorize by impact
            if impact == 'positive':
                breakdown['positive'].append(factor)
                if weight >= self.HIGH_WEIGHT:
                    breakdown['protective'].append(factor)
            elif impact == 'negative':
                breakdown['negative'].append(factor)
                if weight >= self.HIGH_WEIGHT:
                    breakdown['critical'].append(factor)
            else:
                breakdown['neutral'].append(factor)
        
        # Add counts
        breakdown['positive_count'] = len(breakdown['positive'])
        breakdown['negative_count'] = len(breakdown['negative'])
        breakdown['neutral_count'] = len(breakdown['neutral'])
        breakdown['critical_count'] = len(breakdown['critical'])
        breakdown['protective_count'] = len(breakdown['protective'])
        
        return breakdown
    
    def generate_explanation(self, score: int, risk_level: str, 
                           factor_breakdown: Dict, content_type: str = 'content') -> str:
        """
        Generate human-readable explanation of risk assessment
        
        Args:
            score: Risk score (0-100)
            risk_level: Risk level (safe/suspicious/dangerous)
            factor_breakdown: Factor analysis breakdown
            content_type: Type of content analyzed (url/email/sms)
        
        Returns:
            Detailed explanation string
        """
        negative_count = factor_breakdown['negative_count']
        positive_count = factor_breakdown['positive_count']
        critical_count = factor_breakdown['critical_count']
        
        if risk_level == 'safe':
            explanation = f"This {content_type} appears safe with a low risk score of {score}/100. "
            
            if positive_count > 0:
                explanation += f"Found {positive_count} positive indicator(s) suggesting legitimacy. "
            
            if negative_count > 0:
                explanation += f"While {negative_count} minor concern(s) were detected, they do not indicate significant threat."
            else:
                explanation += "No significant threat indicators were detected."
        
        elif risk_level == 'suspicious':
            explanation = f"This {content_type} shows suspicious characteristics with a risk score of {score}/100. "
            explanation += f"Detected {negative_count} warning sign(s)"
            
            if critical_count > 0:
                explanation += f", including {critical_count} critical indicator(s)"
            
            explanation += ". Exercise extreme caution before interacting with this content."
            
            if positive_count > 0:
                explanation += f" Note: {positive_count} positive factor(s) were found, but they are outweighed by the risks."
        
        else:  # dangerous
            explanation = f"This {content_type} is highly suspicious with a risk score of {score}/100. "
            explanation += f"Multiple red flags detected: {negative_count} total warning(s)"
            
            if critical_count > 0:
                explanation += f" including {critical_count} critical threat indicator(s)"
            
            explanation += ". This appears to be a phishing or social engineering attack. DO NOT interact with this content."
        
        return explanation
    
    def generate_recommendations(self, risk_level: str, critical_factors: List[Dict]) -> List[str]:
        """
        Generate actionable recommendations based on risk level
        
        Args:
            risk_level: Risk level (safe/suspicious/dangerous)
            critical_factors: List of critical risk factors
        
        Returns:
            List of recommendation strings
        """
        recommendations = []
        
        if risk_level == 'safe':
            recommendations = [
                "Content appears safe to interact with",
                "Always verify sender identity for sensitive actions",
                "Keep your security software updated",
                "Report any unexpected or unusual behavior"
            ]
        
        elif risk_level == 'suspicious':
            recommendations = [
                "Do not provide personal or financial information",
                "Verify the source through official channels",
                "Do not click links or download attachments",
                "Check for spelling errors and unusual formatting",
                "Contact the organization directly using known contact info"
            ]
            
            # Add specific recommendations based on critical factors
            factor_names = [f['name'].lower() for f in critical_factors]
            
            if any('url' in name or 'link' in name for name in factor_names):
                recommendations.append("Hover over links to see actual destination before clicking")
            
            if any('email' in name or 'sender' in name for name in factor_names):
                recommendations.append("Verify sender email address carefully")
        
        else:  # dangerous
            recommendations = [
                "DO NOT interact with this content under any circumstances",
                "DO NOT click any links or open attachments",
                "DO NOT provide any personal, financial, or login information",
                "DO NOT respond to the message",
                "Report this to your IT security team immediately",
                "Delete this message and block the sender",
                "Run a security scan if you've already interacted with it",
                "Change passwords if you've provided any credentials"
            ]
        
        return recommendations
    
    def get_confidence_score(self, factor_breakdown: Dict) -> Tuple[int, str]:
        """
        Calculate confidence in the risk assessment
        
        Args:
            factor_breakdown: Factor analysis breakdown
        
        Returns:
            Tuple of (confidence_score, confidence_level)
        """
        total_factors = (factor_breakdown['positive_count'] + 
                        factor_breakdown['negative_count'] + 
                        factor_breakdown['neutral_count'])
        
        critical_count = factor_breakdown['critical_count']
        
        # More factors = higher confidence
        # Critical factors = higher confidence
        confidence = min(100, (total_factors * 10) + (critical_count * 15))
        
        if confidence >= 80:
            level = 'high'
        elif confidence >= 50:
            level = 'medium'
        else:
            level = 'low'
        
        return confidence, level

# Create singleton instance
risk_scorer = RiskScorer()
