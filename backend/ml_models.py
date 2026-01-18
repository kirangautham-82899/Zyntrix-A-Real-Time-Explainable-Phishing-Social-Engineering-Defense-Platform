"""
Machine Learning Models for Phishing Detection
Uses TF-IDF and Logistic Regression for text classification
"""

import pickle
import os
from typing import Dict, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import nltk
from nltk.corpus import stopwords

class PhishingClassifier:
    """
    ML-based phishing classifier using TF-IDF and Logistic Regression
    """
    
    def __init__(self):
        self.vectorizer = None
        self.model = None
        self.is_trained = False
        
        # Download NLTK data if not already present
        try:
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('stopwords', quiet=True)
        
        # Try to load pre-trained model
        self._load_model()
        
        # If no model exists, train a basic one
        if not self.is_trained:
            self._train_basic_model()
    
    def _train_basic_model(self):
        """Train a basic model with sample phishing and legitimate texts"""
        
        # Sample training data (phishing examples)
        phishing_samples = [
            "urgent verify your account immediately",
            "congratulations you won a prize claim now",
            "your account has been suspended click here",
            "verify your password immediately or account will be locked",
            "you have won $1000 gift card click to claim",
            "urgent security alert verify your information",
            "your package delivery failed click to reschedule",
            "irs tax refund approved claim your money now",
            "bank account suspended verify identity immediately",
            "congratulations selected for cash prize act now",
            "unusual activity detected confirm your account",
            "your payment failed update billing information",
            "limited time offer claim your reward now",
            "account verification required click here immediately",
            "suspicious login attempt verify your identity",
            "your account will expire update information now",
            "final notice verify account or will be terminated",
            "you have unclaimed package click to track",
            "urgent action required confirm your details",
            "your refund is ready claim it now"
        ]
        
        # Sample legitimate texts
        legitimate_samples = [
            "thank you for your order it will arrive tomorrow",
            "your meeting is scheduled for next week",
            "reminder your appointment is confirmed",
            "your subscription has been renewed successfully",
            "welcome to our service here is your confirmation",
            "your order has shipped tracking number included",
            "monthly statement is now available to view",
            "your payment was processed successfully",
            "thank you for contacting customer support",
            "your request has been received and is being processed",
            "notification your package was delivered today",
            "your reservation is confirmed for next month",
            "update your profile information at your convenience",
            "your feedback helps us improve our service",
            "new features are now available in your account",
            "your invoice is ready for download",
            "reminder your trial period ends next week",
            "your settings have been updated successfully",
            "thank you for being a valued customer",
            "your question has been answered by our team"
        ]
        
        # Combine samples
        texts = phishing_samples + legitimate_samples
        labels = [1] * len(phishing_samples) + [0] * len(legitimate_samples)
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=100,
            stop_words='english',
            ngram_range=(1, 2),  # unigrams and bigrams
            min_df=1
        )
        
        # Transform texts to features
        X = self.vectorizer.fit_transform(texts)
        y = np.array(labels)
        
        # Train logistic regression model
        self.model = LogisticRegression(
            random_state=42,
            max_iter=1000,
            C=1.0
        )
        self.model.fit(X, y)
        
        self.is_trained = True
        
        # Save the model
        self._save_model()
    
    def predict(self, text: str) -> Dict:
        """
        Predict if text is phishing
        
        Args:
            text: Text content to analyze
        
        Returns:
            Dictionary with prediction, probability, and confidence
        """
        if not self.is_trained:
            return {
                'is_phishing': False,
                'confidence': 0.0,
                'phishing_probability': 0.0,
                'legitimate_probability': 0.0,
                'ml_score': 0
            }
        
        # Transform text to features
        X = self.vectorizer.transform([text.lower()])
        
        # Get prediction and probabilities
        prediction = self.model.predict(X)[0]
        probabilities = self.model.predict_proba(X)[0]
        
        # probabilities[0] = legitimate, probabilities[1] = phishing
        legitimate_prob = probabilities[0]
        phishing_prob = probabilities[1]
        
        # Calculate confidence (distance from 0.5)
        confidence = abs(phishing_prob - 0.5) * 2  # Scale to 0-1
        
        # Calculate ML score (0-100)
        ml_score = int(phishing_prob * 100)
        
        return {
            'is_phishing': bool(prediction),
            'confidence': float(confidence),
            'phishing_probability': float(phishing_prob),
            'legitimate_probability': float(legitimate_prob),
            'ml_score': ml_score
        }
    
    def get_top_features(self, text: str, n: int = 5) -> list:
        """
        Get top features contributing to prediction
        
        Args:
            text: Text content
            n: Number of top features to return
        
        Returns:
            List of (feature, weight) tuples
        """
        if not self.is_trained:
            return []
        
        # Transform text
        X = self.vectorizer.transform([text.lower()])
        
        # Get feature names and weights
        feature_names = self.vectorizer.get_feature_names_out()
        feature_weights = X.toarray()[0]
        
        # Get model coefficients
        coefficients = self.model.coef_[0]
        
        # Calculate feature importance
        importance = feature_weights * coefficients
        
        # Get top features
        top_indices = np.argsort(np.abs(importance))[-n:][::-1]
        
        top_features = [
            (feature_names[i], float(importance[i]))
            for i in top_indices
            if feature_weights[i] > 0
        ]
        
        return top_features
    
    def _save_model(self):
        """Save trained model to disk"""
        try:
            model_dir = os.path.dirname(__file__)
            
            # Save vectorizer
            with open(os.path.join(model_dir, 'vectorizer.pkl'), 'wb') as f:
                pickle.dump(self.vectorizer, f)
            
            # Save model
            with open(os.path.join(model_dir, 'ml_model.pkl'), 'wb') as f:
                pickle.dump(self.model, f)
        except Exception as e:
            print(f"Warning: Could not save model: {e}")
    
    def _load_model(self):
        """Load trained model from disk"""
        try:
            model_dir = os.path.dirname(__file__)
            
            vectorizer_path = os.path.join(model_dir, 'vectorizer.pkl')
            model_path = os.path.join(model_dir, 'ml_model.pkl')
            
            if os.path.exists(vectorizer_path) and os.path.exists(model_path):
                with open(vectorizer_path, 'rb') as f:
                    self.vectorizer = pickle.load(f)
                
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                
                self.is_trained = True
        except Exception as e:
            print(f"Warning: Could not load model: {e}")
            self.is_trained = False

# Create singleton instance
ml_classifier = PhishingClassifier()
