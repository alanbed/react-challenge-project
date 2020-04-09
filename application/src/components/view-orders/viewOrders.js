import React, { Component } from 'react';
import Modal from './modal';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

const deleteOrderURL = `${SERVER_IP}/api/delete-order`;
const editOrderURL = `${SERVER_IP}/api/edit-order`;

class ViewOrders extends Component {
  state = {
    orders: [],
    show: false,
    currentOrder: {},
    newOrderedBy: '',
    newOrderItem: '',
    newQuantity: 0,
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

  async submitOrderChange() {
    await fetch(`${editOrderURL}`, {
      method: 'POST',
      body: JSON.stringify({
        id: this.state.currentOrder._id,
        order_item: this.state.newOrderItem,
        quantity: this.state.newQuantity,
        ordered_by: this.state.newOrderedBy,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        this.toggleModal();
        this.getCurrentOrders();
      })
      .catch((err) => console.error(err));
  }

  setOrderItem = (e) => {
    this.setState({ newOrderItem: e.target.value });
  };

  setQuantity = (e) => {
    this.setState({ newQuantity: e.target.value });
  };

  setOrderedBy = (e) => {
    this.setState({ newOrderedBy: e.target.value });
  };

  editOrder(order) {
    this.toggleModal();
    this.setState({ currentOrder: order });
  }

  toggleModal = (e) => {
    this.setState({
      show: !this.state.show,
    });
  };

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
                <div className='viewOrder col-md-4 view-order-right-col'>
                  <button
                    type='submit'
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
              </div>
            );
          })}
          <Modal show={this.state.show} onClose={this.toggleModal}>
            <select
              value={this.state.newOrderItem}
              onChange={this.setOrderItem}
              className='menu-select'
            >
              <option value='' defaultValue disabled hidden>
                Lunch menu
              </option>
              <option value='Soup of the Day'>Soup of the Day</option>
              <option value='Linguini With White Wine Sauce'>
                Linguini With White Wine Sauce
              </option>
              <option value='Eggplant and Mushroom Panini'>
                Eggplant and Mushroom Panini
              </option>
              <option value='Chili Con Carne'>Chili Con Carne</option>
            </select>
            <select value={this.state.newQuantity} onChange={this.setQuantity}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
            </select>
            <input
              onChange={this.setOrderedBy}
              value={this.state.newOrderedBy}
            />
            <button
              type='submit'
              classname='btn btn-success'
              onClick={() => this.submitOrderChange()}
            >
              Update
            </button>
          </Modal>
        </div>
      </Template>
    );
  }
}

export default ViewOrders;
