import React from 'react';

const AdminControls = ({ filters, setFilters, sort, setSort, metadata }) => {
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSortChange = (e) => {
        const { name, value } = e.target;
        setSort(prev => ({ ...prev, [name]: value }));
    };

    return (
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
    );
};

export default AdminControls;