import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();
export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [activeColor, setActiveColor] = useState('#777');
    const [activeGroupColor, setActiveGroupColor] = useState('#777');
    const [isNavScrolling, setIsNavScrolling] = useState(false);
    const [isBlurOverlayActive, setIsBlurOverlayActive] = useState(false); // New state for blur

    useEffect(() => {
        document.documentElement.style.setProperty('--dynamic-ui-color', activeColor);
    }, [activeColor]);

    const onNavClick = () => {
        setIsNavScrolling(true);
        setTimeout(() => setIsNavScrolling(false), 1000); 
    };

    const value = {
        activeColor,
        setActiveColor,
        activeGroupColor,
        setActiveGroupColor,
        isNavScrolling,
        onNavClick,
        isBlurOverlayActive,      // Expose state and setter
        setIsBlurOverlayActive,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};