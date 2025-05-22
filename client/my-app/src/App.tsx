import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddTrade from './pages/AddTrade';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen flex flex-col bg-gray-900 text-white'>
        <Navbar />
        <main className='flex-1 flex items-center justify-center p-4'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/add-trade' element={<AddTrade />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
