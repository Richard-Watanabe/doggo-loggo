import React from 'react';
import SignUpForm from './sign-up-form';
import AppContext from '../lib/app-context';
import { Navigate } from 'react-router-dom';

export default class SignUp extends React.Component {
  render() {
    const { user } = this.context;
    if (user) return <Navigate to="/home" />;

    return (
      <div className="full-screen auth-screen">
        <div className="inner-form auth-card">
          <header className="text-center">
            <img
              src={window.location.origin + '/images/logo.png'}
              className="doggo-logo"
              alt="app-logo"
            />
            <p className="text-muted mb-4">Create an account to get started!</p>
          </header>

          <div className="sign-form">
            <SignUpForm onSignIn={this.context.handleSignIn} />
          </div>
        </div>
      </div>
    );
  }
}

SignUp.contextType = AppContext;
