import React, { useState, useEffect } from 'react';
import { useUI } from '../../context/UIProvider';

const tutorialSteps = [
    { elementId: 'info-bubble', text: "Click here to learn about the buying procedure and rules.", position: 'left' },
    { elementId: 'filter-bubble', text: "You can filter for specific cards here. Filters are unique for each member.", position: 'left' }
];

const Tutorial = () => {
    const { setIsBlurOverlayActive } = useUI();
    const [stepIndex, setStepIndex] = useState(-1);
    const [styles, setStyles] = useState({ clone: {}, bubble: {}, pointer: '' });

    const isVisible = stepIndex >= 0;

    useEffect(() => {
        const hasSeen = localStorage.getItem('photocard_tutorial_seen_v3');
        const hasAcknowledged = localStorage.getItem('disclaimerAcknowledged_v2') === 'true';
        if (hasSeen !== 'true' && hasAcknowledged) {
            setTimeout(() => setStepIndex(0), 1200); // Delay to allow page to settle
        }
    }, []);
    
    useEffect(() => {
        setIsBlurOverlayActive(isVisible);
        return () => setIsBlurOverlayActive(false);
    }, [isVisible, setIsBlurOverlayActive]);

    useEffect(() => {
        if (!isVisible) return;

        const currentStep = tutorialSteps[stepIndex];
        const targetElement = document.getElementById(currentStep.elementId);

        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const bubbleEl = document.getElementById('tutorial-bubble');
            if (!bubbleEl) return;

            const bubbleRect = bubbleEl.getBoundingClientRect();
            let top, left;
            const margin = 15, padding = 10;
            
            left = rect.left - bubbleRect.width - margin;
            top = rect.top + rect.height / 2 - bubbleRect.height / 2;
            
            // Adjust if off-screen
            if (left < padding) left = rect.right + margin;
            if (top < padding) top = padding;
            if (left + bubbleRect.width > window.innerWidth - padding) left = window.innerWidth - bubbleRect.width - padding;
            if (top + bubbleRect.height > window.innerHeight - padding) top = window.innerHeight - bubbleRect.height - padding;
            
            setStyles({
                clone: { top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px` },
                bubble: { top: `${top}px`, left: `${left}px` },
                pointer: 'right'
            });
        }
    }, [stepIndex, isVisible]);

    const nextStep = () => setStepIndex(prev => prev + 1);
    const closeTutorial = () => {
        localStorage.setItem('photocard_tutorial_seen_v3', 'true');
        setStepIndex(-1);
    };

    return (
        <div className={`tutorial-overlay ${isVisible ? 'visible' : ''}`}>
            {isVisible && <>
                <div className="tutorial-clone-container" style={styles.clone} />
                <div id="tutorial-bubble" className="tutorial-bubble visible" style={styles.bubble}>
                    <div className={`tutorial-bubble-pointer ${styles.pointer}`}></div>
                    <p className="mb-4">{tutorialSteps[stepIndex]?.text}</p>
                    <div className="flex justify-end gap-2">
                        {stepIndex < tutorialSteps.length - 1 ? <>
                            <button onClick={closeTutorial} className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm">Skip</button>
                            <button onClick={nextStep} className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm">Next</button>
                        </> : <button onClick={closeTutorial} className="bg-green-600 text-white py-1 px-3 rounded-full text-sm">Got it!</button>}
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Tutorial;