import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaEdit } from 'react-icons/fa';
import AdminCardList from '../components/admin/AdminCardList';
import CardFormModal from '../components/admin/CardFormModal';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import SiteContentModal from '../components/admin/SiteContentModal';
import { deleteCard } from '../api/firestoreService';
import AdminControls from '../components/admin/AdminControls';
import BulkActions from '../components/admin/BulkActions';

const Admin = () => {
    const { currentUser, logout } = useAuth();
    const { metadata } = useContext(AppContext);
    const navigate = useNavigate();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [cardToEdit, setCardToEdit] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedCards, setSelectedCards] = useState(new Set());
    
    const [filters, setFilters] = useState({ group: 'All', member: 'All', status: 'available', searchTerm: '' });
    const [sort, setSort] = useState({ by: 'default', order: 'asc' });

    if (!currentUser) {
        navigate('/');
        return null;
    }
    
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };
    
    const handleOpenAddForm = () => {
        setCardToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEditForm = (card) => {
        setCardToEdit(card);
        setIsFormOpen(true);
    };
    
    const handleOpenConfirm = (action) => {
        setConfirmAction(() => action);
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (confirmAction) {
            await confirmAction();
        }
        setIsConfirmOpen(false);
        setConfirmAction(null);
    };

    const handleDelete = async (docId) => {
        try {
            await deleteCard(docId);
        } catch (error) {
            console.error("Failed to delete card:", error);
        }
    };
    
    return (
        <>
            <div className="p-4 md:p-8 min-h-screen">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Admin Panel</h1>
                        <p className="text-gray-400">Welcome, {currentUser.email}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsContentModalOpen(true)} className="bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-blue-500 transition-colors">
                            <FaEdit />
                            Edit Site
                        </button>
                        <button onClick={handleLogout} className="bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-500 transition-colors">
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                </header>

                <div className="bg-gray-800/50 p-4 md:p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Manage Cards</h2>
                        <button onClick={handleOpenAddForm} className="bg-green-600 text-white flex items-center gap-2 px-4 py-2 rounded-md hover:bg-green-500 transition-colors">
                            <FaPlus />
                            Add Card
                        </button>
                    </div>

                    <AdminControls 
                        filters={filters}
                        setFilters={setFilters}
                        sort={sort}
                        setSort={setSort}
                        metadata={metadata}
                    />

                    <BulkActions 
                        selectedCards={selectedCards}
                        setSelectedCards={setSelectedCards}
                        handleOpenConfirm={handleOpenConfirm}
                    />

                    <AdminCardList
                        onEdit={handleOpenEditForm}
                        onDelete={(docId) => handleOpenConfirm(() => handleDelete(docId))}
                        selectedCards={selectedCards}
                        setSelectedCards={setSelectedCards}
                        filters={filters}
                        sort={sort}
                    />
                </div>
            </div>

            <CardFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} cardToEdit={cardToEdit} />
            <SiteContentModal isOpen={isContentModalOpen} onClose={() => setIsContentModalOpen(false)} />
            <ConfirmationModal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirm} title="Are you sure?" message="This action may be permanent. Please confirm." />
        </>
    );
};

export default Admin;