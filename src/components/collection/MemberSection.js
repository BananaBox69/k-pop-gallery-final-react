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

// Staggered animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};


const MemberSection = ({ groupName, memberName, cards, sectionId, nextSectionColor }) => {
    const { setActiveColor, setActiveGroupColor } = useUI();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { amount: 0.6, once: false });

    const { siteContent, metadata } = useContext(AppContext);
    const { basket, addToBasket, removeFromBasket, isInBasket, itemCount } = useCart();
    const { getFiltersForSection, setActiveSectionId } = useFilters();

    const currentFilters = getFiltersForSection(sectionId);

    const filteredCards = useMemo(() => {
        if (!cards || cards.length === 0) return [];
        return cards.filter(card => {
            const { searchTerm, album, version, tags } = currentFilters;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const searchableText = `${card.album || ''} ${card.version || card.description || ''} ${card.id || ''}`.toLowerCase();
                if (!searchableText.includes(term)) return false;
            }
            if (album !== 'All' && card.album !== album) return false;
            if (version !== 'All' && (card.version || card.description) !== version) return false;
            if (tags.size > 0) {
                const isNew = card.dateAdded && (Date.now() - card.dateAdded.getTime()) < 7 * 24 * 60 * 60 * 1000;
                if (tags.has('new') && !isNew) return false;
                if (tags.has('rare') && !card.isRare) return false;
                if (tags.has('sale') && card.discount !== 10) return false;
                if (tags.has('super-sale') && card.discount !== 20) return false;
            }
            return true;
        });
    }, [cards, currentFilters]);

    const [activeIndex, setActiveIndex] = useState(0);

    // This is the key fix: activeCard is now derived state from activeIndex and filteredCards
    const activeCard = useMemo(() => filteredCards[activeIndex] || null, [filteredCards, activeIndex]);

    const quote = siteContent.memberQuotes?.[groupName]?.[memberName];
    const signatureUrl = metadata.memberSignatures?.[groupName]?.[memberName];
    const memberColor = config.colors[groupName]?.[memberName] || '#FF4757';
    const groupColor = config.colors[groupName]?.group || '#FF4757';

    useEffect(() => {
        if (isInView) {
            setActiveSectionId(sectionId);
            setActiveColor(memberColor);
            setActiveGroupColor(groupColor);
        }
    }, [isInView, sectionId, memberColor, groupColor, setActiveSectionId, setActiveColor, setActiveGroupColor]);
    
    // Reset index when filters change
    useEffect(() => {
        setActiveIndex(0);
    }, [filteredCards]);

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
            className="showcase-section scroll-snap-section member-section-container"
            style={{'--member-color': memberColor, '--group-color': groupColor}}
        >
            <RoomBackdrop />

            {quote && (
                <motion.div 
                    className="member-quote" 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <span className="quote-mark">“</span>
                    <p dangerouslySetInnerHTML={{ __html: quote.replace(/\n/g, '<br />') }} />
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-6xl mx-auto z-10">
                <motion.div 
                    className="card-details-panel"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.p variants={itemVariants} className="card-id-text">{activeCard?.id || 'N/A'}</motion.p>
                    <motion.h2 variants={itemVariants} className="member-name" style={{ color: memberColor }}>{memberName}</motion.h2>
                    <motion.p variants={itemVariants} className="group-name" style={{ color: groupColor }}>{groupName}</motion.p>
                    <motion.p variants={itemVariants} className="album-name">{activeCard?.album || (filteredCards.length === 0 ? 'No matching cards found' : '')}</motion.p>
                    <motion.p variants={itemVariants} className="version-name">{activeCard?.version || activeCard?.description || ''}</motion.p>
                    <motion.p variants={itemVariants} className="price-tag" style={{ color: memberColor }}>
                        {activeCard ? `€${finalPrice.toFixed(2)}` : ''}
                    </motion.p>
                    {activeCard && activeCard.discount > 0 && activeCard.price > finalPrice && (
                        <motion.div variants={itemVariants} className="original-price-container">
                            <span className="line-through">€{activeCard.price.toFixed(2)}</span>
                        </motion.div>
                    )}
                    <motion.button
                        variants={itemVariants}
                        onClick={handleBasketButtonClick}
                        disabled={!activeCard || activeCard.status !== 'available'}
                        className="add-to-basket-main-btn"
                        style={getButtonStyle()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isCardInBasket ? <><FaCheckCircle/> In Basket</>
                            : activeCard?.status !== 'available' ? <span className="capitalize">{activeCard?.status}</span>
                            : <><FaCartPlus/> Add to Basket</>
                        }
                    </motion.button>
                </motion.div>
                <div className="carousel-mask w-full lg:w-[150%] lg:-ml-[25%]">
                    <Carousel
                        cards={filteredCards}
                        onSlideChange={setActiveIndex}
                    />
                </div>
            </div>

            {signatureUrl && (
                <motion.div 
                    className="member-signature"
                    style={{
                        maskImage: `url(${signatureUrl})`, WebkitMaskImage: `url(${signatureUrl})`,
                        backgroundColor: memberColor,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                />
            )}
            
            <div className={`scroll-down-arrow ${itemCount > 0 ? 'raised' : ''}`} style={{ color: nextSectionColor }}>
                <FaAngleDown size={24} />
            </div>
        </motion.section>
    );
};

export default MemberSection;