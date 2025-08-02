import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminCardList = ({ onEdit, onDelete, selectedCards, setSelectedCards, filters, sort }) => {
    const { cards, loading, metadata } = useContext(AppContext);

    const handleSelect = (docId) => {
        const newSelection = new Set(selectedCards);
        if (newSelection.has(docId)) {
            newSelection.delete(docId);
        } else {
            newSelection.add(docId);
        }
        setSelectedCards(newSelection);
    };

    const filteredAndSortedCards = useMemo(() => {
        let processedCards = [...cards];

        // Filtering
        processedCards = processedCards.filter(c => {
            if (filters.status !== 'All' && c.status !== filters.status) return false;
            if (filters.group !== 'All' && c.group !== filters.group) return false;
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                const searchableText = `${c.id} ${c.album} ${c.member} ${c.group} ${c.version || c.description}`.toLowerCase();
                if (!searchableText.includes(term)) return false;
            }
            return true;
        });

        // Sorting
        processedCards.sort((a, b) => {
            if (sort.by === 'default') {
                const groupA = metadata.groupOrder?.indexOf(a.group) ?? -1;
                const groupB = metadata.groupOrder?.indexOf(b.group) ?? -1;
                if (groupA !== groupB) return groupA - groupB;
                const memberA = metadata.memberOrder?.[a.group]?.indexOf(a.member) ?? -1;
                const memberB = metadata.memberOrder?.[b.group]?.indexOf(b.member) ?? -1;
                if (memberA !== memberB) return memberA - memberB;
                return (a.id || '').localeCompare(b.id || '');
            }
            
            const valA = a[sort.by];
            const valB = b[sort.by];

            let compare = 0;
            if (typeof valA === 'string') compare = valA.localeCompare(valB);
            else if (typeof valA === 'number') compare = valA - valB;
            else if (valA instanceof Date) compare = valA.getTime() - valB.getTime();

            return sort.order === 'asc' ? compare : -compare;
        });

        return processedCards;
    }, [cards, filters, sort, metadata]);


    if (loading) return <p className="text-gray-400">Loading cards...</p>;

    return (
        <div className="flex flex-col gap-2">
            {filteredAndSortedCards.map(card => {
                const isSelected = selectedCards.has(card.docId);
                const isNew = card.dateAdded && (Date.now() - card.dateAdded.getTime()) < 7 * 24 * 60 * 60 * 1000;

                return (
                    <div 
                        key={card.docId} 
                        className={`p-3 rounded-lg flex items-center gap-4 transition-colors cursor-pointer ${isSelected ? 'bg-blue-900/50' : 'bg-gray-900/70 hover:bg-gray-900'}`}
                        onClick={() => handleSelect(card.docId)}
                    >
                        <input type="checkbox" checked={isSelected} readOnly className="w-5 h-5 flex-shrink-0 bg-gray-700 border-gray-600 rounded pointer-events-none" />
                        
                        <img src={card.imageUrl} alt={card.id} className="w-12 h-20 object-cover rounded-md flex-shrink-0"/>
                        <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                            <p><strong>ID:</strong> {card.id}</p>
                            <p><strong>Member:</strong> {card.member}</p>
                            <p className="col-span-2"><strong>Album:</strong> {card.album}</p>
                            <p><strong>Price:</strong> €{card.price?.toFixed(2)}</p>
                            <div>
                                <strong>Status:</strong> <span className="capitalize">{card.status}</span>
                                {isNew && <span className="text-cyan-400 ml-2">New</span>}
                                {card.isRare && <span className="text-yellow-400 ml-2">Rare</span>}
                                {card.discount === 10 && <span className="text-red-400 ml-2">Sale</span>}
                                {card.discount === 20 && <span className="text-purple-400 ml-2">Super Sale</span>}
                            </div>
                        </div>
                        <div className="flex gap-2 z-10">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(card); }} className="p-2 text-blue-400 hover:text-blue-300"><FaEdit size={18} /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(card.docId); }} className="p-2 text-red-500 hover:text-red-400"><FaTrash size={18} /></button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default AdminCardList;