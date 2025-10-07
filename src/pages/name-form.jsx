import React, { useState, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import AppContext from '../lib/app-context';
import connectionAlert from './connection-alert';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function NameForm() {
  const { user } = useContext(AppContext);
  const [dogName, setDogName] = useState('');
  const navigate = useNavigate();

  if (!user) return <Navigate to="/" />;

  const handleChange = (event) => {
    setDogName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dogId = user?.dogId || localStorage.getItem('dogId');
    if (!dogId) {
      console.error('Dog ID not found');
      return connectionAlert();
    }

    try {
      await setDoc(doc(db, 'dogs', dogId), { dogName }, { merge: true });
      navigate('/home');
    } catch (err) {
      console.error(err);
      connectionAlert();
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center full-screen">
      <Link to="/home" className="go-back d-inline-block">&lt; Back to logs</Link>
      <div className="inner-form">
        <form onSubmit={handleSubmit} className="flex-center">
          <div className="text-center name-div add-dog-contain">
            <div className="d-flex add-name-header text-nowrap">
              <label htmlFor="name">
                <h2>Add/Change Name</h2>
              </label>
            </div>
            <div className="d-flex flex-center">
              <input
                type="text"
                id="name"
                value={dogName}
                onChange={handleChange}
                className="form-control input-custom"
                placeholder="Name"
                maxLength="14"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary box-shadow name-button">
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


NameForm.contextType = AppContext;
