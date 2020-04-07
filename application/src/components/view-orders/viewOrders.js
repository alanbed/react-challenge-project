import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

const deleteOrderURL = `${SERVER_IP}/api/delete-order`;
const editOrderURL = `${SERVER_IP}/api/edit-order`;

class ViewOrders extends Component {
  state = {
    orders: [],
    isModalOpen: false,
    currentOrder: null,
  };

  componentDidMount() {
    this.getCurrentOrders();
  }

  getCurrentOrders() {
    fetch(`${SERVER_IP}/api/current-orders`)
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          this.setState({ orders: response.orders });
        } else {
          console.log('Error getting orders');
        }
      })
      .catch((err) => console.error(err));
  }

  async submitOrderChange(order) {
    await fetch(`${editOrderURL}`, {
      method: 'POST',
      body: JSON.stringify({
        id: order._id,
        order_item: this.state.currentOrder.order_item,
        quantity: this.state.currentOrder.quantity,
        ordered_by: this.state.currentOrder.ordered_by,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        this.toggleModal();
      })
      .catch((err) => console.error(err));
  }

  editOrder(order) {
    this.toggleModal();
    this.setState({ currentOrder: order });
  }

  toggleModal() {
    // open/close your modal
    this.setState({ isModalOpen: !this.state.isModalOpen });
  }

  async deleteOrder(order) {
    await fetch(`${deleteOrderURL}`, {
      method: 'POST',
      body: JSON.stringify({
        id: order._id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res);
        this.getCurrentOrders();
      })
      .catch((err) => console.error(err));
  }

  orderTime(date) {
    let hr = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    hr = hr < 10 ? '0' + hr : hr;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;

    return `${hr}:${min}:${sec}`;
  }

  render() {
    return (
      <Template>
        <div className='container-fluid'>
          {this.state.orders.map((order) => {
            return (
              <div className='row view-order-container' key={order._id}>
                <div className='col-md-4 view-order-left-col p-3'>
                  <h2>{order.order_item}</h2>
                  <p>Ordered by: {order.ordered_by || ''}</p>
                </div>
                <div className='col-md-4 d-flex view-order-middle-col'>
                  <p>
                    Order placed at {this.orderTime(new Date(order.createdAt))}
                  </p>
                  <p>Quantity: {order.quantity}</p>
                </div>
                <div className='col-md-4 view-order-right-col'>
                  <button
                    type='submit'
                    data-toggle='modal'
                    data-target='editCurrentOrder'
                    onClick={() => this.editOrder(order)}
                    className='btn btn-success'
                  >
                    Edit
                  </button>
                  <button
                    type='submit'
                    onClick={() => this.deleteOrder(order)}
                    className='btn btn-danger'
                  >
                    Delete
                  </button>
                </div>
                <div className='modal' id='editCurrentOrder' role='dialog'>
                  <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <h5 className='modal-title'>Edit Order</h5>
                        <button
                          type='button'
                          className='close'
                          data-dismiss='modal'
                          aria-label='Close'
                        >
                          <span aria-hidden='true'>&times;</span>
                        </button>
                      </div>
                      <div className='modal-body'>
                        <p>Modal body text goes here.</p>
                      </div>
                      <div className='modal-footer'>
                        <button type='button' className='btn btn-primary'>
                          Save changes
                        </button>
                        <button
                          type='button'
                          className='btn btn-secondary'
                          data-dismiss='modal'
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Template>
    );
  }
}

export default ViewOrders;
