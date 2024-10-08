import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import validatePassword from "./utils/ValidationUtil";
import { useFilter } from "./utils/FilterContext";

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [conpassword, setConPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const {message, setMessage, backendUrl} = useFilter();


    const handleInputChange = (e, setter) => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            validatePassword(password, conpassword);
            const response = await fetch(`${backendUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, phone, email, password }),
            });
            const data = await response.json();
            const message =data.message
            if (response.ok) {
                navigate('/login',{status:{message}});
            } else {
                setMessage(message || "Invalid username or password");
            }
        } catch (error) {
            setMessage(error.message);
            console.error('Error:', error.message);
        }
    };
    return (
        <div className="login-signup-overlay overlay">
            <div className="form">
                <h3>TaskTrack</h3>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-fields">
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
                    <div className="form-fields">
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
                    <div className="form-fields">
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
                    <div className="form-fields">
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
                    <div className="form-fields">
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
                    {message && (
                        <p style={{ color: 'red' }}>
                            {message}
                        </p>
                    )}
                    <button type="submit" className="btn btn-gradient-border btn-glow">Sign Up</button>
                    <p className="ask">
                        <span>Already signed up?</span>
                        <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
