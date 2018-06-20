import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div>
    <li>
      <Link to="/">/</Link>
    </li>
    <li>
      <Link to="/auth">/auth</Link>
    </li>
    <li>
      <Link to="/all-grid">/all-grid</Link>
    </li>
    <li>
      <Link to="/all-map">/all-map</Link>
    </li>
    <li>
      <Link to="/post/:postId">/post/:postId</Link>
    </li>
    <li>
      <Link to="/post/:postId/edit">/post/:postId/edit</Link>
    </li>
    <li>
      <Link to="/post/create">/post/create</Link>
    </li>
    <li>
      <Link to="/account">/account</Link>
    </li>
    <li>
      <Link to="/account/posts">/account/posts</Link>
    </li>
  </div>
);
