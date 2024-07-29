import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmSignUp } from '../authService';
import config from "../config.json";
import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from '@aws-sdk/client-cognito-identity-provider';

const ConfirmSignUp = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState(location.state?.email || '');
    const [username, setUsername] = useState(location.state?.username || '');
    const [confirmationCode, setConfirmationCode] = useState('');

    const resendConfirmationCode = ({ clientId, username }) => {
        const client = new CognitoIdentityProviderClient({
            region: config.region,
        });
      
        const command = new ResendConfirmationCodeCommand({
          ClientId: config.clientId,
          Username: username,
        });
      
        return client.send(command);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          await confirmSignUp(username, confirmationCode);
          alert("Account confirmed successfully!\nSign in on next page.");
          navigate('/signin');
        } catch (error) {
          alert(`Failed to confirm account: ${error}`);
        }
    };

    return (
        <div>
            <h3>ConfirmSignUp</h3>
            <p>A confirmation code was sent to {email}. Please check your email and enter the code received to validate your email.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                    className="inputText"
                    type="text"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                    placeholder="Confirmation Code"
                    required />
                </div>
                <button type="submit">Confirm Account</button>
            </form>
            {/* set up a resend button link in case the user might now have gotten the confirmation code from aws cognito */}
            <p onClick={resendConfirmationCode} style={{cursor: 'pointer'}}>Didn't get the confirmation code? Resend</p>
        </div>
    )
}

export default ConfirmSignUp