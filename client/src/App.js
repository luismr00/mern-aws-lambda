import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import ItemList from './components/ItemList'; // Assuming this component lists your CRUD items

Amplify.configure(awsConfig);

const App = () => {
    return (
        <Authenticator signUpAttributes={[
            'given_name',
            'family_name',
            'email',
        ]}>
            {({ signOut, user }) => (
                <main>
                    <h1>Welcome {user?.attributes?.given_name} {user?.attributes?.family_name}</h1>
                    <button onClick={signOut}>Sign out</button>
                    <ItemList />
                </main>
            )}
        </Authenticator>
    );
};

export default App;
