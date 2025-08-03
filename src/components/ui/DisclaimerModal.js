import React, { useEffect } from 'react';
import Modal from './Modal';
import { useUI } from '../../context/UIProvider';

const DisclaimerModal = ({ isOpen, onAcknowledge }) => {
    const { setIsBlurOverlayActive } = useUI();

    useEffect(() => {
        setIsBlurOverlayActive(isOpen);
        // Cleanup function to ensure blur is removed if component unmounts
        return () => {
            if (isOpen) {
                setIsBlurOverlayActive(false);
            }
        };
    }, [isOpen, setIsBlurOverlayActive]);

    const handleAcknowledge = () => {
        // We can remove this call since the useEffect will handle it when isOpen becomes false
        // setIsBlurOverlayActive(false); 
        onAcknowledge();
    };

    const disclaimerText = `
        <h3 class="text-lg font-bold text-red-400 mb-2">This is NOT a Shop!</h3>
        <p class="mb-4">This website is for displaying a private photocard collection. Its purpose is to make it easier for others to see what is available for trade or sale.</p>
        <strong class="text-white">Condition of Cards:</strong>
        <p class="mb-4">Small defects like scratches can exist from manufacturing or shipping. Highly sensitive people should refrain from buying.</p>
        <strong class="text-white">Private Sale Policy:</strong>
        <p>As a private person, I do not offer refunds, returns, or any kind of warranties.</p>
    `;
    
    // The modal itself handles visibility, so no need for an extra check here.

    return (
        <Modal isOpen={isOpen} onClose={() => {}} title="Disclaimer">
             <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: disclaimerText }} />
                <button onClick={handleAcknowledge} className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500 transition-colors">
                    Acknowledge and Continue
                </button>
             </div>
        </Modal>
    );
};

export default DisclaimerModal;