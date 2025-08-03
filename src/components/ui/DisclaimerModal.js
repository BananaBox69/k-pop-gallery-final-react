import React, { useEffect } from 'react';
import Modal from './Modal';
import { useUI } from '../../context/UIProvider';

const DisclaimerModal = ({ isOpen, onAcknowledge }) => {
    const { setIsBlurOverlayActive } = useUI();

    useEffect(() => {
        setIsBlurOverlayActive(isOpen);
        return () => {
            // Ensure blur is removed if the component unmounts while open
            setIsBlurOverlayActive(false);
        };
    }, [isOpen, setIsBlurOverlayActive]);

    const disclaimerText = `
        <h3 class="text-lg font-bold text-red-400 mb-2">This is NOT a Shop!</h3>
        <p class="mb-4">This website is for displaying a private photocard collection. Its purpose is to make it easier for others to see what is available for trade or sale.</p>
        <strong class="text-white">Condition of Cards:</strong>
        <p class="mb-4">Small defects like scratches can exist from manufacturing or shipping. Highly sensitive people should refrain from buying.</p>
        <strong class="text-white">Private Sale Policy:</strong>
        <p>As a private person, I do not offer refunds, returns, or any kind of warranties.</p>
    `;

    return (
        <Modal isOpen={isOpen} onClose={() => {}} title="Disclaimer" isDismissable={false}>
             <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: disclaimerText }} />
                <button onClick={onAcknowledge} className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500 transition-colors">
                    Acknowledge and Continue
                </button>
             </div>
        </Modal>
    );
};

export default DisclaimerModal;