import React from 'react';

export default class AuthForm extends React.Component {
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
    fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        event.target.reset();
      });
  }

  render() {
    return (
      <form className="w-100" onSubmit={this.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input required autoFocus id="username" type="text" name="username" onChange={this.handleChange} className="form-control bg-light" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input required id="password" type="password" name="password" autoComplete="off" onChange={this.handleChange} className="form-control bg-light" />
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <button type="submit" className="btn btn-primary box-shadow">Create Account</button>
        </div>
      </form>
    );
  }
}