import React, { useState, useEffect, useContext } from 'react';
import Modal from '../ui/Modal';
import { useCart } from '../../context/CartProvider';
import { calculateDiscountedPrice } from '../../utils/helpers';
import { CgClose } from 'react-icons/cg';
import ConfirmationModal from '../admin/ConfirmationModal';
import { AppContext } from '../../context/AppContext';

const BasketModal = ({ isOpen, onClose }) => {
    const { basket, removeFromBasket, clearBasket } = useCart();
    const { metadata } = useContext(AppContext);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [shippingCountry, setShippingCountry] = useState('');
    const [shippingMethod, setShippingMethod] = useState('Cheapest');
    const [paymentMethod, setPaymentMethod] = useState('PayPal F&F');

    const totalPrice = basket.reduce((sum, item) => sum + calculateDiscountedPrice(item.price, item.discount), 0);

    useEffect(() => {
        if (basket.length === 0) {
            setMessage('');
            return;
        }

        const cardList = basket.map(item => {
            const price = calculateDiscountedPrice(item.price, item.discount);
            return `${item.id}\n${item.member} - ${item.album}\n${item.version || item.description}\n€${price.toFixed(2)}`;
        }).join('\n\n');
        
        const generatedMessage = `Hello! I would like to buy the following card(s):\n\n${cardList}\n\n------------------------------\nTOTAL (${basket.length} cards): €${totalPrice.toFixed(2)} (excl. shipping)\n\n--- Shipping & Payment ---\nShip to: ${shippingCountry || 'Please specify'}\nShipping Method: ${shippingMethod}\nPayment Method: ${paymentMethod}`;
        
        setMessage(generatedMessage);

    }, [basket, totalPrice, shippingCountry, shippingMethod, paymentMethod]);

    const handleCopyToClipboard = () => {
        if (!shippingCountry.trim()) {
            alert('Please specify the shipping country first!');
            return;
        }
        navigator.clipboard.writeText(message);
        alert('Message copied to clipboard!');
    };

    const handleConfirmClear = () => {
        clearBasket();
        setIsConfirmOpen(false);
        onClose();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Your Basket">
                {basket.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-400">Ship to (Country):</label>
                                <input
                                    type="text"
                                    value={shippingCountry}
                                    onChange={(e) => setShippingCountry(e.target.value)}
                                    placeholder="e.g., Germany, USA"
                                    list="country-suggestions"
                                    className="p-2 bg-gray-700 rounded-md text-white w-full mt-1"
                                />
                                <datalist id="country-suggestions">
                                    {(metadata.countries || []).map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Shipping Method:</label>
                                <select value={shippingMethod} onChange={e => setShippingMethod(e.target.value)} className="p-2 bg-gray-700 rounded-md text-white w-full mt-1">
                                    <option>Cheapest</option>
                                    <option>Tracked</option>
                                    <option>Insured</option>
                                </select>
                            </div>
                        </div>
                         <div>
                            <label className="text-sm text-gray-400">Payment Method:</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="p-2 bg-gray-700 rounded-md text-white w-full mt-1">
                                <option>PayPal F&F</option>
                                <option>Wise</option>
                                <option>Bank Transfer (EU)</option>
                            </select>
                        </div>
                        <textarea value={message} readOnly rows="6" className="w-full p-2 bg-gray-900 rounded-md text-sm text-gray-300"></textarea>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/bananatrades877/" target="_blank" rel="noopener noreferrer" className="text-center w-full bg-gray-600 text-white py-2 px-4 rounded-full hover:bg-gray-500 transition-colors">
                                Open Instagram
                            </a>
                            <button onClick={handleCopyToClipboard} className="w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-500 transition-colors">
                                Copy Message
                            </button>
                        </div>
                        <hr className="border-gray-600 my-2"/>
                        <div className="max-h-40 overflow-y-auto pr-2 flex flex-col gap-2">
                            {basket.map(item => (
                                <div key={item.docId} className="flex items-center gap-3 bg-gray-700/50 p-2 rounded-md">
                                    <img src={item.imageUrl} alt={item.id} className="w-10 h-16 object-cover rounded-sm"/>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.member} - {item.album}</p>
                                        <p className="text-sm text-gray-400">€{calculateDiscountedPrice(item.price, item.discount).toFixed(2)}</p>
                                    </div>
                                    <button onClick={() => removeFromBasket(item.docId)} className="text-gray-500 hover:text-red-500"><CgClose size={20}/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setIsConfirmOpen(true)} className="text-sm text-red-500 hover:underline self-center mt-2">
                            Empty Basket
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-8">Your basket is empty.</p>
                )}
            </Modal>
            <ConfirmationModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmClear}
                title="Empty Basket"
                message="Are you sure you want to remove all items from your basket?"
            />
        </>
    );
};

export default BasketModal;