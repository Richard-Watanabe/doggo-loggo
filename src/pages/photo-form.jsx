import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../lib/app-context';
import connectionAlert from './connection-alert';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export default class PhotoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '/images/placeholder.png',
      isLoading: true,
      uploading: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getCurrentDogId() {
    return localStorage.getItem('dogId') || this.context.user?.dogId || 'default';
  }

  async componentDidMount() {
    const currentDogId = this.getCurrentDogId();
    if (!currentDogId) return;

    let imageUrl = '/images/placeholder.png';
    try {
      // try user’s dog image
      const photoRef = ref(storage, `dogs/${currentDogId}/profile.png`);
      imageUrl = await getDownloadURL(photoRef);
    } catch (err) {
      try {
        // fallback to default profile if exists
        const fallbackRef = ref(storage, `dogs/default/profile.png`);
        imageUrl = await getDownloadURL(fallbackRef);
      } catch (fallbackErr) {
        console.warn('No profile image found, using local placeholder.');
      }
    }

    this.setState({ imageUrl, isLoading: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const file = fileInput?.files?.[0];
    const { user } = this.context;

    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }

    const currentDogId = this.getCurrentDogId();
    if (!currentDogId) {
      alert('Missing dogId.');
      return;
    }

    const storageRef = ref(storage, `dogs/${currentDogId}/profile.png`);
    try {
      this.setState({ uploading: true });
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      this.setState({ imageUrl, isLoading: false, uploading: false });
      // alert('Photo uploaded successfully!');
      window.location.href = '/home';
    } catch (err) {
      console.error('Upload failed:', err);
      connectionAlert();
      alert('Failed to upload photo. Try again.');
    }
  }

  handleChange(event) {
    this.setState({
      imageUrl: URL.createObjectURL(event.target.files[0]),
      isLoading: false
    });
  }

  getLoaderClass() {
    return this.state.isLoading ? 'lds-heart' : 'lds-heart hide';
  }

  render() {
    const loaderClass = this.getLoaderClass();
    const { user } = this.context;
    if (!user) return <Navigate to="/" />;

    return (
      <div className="d-flex justify-content-center align-items-center full-screen">
        <form onSubmit={this.handleSubmit}>
          <div className="inner-form">
            <Link to="/home" className="go-back d-inline-block">
              &lt; Back to logs
            </Link>
            <h2 className="photo-header text-center text-nowrap">Add/Change Photo</h2>
            <div className="d-flex justify-content-center">
              <img src={this.state.imageUrl} className="change-image" alt="preview-image" />
            </div>
            <div className="d-flex justify-content-around">
              <label htmlFor="file-upload" className="custom-file-upload box-shadow d-none">
                {/* Choose File */}
              </label>
              <input
                id="file-upload"
                className=""
                type="file"
                name="image"
                onChange={this.handleChange}
              />
              <button type="submit" className="btn btn-primary save-button box-shadow">
                Save
              </button>
            </div>
            <div className="justify-content-center align-items-center d-flex">
              <div className={`${loaderClass} photo-heart`}>
                <div></div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

PhotoForm.contextType = AppContext;
