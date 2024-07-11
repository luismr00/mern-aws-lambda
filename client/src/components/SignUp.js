import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const signUp = async () => {
        try {
            await Auth.signUp({
                username,
                password,
                attributes: { email },
            });
            alert('Sign up successful!');
        } catch (error) {
            alert('Error signing up: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <button onClick={signUp}>Sign Up</button>
        </div>
    );
};

export default SignUp;
