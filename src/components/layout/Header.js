import React, { useContext, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useUI } from '../../context/UIProvider';
import { AppContext } from '../../context/AppContext';
import { useCart } from '../../context/CartProvider';
import PerspectiveTiles from '../ui/PerspectiveTiles';
import { FaAngleDown } from 'react-icons/fa';

const Header = () => {
    const { siteContent } = useContext(AppContext);
    const { setActiveColor } = useUI();
    const { itemCount } = useCart();
    const ref = useRef(null);
    const isInView = useInView(ref, { amount: 0.6 });

    useEffect(() => {
        if (isInView) {
            setActiveColor('#777');
        }
    }, [isInView, setActiveColor]);

    return (
        <header ref={ref} id="header" className="showcase-section scroll-snap-section text-center min-h-screen flex flex-col justify-center items-center p-8 relative">
            <PerspectiveTiles />
            <div className="title-container z-10">
                <h1 className="hero-title-glow font-playfair-display text-5xl md:text-6xl font-bold">
                    {siteContent.title}
                </h1>
                {siteContent.subtitle && (
                    <p
                        className="hero-subtitle-glow hero-subtitle text-lg md:text-xl mt-4 max-w-2xl mx-auto text-gray-400"
                        dangerouslySetInnerHTML={{ __html: siteContent.subtitle.replace(/\n/g, '<br />') }}
                    />
                )}
            </div>
            <div className={`scroll-down-arrow ${itemCount > 0 ? 'raised' : ''}`}>
                <FaAngleDown size={24} />
            </div>
        </header>
    );
};

export default Header;