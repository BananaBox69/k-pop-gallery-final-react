import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Carousel from './Carousel';
import CardDetails from './CardDetails';
import { useFilters } from '../../hooks/useFilters';
import { AppContext } from '../../context/AppContext';
import { config } from '../../config/appConfig';
import RoomBackdrop from '../ui/RoomBackdrop';
import { useUI } from '../../context/UIProvider';
import { FaAngleDown } from 'react-icons/fa';
import { useCart } from '../../context/CartProvider';

const MemberSection = ({ groupName, memberName, cards, sectionId, nextSectionColor }) => {
    const { setActiveColor, setActiveGroupColor } = useUI();
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { amount: 0.6, once: false });
    const { itemCount } = useCart();

    const { siteContent, metadata } = useContext(AppContext);
    const { getFiltersForSection, setActiveSectionId } = useFilters();

    const currentFilters = getFiltersForSection(sectionId);

    const filteredCards = useMemo(() => {
        // If no cards are passed, return an empty array immediately.
        if (!cards || cards.length === 0) {
            return [];
        }
        
        return cards.filter(card => {
            const { searchTerm, album, version, tags } = currentFilters;

            // Search Term Filter
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const searchableText = `${card.album || ''} ${card.version || card.description || ''} ${card.id || ''}`.toLowerCase();
                if (!searchableText.includes(term)) return false;
            }

            // Album Filter
            if (album !== 'All' && card.album !== album) return false;

            // Version Filter
            if (version !== 'All' && (card.version || card.description) !== version) return false;

            // Tags Filter
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

    // This state will now be controlled by the Carousel's `onSlideChange` callback.
    const [activeCard, setActiveCard] = useState(null);

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

    useEffect(() => {
        // When filtered cards change, update the active card to the first one.
        // The carousel will then automatically animate to it.
        if (filteredCards.length > 0) {
          setActiveCard(filteredCards[0]);
        } else {
          setActiveCard(null);
        }
    }, [filteredCards]);
    
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
                <CardDetails 
                    activeCard={activeCard}
                    filteredCards={filteredCards}
                    memberName={memberName}
                    groupName={groupName}
                    memberColor={memberColor}
                    groupColor={groupColor}
                />
                {/* The old masking div is removed, we just render the Carousel directly */}
                <Carousel
                    cards={filteredCards}
                    onSlideChange={setActiveCard}
                />
            </div>

            {signatureUrl && (
                <div className="member-signature absolute bottom-8 left-8 w-40 h-28 z-20" style={{
                    maskImage: `url(${signatureUrl})`, WebkitMaskImage: `url(${signatureUrl})`,
                    maskSize: 'contain', WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat'
                }} />
            )}

            <div className={`scroll-down-arrow ${itemCount > 0 ? 'raised' : ''}`} style={{ color: nextSectionColor || memberColor, transition: 'color 0.5s ease, bottom 0.5s ease' }}>
                <FaAngleDown size={24} />
            </div>
        </motion.section>
    );
};

export default MemberSection;