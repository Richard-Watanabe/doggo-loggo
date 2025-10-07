import React from 'react';
import Category from './pages/category-list';
import Home from './pages/home';
import PhotoForm from './pages/photo-form';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import decodeToken from './lib/decode-token';
import AppContext from './lib/app-context';
import NameForm from './pages/name-form';
import DogForm from './pages/dog-form';
import DogList from './pages/dog-list';
import ReactGA from 'react-ga';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      token: ''
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    this.unregisterAuthObserver = onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        let dogId = localStorage.getItem('dogId');

        if (!dogId) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              dogId = userDoc.data().dogId || 'default';
              localStorage.setItem('dogId', dogId);
            } else {
              dogId = 'default';
            }
          } catch (err) {
            console.error('Failed to fetch user doc:', err);
            dogId = 'default';
          }
        }

        const user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          dogId
        };

        this.setState({ user, token, isAuthorizing: false });
      } else {
        this.setState({ user: null, token: '', isAuthorizing: false });
      }
    });

    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_CODE);
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }

componentWillUnmount() {
  if (this.unregisterAuthObserver) this.unregisterAuthObserver();
}


  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user, token });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  render() {
    if (this.state.isAuthorizing) return null;

    const { user, token } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, token, handleSignIn, handleSignOut };

    return (
      <div className="container outer-orange">
        <div className="row">
          <Router>
            <AppContext.Provider value={contextValue}>
              <Routes>
                <Route path="/category" element={<Category />} />
                <Route path="/photo-form" element={<PhotoForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/" element={<SignIn />} />
                <Route path="/name-form" element={<NameForm />} />
                <Route path="/add-dog" element={<DogForm />} />
                <Route path="/dog-list" element={<DogList />} />
              </Routes>
            </AppContext.Provider>
          </Router>
        </div>
      </div>
    );
  }
}

App.contextType = AppContext;

export default App;
