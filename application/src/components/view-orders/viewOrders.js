import React, { Component } from 'react';
import { Template } from '../../components';
import { SERVER_IP } from '../../private';
import './viewOrders.css';

const deleteOrderURL = `${SERVER_IP}/api/delete-order`;

class ViewOrders extends Component {
  state = {
    orders: [],
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

  async deleteOrder(order) {
    console.log(order._id);
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
                  <button className='btn btn-success'>Edit</button>
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
        </div>
      </Template>
    );
  }
}

export default ViewOrders;
