import React from 'react';
import Users from './Users';
import Navbar from './Navbar';

const App = () => {
  return (
    <div className="ui container">
      <Navbar/>
      <Users/>
    </div>
  );
};

export default App;
