"""
Analytics Engine
Advanced analytics and reporting for threat detection
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict
import statistics

class AnalyticsEngine:
    """Analytics engine for threat detection and reporting"""
    
    def __init__(self, database):
        self.db = database
    
    async def get_overview_stats(self, organization_id: Optional[str] = None) -> Dict:
        """Get overview statistics for dashboard"""
        # Mock data if database is not connected
        if not self.db.db:
            return {
                'total_scans': 1250,
                'by_risk_level': {
                    'safe': 980,
                    'suspicious': 200,
                    'dangerous': 70
                },
                'by_type': {
                    'url': 800,
                    'email': 300,
                    'sms': 150
                },
                'recent_activity': {
                    'last_24_hours': 45
                },
                'threat_reports': {
                    'total': 12,
                    'pending': 3
                },
                'metrics': {
                    'threat_detection_rate': 21.6,
                    'avg_risk_score': 35.5
                }
            }

        query = {}
        if organization_id:
            query['organization_id'] = organization_id
        
        # Total scans
        total_scans = await self.db.db.scan_history.count_documents(query)
        
        # Scans by risk level
        safe_count = await self.db.db.scan_history.count_documents({**query, 'risk_level': 'safe'})
        suspicious_count = await self.db.db.scan_history.count_documents({**query, 'risk_level': 'suspicious'})
        dangerous_count = await self.db.db.scan_history.count_documents({**query, 'risk_level': 'dangerous'})
        
        # Scans by type
        url_count = await self.db.db.scan_history.count_documents({**query, 'scan_type': 'url'})
        email_count = await self.db.db.scan_history.count_documents({**query, 'scan_type': 'email'})
        sms_count = await self.db.db.scan_history.count_documents({**query, 'scan_type': 'sms'})
        
        # Recent activity (last 24 hours)
        yesterday = datetime.utcnow() - timedelta(days=1)
        recent_scans = await self.db.db.scan_history.count_documents({
            **query,
            'timestamp': {'$gte': yesterday}
        })
        
        # Threat reports
        total_reports = await self.db.db.threat_reports.count_documents(query)
        pending_reports = await self.db.db.threat_reports.count_documents({
            **query,
            'status': 'pending'
        })
        
        # Calculate threat detection rate
        threat_detection_rate = 0
        if total_scans > 0:
            threat_detection_rate = ((suspicious_count + dangerous_count) / total_scans) * 100
        
        return {
            'total_scans': total_scans,
            'by_risk_level': {
                'safe': safe_count,
                'suspicious': suspicious_count,
                'dangerous': dangerous_count
            },
            'by_type': {
                'url': url_count,
                'email': email_count,
                'sms': sms_count
            },
            'recent_activity': {
                'last_24_hours': recent_scans
            },
            'threat_reports': {
                'total': total_reports,
                'pending': pending_reports
            },
            'metrics': {
                'threat_detection_rate': round(threat_detection_rate, 2),
                'avg_risk_score': await self._get_average_risk_score(query)
            }
        }
    
    async def get_trends(self, 
                        days: int = 30,
                        organization_id: Optional[str] = None) -> Dict:
        """Get trend data over time"""
        # Mock data if database is not connected
        if not self.db.db:
            trends = []
            start_date = datetime.utcnow() - timedelta(days=days)
            for i in range(days):
                curr_date = start_date + timedelta(days=i)
                trends.append({
                    'date': curr_date.strftime('%Y-%m-%d'),
                    'total_scans': 20 + (i % 10),
                    'safe': 15 + (i % 8),
                    'suspicious': 3 + (i % 3),
                    'dangerous': 2 + (i % 2),
                    'avg_risk_score': 30 + (i % 20)
                })
            return {
                'period': f'{days} days',
                'start_date': start_date.isoformat(),
                'end_date': datetime.utcnow().isoformat(),
                'trends': trends
            }

        query = {}
        if organization_id:
            query['organization_id'] = organization_id
        
        start_date = datetime.utcnow() - timedelta(days=days)
        query['timestamp'] = {'$gte': start_date}
        
        # Get all scans in the period
        cursor = self.db.db.scan_history.find(query).sort('timestamp', 1)
        scans = await cursor.to_list(length=None)
        
        # Group by date
        daily_stats = defaultdict(lambda: {
            'total': 0,
            'safe': 0,
            'suspicious': 0,
            'dangerous': 0,
            'url': 0,
            'email': 0,
            'sms': 0,
            'risk_scores': []
        })
        
        for scan in scans:
            date_key = scan['timestamp'].strftime('%Y-%m-%d')
            daily_stats[date_key]['total'] += 1
            daily_stats[date_key][scan['risk_level']] += 1
            daily_stats[date_key][scan['scan_type']] += 1
            daily_stats[date_key]['risk_scores'].append(scan['risk_score'])
        
        # Format for response
        trends = []
        for date_str in sorted(daily_stats.keys()):
            stats = daily_stats[date_str]
            avg_risk = statistics.mean(stats['risk_scores']) if stats['risk_scores'] else 0
            
            trends.append({
                'date': date_str,
                'total_scans': stats['total'],
                'safe': stats['safe'],
                'suspicious': stats['suspicious'],
                'dangerous': stats['dangerous'],
                'by_type': {
                    'url': stats['url'],
                    'email': stats['email'],
                    'sms': stats['sms']
                },
                'avg_risk_score': round(avg_risk, 2)
            })
        
        return {
            'period': f'{days} days',
            'start_date': start_date.isoformat(),
            'end_date': datetime.utcnow().isoformat(),
            'trends': trends
        }
    
    async def get_attack_patterns(self, organization_id: Optional[str] = None) -> Dict:
        """Analyze attack patterns and vectors"""
        # Mock data if database is not connected
        if not self.db.db:
            return {
                'total_threats': 270,
                'attack_types': {
                    'phishing': 150,
                    'malware': 80,
                    'scam': 30,
                    'social_engineering': 10
                },
                'top_threat_factors': [
                    {'factor': 'Suspicious URL Structure', 'count': 85},
                    {'factor': 'Known Malicious Domain', 'count': 60},
                    {'factor': 'Urgency Keywords', 'count': 45},
                    {'factor': 'Credential Harvesting', 'count': 30},
                    {'factor': 'Fake Login Page', 'count': 25}
                ],
                'by_scan_type': {
                    'url': 180,
                    'email': 60,
                    'sms': 30
                }
            }

        query = {}
        if organization_id:
            query['organization_id'] = organization_id
        
        # Get dangerous and suspicious scans
        query['risk_level'] = {'$in': ['suspicious', 'dangerous']}
        
        cursor = self.db.db.scan_history.find(query)
        scans = await cursor.to_list(length=None)
        
        # Analyze factors
        factor_counts = defaultdict(int)
        attack_types = defaultdict(int)
        
        for scan in scans:
            for factor in scan.get('factors', []):
                factor_name = factor.get('factor', 'Unknown')
                factor_counts[factor_name] += 1
                
                # Categorize attack types
                if 'phishing' in factor_name.lower():
                    attack_types['phishing'] += 1
                elif 'malware' in factor_name.lower():
                    attack_types['malware'] += 1
                elif 'scam' in factor_name.lower():
                    attack_types['scam'] += 1
                elif 'urgency' in factor_name.lower():
                    attack_types['social_engineering'] += 1
        
        # Top factors
        top_factors = sorted(
            [{'factor': k, 'count': v} for k, v in factor_counts.items()],
            key=lambda x: x['count'],
            reverse=True
        )[:10]
        
        return {
            'total_threats': len(scans),
            'attack_types': dict(attack_types),
            'top_threat_factors': top_factors,
            'by_scan_type': {
                'url': sum(1 for s in scans if s['scan_type'] == 'url'),
                'email': sum(1 for s in scans if s['scan_type'] == 'email'),
                'sms': sum(1 for s in scans if s['scan_type'] == 'sms')
            }
        }
    
    async def get_user_risk_scores(self, organization_id: str) -> List[Dict]:
        """Calculate risk scores for users in an organization"""
        # Get all scans for the organization
        cursor = self.db.db.scan_history.find({
            'organization_id': organization_id,
            'user_id': {'$ne': None}
        })
        scans = await cursor.to_list(length=None)
        
        # Group by user
        user_stats = defaultdict(lambda: {
            'total_scans': 0,
            'dangerous_encounters': 0,
            'risk_scores': []
        })
        
        for scan in scans:
            user_id = scan['user_id']
            user_stats[user_id]['total_scans'] += 1
            user_stats[user_id]['risk_scores'].append(scan['risk_score'])
            
            if scan['risk_level'] in ['suspicious', 'dangerous']:
                user_stats[user_id]['dangerous_encounters'] += 1
        
        # Calculate risk scores
        user_risks = []
        for user_id, stats in user_stats.items():
            avg_risk = statistics.mean(stats['risk_scores']) if stats['risk_scores'] else 0
            risk_exposure = (stats['dangerous_encounters'] / stats['total_scans'] * 100) if stats['total_scans'] > 0 else 0
            
            user_risks.append({
                'user_id': user_id,
                'total_scans': stats['total_scans'],
                'dangerous_encounters': stats['dangerous_encounters'],
                'avg_risk_score': round(avg_risk, 2),
                'risk_exposure_rate': round(risk_exposure, 2)
            })
        
        # Sort by risk exposure
        user_risks.sort(key=lambda x: x['risk_exposure_rate'], reverse=True)
        
        return user_risks
    
    async def get_comparative_analytics(self, 
                                       period1_days: int = 7,
                                       period2_days: int = 7,
                                       organization_id: Optional[str] = None) -> Dict:
        """Compare two time periods"""
        query = {}
        if organization_id:
            query['organization_id'] = organization_id
        
        # Period 1 (most recent)
        period1_end = datetime.utcnow()
        period1_start = period1_end - timedelta(days=period1_days)
        
        # Period 2 (previous period)
        period2_end = period1_start
        period2_start = period2_end - timedelta(days=period2_days)
        
        # Get stats for both periods
        period1_stats = await self._get_period_stats(period1_start, period1_end, query)
        period2_stats = await self._get_period_stats(period2_start, period2_end, query)
        
        # Calculate changes
        changes = {}
        for key in period1_stats:
            if isinstance(period1_stats[key], (int, float)):
                change = period1_stats[key] - period2_stats[key]
                percent_change = 0
                if period2_stats[key] > 0:
                    percent_change = (change / period2_stats[key]) * 100
                
                changes[key] = {
                    'current': period1_stats[key],
                    'previous': period2_stats[key],
                    'change': change,
                    'percent_change': round(percent_change, 2)
                }
        
        return {
            'period1': {
                'start': period1_start.isoformat(),
                'end': period1_end.isoformat(),
                'stats': period1_stats
            },
            'period2': {
                'start': period2_start.isoformat(),
                'end': period2_end.isoformat(),
                'stats': period2_stats
            },
            'changes': changes
        }
    
    async def _get_period_stats(self, start: datetime, end: datetime, base_query: Dict) -> Dict:
        """Get statistics for a specific time period"""
        query = {**base_query, 'timestamp': {'$gte': start, '$lte': end}}
        
        total = await self.db.db.scan_history.count_documents(query)
        dangerous = await self.db.db.scan_history.count_documents({**query, 'risk_level': 'dangerous'})
        suspicious = await self.db.db.scan_history.count_documents({**query, 'risk_level': 'suspicious'})
        
        return {
            'total_scans': total,
            'dangerous_scans': dangerous,
            'suspicious_scans': suspicious,
            'safe_scans': total - dangerous - suspicious
        }
    
    async def _get_average_risk_score(self, query: Dict) -> float:
        """Calculate average risk score"""
        cursor = self.db.db.scan_history.find(query)
        scans = await cursor.to_list(length=None)
        
        if not scans:
            return 0.0
        
        risk_scores = [scan['risk_score'] for scan in scans]
        return round(statistics.mean(risk_scores), 2)
    
    async def export_report(self, 
                           start_date: datetime,
                           end_date: datetime,
                           organization_id: Optional[str] = None,
                           format: str = 'json') -> Dict:
        """Export analytics report"""
        query = {
            'timestamp': {'$gte': start_date, '$lte': end_date}
        }
        if organization_id:
            query['organization_id'] = organization_id
        
        # Gather all data
        overview = await self.get_overview_stats(organization_id)
        trends = await self.get_trends(
            days=(end_date - start_date).days,
            organization_id=organization_id
        )
        patterns = await self.get_attack_patterns(organization_id)
        
        report = {
            'report_metadata': {
                'generated_at': datetime.utcnow().isoformat(),
                'period': {
                    'start': start_date.isoformat(),
                    'end': end_date.isoformat()
                },
                'organization_id': organization_id,
                'format': format
            },
            'overview': overview,
            'trends': trends,
            'attack_patterns': patterns
        }
        
        # TODO: Implement CSV/PDF export
        if format == 'csv':
            # Convert to CSV format
            pass
        elif format == 'pdf':
            # Generate PDF report
            pass
        
        return report

# Create singleton instance
analytics_engine = None

def get_analytics_engine(database):
    """Get or create analytics engine instance"""
    global analytics_engine
    if analytics_engine is None:
        analytics_engine = AnalyticsEngine(database)
    return analytics_engine
