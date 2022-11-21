import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../marvel-logo.png';

export default function Home() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='logo' alt='logo' />
        <h1>Welcome to my React.js Marvel API Example</h1>
        <Link className='App-link' to='/characters/page/1'>
          Characters List
        </Link>
        <Link className='App-link' to='/comics/page/1'>
          Comics List
        </Link>
        <Link className='App-link' to='/stories/page/1'>
          Stories List
        </Link>
        <p>By Junjie Chen 10476718</p>
      </header>
    </div>
  );
}
