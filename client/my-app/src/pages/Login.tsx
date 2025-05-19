import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // import kontekstu
import LoadingOverlay from '../components/LoadingOverlay';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth(); // użycie AuthContext

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoggedIn) {
      setError('Jesteś już zalogowany. Wyloguj się, aby kontynuować.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000)); // testowy delay
      const res = await axios.post('http://localhost:8000/login', {
        email,
        password,
      });

      const { token } = res.data;

      if (token) {
        login(token); // zapis tokenu i ustawienie isLoggedIn
        navigate('/'); // przekierowanie np. do dashboardu
      } else {
        setError('Brak tokena w odpowiedzi');
      }
    } catch (err: any) {
      console.error(err);
      setError('Błąd logowania. Sprawdź dane.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className='bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md'>
        <form onSubmit={handleLogin} className='flex flex-col space-y-4'>
          <h2 className='text-center text-2xl font-bold mb-6'>Logowanie</h2>

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
            placeholder='Hasło'
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
            Zaloguj się
          </button>
        </form>
      </div>
    </>
  );
}
