import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Carousel from './Carousel';
import { calculateDiscountedPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartProvider';
import { useFilters } from '../../hooks/useFilters';
import { FaCheckCircle, FaCartPlus, FaAngleDown } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { config } from '../../config/appConfig';
import RoomBackdrop from '../ui/RoomBackdrop';
import { useUI } from '../../context/UIProvider';

const MemberSection = ({ groupName, memberName, cards, sectionId, nextSectionColor }) => {
    const { setActiveColor, setActiveGroupColor } = useUI();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { amount: 0.6, once: false });

    const { siteContent, metadata } = useContext(AppContext);
    const { basket, addToBasket, removeFromBasket, isInBasket, itemCount } = useCart();
    const { getFiltersForSection, setActiveSectionId } = useFilters();

    const currentFilters = getFiltersForSection(sectionId);

    const filteredCards = useMemo(() => cards.filter(card => {
        // ... (filtering logic remains the same) ...
    }), [cards, currentFilters]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [activeCard, setActiveCard] = useState(filteredCards[0] || null);

    const quote = siteContent.memberQuotes?.[groupName]?.[memberName];
    const signatureUrl = metadata.memberSignatures?.[groupName]?.[memberName];
    const memberColor = config.colors[groupName]?.[memberName] || '#FF4757';
    const groupColor = config.colors[groupName]?.group || '#FF4757';

    useEffect(() => {
        if (isInView) {
            setActiveSectionId(sectionId);
            setActiveColor(memberColor);
            setActiveGroupColor(groupColor); // Also set the active group color
        }
    }, [isInView, sectionId, memberColor, groupColor, setActiveSectionId, setActiveColor, setActiveGroupColor]);

    useEffect(() => {
        setActiveIndex(0);
    }, [filteredCards]);

    useEffect(() => {
        setActiveCard(filteredCards[activeIndex] || null);
    }, [activeIndex, filteredCards]);

    const finalPrice = useMemo(() => {
        return activeCard ? calculateDiscountedPrice(activeCard.price, activeCard.discount) : 0;
    }, [activeCard]);

    const isCardInBasket = useMemo(() => {
        return activeCard ? isInBasket(activeCard.docId) : false;
    }, [activeCard, isInBasket]);

    const handleBasketButtonClick = () => {
        if (!activeCard) return;
        if (isCardInBasket) {
            removeFromBasket(activeCard.docId);
        } else if (activeCard.status === 'available') {
            addToBasket(activeCard);
        }
    };
    
    // Define button style based on card status and whether it's in the basket
    const getButtonStyle = () => {
        if (!activeCard) return { backgroundColor: '#555', cursor: 'not-allowed' };
        if (isCardInBasket) {
            return { backgroundColor: groupColor };
        }
        if (activeCard.status === 'available') {
            return { backgroundColor: memberColor };
        }
        return { backgroundColor: '#555', cursor: 'not-allowed' };
    };

    return (
        <motion.section
            ref={sectionRef}
            id={sectionId}
            className="showcase-section scroll-snap-section member-section-container min-h-screen flex flex-col justify-center items-center p-8 relative overflow-hidden"
            style={{'--member-color': memberColor, '--group-color': groupColor}}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <RoomBackdrop />

            {quote && (
                 <div className="member-quote absolute top-8 left-8 text-lg italic max-w-sm z-20 text-left" style={{ color: memberColor }}>
                    <span className="absolute text-8xl -top-8 -left-4 opacity-10 font-playfair-display">“</span>
                    <p dangerouslySetInnerHTML={{ __html: quote.replace(/\n/g, '<br />') }} />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-6xl mx-auto z-10">
                <div className="card-details-panel text-left">
                    <p className="card-id-text text-gray-400">{activeCard?.id || 'N/A'}</p>
                    <h2 className="member-name text-5xl font-extrabold" style={{ color: memberColor }}>{memberName}</h2>
                    <p className="group-name text-2xl font-medium" style={{ color: groupColor }}>{groupName}</p>
                    <p className="album-name text-lg mt-6 text-gray-300">{activeCard?.album || (filteredCards.length === 0 ? 'No matching cards found' : '')}</p>
                    <p className="version-name text-base text-gray-500 min-h-[1.5rem]">{activeCard?.version || activeCard?.description || ''}</p>
                    <p className="price-tag text-4xl font-black mt-4" style={{ color: memberColor }}>
                        {activeCard ? `€${finalPrice.toFixed(2)}` : ''}
                    </p>
                    {activeCard && activeCard.discount > 0 && activeCard.price > finalPrice && (
                        <div className="original-price-container text-gray-500 text-xl">
                            <span className="line-through">€{activeCard.price.toFixed(2)}</span>
                        </div>
                    )}
                    <button
                        onClick={handleBasketButtonClick}
                        disabled={!activeCard || activeCard.status !== 'available'}
                        className="mt-6 w-auto px-8 py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-all"
                        style={getButtonStyle()}
                    >
                        {isCardInBasket ? <><FaCheckCircle/> In Basket</>
                            : activeCard?.status !== 'available' ? <span className="capitalize">{activeCard?.status}</span>
                            : <><FaCartPlus/> Add to Basket</>
                        }
                    </button>
                </div>
                <div className="carousel-mask w-full lg:w-[150%] lg:-ml-[25%]">
                    <Carousel
                        cards={filteredCards}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                </div>
            </div>

            {signatureUrl && (
                <div className="member-signature absolute bottom-8 left-8 w-40 h-28 z-20" style={{
                    maskImage: `url(${signatureUrl})`, WebkitMaskImage: `url(${signatureUrl})`,
                    maskSize: 'contain', WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                    backgroundColor: memberColor,
                }}/>
            )}
            
            <div className={`scroll-down-arrow ${itemCount > 0 ? 'raised' : ''}`} style={{ color: nextSectionColor, transition: 'color 0.5s ease, bottom 0.5s ease' }}>
                <FaAngleDown size={24} />
            </div>
        </motion.section>
    );
};

export default MemberSection;