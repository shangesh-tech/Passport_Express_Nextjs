const API_BASE = 'http://localhost:8080';

export async function fetchUser() {
  try {
    const res = await fetch(`${API_BASE}/api/user`, { credentials: 'include' });
    return res.ok ? res.json() : { user: null };
  } catch (error) {
    console.error('Fetch user error:', error);
    return { user: null };
  }
}

export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      return res.json();
    } else {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: error.message };
  }
}

export async function signup(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      return res.json();
    } else {
      const error = await res.json();
      throw new Error(error.error || 'Signup failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    return { error: error.message };
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}
