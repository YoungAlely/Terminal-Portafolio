import { useState, useEffect } from 'react';
import { db } from './../../firebase';
import { collection, getDocs } from 'firebase/firestore';


export function useFirestoreData() {
    const [data, setData] = useState({
        projects: [],
        conferences: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const workSnapShot = await getDocs(collection(db, 'Work'));
                const projects = workSnapShot.docs.map(doc => {
                    const docData = doc.data();

                    return {
                        id: doc.id,
                        name: docData.title,
                        short: docData.desc,
                        url: docData.buttonLInk || null,
                        details: docData.desc,
                    };
                });

                const confSnapshot = await getDocs(collection(db, 'Conferences'));
                const conferences = confSnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        title: docData.title,
                        desc: docData.desc,
                        places: docData.places,
                    }
                });
                setData({
                    projects,
                    conferences,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                console.error("Error al cargar datos", error);
                setData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message,
                }));
            }
        };
        fetchAllData();
    }, []);
    return data;
}