import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validatePassword from "./utils/Validation";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conpassword, setConPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState('');
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
            validatePassword(password, conpassword);
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, phone, email, password }),
            });
            const data = await response.json();
            const message =data.message
            if (response.ok) {
                console.log(data);
                console.log(message);
                navigate('/login',{status:{message}});
            } else {
                setError(true);
                setErrorMessage(message || "Invalid username or password");
            }
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        value={fullName}
                        placeholder="Enter your Full Name"
                        autoComplete="on"
                        onChange={(e) => handleInputChange(e, setFullName)}
                        required
                    />
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="tel"
                        value={phone}
                        placeholder="1234567890"
                        autoComplete="on"
                        onChange={(e) => handleInputChange(e, setPhone)}
                        pattern="\d{10}"
                        title="Please enter exactly 10 digits"
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        autoComplete="on"
                        onChange={(e) => handleInputChange(e, setEmail)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        placeholder="Enter a password"
                        onChange={(e) => handleInputChange(e, setPassword)}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        id="conpassword"
                        type="password"
                        value={conpassword}
                        placeholder="Enter your password"
                        onChange={(e) => handleInputChange(e, setConPassword)}
                        required
                    />
                </div>
                {error && (
                    <p style={{ color: 'red' }}>
                        {errorMessage}
                    </p>
                )}
                <button type="submit">Sign Up</button>
                <p>
                    Already signed up? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
