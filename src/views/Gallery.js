import React, { useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { useUI } from '../context/UIProvider';
import Loader from '../components/ui/Loader';
import Header from '../components/layout/Header';
import GroupIntro from '../components/collection/GroupIntro';
import MemberSection from '../components/collection/MemberSection';
import FloatingUI from '../components/layout/FloatingUI';
import FloatingNav from '../components/layout/FloatingNav';
import FloatingBasket from '../components/cart/FloatingBasket';
import DisclaimerModal from '../components/ui/DisclaimerModal';
import FilterSidebar from '../components/ui/FilterSidebar';
import Tutorial from '../components/ui/Tutorial';
import { config } from '../config/appConfig';

const Gallery = () => {
    const { cards, siteContent, metadata, loading } = useContext(AppContext);
    const { isNavScrolling, isBlurOverlayActive } = useUI(); // Get the blur state
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        const hasAcknowledged = localStorage.getItem('disclaimerAcknowledged_v2');
        if (hasAcknowledged !== 'true') {
            setShowDisclaimer(true);
        }
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem('disclaimerAcknowledged_v2', 'true');
        setShowDisclaimer(false);
    };

    const groupedData = useMemo(() => cards.reduce((acc, card) => {
        if (card.status === 'archived') return acc;
        const { group, member } = card;
        if (!acc[group]) acc[group] = {};
        if (!acc[group][member]) acc[group][member] = [];
        acc[group][member].push(card);
        return acc;
    }, {}), [cards]);

    const renderedSections = useMemo(() => {
        if (!metadata.groupOrder) return [];
        
        const sections = [];
        
        // Add Header section placeholder
        sections.push({ type: 'header', id: 'header' });

        metadata.groupOrder.forEach(groupName => {
            const memberSections = [];
            let groupHasCards = false;
            
            if (metadata.memberOrder[groupName]) {
                metadata.memberOrder[groupName].forEach(memberName => {
                    if (groupedData[groupName]?.[memberName]) {
                        groupHasCards = true;
                        memberSections.push({
                            type: 'member',
                            name: memberName,
                            group: groupName,
                            id: `member-${groupName}-${memberName}`
                        });
                    }
                });
            }

            if (groupHasCards) {
                 sections.push({
                    type: 'group',
                    name: groupName,
                    id: `group-${groupName}`
                });
                sections.push(...memberSections);
            }
        });
        
        // Add next section color to each section
        return sections.map((section, index) => {
            const nextSection = sections[index + 1];
            let nextColor = '#777'; // Default color for the very last section's arrow
            if (nextSection) {
                if (nextSection.type === 'group') {
                    nextColor = config.colors[nextSection.name]?.group;
                } else { // type is 'member'
                    nextColor = config.colors[nextSection.group]?.[nextSection.name];
                }
            }
            return { ...section, nextSectionColor: nextColor };
        });

    }, [groupedData, metadata]);
    
    // Create a separate list for the Nav since it needs slightly different data
    const navSections = useMemo(() => {
        const homeSection = { type: 'group', name: 'Home', id: 'header' };
        const otherSections = renderedSections.filter(s => s.type !== 'header');
        return [homeSection, ...otherSections];
    }, [renderedSections]);


    if (loading) return <Loader />;

    return (
        <div id="gallery-container" className={`${isBlurOverlayActive ? 'content-blurred' : ''}`}>
            <div id="scroll-container" className={`scroll-snap-container ${isNavScrolling ? 'no-snap' : ''}`}>
                <Header nextSectionColor={renderedSections[0]?.nextSectionColor} />

                {renderedSections.slice(1).map((section) => {
                     if (section.type === 'group') {
                         return (
                             <GroupIntro
                                 key={section.id}
                                 id={section.id}
                                 groupName={section.name}
                                 subtitle={siteContent.groupSubtitles?.[section.name]}
                                 bannerUrl={siteContent.groupBanners?.[section.name]}
                                 logoUrl={metadata.groupLogos?.[section.name]}
                                 nextSectionColor={section.nextSectionColor}
                             />
                         );
                     }
                     if (section.type === 'member') {
                         const memberCards = groupedData[section.group]?.[section.name];
                         if (!memberCards) return null;
                         return (
                             <MemberSection
                                 key={section.id}
                                 sectionId={section.id}
                                 groupName={section.group}
                                 memberName={section.name}
                                 cards={memberCards}
                                 nextSectionColor={section.nextSectionColor}
                             />
                         );
                     }
                     return null;
                })}
            </div>

            {/* UI Overlays */}
            <FloatingUI />
            <FloatingNav sections={navSections} />
            <FloatingBasket />
            <FilterSidebar />
            
            {/* These Modals will control the blur */}
            <DisclaimerModal isOpen={showDisclaimer} onAcknowledge={handleAcknowledge} />
            <Tutorial />
        </div>
    );
};

export default Gallery;