import React, { useState } from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import Zyntrix from '../core/Zyntrix';
import { WarningModal } from '../ui/WarningModal';

interface LinkProtectorProps {
    url: string;
    children: React.ReactNode;
    style?: any;
}

export const LinkProtector: React.FC<LinkProtectorProps> = ({ url, children, style }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [threatType, setThreatType] = useState<'dangerous' | 'suspicious'>('suspicious');

    const handlePress = async () => {
        // 1. Scan URL
        const result = await Zyntrix.getClient().scanUrl(url);

        // 2. Check result
        if (result.risk_level === 'dangerous' || result.risk_level === 'suspicious') {
            setThreatType(result.risk_level);
            setModalVisible(true);
        } else {
            // Safe -> Open URL
            Linking.openURL(url);
        }
    };

    const handleProceed = () => {
        setModalVisible(false);
        Linking.openURL(url);
    };

    return (
        <>
            <TouchableOpacity onPress={handlePress} style={style}>
                {children}
            </TouchableOpacity>

            <WarningModal
                visible={modalVisible}
                type={threatType}
                onProceed={handleProceed}
                onGoBack={() => setModalVisible(false)}
            />
        </>
    );
};
