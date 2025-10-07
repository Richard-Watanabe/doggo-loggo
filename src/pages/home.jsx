import React, { useEffect, useState, useRef, useContext } from 'react';
import moment from 'moment';
import { Link, Navigate } from 'react-router-dom';

import LogList from './log-list';
import AppDrawer from './app-drawer';
import AppContext from '../lib/app-context';
import connectionAlert from './connection-alert';

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from 'firebase/firestore';

import {
  getDownloadURL,
  ref
} from 'firebase/storage';

import { db, storage } from '../lib/firebase';

export default function Home() {
  const { user } = useContext(AppContext);

  const [logs, setLogs] = useState([]);
  const [imageUrl, setImageUrl] = useState('/images/placeholder.png');
  const [dogName, setDogName] = useState('Name');
  const [isLoading, setIsLoading] = useState(true);
  const [loadedDogId, setLoadedDogId] = useState(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;

    const localDogId = localStorage.getItem('dogId');
    const effectiveDogId = localDogId || user.dogId;

    if (effectiveDogId && effectiveDogId !== loadedDogId) {
      setIsLoading(true);
      loadHomeData(user, effectiveDogId);
    }
  }, [user, loadedDogId]);

  async function safeGetDownloadURL(path, fallback = '/images/placeholder.png') {
    try {
      return await getDownloadURL(ref(storage, path));
    } catch (err) {
      if (err.code === 'storage/object-not-found') {
        if (process.env.NODE_ENV === 'development') {
          console.info(`No image at ${path}. Using placeholder.`);
        }
      } else {
        console.error(`Unexpected image load error for ${path}:`, err);
      }
      return fallback;
    }
  }


  async function loadHomeData(user, passedDogId = null) {
    try {
      let dogId = passedDogId;

      if (!dogId) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          dogId = userDoc.data().dogId || 'default';
          localStorage.setItem('dogId', dogId);
        } else {
          dogId = 'default';
        }
      }

      const logsQuery = query(
        collection(db, 'logs'),
        where('userId', '==', user.uid),
        where('dogId', '==', dogId),
        orderBy('createdAt', 'desc')
      );
      const logSnapshot = await getDocs(logsQuery);
      const logsArray = logSnapshot.docs.map(doc => ({
        logId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date()
      }));

      let fetchedDogName = 'Name';
      const dogDoc = await getDoc(doc(db, 'dogs', dogId));
      if (dogDoc.exists()) {
        const dogData = dogDoc.data();
        if (dogData.dogName) fetchedDogName = dogData.dogName;
      }

      const fetchedImageUrl = await safeGetDownloadURL(`dogs/${dogId}/profile.png`);

      if (isMounted.current) {
        setLogs(logsArray);
        setDogName(fetchedDogName);
        setImageUrl(fetchedImageUrl);
        setIsLoading(false);
        setLoadedDogId(dogId);
      }
    } catch (err) {
      console.error('Error loading home data:', err);
      if (isMounted.current) connectionAlert();
    }
  }

  const loaderClass = isLoading ? 'lds-heart' : 'lds-heart hide';
  const date = new Date();

  if (!user) return <Navigate to="/" />;

  return (
    <div className="d-flex justify-content-center align-items-center full-screen">
      <div className="inner-main d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center">
          <AppDrawer />
          <p className="date">{moment(date).format('MM/DD/YYYY')}</p>
        </div>

        <div className="d-flex flex-row justify-content-center align-items-center home-image-div position-relative">
          <img src={imageUrl} className="d-inline-block home-image" alt="profile-dog-image" />
          <Link to="/photo-form" className="edit-photo-btn position-absolute">
            <img src="/images/photo-camera.png" alt="camera" className="camera-icon" />
          </Link>
        </div>

        <div className="name d-flex justify-content-center col-md-5">
          <div className="d-flex flex-row align-items-center gap-2 name-home">
            <p className="mb-0 dog-name">{dogName}</p>
            <Link to="/name-form" className="position-absolute">
              <img src="/images/edit.png" alt="Edit Name" className="edit-icon" />
            </Link>
          </div>
        </div>

        <div className="plus-div">
          <Link to="/category" className="custom-plus-button">
            <span className="plus-span">+</span>
          </Link>
        </div>

        <div className="log-list">
          <LogList logs={logs} onLogDeleted={(deletedId) => setLogs((prev) => prev.filter((l) => l.logId !== deletedId)) } />
        </div>

        <div className="my-auto justify-content-center align-items-center d-flex">
          <div className={loaderClass}><div></div></div>
        </div>
      </div>
    </div>
  );
}
