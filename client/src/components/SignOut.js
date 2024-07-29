import React from 'react';
import { signOut } from '../authService';
// import { Auth } from 'aws-amplify';

const SignOut = () => {

    const handleSignOut = async () => {
        try {
            await signOut();
            alert('Sign out successful!');
            window.location.href = '/signin';
        } catch (error) {
            alert(`Sign out failed: ${error}`);
        }
    };


    return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
