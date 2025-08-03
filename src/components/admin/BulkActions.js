import React from 'react';
import { FaCheckCircle, FaClock, FaDollarSign, FaTag, FaArchive } from 'react-icons/fa';
import { bulkUpdateCards } from '../../api/firestoreService';

const BulkButton = ({ children, className, ...props }) => (
    <button {...props} className={`flex items-center px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}>
        {children}
    </button>
);

const BulkActions = ({ selectedCards, setSelectedCards, handleOpenConfirm }) => {
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
    );
};

export default BulkActions;