import React from 'react';

export default class LogList extends React.Component {
  getImagePath(content) {
    const defaultIcons = [
      'meal', 'snack', 'walk', 'poo',
      'puke', 'medicine', 'wash', 'brush'
    ];

    const normalized = content?.toLowerCase().replace(/\s+/g, '') || '';

    if (defaultIcons.includes(normalized)) {
      return `/images/${normalized}.png`;
    }

    return '/images/custom.png';
  }


  render() {
    return (
      <div className="d-flex flex-column text-center justify-content-center list-base">
        <ul className="ul-base">
          {this.props.logs.map(log => {
            const time = new Date(log.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            if (new Date().toDateString() === new Date(log.createdAt).toDateString()) {
              const iconSrc = this.getImagePath(log.content);

              return (
                <li key={log.logId} className="log col-md-7 align-self-end box-shadow d-flex align-items-center">
                  <img
                    src={iconSrc}
                    alt={log.content}
                    style={{
                      width: '28px',
                      height: '28px',
                      marginRight: '12px',
                      objectFit: 'contain'
                    }}
                  />
                  <span className='margin-r me-auto'>{log.content}</span>
                  <span className="text-muted">{time}</span>
                </li>
              );
            }

            return <span className="d-none" key={log.logId}></span>;
          })}
        </ul>
      </div>
    );
  }
}
