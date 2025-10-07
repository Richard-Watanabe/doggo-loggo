import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Navigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import AppContext from '../lib/app-context';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      isSubmitting: false,
      redirectToHome: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDemoSignIn = this.handleDemoSignIn.bind(this);
  }

  static contextType = AppContext;

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: 'Please enter both email and password.' });
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Get dogId from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      let dogId = null;
      if (userDoc.exists()) {
        dogId = userDoc.data().dogId;
        localStorage.setItem('dogId', dogId); // Optional fallback
      }

      this.context.handleSignIn({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          dogId
        },
        token: await firebaseUser.getIdToken()
      });

      this.setState({ redirectToHome: true });

    } catch (err) {
      console.error('Sign-in error:', err);
      this.setState({
        error: err.message || 'Something went wrong.',
        isSubmitting: false
      });
    }
  }

  async handleDemoSignIn() {
    const email = 'demo@doggo.com';
    const password = 'password123';

    this.setState({ isSubmitting: true, error: null });

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) throw new Error('Demo user not found in Firestore.');

      const { dogId } = userDoc.data();
      if (!dogId) throw new Error('Dog ID missing from demo user data.');

      localStorage.setItem('dogId', dogId);

      this.context.handleSignIn({
        user: {
          uid: user.uid,
          email: user.email,
          dogId
        },
        token: await user.getIdToken()
      });

      this.setState({ redirectToHome: true });

    } catch (err) {
      console.error('Demo sign-in error:', err);
      this.setState({
        error: err.message || 'Failed to sign in as demo.',
        isSubmitting: false
      });
    }
  }

  render() {
    const { email, password, error, isSubmitting, redirectToHome } = this.state;
    if (redirectToHome) return <Navigate to="/home" />;

    return (
      <div className="d-flex justify-content-center align-items-center full-screen">
        <form onSubmit={this.handleSubmit}>
          <div className="inner-form">
            <h2 className="sign-in-text mb-4">Sign In</h2>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={email}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group mb-4">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={password}
                onChange={this.handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn sign-in-button btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="text-center mt-3">
              Don't have an account? <Link className="sign-link" to="/sign-up">Sign Up</Link>
            </p>

            <hr className="my-4" />
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-secondary demo-btn"
                onClick={this.handleDemoSignIn}
              >
                Try Demo Without Sign Up
              </button>
            </div>

          </div>
        </form>
      </div>
    );
  }
}
