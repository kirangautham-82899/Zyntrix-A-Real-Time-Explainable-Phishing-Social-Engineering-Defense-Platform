import React from 'react';
interface WarningModalProps {
    visible: boolean;
    type: 'dangerous' | 'suspicious';
    details?: string;
    onProceed: () => void;
    onGoBack: () => void;
}
export declare const WarningModal: React.FC<WarningModalProps>;
export {};
//# sourceMappingURL=WarningModal.d.ts.map