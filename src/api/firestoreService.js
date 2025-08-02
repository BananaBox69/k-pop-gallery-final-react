import { db } from '../config/firebase';
import { doc, addDoc, updateDoc, deleteDoc, setDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { config } from '../config/appConfig'; // We'll create this file next

export const saveCard = async (cardData, docId) => {
    if (docId) {
        return updateDoc(doc(db, 'cards', docId), cardData);
    } else {
        const groupPrefix = config.groupPrefixes[cardData.group] || 'XX';
        const memberPrefix = (cardData.group === 'IU' && cardData.member === 'IU') 
            ? config.memberPrefixes.IU 
            : cardData.member.charAt(0).toUpperCase();

        const q = query(collection(db, 'cards'), where('group', '==', cardData.group), where('member', '==', cardData.member));
        const querySnapshot = await getDocs(q);
        let maxCardNum = 0;
        querySnapshot.forEach(docSnap => {
            const numPart = (docSnap.data().displayId || '').split('-')[2];
            if (numPart) maxCardNum = Math.max(maxCardNum, parseInt(numPart, 10) || 0);
        });

        cardData.displayId = `${groupPrefix}-${memberPrefix}-${String(maxCardNum + 1).padStart(3, '0')}`;
        cardData.createdAt = serverTimestamp();
        return addDoc(collection(db, 'cards'), cardData);
    }
};

export const deleteCard = (docId) => {
    return deleteDoc(doc(db, "cards", docId));
};

export const saveSiteContent = (content) => {
    return setDoc(doc(db, 'settings', 'siteContent'), content, { merge: true });
};

export const bulkUpdateCards = (docIds, updateData) => {
    const promises = docIds.map(id => updateDoc(doc(db, 'cards', id), updateData));
    return Promise.all(promises);
};