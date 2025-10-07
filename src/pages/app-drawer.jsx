import React from 'react';
import AppContext from '../lib/app-context';
import { Link } from 'react-router-dom';

export default class AppDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleOpen() {
    this.setState({ isOpen: true });
  }

  handleClose(event) {
    if (event.target.className === 'overlay open' || event.target.className === 'drawer-items') {
      this.setState({ isOpen: false });
    }
  }

  handleClick(event) {
    this.setState({ isOpen: false });
  }

  render() {
    const { handleSignOut } = this.context;
    const drawerContent = this.state.isOpen ? 'drawer-content open' : 'drawer-content close';
    const overlay = this.state.isOpen ? 'overlay open' : 'overlay close';

    return (
      <div>
        <img
          src="/images/hamburger.png"
          alt="Menu"
          className="hamburger-icon bar"
          onClick={this.handleOpen}
        />

        <div className={overlay} onClick={this.handleClose}></div>
        <div className={drawerContent}>
          <div className="d-flex justify-content-center">
            <img src="/images/logo.png" className="menu-doggo-logo" alt="app-logo" />
          </div>
          <ul onClick={this.handleClose} className="d-flex flex-column align-items-start menu">

            <a onClick={this.handleClick} className="menu-items">
              <img src="/images/home.png" className="menu-icon" alt="Home" /> Home
            </a>

            <Link to="/name-form" className="menu-items text-nowrap">
              <img src="/images/edit.png" className="menu-icon" alt="Edit" /> Add/Change Name
            </Link>

            <Link to="/photo-form" className="menu-items text-nowrap">
              <img src="/images/photo-camera.png" className="menu-icon image-icon" alt="Photo" /> Add/Change Photo
            </Link>

            <Link to="/add-dog" className="menu-items">
              <img src="/images/add.png" className="menu-icon" alt="New Dog" /> Add Doggo
            </Link>

            <Link to="/dog-list" className="menu-items">
              <img src="/images/custom.png" className="menu-icon" alt="Dog List" /> My Doggo List
            </Link>

            <button className="menu-items menu-button" onClick={handleSignOut}>
              <img src="/images/logout.png" className="menu-icon log-out-icon" alt="Log Out" /> Log Out
            </button>

          </ul>
        </div>
      </div>
    );
  }
}

AppDrawer.contextType = AppContext;
