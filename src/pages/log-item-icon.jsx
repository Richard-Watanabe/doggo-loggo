import React from 'react';

export default class LogItemIcon extends React.Component {

  getIconClass() {
    const { content } = this.props;
    if (content === 'Meal') return 'fas fa-drumstick-bite meal';
    if (content === 'Snack') return 'fas fa-cookie-bite snack';
    if (content === 'Walk') return 'fas fa-shoe-prints walk';
    if (content === 'Poo') return 'fas fa-poo poo';
    if (content === 'Puke') return 'fas fa-tired puke';
    if (content === 'Medicine') return 'fas fa-pills medicine';
    if (content === 'Wash') return 'fas fa-bath wash';
    if (content === 'Brush') return 'fas fa-ruler-vertical brush';
    return 'fas fa-dog custom-icon';
  }

  render() {
    const iconClass = this.getIconClass();
    return (
        <i className={`${iconClass} text-shadow`}></i>
    );
  }
}
