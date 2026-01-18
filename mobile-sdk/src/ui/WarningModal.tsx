import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

interface WarningModalProps {
    visible: boolean;
    type: 'dangerous' | 'suspicious';
    details?: string;
    onProceed: () => void;
    onGoBack: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
    visible,
    type,
    details,
    onProceed,
    onGoBack
}) => {
    const isDangerous = type === 'dangerous';
    const bgColor = isDangerous ? '#ef4444' : '#f59e0b';
    const title = isDangerous ? 'DANGEROUS SITE BLOCKED' : 'SUSPICIOUS SITE DETECTED';

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onGoBack}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={[styles.header, { backgroundColor: bgColor }]}>
                        <Text style={styles.icon}>⚠️</Text>
                    </View>

                    <View style={styles.content}>
                        <Text style={[styles.title, { color: bgColor }]}>{title}</Text>
                        <Text style={styles.description}>
                            ZYNTRIX has identified potential threats on this page.
                        </Text>
                        {details && <Text style={styles.details}>{details}</Text>}

                        <TouchableOpacity style={[styles.button, styles.primaryButton, { backgroundColor: bgColor }]} onPress={onGoBack}>
                            <Text style={styles.buttonText}>Go Back to Safety</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.textButton} onPress={onProceed}>
                            <Text style={[styles.textButtonText, { color: '#6b7280' }]}>I understand the risk, proceed anyway</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    modalView: {
        width: '85%',
        backgroundColor: '#1f2937', // Dark gray
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    header: {
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 40,
    },
    content: {
        padding: 20,
        alignItems: 'center',
        width: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        color: '#d1d5db',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    details: {
        color: '#9ca3af',
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    button: {
        borderRadius: 10,
        padding: 15,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    primaryButton: {
        elevation: 2,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textButton: {
        padding: 10,
    },
    textButtonText: {
        fontSize: 12,
        textDecorationLine: 'underline',
    }
});
