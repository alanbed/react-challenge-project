import React from 'react';
import './modal.css';
import PropTypes from 'prop-types';

class Modal extends React.Component {
  onClose = (e) => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className='modalPopup'>
        <h2>Edit Order</h2>
        <div className='content'>{this.props.children}</div>
        <div className='actions'>
          <button className='toggle-button' onClick={this.onClose}>
            close
          </button>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

export default Modal;
