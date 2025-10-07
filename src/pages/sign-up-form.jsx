import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import connectionAlert from './connection-alert';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import AppContext from '../lib/app-context';
import { storage } from '../lib/firebase';
import { ref, uploadBytes } from 'firebase/storage';

export default class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;

    if (!/\S+@\S+\.\S+/.test(username)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Step 1: Create Firebase Auth User
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;
      const uid = user.uid;

      // Step 2: Create a dog document
      const dogRef = doc(collection(db, 'dogs'));
      const dogId = dogRef.id;

      await setDoc(dogRef, {
        dogName: 'New Doggo',
        createdAt: serverTimestamp(),
        userId: uid
      });

      // Step 2.5: Upload default profile image to storage
      try {
        const response = await fetch('/images/placeholder.png');
        const blob = await response.blob();
        const storageRef = ref(storage, `dogs/${dogId}/profile.png`);
        await uploadBytes(storageRef, blob);
      } catch (uploadErr) {
        console.warn('Could not upload default profile image:', uploadErr);
      }

      // Step 3: Create user document
      await setDoc(doc(db, 'users', uid), {
        email: username,
        dogId,
        createdAt: serverTimestamp()
      });

      // Step 4: Store dogId in localStorage
      localStorage.setItem('dogId', dogId);

      // Step 5: Finalize sign-in and update context
      const token = await user.getIdToken();
      this.props.onSignIn({
        user: {
          uid,
          email: username,
          dogId
        },
        token
      });

    } catch (err) {
      console.error('Sign-up error:', err);
      connectionAlert();
    }
  }

  render() {
    const { handleChange, handleSubmit } = this;
    const { user } = this.context;
    if (user) return <Navigate to="/home" />;

    return (
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            required
            autoFocus
            id="username"
            type="email"
            name="username"
            onChange={handleChange}
            className="form-control bg-light"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            required
            id="password"
            type="password"
            name="password"
            autoComplete="off"
            onChange={handleChange}
            className="form-control bg-light"
          />
        </div>
        <div className="d-flex login-div justify-content-between align-items-center">
          <button type="submit" className="btn btn-primary box-shadow">Create Account</button>
          <Link to="/" className="sign-link">Login</Link>
        </div>
      </form>
    );
  }
}

SignUpForm.contextType = AppContext;
