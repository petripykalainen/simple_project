import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Users from './Users';
import Navbar from './Navbar';

import Postlist from './posts/Postlist';
import Post from './posts/Post';
import PostNew from './posts/PostCreate.js';
import PostEdit from './posts/PostEdit';
import PostDelete from './posts/PostDelete';

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Navbar/>
        <Route path="/" exact component={Postlist}/>
        <Route path="/posts/new" exact component={PostNew}/>
        <Route path="/posts/edit" exact component={PostEdit}/>
        <Route path="/posts/delete" exact component={PostDelete}/>
        <Route path="/posts/show" exact component={Post}/>
      </BrowserRouter>
    </div>
  );
};

export default App;
