import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// Import directly from SDK source for local development
import { Zyntrix, LinkProtector } from '../../src';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Initialize Zyntrix SDK
    Zyntrix.initialize({
      apiKey: 'demo-api-key',
      baseUrl: 'http://localhost:8000', // Ensure this points to your ZYNTRIX backend
      debug: true
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🛡️ ZYNTRIX SDK</Text>
      <Text style={styles.subtitle}>Mobile Protection Demo</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Protected Links</Text>
        <Text style={styles.cardDesc}>
          The buttons below are wrapped with &lt;LinkProtector /&gt;.
          Tapping them scans the URL in real-time.
        </Text>

        <LinkProtector url="http://malware.testing.google.test/bad" style={styles.buttonDanger}>
          <Text style={styles.buttonText}>⚠️ Tap Malicious Link</Text>
        </LinkProtector>

        <LinkProtector url="https://google.com" style={styles.buttonSafe}>
          <Text style={styles.buttonText}>✅ Tap Safe Link</Text>
        </LinkProtector>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Check your backend logs to see the scan requests!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#06b6d4',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#1f2937',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDesc: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonSafe: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    marginTop: 30,
    backgroundColor: '#06b6d410',
    padding: 12,
    borderRadius: 8,
  },
  infoText: {
    color: '#06b6d4',
    fontSize: 12,
  }
});
