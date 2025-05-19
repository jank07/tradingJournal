import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className='w-full bg-gray-800 text-white p-4 flex justify-between'>
      <div className='flex space-x-4'>
        <Link to='/' className='hover:text-gray-500 text-white'>
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link to='/add-trade' className='hover:text-gray-500 text-white'>
              Add Trade
            </Link>
            <Link to='/dashboard' className='hover:text-gray-500 text-white'>
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to='/login' className='hover:text-gray-500 text-white'>
              Login
            </Link>
            <Link to='/register' className='hover:text-gray-500 text-white'>
              Register
            </Link>
          </>
        )}
      </div>

      {isLoggedIn && (
        <button
          onClick={logout}
          className='bg-red-500 px-3 py-1 rounded hover:bg-red-600'
        >
          Logout
        </button>
      )}
    </nav>
  );
}
