import React from 'react';

const Sparkles = ({ color }) => {
    const numSparkles = color === 'gold' ? 40 : 20;
    const shadow1 = color === 'gold' ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.4)';
    const shadow2 = color === 'gold' ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.4)';

    return Array.from({ length: numSparkles }).map((_, i) => (
        <div
            key={i}
            className="sparkle"
            style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 0.8}s`,
                '--sparkle-color': color,
                '--sparkle-color-shadow-1': shadow1,
                '--sparkle-color-shadow-2': shadow2,
                '--sparkle-end-x': `${(Math.random() * 2 - 1) * 70}px`,
                '--sparkle-end-y': `${(Math.random() * 2 - 1) * 70}px`,
            }}
        />
    ));
};

export default Sparkles;