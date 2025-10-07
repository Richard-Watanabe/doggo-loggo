import React, { useEffect, useState, useContext } from 'react';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../lib/firebase';
import AppContext from '../lib/app-context';

export default function DogListBase({ dogs, navigate }) {
  const { user, handleSignIn, token } = useContext(AppContext);
  const [dogImages, setDogImages] = useState({});

  useEffect(() => {
    async function fetchImages() {
      const images = {};
      for (const dog of dogs) {
        try {
          const url = await getDownloadURL(ref(storage, `dogs/${dog.dogId}/profile.png`));
          images[dog.dogId] = url;
        } catch (err) {
          images[dog.dogId] = '/images/placeholder.png';
        }
      }
      setDogImages(images);
    }
    if (dogs.length > 0) fetchImages();
  }, [dogs]);

  function handleSelectDog(dogId) {
    localStorage.setItem('dogId', dogId);

    handleSignIn({ user: { ...user, dogId }, token });

    navigate('/home');
  }

  return (
    <div className="d-flex flex-column align-items-center gap-3">
      {dogs.map(dog => (
        <div
          key={dog.dogId}
          className="dog-card d-flex align-items-center gap-3"
          onClick={() => handleSelectDog(dog.dogId)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={dogImages[dog.dogId] || '/images/placeholder.png'}
            alt={`${dog.dogName} avatar`}
            className="dog-list-image"
          />
          <p className="mb-0 dog-name">{dog.dogName}</p>
        </div>
      ))}
    </div>
  );
}


DogListBase.contextType = AppContext;
