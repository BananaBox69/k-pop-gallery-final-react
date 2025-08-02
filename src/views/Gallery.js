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

const Gallery = () => {
    const { cards, siteContent, metadata, loading } = useContext(AppContext);
    const { isNavScrolling } = useUI();
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
        const sections = [{ type: 'group', name: 'Home', id: 'header' }];
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
        return sections;
    }, [groupedData, metadata]);

    if (loading) return <Loader />;

    return (
        <div id="scroll-container" className={`scroll-snap-container ${isNavScrolling ? 'no-snap' : ''}`}>
            <FloatingUI />
            <FloatingNav sections={renderedSections} />
            <FloatingBasket />
            <DisclaimerModal isOpen={showDisclaimer} onAcknowledge={handleAcknowledge} />
            <FilterSidebar />
            <Tutorial />

            <Header />

            {metadata.groupOrder?.map(groupName => {
                const groupHasRenderedMembers = renderedSections.some(s => s.type === 'member' && s.group === groupName);
                if (!groupHasRenderedMembers) return null;

                return (
                    <React.Fragment key={groupName}>
                        <GroupIntro
                            id={`group-${groupName}`}
                            groupName={groupName}
                            subtitle={siteContent.groupSubtitles?.[groupName]}
                            bannerUrl={siteContent.groupBanners?.[groupName]}
                            logoUrl={metadata.groupLogos?.[groupName]}
                        />
                        {metadata.memberOrder[groupName]?.map(memberName => {
                            const memberCards = groupedData[groupName]?.[memberName];
                            if (!memberCards) return null;

                            return (
                                <MemberSection
                                    key={`${groupName}-${memberName}`}
                                    sectionId={`member-${groupName}-${memberName}`}
                                    groupName={groupName}
                                    memberName={memberName}
                                    cards={memberCards}
                                />
                            );
                        })}
                    </React.Fragment>
                )
            })}
        </div>
    );
};

export default Gallery;