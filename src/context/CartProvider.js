import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create a custom hook for easy access
export const useCart = () => useContext(CartContext);

// 3. Create the Provider component
export const CartProvider = ({ children }) => {
    const [basket, setBasket] = useState(() => {
        // Load cart from localStorage on initial load
        try {
            const localData = localStorage.getItem('kpopGalleryCart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Could not parse cart from localStorage", error);
            return [];
        }
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('kpopGalleryCart', JSON.stringify(basket));
    }, [basket]);

    const addToBasket = (card) => {
        setBasket(prev => {
            // Prevent duplicates
            if (prev.find(item => item.docId === card.docId)) {
                return prev;
            }
            return [...prev, card];
        });
    };

    const removeFromBasket = (docId) => {
        setBasket(prev => prev.filter(item => item.docId !== docId));
    };

    const clearBasket = () => {
        setBasket([]);
    };

    const isInBasket = (docId) => {
        return basket.some(item => item.docId === docId);
    };

    const value = {
        basket,
        addToBasket,
        removeFromBasket,
        clearBasket,
        isInBasket,
        itemCount: basket.length,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};