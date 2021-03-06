import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import connectionAlert from './connection-alert';

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

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        this.props.history.push('/');
      })
      .catch(err => {
        console.error('Error:', err);
        connectionAlert();
      });
  }

  render() {
    const { handleChange, handleSubmit } = this;
    const { user } = this.context;
    if (user) return <Redirect to="/home" />;
    return (
      <form className="w-100" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input required autoFocus id="username" type="text" name="username" onChange={handleChange} className="form-control bg-light" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input required id="password" type="password" name="password" autoComplete="off" onChange={handleChange} className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" className="sign-link">Login</Link>
          <button type="submit" className="btn btn-primary box-shadow">Create Account</button>
        </div>
      </form>
    );
  }
}
