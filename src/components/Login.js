import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState(location.state?.message || '');

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        setErrorMessage(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const { user, token } = data;

                localStorage.setItem('token', token);
                localStorage.setItem('userId', user._id);
                navigate('/dashboard', {
                    state: {
                        id: user._id,
                    }
                });
            } else {
                const data = await response.json();
                setErrorMessage(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred. Please try again.");
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="email"
                        autoComplete="on"
                        onChange={(e) => handleInputChange(e, setEmail)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => handleInputChange(e, setPassword)}
                        required
                    />
                </div>
                {errorMessage && (
                    <p style={{ color: 'red' }}>{errorMessage}</p>
                )}
                <button type="submit">Log In</button>
                <p>
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
