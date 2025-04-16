import { useState } from 'react'
import { Link } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  return (
    <>
      <nav>
        <Link to={'/'}>
          <a>Home page</a>
        </Link>
        <Link to={'/journal'}>
          <a>Trading journal</a>
        </Link>
        <Link to={'/login'}>
          <a>Login</a>
        </Link>
        <Link to={'/'}>
          <a>Home page</a> 
        </Link>
      </nav>
      <h1>Trading journal</h1>
      
    </>
  )
}

export default App
