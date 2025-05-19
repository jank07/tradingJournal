import { useState } from 'react';
import axios from 'axios';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // loading true when request is sent
    try {
      const res = await axios.post('http://localhost:8000/register', {
        email,
        password,
      });
      setMessage(res.data.message || 'Registered!');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false); // loading false after request is done
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className='bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-center text-2xl font-bold mb-6'>Zarejestruj się</h2>
        <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className='p-3 rounded bg-black text-white focus:outline-none'
          />
          <input
            type='password'
            placeholder='Hasło'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className='p-3 rounded bg-black text-white focus:outline-none'
          />
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 flex justify-center items-center gap-2'
          >
            Zarejestruj się
          </button>
        </form>
        {message && <p className='mt-4 text-center text-gray-700'>{message}</p>}
      </div>
    </>
  );
}
