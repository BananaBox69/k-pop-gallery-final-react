import { createContext, useContext, useState } from 'react';

// 1. Create a context to hold the filter state and functions
const FilterContext = createContext();

// 2. Create a custom hook for easy access
export const useFilters = () => useContext(FilterContext);

// 3. Create the provider component
export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({}); // Stores filters for each section, e.g., { 'member-rv-irene': { searchTerm: '...', album: '...' } }
    const [activeSectionId, setActiveSectionId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getFiltersForSection = (sectionId) => {
        return filters[sectionId] || { searchTerm: '', album: 'All', version: 'All', tags: new Set() };
    };

    const updateFiltersForSection = (sectionId, newFilters) => {
        setFilters(prev => ({
            ...prev,
            [sectionId]: { ...getFiltersForSection(sectionId), ...newFilters }
        }));
    };

    const resetFiltersForSection = (sectionId) => {
        setFilters(prev => ({
            ...prev,
            [sectionId]: { searchTerm: '', album: 'All', version: 'All', tags: new Set() }
        }));
    };

    const value = {
        getFiltersForSection,
        updateFiltersForSection,
        resetFiltersForSection,
        activeSectionId,
        setActiveSectionId,
        isSidebarOpen,
        setIsSidebarOpen,
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};