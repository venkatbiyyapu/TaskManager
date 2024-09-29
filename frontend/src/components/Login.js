import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useFilter } from "./utils/FilterContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const [errorMessage, setErrorMessage] = useState('');

    const { setId, message,setMessage,backendUrl } = useFilter();

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(`${backendUrl}/login `, {
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
                localStorage.setItem('isAuth', true);
                setId(localStorage.getItem('userId'));
                navigate('/dashboard');
            } else {
                const data = await response.json();
                setMessage(data.message || "Invalid email or password.");
            }
        } catch (error) {
            setMessage("An unexpected error occurred. Please try again.");
            console.error('Login error:', error);
        }
    };
    return (

        <div className="login-signup-overlay overlay">
            <div className="form">
                <h3>TaskTrack</h3>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-fields">
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
                    <div className="form-fields">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            placeholder="password"
                            onChange={(e) => handleInputChange(e, setPassword)}
                            required
                        />
                    </div>
                    {message && (
                        <p style={{ color: 'red' }}>{message}</p>
                    )}
                    <button type="submit" className="btn btn-gradient-border btn-glow">Log In</button>
                    <p className="ask">
                        <span>Don't have an account?</span>
                        <Link to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;

