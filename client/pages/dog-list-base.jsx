import React from 'react';

export default class DogListBase extends React.Component {

  render() {
    return (
      <div className="d-flex flex-column text-center justify-content-center list-base dog-list-base">
        <ul className="ul-base">
          {
            this.props.dogs.map(dog => {
              if (this.props.dogs === undefined) {
                return (
                  <li key={dog.dogId} className="log col-md-7 align-items-center align-self-end justify-content-around box-shadow">
                    <img className="dog-list-image" src="/images/placeholder.png"/>
                    <span className='margin-lr dog-list-name'>{dog.dogName}</span>
                  </li>
                );
              }
              return (
              <li key={dog.dogId} className="log col-md-7 align-items-center align-self-end justify-content-around box-shadow">
                <img className="dog-list-image" src={dog.url}/>
                <span className='margin-lr dog-list-name'>{dog.dogName}</span>
              </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}