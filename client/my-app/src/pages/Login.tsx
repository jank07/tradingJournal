import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoggedIn) {
      setError('You are logged in.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      const res = await api.post('/login', {
        email,
        password,
      });

      const { token } = res.data;

      if (token) {
        login(token);
        navigate('/'); // Redirect to the dashboard or home page
      } else {
        setError('No token received');
      }
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className='bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md'>
        <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
          <h2 className='text-center text-2xl font-bold mb-6'>Login</h2>

          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-3 rounded bg-black text-white  focus:outline-none'
            required
          />

          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-3 rounded bg-black text-white  focus:outline-none'
            required
          />

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex justify-center items-center gap-2'
            disabled={loading}
          >
            {' '}
            Login
          </button>
        </form>
      </div>
    </>
  );
}
