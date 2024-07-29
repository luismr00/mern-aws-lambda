import React, { useState } from 'react';
import { signIn } from '../authService';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
          const session = await signIn(email, password);
          console.log('Sign in successful', session);
          if (session && typeof session.AccessToken !== 'undefined') {
            sessionStorage.setItem('accessToken', session.AccessToken);
            if (sessionStorage.getItem('accessToken')) {
              window.location.href = '/';
            } else {
              console.error('Session token was not set properly.');
            }
          } else {
            console.error('SignIn session or AccessToken is undefined.');
          }
        } catch (error) {
          alert(`Sign in failed: ${error}`);
        }
      };

    return (
        <div>
            <h2>Sign In</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleSignIn}>Sign In</button>
            <p>Don't have an account?<a href="/signup">Sign Up</a></p>
        </div>
    );
};

export default SignIn;
