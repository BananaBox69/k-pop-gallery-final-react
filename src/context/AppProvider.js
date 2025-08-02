// src/context/AppProvider.js
import React, { useState, useEffect } from 'react';
import { AppContext } from './AppContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, doc } from 'firebase/firestore';

export const AppProvider = ({ children }) => {
    const [cards, setCards] = useState([]);
    const [siteContent, setSiteContent] = useState({ title: "Loading...", subtitle: "", groupSubtitles: {}, groupBanners: {}, memberQuotes: {} });
    const [metadata, setMetadata] = useState({ groupOrder: [], memberOrder: {}, groupLogos: {}, memberSignatures: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeCards = onSnapshot(collection(db, 'cards'), (snapshot) => {
            const cardsData = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    docId: doc.id,
                    id: data.displayId || doc.id,
                    ...data,
                    dateAdded: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                };
            });
            setCards(cardsData);
            setLoading(false);
        });

        const unsubscribeContent = onSnapshot(doc(db, 'settings', 'siteContent'), (doc) => {
            if (doc.exists()) {
                setSiteContent(doc.data());
            }
        });

        const unsubscribeMetadata = onSnapshot(doc(db, 'settings', 'metadata'), (doc) => {
            if (doc.exists()) {
                setMetadata(doc.data());
            }
        });

        return () => {
            unsubscribeCards();
            unsubscribeContent();
            unsubscribeMetadata();
        };
    }, []);

    const value = {
        cards,
        siteContent,
        metadata,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};