import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import Card from './Card';

const CARD_WIDTH = 224;
const CARD_MARGIN = 32;
const CARD_SIZE = CARD_WIDTH + CARD_MARGIN;

const Carousel = ({ cards, onSlideChange }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef(null);

    // Calculate the total width of the carousel
    const carouselWidth = cards.length * CARD_SIZE;

    // --- Center the carousel on the active card ---
    useEffect(() => {
        if (!containerRef.current) return;
        const containerWidth = containerRef.current.offsetWidth;
        const offset = (containerWidth - CARD_WIDTH) / 2;
        const targetX = offset - activeIndex * CARD_SIZE;
        animate(x, targetX, { type: 'spring', stiffness: 300, damping: 30, bounce: 0.1 });
    }, [activeIndex, x]);
    
    // --- Update the active card in the parent component ---
    useEffect(() => {
        if (cards[activeIndex]) {
            onSlideChange(cards[activeIndex]);
        } else if (cards.length > 0) {
            // Handle case where activeIndex is out of bounds after filtering
            setActiveIndex(0);
            onSlideChange(cards[0]);
        } else {
            // No cards
            onSlideChange(null);
        }
    }, [activeIndex, cards, onSlideChange]);


    // --- Handle dragging and snapping ---
    const handleDragEnd = (event, info) => {
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        // Determine the next slide based on drag distance and velocity
        const swipePower = Math.abs(velocity) * 0.1 + Math.abs(offset);
        if (swipePower < 50) return;

        const direction = offset > 0 ? -1 : 1;
        setActiveIndex(prev => {
            const newIndex = prev + direction;
            return Math.max(0, Math.min(newIndex, cards.length - 1));
        });
    };
    
    // --- Handle card clicks ---
    const handleCardClick = (index) => {
        setActiveIndex(index);
    }
    
    if (!cards || cards.length === 0) {
        return (
            <div className="relative w-full h-[460px] flex items-center justify-center">
                <p className="text-gray-500">No cards match the current filters.</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="carousel-container">
            <motion.div
                className="carousel-track"
                drag="x"
                onDragEnd={handleDragEnd}
                style={{ x }}
                dragConstraints={{
                    left: -(carouselWidth - CARD_WIDTH / 2),
                    right: CARD_WIDTH / 2
                }}
                dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            >
                {cards.map((card, index) => (
                    <CarouselItem 
                        card={card} 
                        index={index} 
                        activeIndex={activeIndex} 
                        x={x}
                        onClick={handleCardClick}
                        key={card.docId}
                    />
                ))}
            </motion.div>
        </div>
    );
};

// --- Individual Carousel Item with 3D rotation effect ---
const CarouselItem = ({ card, index, activeIndex, x, onClick }) => {
    const-child-ref = useRef(null);

    // Creates a 3D rotation effect based on the card's position
    const transform = useTransform(x, (latestX) => {
        if (!childRef.current) return 'none';
        
        const itemOffset = childRef.current.offsetLeft;
        const center = (containerRef.current.offsetWidth / 2) - (CARD_WIDTH / 2);
        const distance = center - (itemOffset + latestX);
        const rotateY = distance / 30; // Adjust for more/less rotation
        const scale = 1 - Math.abs(distance) / 5000; // Adjust for more/less scaling
        
        return `perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
    });

    return (
        <motion.div
            ref={childRef}
            className="carousel-item"
            style={{ 
                transform,
                zIndex: cards.length - Math.abs(activeIndex - index),
            }}
            onClick={() => onClick(index)}
        >
            <Card card={card} />
        </motion.div>
    );
};


export default Carousel;