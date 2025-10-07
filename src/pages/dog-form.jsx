import React, { useState, useContext } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import AppContext from '../lib/app-context';
import { db } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export default function DogForm() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [dogName, setDogName] = useState('');

  if (!user) return <Navigate to="/" />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!user?.uid) return;

    try {
      const finalDogName = dogName.trim() === '' ? 'New Doggo' : dogName.trim();

      const newDogRef = await addDoc(collection(db, 'dogs'), {
        dogName: finalDogName,
        userId: user.uid
      });

      await updateDoc(doc(db, 'users', user.uid), {
        dogId: newDogRef.id
      });

      localStorage.setItem('dogId', newDogRef.id);

      setDogName('');
      navigate('/home');
    } catch (err) {
      console.error('Error adding dog:', err);
      alert('Failed to add dog');
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center full-screen">
      <div className="inner-form">
        <Link to="/home" className="go-back d-inline-block">&lt; Back to logs</Link>
        <form onSubmit={handleSubmit} className="flex-center">
          <div className="text-center name-div add-dog-contain">
            <div className="d-flex add-name-header text-nowrap">
              <label htmlFor="name">
                <h2>Add New Doggo</h2>
              </label>
            </div>
            <div className="d-flex flex-center">
              <input
                type="text"
                id="name"
                value={dogName}
                onChange={e => setDogName(e.target.value)}
                className='form-control input-custom'
                placeholder="Name"
                maxLength="14"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary box-shadow name-button">
              Add Doggo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

DogForm.contextType = AppContext;
