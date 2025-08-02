import React from 'react';
import Modal from '../ui/Modal';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <p>{message}</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500">
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;