import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Error() {
  const location = useLocation();

  return (
    <div style={{ textAlign: 'center' }}>
      <Link to='/'>Home</Link>
      <h1>opoos... 404 NOT FOUND</h1>
      <p>{location.state ? location.state.description : undefined}</p>
    </div>
  );
}
