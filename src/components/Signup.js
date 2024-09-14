import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [conpassword, setConPassword] = useState("")
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data) {
                console.log(data);
                // localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(true);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            {error && (
                <p style={{ color: 'red' }}>
                    Invalid username or password
                </p>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="email"
                        autoComplete="on"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={conpassword}
                        placeholder="confirm password"
                        onChange={(e) => setConPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
                <p>
                    Already SignUp? <Link to="/login">Login In</Link>
                </p>
            </form>
        </div>
    );
};


export default SignUp;