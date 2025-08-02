import React, { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useUI } from '../../context/UIProvider';
import { useCart } from '../../context/CartProvider';
import { config } from '../../config/appConfig';
import { FaAngleDown } from 'react-icons/fa';

const GroupIntro = ({ id, groupName, subtitle, bannerUrl, logoUrl }) => {
    const { activeColor, setActiveColor } = useUI();
    const { itemCount } = useCart();
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.6 });
    const groupColor = config.colors[groupName]?.group || '#777';

    useEffect(() => {
        if (isInView) {
            setActiveColor(groupColor);
        }
    }, [isInView, groupColor, setActiveColor]);

    return (
        <section ref={ref} id={id} className="showcase-section scroll-snap-section group-intro text-center min-h-screen flex flex-col justify-center items-center relative p-8">
            {bannerUrl && <div className="absolute top-0 left-0 w-full h-1/2 bg-cover bg-center z-0" style={{ backgroundImage: `url(${bannerUrl})` }}></div>}
            <div className="title-container z-10">
                <h2 className="hero-title-glow font-playfair-display text-5xl font-bold">{groupName}</h2>
                <p className="hero-subtitle-glow group-subtitle text-lg mt-2">{subtitle}</p>
            </div>
            {logoUrl && <img src={logoUrl} alt={`${groupName} logo`} className="absolute bottom-8 left-8 w-36 h-24 object-contain z-10" />}
            <div className={`scroll-down-arrow ${itemCount > 0 ? 'raised' : ''}`} style={{ color: activeColor, transition: 'color 0.5s ease, bottom 0.5s ease' }}>
                <FaAngleDown size={24} />
            </div>
        </section>
    );
};

export default GroupIntro;