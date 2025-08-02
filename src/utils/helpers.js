// src/utils/helpers.js

export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!originalPrice) return 0;
    if (!discountPercentage || discountPercentage === 0) return originalPrice;
    
    let discountAmount = 0;
    if (discountPercentage === 10) {
        discountAmount = Math.max(0.50, originalPrice * 0.10);
    } else if (discountPercentage === 20) {
        discountAmount = Math.max(1.00, originalPrice * 0.20);
    }
    
    const rawDiscountedPrice = originalPrice - discountAmount;
    const roundedPrice = Math.ceil(rawDiscountedPrice * 2) / 2;
    return Math.max(1.00, roundedPrice);
};