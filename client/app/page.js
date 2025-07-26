'use client';
import { useState, useEffect } from 'react';
import { fetchUser, login, signup, logout } from '../lib/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    fetchUser().then(data => setUser(data.user)); 
  }, []);

  if (user) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome, {user.displayName || user.email}!</h1>
        {user.photos?.[0]?.value && (
          <img src={user.photos[0].value} alt="" className="w-16 h-16 rounded-full my-4" />
        )}
        <button
          onClick={() => logout().then(() => setUser(null))}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  }

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const action = type === 'login' ? login : signup;
    const data = await action(form.email, form.password);
    
    if (data?.user) {
      setUser(data.user);
    } else if (data?.error) {
      setError(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign In or Sign Up</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="space-y-4">
        <input
          type="email" 
          required 
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <input
          type="password" 
          required 
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <div className="flex space-x-4">
          <button 
            type="button"
            onClick={e => handleSubmit(e, 'login')}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
          <button
            type="button"
            onClick={e => handleSubmit(e, 'signup')}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <a
          href="http://localhost:8080/api/auth/google"
          className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign in with Google
        </a>
      </div>
    </div>
  );
}
