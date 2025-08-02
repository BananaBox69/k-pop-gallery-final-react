import React, { useState, useEffect, useContext } from 'react';
import Modal from '../ui/Modal';
import { AppContext } from '../../context/AppContext';
import { saveSiteContent } from '../../api/firestoreService';

const SiteContentModal = ({ isOpen, onClose }) => {
    const { siteContent, metadata } = useContext(AppContext);
    const [content, setContent] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (siteContent) {
            // Deep copy to prevent direct state mutation
            setContent(JSON.parse(JSON.stringify(siteContent)));
        }
    }, [siteContent, isOpen]);

    const handleChange = (e, group, member) => {
        const { name, value } = e.target;
        
        if (group && member) {
            setContent(prev => ({
                ...prev,
                memberQuotes: {
                    ...prev.memberQuotes,
                    [group]: {
                        ...prev.memberQuotes?.[group],
                        [member]: value
                    }
                }
            }));
        } else if (group) {
             setContent(prev => ({
                ...prev,
                [name]: {
                    ...prev[name],
                    [group]: value
                }
            }));
        } else {
            setContent(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await saveSiteContent(content);
            onClose();
        } catch (error) {
            console.error("Failed to save site content:", error);
            alert("Error saving content.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Site Content">
            <form onSubmit={handleSave} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2">
                <div>
                    <label className="text-sm text-gray-400">Site Title</label>
                    <input name="title" value={content.title || ''} onChange={handleChange} className="p-2 bg-gray-700 rounded-md w-full mt-1" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Site Subtitle</label>
                    <textarea name="subtitle" value={content.subtitle || ''} onChange={handleChange} rows="2" className="p-2 bg-gray-700 rounded-md w-full mt-1" />
                </div>
                
                {metadata.groupOrder?.map(groupName => (
                    <div key={groupName} className="p-3 border border-gray-700 rounded-lg">
                        <h4 className="text-lg font-bold mb-2">{groupName}</h4>
                        <label className="text-sm text-gray-400">Group Subtitle</label>
                        <input name="groupSubtitles" value={content.groupSubtitles?.[groupName] || ''} onChange={(e) => handleChange(e, groupName)} className="p-2 bg-gray-700 rounded-md w-full mt-1 mb-2" />
                        
                        <label className="text-sm text-gray-400">Member Quotes</label>
                        {metadata.memberOrder?.[groupName]?.map(memberName => (
                             <textarea 
                                key={memberName}
                                placeholder={`${memberName}'s Quote`}
                                value={content.memberQuotes?.[groupName]?.[memberName] || ''} 
                                onChange={(e) => handleChange(e, groupName, memberName)} 
                                rows="2" 
                                className="p-2 bg-gray-800 rounded-md w-full mt-1 text-sm" 
                            />
                        ))}
                    </div>
                ))}

                <button type="submit" disabled={isSaving} className="bg-green-600 text-white p-3 rounded-md hover:bg-green-500 transition-colors disabled:bg-gray-500 mt-4">
                    {isSaving ? 'Saving...' : 'Save All Content'}
                </button>
            </form>
        </Modal>
    );
};

export default SiteContentModal;