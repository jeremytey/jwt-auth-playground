import { useState } from 'react';

function LoginForm({onLogin}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    // async function to handle form submission, it prevents the default form behavior, resets any existing error messages, and then attempts to log in using the provided email and password. If the login attempt fails, it catches the error and sets the error message to be displayed to the user.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <input value = {email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value = {password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button onClick={handleSubmit}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default LoginForm;