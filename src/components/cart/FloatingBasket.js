import React, { useState } from 'react';
import { useCart } from '../../context/CartProvider';
import { useUI } from '../../context/UIProvider';
import { calculateDiscountedPrice } from '../../utils/helpers';
import { FaShoppingCart } from 'react-icons/fa';
import BasketModal from './BasketModal';
import ConfirmationModal from '../admin/ConfirmationModal';

const FloatingBasket = () => {
    const { basket, itemCount, clearBasket } = useCart();
    const { activeColor } = useUI();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    if (itemCount === 0) return null;

    const totalPrice = basket.reduce((sum, item) => {
        return sum + calculateDiscountedPrice(item.price, item.discount);
    }, 0);

    const handleConfirmClear = () => {
        clearBasket();
        setIsConfirmOpen(false);
    };

    return (
        <>
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-lg bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-full shadow-lg z-40 flex items-center justify-between px-3 md:px-6 py-3 animate-fade-in-up">
                <div className="flex items-center gap-3 text-white">
                    <FaShoppingCart />
                    <span>{itemCount} item{itemCount > 1 ? 's' : ''}</span>
                    <strong className="hidden md:block">| Total: €{totalPrice.toFixed(2)}</strong>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsConfirmOpen(true)}
                        style={{ backgroundColor: activeColor, transition: 'background-color 0.5s ease' }}
                        className="text-white px-5 py-2 text-sm rounded-full font-semibold hover:bg-opacity-90 transition-all"
                    >
                        Empty Basket
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[var(--dynamic-ui-color)] text-white px-5 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                    >
                        View Basket
                    </button>
                </div>
            </div>
            <BasketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmClear}
                title="Empty Basket"
                message="Are you sure you want to remove all items from your basket?"
            />
        </>
    );
};

export default FloatingBasket;