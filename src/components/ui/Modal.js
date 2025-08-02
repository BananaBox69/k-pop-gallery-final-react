import React from 'react';
import { CgClose } from 'react-icons/cg';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div 
                className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 border border-gray-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <CgClose size={24} />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;