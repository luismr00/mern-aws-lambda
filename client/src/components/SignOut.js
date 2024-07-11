import React from 'react';
import { Auth } from 'aws-amplify';

const SignOut = () => {
    const signOut = async () => {
        try {
            await Auth.signOut();
            alert('Sign out successful!');
        } catch (error) {
            alert('Error signing out: ' + error.message);
        }
    };

    return <button onClick={signOut}>Sign Out</button>;
};

export default SignOut;
