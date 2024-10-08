import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/'); // Redirect to home page after login/signup
    } catch (error) {
      console.error('Authentication Error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <h1 className="text-4xl font-bold mb-6">{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleAuth} className="flex flex-col">
        {isSignUp && (
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mb-4 p-3 border rounded-lg"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="mb-4 p-3 border rounded-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="mb-4 p-3 border rounded-lg"
        />
        <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-lg">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p className="mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button className="text-blue-600" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}
