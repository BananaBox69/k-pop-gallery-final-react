import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();
export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [activeColor, setActiveColor] = useState('#777');
    const [activeGroupColor, setActiveGroupColor] = useState('#777'); // New state for group color
    const [isNavScrolling, setIsNavScrolling] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--dynamic-ui-color', activeColor);
        const glowRgb = hexToRgb(activeColor);
        if (glowRgb) {
            document.documentElement.style.setProperty('--hero-glow-color', `rgba(${glowRgb.r}, ${glowRgb.g}, ${glowRgb.b}, 0.5)`);
        }
    }, [activeColor]);

    const onNavClick = () => {
        setIsNavScrolling(true);
        setTimeout(() => setIsNavScrolling(false), 1000); 
    };

    const hexToRgb = (hex) => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }

    const value = {
        activeColor,
        setActiveColor,
        activeGroupColor,      // Expose new state and setter
        setActiveGroupColor,
        isNavScrolling,
        onNavClick,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};