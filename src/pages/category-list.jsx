import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../lib/app-context';
import connectionAlert from './connection-alert';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const allCategories = [
  { id: '1', name: 'Meal', class: 'meal' },
  { id: '2', name: 'Snack', class: 'snack' },
  { id: '3', name: 'Walk', class: 'walk' },
  { id: '4', name: 'Poo', class: 'poo' },
  { id: '5', name: 'Puke', class: 'puke' },
  { id: '6', name: 'Medicine', class: 'medicine' },
  { id: '7', name: 'Wash', class: 'wash' },
  { id: '8', name: 'Brush', class: 'brush' },
  { id: '9', name: 'Custom', class: 'custom' }
];

export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenCategory: '',
      logs: []
    };
    this.addLog = this.addLog.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async addLog(event) {
    event.preventDefault();
    const clickedCategory = event.target.getAttribute('data-category');
    const user = this.context.user;

    if (!user?.uid) {
      connectionAlert();
      return;
    }

    try {
      await addDoc(collection(db, 'logs'), {
        content: clickedCategory,
        userId: user.uid,
        dogId: user.dogId || 'default',
        createdAt: Timestamp.fromDate(new Date())
      });
      window.location.href = '/home';
      this.setState(prevState => ({
        logs: [...prevState.logs, { content: clickedCategory }],
        chosenCategory: ''
      }));
    } catch (err) {
      console.error(err);
      connectionAlert();
    }
  }

  handleChange(event) {
    this.setState({
      chosenCategory: event.target.value
    });
  }

  render() {
    const { user } = this.context;
    if (!user) return <Navigate to="/" />;
    const value = this.state.chosenCategory;

    const CategoryList = allCategories.map(category => {
      if (category.name === 'Custom') {
        return (
          <li key={category.id} className="col-10 d-flex justify-content-around align-items-center text-center category box-shadow">
            <img src="/images/custom.png" alt="Custom" className="category-icon" />
            <form className="d-flex custom-form align-items-center justify-content-around col-10">
              <div className="col-7 col-md-8 custom-div">
                <input
                  value={value}
                  onChange={this.handleChange}
                  className="form-control input-custom"
                  placeholder="Custom"
                  maxLength="15"
                />
              </div>
              <div className="col-4">
                <button
                  type="button"
                  data-category={this.state.chosenCategory}
                  onClick={this.addLog}
                  className="btn btn-sm btn-success col-11 col-md-9 btn-polish box-shadow"
                >
                  ADD
                </button>
              </div>
            </form>
          </li>
        );
      }

      return (
        <li key={category.id} className="d-flex justify-content-around align-items-center text-center col-md-5 col-10 category box-shadow">
          <img src={`/images/${category.class}.png`} alt={category.name} className="category-icon" />
          <span className="col-5 text-center category-name">{category.name}</span>
          <button
            type="button"
            data-category={category.name}
            onClick={this.addLog}
            className="btn btn-sm btn-success col-3 btn-polish box-shadow"
          >
            ADD
          </button>
        </li>
      );
    });

    return (
      <div>
        <Link to="/home" className="go-back d-inline-block">&lt; Back to logs</Link>
        <ul className="container inner-form d-flex flex-center justify-content-center py-5 full-screen">
          {CategoryList}
        </ul>
      </div>
    );
  }
}

// ✅ this must be *outside* of the class
Category.contextType = AppContext;
