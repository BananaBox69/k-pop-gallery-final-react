import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIProvider';

const tutorialSteps = [
    {
        elementId: 'info-bubble',
        text: "Click here to learn about the buying procedure and rules.",
        position: 'left'
    },
    {
        elementId: 'filter-bubble',
        text: "You can filter for specific cards here. Filters are unique for each member.",
        position: 'left'
    },
];

const Tutorial = () => {
    const { setIsBlurOverlayActive } = useUI();
    const [stepIndex, setStepIndex] = useState(-1);
    const [cloneStyle, setCloneStyle] = useState({});
    const [bubbleStyle, setBubbleStyle] = useState({});
    const [pointerClass, setPointerClass] = useState('');
    const [clonedNode, setClonedNode] = useState(null);

    const isVisible = stepIndex >= 0 && stepIndex < tutorialSteps.length;

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('photocard_tutorial_seen_v3');
        const hasAcknowledgedDisclaimer = localStorage.getItem('disclaimerAcknowledged_v2') === 'true';
        if (hasSeenTutorial !== 'true' && hasAcknowledgedDisclaimer) {
            setTimeout(() => setStepIndex(0), 500);
        }
    }, []);
    
    useEffect(() => {
        setIsBlurOverlayActive(isVisible);
        
        return () => {
            if(isVisible) setIsBlurOverlayActive(false);
        }
    }, [isVisible, setIsBlurOverlayActive]);

    useEffect(() => {
        if (!isVisible) {
            setClonedNode(null);
            return;
        }

        const currentStep = tutorialSteps[stepIndex];
        const targetElement = document.getElementById(currentStep.elementId);

        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            setCloneStyle({
                top: `${rect.top}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                height: `${rect.height}px`,
            });
            
            setClonedNode(targetElement.cloneNode(true));
            
            setTimeout(() => {
                const bubbleEl = document.getElementById('tutorial-bubble');
                if (bubbleEl) {
                    const bubbleRect = bubbleEl.getBoundingClientRect();
                    let top, left;
                    const margin = 15;
                    const viewportPadding = 10;

                    switch (currentStep.position) {
                        case 'left':
                            left = rect.left - bubbleRect.width - margin;
                            top = rect.top + rect.height / 2 - bubbleRect.height / 2;
                            setPointerClass('right');
                            break;
                        case 'right':
                            left = rect.right + margin;
                            top = rect.top + rect.height / 2 - bubbleRect.height / 2;
                            setPointerClass('left');
                            break;
                        default:
                            left = 0; top = 0;
                            break;
                    }

                    if (left < viewportPadding) left = viewportPadding;
                    if (top < viewportPadding) top = viewportPadding;
                    if (left + bubbleRect.width > window.innerWidth - viewportPadding) left = window.innerWidth - bubbleRect.width - viewportPadding;
                    if (top + bubbleRect.height > window.innerHeight - viewportPadding) top = window.innerHeight - bubbleRect.height - viewportPadding;

                    setBubbleStyle({ top: `${top}px`, left: `${left}px` });
                }
            }, 50);
        }

    }, [stepIndex, isVisible]);

    const nextStep = () => {
        setStepIndex(prev => prev + 1);
    };

    const closeTutorial = () => {
        localStorage.setItem('photocard_tutorial_seen_v3', 'true');
        setStepIndex(-1);
    };

    return (
        <div className={`tutorial-overlay ${isVisible ? 'visible' : ''}`}>
            <div className="tutorial-clone-container">
                {clonedNode && (
                    <div style={cloneStyle} dangerouslySetInnerHTML={{ __html: clonedNode.outerHTML }} />
                )}
            </div>
            <div id="tutorial-bubble" className={`tutorial-bubble ${isVisible ? 'visible' : ''}`} style={bubbleStyle}>
                <div className={`tutorial-bubble-pointer ${pointerClass}`}></div>
                <p className="mb-4">{tutorialSteps[stepIndex]?.text}</p>
                <div className="flex justify-end gap-2">
                    {stepIndex < tutorialSteps.length - 1 ? (
                        <>
                            <button onClick={closeTutorial} className="bg-gray-600 text-white py-1 px-3 rounded-full text-sm">Skip</button>
                            <button onClick={nextStep} className="bg-blue-600 text-white py-1 px-3 rounded-full text-sm">Next</button>
                        </>
                    ) : (
                        <button onClick={closeTutorial} className="bg-green-600 text-white py-1 px-3 rounded-full text-sm">Got it!</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tutorial;