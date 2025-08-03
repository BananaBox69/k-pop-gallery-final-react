import React from 'react';
import Modal from './Modal';

const DisclaimerModal = ({ isOpen, onAcknowledge }) => {
    // A simplified version of the original disclaimer text
    const disclaimerText = `
        <h3 class="text-lg font-bold text-red-400 mb-2">This is NOT a Shop!</h3>
        <p class="mb-4">This website is for displaying a private photocard collection. Its purpose is to make it easier for others to see what is available for trade or sale.</p>
        <strong class="text-white">Condition of Cards:</strong>
        <p class="mb-4">Small defects like scratches can exist from manufacturing or shipping. Highly sensitive people should refrain from buying.</p>
        <strong class="text-white">Private Sale Policy:</strong>
        <p>As a private person, I do not offer refunds, returns, or any kind of warranties.</p>
    `;
    
    const handleCancel = () => {
        window.location.href = 'https://www.google.com';
    };

    return (
        <Modal isOpen={isOpen} onClose={() => {}} title="Disclaimer">
             <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: disclaimerText }} />
                <div className="flex gap-3 mt-4">
                    <button onClick={handleCancel} className="w-full bg-gray-600 text-white p-2 rounded-md hover:bg-gray-500 transition-colors">
                        Cancel
                    </button>
                    <button onClick={onAcknowledge} className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-500 transition-colors">
                        Acknowledge and Continue
                    </button>
                </div>
             </div>
        </Modal>
    );
};

export default DisclaimerModal;