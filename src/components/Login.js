import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        if (error) {
            setError(false);
            setErrorMessage('');
        }
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
                const {user,token}= data
                console.log(data.user);
                console.log(user._id);
                console.log(token);
                navigate('/dashboard',{state:{fullName: user.fullName, id: user._id}});
            } else {
                const data = await response.json();
                setError(true);
                setErrorMessage(data.message || "Invalid username or password");
            }
        } catch (error) {
            setError(true);
            setErrorMessage("An unexpected error occurred. Please try again.");
            console.error('Error:', error);
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
                {error && (
                    <p style={{ color: 'red' }}>
                        {errorMessage}
                    </p>
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
