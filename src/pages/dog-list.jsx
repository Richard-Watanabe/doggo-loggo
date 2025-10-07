import React, { useEffect, useState, useContext } from 'react';
import AppContext from '../lib/app-context';
import connectionAlert from './connection-alert';
import DogListBase from './dog-list-base';
import { Navigate, Link, useNavigate } from 'react-router-dom';

import { db, storage } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';

export default function DogList() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    async function fetchDogs() {
      if (!user?.uid) return;
      try {
        const dogsQuery = query(
          collection(db, 'dogs'),
          where('userId', '==', user.uid)
        );
        const snapshot = await getDocs(dogsQuery);

        const dogPromises = snapshot.docs.map(async docSnap => {
          const dogData = docSnap.data();
          const dogId = docSnap.id;

          let imageUrl = '/images/placeholder.png';
          try {
            const imageRef = ref(storage, `dogs/${dogId}/profile.png`);
            imageUrl = await getDownloadURL(imageRef);
          } catch (err) {
            if (err.code === 'storage/object-not-found') {
            } else {
              console.error('Unexpected image load error:', err);
            }
          }

          return {
            dogId,
            ...dogData,
            imageUrl
          };
        });

        const dogsArray = await Promise.all(dogPromises);
        setDogs(dogsArray);
      } catch (err) {
        console.error('Error fetching dog list:', err);
        connectionAlert();
      }
    }

    fetchDogs();
  }, [user]);

  if (!user) return <Navigate to="/" />;

  return (
    <div className="d-flex justify-content-center align-items-center full-screen">
      <div className="inner-main">
        <Link to="/home" className="go-back d-inline-block">&lt; Back to logs</Link>
        <div className="text-center name-div">
          <div className="d-flex add-name-header text-nowrap">
            <h2 className="list-header">My Doggo List</h2>
          </div>
          <div className="dog-list">
            <DogListBase dogs={dogs} navigate={navigate} />
          </div>
        </div>
      </div>
    </div>
  );
}

DogList.contextType = AppContext;
