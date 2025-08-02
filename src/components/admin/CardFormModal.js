import React, { useState, useEffect, useContext } from 'react';
import Modal from '../ui/Modal';
import { AppContext } from '../../context/AppContext';
import { saveCard } from '../../api/firestoreService';

const CardFormModal = ({ isOpen, onClose, cardToEdit }) => {
    const { metadata } = useContext(AppContext);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (cardToEdit) {
            setFormData(cardToEdit);
        } else {
            setFormData({
                group: '', member: '', album: '', description: '', price: 0,
                discount: 0, status: 'available', isRare: false, imageUrl: '', backImage: ''
            });
        }
    }, [cardToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSave = async (e, addAnother = false) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await saveCard(formData, cardToEdit?.docId);
            if (addAnother) {
                setFormData(prev => ({
                    ...{ group: prev.group, member: prev.member, album: '', description: '', price: 0, discount: 0, status: 'available', isRare: false, imageUrl: '', backImage: '' }
                }));
                document.getElementById('album-input').focus();
            } else {
                onClose();
            }
        } catch (error) {
            console.error("Failed to save card:", error);
            alert("Error: Could not save card.");
        } finally {
            setIsSaving(false);
        }
    };
    
    const membersForSelectedGroup = formData.group ? metadata.memberOrder[formData.group] || [] : [];
    const albumSuggestions = formData.group && metadata.albums?.[formData.group] 
        ? Object.keys(metadata.albums[formData.group].group_albums || {}).concat(Object.keys(metadata.albums[formData.group][formData.member] || {}))
        : [];
    const versionSuggestions = formData.group && formData.album && metadata.albums?.[formData.group]
        ? (metadata.albums[formData.group].group_albums?.[formData.album]?.versions || metadata.albums[formData.group][formData.member]?.[formData.album]?.versions || [])
        : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={cardToEdit ? 'Edit Card' : 'Add New Card'}>
            <form className="flex flex-col gap-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                    <select name="group" value={formData.group || ''} onChange={handleChange} required className="p-2 bg-gray-700 rounded-md">
                        <option value="">Select Group</option>
                        {metadata.groupOrder?.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select name="member" value={formData.member || ''} onChange={handleChange} required className="p-2 bg-gray-700 rounded-md">
                        <option value="">Select Member</option>
                        {membersForSelectedGroup.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <input id="album-input" name="album" value={formData.album || ''} onChange={handleChange} placeholder="Album" required className="p-2 bg-gray-700 rounded-md" list="album-suggestions" />
                <datalist id="album-suggestions">
                    {[...new Set(albumSuggestions)].map(a => <option key={a} value={a} />)}
                </datalist>
                <input name="description" value={formData.version || formData.description || ''} onChange={handleChange} placeholder="Version / Description" required className="p-2 bg-gray-700 rounded-md" list="version-suggestions" />
                <datalist id="version-suggestions">
                    {[...new Set(versionSuggestions)].map(v => <option key={v} value={v} />)}
                </datalist>
                <div className="grid grid-cols-2 gap-3">
                    <input name="price" type="number" step="0.01" value={formData.price || ''} onChange={handleChange} placeholder="Price (€)" required className="p-2 bg-gray-700 rounded-md" />
                    <select name="discount" value={formData.discount || 0} onChange={handleChange} className="p-2 bg-gray-700 rounded-md">
                        <option value="0">No Discount</option>
                        <option value="10">10% Sale</option>
                        <option value="20">20% Super Sale</option>
                    </select>
                </div>
                <select name="status" value={formData.status || 'available'} onChange={handleChange} className="p-2 bg-gray-700 rounded-md">
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="archived">Archived</option>
                </select>
                <input name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="Front Image URL" required className="p-2 bg-gray-700 rounded-md" />
                <input name="backImage" value={formData.backImage || ''} onChange={handleChange} placeholder="Back Image URL" className="p-2 bg-gray-700 rounded-md" />
                <label className="flex items-center gap-2">
                    <input name="isRare" type="checkbox" checked={!!formData.isRare} onChange={handleChange} className="w-4 h-4" /> Is Rare?
                </label>
                <div className="flex gap-3 mt-4">
                    <button onClick={handleSave} disabled={isSaving} className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-500 transition-colors disabled:bg-gray-500">
                        {isSaving ? 'Saving...' : 'Save Card'}
                    </button>
                    {!cardToEdit && (
                        <button onClick={(e) => handleSave(e, true)} disabled={isSaving} className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500">
                            Save & Add Another
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
};

export default CardFormModal;