import React from 'react';
import axios from 'axios';

class Users extends React.Component {
  state = {
    users: []
  };

  componentDidMount() {
    this.getUsers();
  };

  async getUsers() {
    let users = await axios.get('/api/users');  
    console.log(users);
  }

  render() {
    return (
      <div className="ui relaxed divided list">
        WORKS???
      </div>
    );
  }
}

export default Users;
