import React, { useContext } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { AppContext } from '../../context/AppContext';
import { CgClose } from 'react-icons/cg';

const FilterSidebar = () => {
    const { isSidebarOpen, setIsSidebarOpen, activeSectionId, getFiltersForSection, updateFiltersForSection, resetFiltersForSection } = useFilters();
    const { cards } = useContext(AppContext);

    if (!activeSectionId) return null;

    // Get the group and member name from the active section ID
    const [, groupName, memberName] = activeSectionId.split('-');
    const currentFilters = getFiltersForSection(activeSectionId);

    // Get all unique albums and versions for the current member
    const memberCards = cards.filter(c => c.group === groupName && c.member === memberName);
    const albums = [...new Set(memberCards.map(c => c.album).filter(Boolean))].sort();
    const versions = [...new Set(memberCards.map(c => c.version || c.description).filter(Boolean))].sort();
    const tags = ['new', 'rare', 'sale', 'super-sale'];

    const handleInputChange = (e) => {
        updateFiltersForSection(activeSectionId, { [e.target.name]: e.target.value });
    };

    const handleTagClick = (tag) => {
        const newTags = new Set(currentFilters.tags);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        updateFiltersForSection(activeSectionId, { tags: newTags });
    };

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
            />
            <aside className={`fixed top-0 right-0 h-full w-80 bg-gray-900/80 backdrop-blur-md shadow-lg z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Filter Cards</h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white"><CgClose size={24} /></button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    {/* Search Input */}
                    <input name="searchTerm" value={currentFilters.searchTerm} onChange={handleInputChange} placeholder="Search by Album, ID..." className="p-2 bg-gray-800 rounded-md"/>
                    {/* Album Select */}
                    <select name="album" value={currentFilters.album} onChange={handleInputChange} className="p-2 bg-gray-800 rounded-md">
                        <option value="All">All Albums</option>
                        {albums.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {/* Version Select */}
                    <select name="version" value={currentFilters.version} onChange={handleInputChange} className="p-2 bg-gray-800 rounded-md">
                        <option value="All">All Versions</option>
                        {versions.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-3 py-1 text-sm rounded-full transition-colors ${currentFilters.tags.has(tag) ? 'bg-redvelvet text-white' : 'bg-gray-700 text-gray-300'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <hr className="border-gray-700"/>
                    <button onClick={() => resetFiltersForSection(activeSectionId)} className="w-full bg-gray-600 p-2 rounded-md hover:bg-gray-500">
                        Reset Filters
                    </button>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;