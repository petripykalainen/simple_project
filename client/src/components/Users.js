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
    this.setState({users: users.data});
    console.log(this.state.users)
  }

  renderUserList() {
    return (this.state.users.map((user) => {
      return (
        <li key={user.id}><h1>{user.firstName}</h1></li>
      )
    }))
  }

  render() {
    let users = this.renderUserList();
    console.log(users)
    return (
      <div className="ui relaxed divided list">
        <ul>
          {users}
        </ul>
      </div>
    );
  }
}

export default Users;
