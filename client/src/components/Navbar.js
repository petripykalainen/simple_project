import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Navbar extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      authenticated: undefined
    }
  }

  componentDidMount() {
    this.getAuthStatus();
  }
  
  getAuthStatus() {
    console.log('tests')
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="mx-auto">
          <h1>
            <Link className="navbar-brand mx-auto" to="/">Website</Link>
          </h1>
        </div>
        <div className="navbar-collapse  w-100 order-3 dual-collapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/signup">Sign up</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;
