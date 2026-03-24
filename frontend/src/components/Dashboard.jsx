import { useState } from 'react'
import api from '../api';

function Dashboard({onLogout}) {
    const [displayResponse, setDisplayResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        setError(null);
        try {
            await onLogout();
        } catch (err) {
            setError(err.message);
        }
    };

    const handlePublic = async () => {
        try {
            const response = await api.get('/public');
            setDisplayResponse(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleProtected = async () => {
        try {
            const response = await api.get('/protected');
            setDisplayResponse(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAdmin = async () => {
        try {
            const response = await api.get('/admin');
            setDisplayResponse(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h1>Welcome to the Dashboard!</h1>

            <button onClick={handleLogout}>Logout</button>
            <button onClick={handlePublic}>Public</button>
            <button onClick={handleProtected}>Protected</button>
            <button onClick={handleAdmin}>Admin</button>
            {displayResponse && <pre>{JSON.stringify(displayResponse, null, 2)}</pre>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );

}

export default Dashboard;