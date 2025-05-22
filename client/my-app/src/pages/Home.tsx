import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md'>
      <h1 className='text-4xl font-bold mb-6'>
        Welcome to Your Trading Journal 📈
      </h1>
      <p className='text-lg text-gray-700 mb-8 max-w-md'>
        Track your trades, analyze your performance, and improve your strategy
        with ease.
      </p>
      <div className='flex gap-4'>
        <Link
          to='/register'
          className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
        >
          Register
        </Link>
        <Link
          to='/login'
          className='px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition'
        >
          Login
        </Link>
      </div>
    </div>
  );
}
