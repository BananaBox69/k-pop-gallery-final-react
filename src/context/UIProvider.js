import React, { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();
export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
    const [activeColor, setActiveColor] = useState('#777');
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
        // Reduce timeout to match scroll duration and remove perceived delay
        setTimeout(() => setIsNavScrolling(false), 100); 
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
        isNavScrolling,
        onNavClick,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};