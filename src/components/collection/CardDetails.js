import React, { useMemo } from 'react';
import { useCart } from '../../context/CartProvider';
import { calculateDiscountedPrice } from '../../utils/helpers';
import { FaCheckCircle, FaCartPlus } from 'react-icons/fa';

const CardDetails = ({ activeCard, filteredCards, memberName, groupName, memberColor, groupColor }) => {
    const { basket, addToBasket, removeFromBasket } = useCart();

    const finalPrice = useMemo(() => {
        return activeCard ? calculateDiscountedPrice(activeCard.price, activeCard.discount) : 0;
    }, [activeCard]);

    const isCardInBasket = useMemo(() => {
        return activeCard ? basket.some(item => item.docId === activeCard.docId) : false;
    }, [activeCard, basket]);

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
        <div className="card-details-panel text-left">
            <p className="card-id-text text-gray-400">{activeCard?.id || 'N/A'}</p>
            <h2 className="member-name text-5xl font-extrabold" style={{ color: memberColor }}>{memberName}</h2>
            <p className="group-name text-2xl font-medium" style={{ color: groupColor }}>{groupName}</p>
            <p className="album-name text-lg mt-6 text-gray-300">{activeCard?.album || (filteredCards.length === 0 ? 'No matching cards found' : '')}</p>
            <p className="version-name text-base text-gray-500 min-h-[1.5rem]">{activeCard?.version || activeCard?.description || ''}</p>
            <p className="price-tag text-4xl font-black mt-4" style={{ color: memberColor }}>
                {activeCard ? `€${finalPrice.toFixed(2)}` : ''}
            </p>
            {activeCard && activeCard.discount > 0 && activeCard.price > finalPrice && (
                <div className="original-price-container text-gray-500 text-xl">
                    <span className="line-through">€{activeCard.price.toFixed(2)}</span>
                </div>
            )}
            <button
                onClick={handleBasketButtonClick}
                disabled={!activeCard || activeCard.status !== 'available'}
                className="mt-6 w-auto px-8 py-3 rounded-full font-bold flex items-center justify-center gap-3 transition-all"
                style={getButtonStyle()}
            >
                {isCardInBasket ? <><FaCheckCircle/> In Basket</>
                    : activeCard?.status !== 'available' ? <span className="capitalize">{activeCard?.status}</span>
                    : <><FaCartPlus/> Add to Basket</>
                }
            </button>
        </div>
    );
};

export default CardDetails;