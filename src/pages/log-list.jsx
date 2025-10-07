import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default class LogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedLog: null,
      deleting: false
    };

    this.handleLogClick = this.handleLogClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
  }

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

  handleLogClick(log) {
    this.setState({
      selectedLog: log,
      showModal: true
    });
  }

  handleClose() {
    this.setState({
      showModal: false,
      selectedLog: null
    });
  }

  async confirmDelete() {
    const { selectedLog } = this.state;
    if (!selectedLog) return;

    this.setState({ deleting: true });
    try {
      await deleteDoc(doc(db, 'logs', selectedLog.logId));
      if (this.props.onLogDeleted) {
        this.props.onLogDeleted(selectedLog.logId);
      }
    } catch (err) {
      console.error('Error deleting log:', err);
      alert('Failed to delete log. Please try again.');
    } finally {
      this.setState({
        deleting: false,
        showModal: false,
        selectedLog: null
      });
    }
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
                <li
                  key={log.logId}
                  className="log col-md-7 align-self-end box-shadow d-flex align-items-center"
                  onClick={() => this.handleLogClick(log)}
                  style={{ cursor: 'pointer' }}
                >
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
                  <span className="margin-r me-auto">{log.content}</span>
                  <span className="text-muted">{time}</span>
                </li>
              );
            }

            return <span className="d-none" key={log.logId}></span>;
          })}
        </ul>

        {this.state.showModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h4>Delete this log?</h4>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button
                  className="btn cancel-btn"
                  onClick={this.handleClose}
                  disabled={this.state.deleting}
                >
                  Cancel
                </button>
                <button
                  className="btn delete-btn"
                  onClick={this.confirmDelete}
                  disabled={this.state.deleting}
                >
                  {this.state.deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
