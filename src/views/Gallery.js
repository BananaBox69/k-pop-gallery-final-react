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
    const { isNavScrolling, isBlurOverlayActive } = useUI();
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
    
    // Create a flat list of all valid, renderable sections for nav and arrow logic
    const allRenderableSections = useMemo(() => {
        if (!metadata.groupOrder) return [];
        const sections = [];
        metadata.groupOrder.forEach(groupName => {
            const membersWithCards = metadata.memberOrder[groupName]?.filter(memberName => groupedData[groupName]?.[memberName]?.length > 0);
            if (membersWithCards && membersWithCards.length > 0) {
                sections.push({ type: 'group', name: groupName, id: `group-${groupName}` });
                membersWithCards.forEach(memberName => {
                    sections.push({ type: 'member', name: memberName, group: groupName, id: `member-${groupName}-${memberName}` });
                });
            }
        });
        return sections;
    }, [groupedData, metadata]);


    const getNextSectionColor = (currentIndex) => {
        const nextSection = allRenderableSections[currentIndex + 1];
        if (!nextSection) return '#777'; // Default for the last element

        if (nextSection.type === 'group') {
            return config.colors[nextSection.name]?.group || '#777';
        }
        return config.colors[nextSection.group]?.[nextSection.name] || '#777';
    };

    if (loading) return <Loader />;

    let sectionRenderIndex = 0;

    return (
        <div id="gallery-container" className={`${isBlurOverlayActive ? 'content-blurred' : ''}`}>
            <div id="scroll-container" className={`scroll-snap-container ${isNavScrolling ? 'no-snap' : ''}`}>
                <Header nextSectionColor={getNextSectionColor(-1)} />
                
                {metadata.groupOrder?.map((groupName) => {
                    const membersWithCards = metadata.memberOrder?.[groupName]?.filter(memberName => groupedData[groupName]?.[memberName]?.length > 0);
                    if (!membersWithCards || membersWithCards.length === 0) return null;

                    const groupIntroColor = getNextSectionColor(sectionRenderIndex);
                    sectionRenderIndex++;

                    return (
                        <React.Fragment key={groupName}>
                            <GroupIntro
                                id={`group-${groupName}`}
                                groupName={groupName}
                                subtitle={siteContent.groupSubtitles?.[groupName]}
                                bannerUrl={siteContent.groupBanners?.[groupName]}
                                logoUrl={metadata.groupLogos?.[groupName]}
                                nextSectionColor={groupIntroColor}
                            />
                            {membersWithCards.map((memberName) => {
                                const memberSectionColor = getNextSectionColor(sectionRenderIndex);
                                sectionRenderIndex++;
                                return (
                                    <MemberSection
                                        key={`${groupName}-${memberName}`}
                                        sectionId={`member-${groupName}-${memberName}`}
                                        groupName={groupName}
                                        memberName={memberName}
                                        cards={groupedData[groupName]?.[memberName]}
                                        nextSectionColor={memberSectionColor}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* UI Overlays */}
            <FloatingUI />
            {/* Nav needs a slightly different structure (with Home) */}
            <FloatingNav sections={[{ type: 'group', name: 'Home', id: 'header' }, ...allRenderableSections]} />
            <FloatingBasket />
            <FilterSidebar />
            
            {/* These Modals will control the blur */}
            <DisclaimerModal isOpen={showDisclaimer} onAcknowledge={handleAcknowledge} />
            <Tutorial />
        </div>
    );
};

export default Gallery;