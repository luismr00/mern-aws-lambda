import React, { useState } from 'react';
import { Auth } from 'aws-amplify';

const SignIn = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            await Auth.signIn(username, password);
            alert('Sign in successful!');
        } catch (error) {
            alert('Error signing in: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
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
            <button onClick={signIn}>Sign In</button>
        </div>
    );
};

export default SignIn;
