import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CgSync } from 'react-icons/cg';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../../context/CartProvider';
import Sparkles from './Sparkles';

const Card = ({ card, basketVersion }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { basket, addToBasket, removeFromBasket } = useCart();

    if (!card) {
        return null;
    }

    const isCardInBasket = basket.some(item => item.docId === card.docId);
    const isNew = card.dateAdded && (Date.now() - card.dateAdded.getTime()) < 7 * 24 * 60 * 60 * 1000;
    const { isRare } = card;

    let sparkleColor = null;
    if (isRare) {
        sparkleColor = 'gold';
    } else if (isNew) {
        sparkleColor = 'white';
    }

    const handleFlipClick = (e) => {
        e.stopPropagation();
        setIsFlipped(f => !f);
    };

    const handleCardClick = (e) => {
        e.stopPropagation();
        if (isCardInBasket) {
            removeFromBasket(card.docId);
        } else if (card.status === 'available') {
            addToBasket(card);
        }
    };

    return (
        <div className="group w-56 h-80 perspective-1000" onClick={handleCardClick}>
            <motion.div
                className="card-inner w-full h-full"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* --- FRONT FACE --- */}
                <div 
                    className="card-face card-face-front absolute w-full h-full"
                    style={{'--bg-image': `url(${card.imageUrl})`}}
                >
                    <div className="absolute inset-0 bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${card.imageUrl})` }}></div>
                    <div className="sheen-overlay" />
                    {sparkleColor && <div className="sparkle-container opacity-0 group-hover:opacity-100 transition-opacity duration-500"><Sparkles color={sparkleColor} /></div>}
                    <div className="card-id-overlay absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                        {card.id || 'N/A'}
                    </div>
                    <div className="card-tags-container">
                        {isNew && <div className="card-tag">NEW</div>}
                        {card.discount === 20 && <div className="card-tag" style={{color: '#BA55D3'}}>SUPER SALE</div>}
                        {card.discount === 10 && <div className="card-tag" style={{color: '#FF4757'}}>SALE</div>}
                        {isRare && <div className="card-tag" style={{color: 'gold'}}>RARE</div>}
                    </div>
                    <div className={`in-basket-indicator text-[var(--dynamic-ui-color)] ${isCardInBasket ? 'visible' : ''}`}>
                        <FaHeart />
                    </div>
                    <button onClick={handleFlipClick} className="flip-button">
                        <CgSync size={20} />
                    </button>
                    <div className="card-reflection"></div>
                </div>

                {/* --- BACK FACE --- */}
                <div 
                    className="card-face card-face-back bg-gray-800 absolute w-full h-full"
                    style={{'--bg-image-back': `url(${card.backImage || 'https://placehold.co/220x341/1e1e1e/ffffff?text=Card+Back'})`}}
                >
                     <div className="absolute inset-0 bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${card.backImage || 'https://placehold.co/220x341/1e1e1e/ffffff?text=Card+Back'})` }}></div>
                     <button onClick={handleFlipClick} className="flip-button opacity-100">
                        <CgSync size={20} />
                    </button>
                    <div className="card-reflection"></div>
                </div>
            </motion.div>
        </div>
    );
};

export default Card;