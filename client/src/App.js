import React from 'react';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ItemList from './components/ItemList'; // Assuming this component lists your CRUD items
import Unauthorized from './components/Unauthorized';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ConfirmSignUp from './components/ConfirmSignUp';
import UploadImage from './components/UploadImage';
import DisplayImage from './components/DisplayImage';
import DisplayVideo from './components/DisplayVideo';

Amplify.configure(awsConfig);

const App = () => {

    const isAuthenticated = () => {
        const accessToken = sessionStorage.getItem('accessToken');
        return !!accessToken;
    };

    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={isAuthenticated() ? <ItemList /> : <Unauthorized />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/confirm" element={<ConfirmSignUp />} />
                <Route path="/upload" element={isAuthenticated() ? <UploadImage /> : <Navigate to="/signin" />} />
                <Route path="/display-image" element={isAuthenticated() ? <DisplayImage /> : <Navigate to="/signin" />} />
                <Route path="/display-video/:id" element={isAuthenticated() ? <DisplayVideo /> : <Navigate to="/signin" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
