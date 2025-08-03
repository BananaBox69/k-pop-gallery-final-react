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

    // A flattened list of all sections that will actually be rendered.
    // This is used to determine the correct order for navigation and for the arrow colors.
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
        if (!nextSection) return '#777'; // Default color for the last arrow

        if (nextSection.type === 'group') {
            return config.colors[nextSection.name]?.group || '#777';
        }
        // If next is a member
        return config.colors[nextSection.group]?.[nextSection.name] || '#777';
    };

    if (loading) return <Loader />;

    // This index will be manually incremented as we render sections to keep track of our position
    // in the `allRenderableSections` array for the arrow color logic.
    let sectionRenderIndex = 0;

    return (
        <div id="gallery-container" className={`${isBlurOverlayActive ? 'content-blurred' : ''}`}>
            <div id="scroll-container" className={`scroll-snap-container ${isNavScrolling ? 'no-snap' : ''}`}>
                <Header nextSectionColor={getNextSectionColor(-1)} />
                
                {/* This nested mapping structure is crucial for correct layout */}
                {metadata.groupOrder?.map((groupName) => {
                    const membersWithCards = metadata.memberOrder?.[groupName]?.filter(memberName => groupedData[groupName]?.[memberName]?.length > 0);

                    // If a group has no members with cards, skip rendering it entirely.
                    if (!membersWithCards || membersWithCards.length === 0) return null;

                    // The color for the group intro's arrow is the color of the first member in that group.
                    const groupIntroArrowColor = getNextSectionColor(sectionRenderIndex);
                    sectionRenderIndex++;

                    return (
                        <React.Fragment key={groupName}>
                            <GroupIntro
                                id={`group-${groupName}`}
                                groupName={groupName}
                                subtitle={siteContent.groupSubtitles?.[groupName]}
                                bannerUrl={siteContent.groupBanners?.[groupName]}
                                logoUrl={metadata.groupLogos?.[groupName]}
                                nextSectionColor={groupIntroArrowColor}
                            />
                            {membersWithCards.map((memberName) => {
                                // The color for this member's arrow is the color of the *next* section in the flat list.
                                const memberArrowColor = getNextSectionColor(sectionRenderIndex);
                                sectionRenderIndex++;
                                return (
                                    <MemberSection
                                        key={`${groupName}-${memberName}`}
                                        sectionId={`member-${groupName}-${memberName}`}
                                        groupName={groupName}
                                        memberName={memberName}
                                        cards={groupedData[groupName]?.[memberName]}
                                        nextSectionColor={memberArrowColor}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* UI Overlays */}
            <FloatingUI />
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