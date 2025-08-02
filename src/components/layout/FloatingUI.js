import React, { useState } from 'react';
import { FaShieldAlt, FaInfoCircle, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { useFilters } from '../../hooks/useFilters';
import { useUI } from '../../context/UIProvider';
import LoginModal from '../auth/LoginModal';
import InfoModal from '../ui/InfoModal'; // Import the new modal

const FloatingUI = () => {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [infoModalOpen, setInfoModalOpen] = useState(false); // State for the info modal
    const { currentUser } = useAuth();
    const { setIsSidebarOpen, activeSectionId } = useFilters();
    const { activeColor } = useUI();
    const navigate = useNavigate();

    const handleAdminClick = () => {
        if (currentUser) {
            navigate('/admin');
        } else {
            setLoginModalOpen(true);
        }
    };

    return (
        <>
            <div className="fixed bottom-4 right-4 flex flex-col gap-4 z-40">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ backgroundColor: activeColor, transition: 'background-color 0.5s ease' }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${activeSectionId ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
                    disabled={!activeSectionId}
                >
                    <FaFilter size={24} />
                </button>
                <button 
                    onClick={handleAdminClick} 
                    style={{ backgroundColor: activeColor, transition: 'background-color 0.5s ease' }}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                    <FaShieldAlt size={24} />
                </button>
                <button 
                    onClick={() => setInfoModalOpen(true)} // Open the info modal on click
                    style={{ backgroundColor: activeColor, transition: 'background-color 0.5s ease' }}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                >
                    <FaInfoCircle size={24} />
                </button>
            </div>
            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
            <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
        </>
    );
};

export default FloatingUI;