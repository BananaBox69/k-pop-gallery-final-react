import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaPlus, FaArchive, FaCheckCircle, FaClock, FaDollarSign, FaTag, FaEdit } from 'react-icons/fa';
import AdminCardList from '../components/admin/AdminCardList';
import CardFormModal from '../components/admin/CardFormModal';
import ConfirmationModal from '../components/admin/ConfirmationModal';
import SiteContentModal from '../components/admin/SiteContentModal';
import { deleteCard, bulkUpdateCards } from '../api/firestoreService';

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
    
    const [filters, setFilters] = useState({ group: 'All', member: 'All', status: 'All', searchTerm: '' });
    const [sort, setSort] = useState({ by: 'default', order: 'asc' });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        setSort(prev => ({ ...prev, [name]: value }));
    };

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
    
    const handleBulkUpdate = async (updateData) => {
        if (selectedCards.size === 0) return;
        try {
            await bulkUpdateCards(Array.from(selectedCards), updateData);
            setSelectedCards(new Set());
        } catch (error) {
            console.error("Bulk update failed:", error);
            alert("Bulk update failed.");
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

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 p-4 bg-gray-900/50 rounded-lg">
                        {/* Filters and Sorting UI */}
                        <input name="searchTerm" value={filters.searchTerm} onChange={handleFilterChange} placeholder="Search..." className="p-2 bg-gray-700 rounded-md col-span-2 lg:col-span-2" />
                        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 bg-gray-700 rounded-md">
                            <option value="All">All Status</option>
                            <option value="available">Available</option>
                            <option value="reserved">Reserved</option>
                            <option value="sold">Sold</option>
                            <option value="archived">Archived</option>
                        </select>
                        <select name="group" value={filters.group} onChange={handleFilterChange} className="p-2 bg-gray-700 rounded-md">
                            <option value="All">All Groups</option>
                            {metadata.groupOrder?.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <select name="by" value={sort.by} onChange={handleSortChange} className="p-2 bg-gray-700 rounded-md">
                            <option value="default">Sort By Default</option>
                            <option value="id">ID</option>
                            <option value="price">Price</option>
                            <option value="dateAdded">Date Added</option>
                        </select>
                        <select name="order" value={sort.order} onChange={handleSortChange} className="p-2 bg-gray-700 rounded-md">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>

                    <div className="bg-gray-900 p-3 rounded-md mb-4 flex flex-wrap items-center gap-2 text-sm">
                        <span className="mr-4">{selectedCards.size} selected</span>
                        <BulkButton onClick={() => handleBulkUpdate({status: 'available'})} disabled={selectedCards.size === 0} className="bg-green-600"><FaCheckCircle className="mr-1"/> Available</BulkButton>
                        <BulkButton onClick={() => handleBulkUpdate({status: 'reserved'})} disabled={selectedCards.size === 0} className="bg-orange-500"><FaClock className="mr-1"/> Reserved</BulkButton>
                        <BulkButton onClick={() => handleBulkUpdate({status: 'sold'})} disabled={selectedCards.size === 0} className="bg-gray-500"><FaDollarSign className="mr-1"/> Sold</BulkButton>
                        <BulkButton onClick={() => handleOpenConfirm(() => handleBulkUpdate({status: 'archived'}))} disabled={selectedCards.size === 0} className="bg-indigo-600"><FaArchive className="mr-1"/> Archive</BulkButton>
                        <BulkButton onClick={() => handleBulkUpdate({discount: 10})} disabled={selectedCards.size === 0} className="bg-red-500"><FaTag className="mr-1"/> Sale (10%)</BulkButton>
                        <BulkButton onClick={() => handleBulkUpdate({discount: 20})} disabled={selectedCards.size === 0} className="bg-purple-600"><FaTag className="mr-1"/> Super Sale (20%)</BulkButton>
                        <BulkButton onClick={() => handleBulkUpdate({discount: 0})} disabled={selectedCards.size === 0} className="bg-gray-600">Clear Sale</BulkButton>
                    </div>

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

const BulkButton = ({ children, className, ...props }) => (
    <button {...props} className={`flex items-center px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}>
        {children}
    </button>
);

export default Admin;