import React, { useContext } from 'react';
import Modal from './Modal';
import { AppContext } from '../../context/AppContext';

const InfoModal = ({ isOpen, onClose }) => {
    const { siteContent } = useContext(AppContext);

    // Default texts in case they are not set in Firebase
    const infoText = siteContent.infoText || `
        <h3 class="text-lg font-bold text-[var(--dynamic-ui-color)] mb-2">Selling Process</h3>
        <p class="mb-4">To purchase a card, please copy the generated message from the basket and send it to me on Instagram. I will get back to you as soon as possible to confirm availability and discuss payment/shipping details.</p>
    `;
    const disclaimerText = siteContent.disclaimerText || `
        <h3 class="text-lg font-bold text-red-400 mb-2">This is NOT a Shop!</h3>
        <p class="mb-4">This website is for displaying a private photocard collection. Its purpose is to make it easier for others to see what is available for trade or sale.</p>
        <strong class="text-white">Condition of Cards:</strong>
        <p class="mb-4">Small defects like scratches can exist from manufacturing or shipping. Highly sensitive people should refrain from buying.</p>
        <strong class="text-white">Private Sale Policy:</strong>
        <p>As a private person, I do not offer refunds, returns, or any kind of warranties.</p>
    `;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Selling & Info">
            <div className="flex flex-col gap-4 text-sm text-gray-300 max-h-[70vh] overflow-y-auto pr-2">
                <div dangerouslySetInnerHTML={{ __html: infoText }} />
                <hr class="border-gray-600 my-2"/>
                <div dangerouslySetInnerHTML={{ __html: disclaimerText }} />
            </div>
        </Modal>
    );
};

export default InfoModal;