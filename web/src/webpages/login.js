import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import ResetPasswordModal from "./ResetPasswordModal";

function Login() {
    const [isMobile, setIsMobile] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showResetModal, setShowResetModal] = useState(false);
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:9000";

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);

        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("adminToken", data.token);
                navigate("/admin");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (error) {
            setError("An error occurred while logging in.");
        }
    };

    if (isMobile) {
        return (
            <div className="mobile-message-container">
                <div className="mobile-message">
                    <h2>Access Restricted</h2>
                    <p>For a better experience, please access this page on a desktop.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-style">
            <div className="grid-container">
                <div className="col-1">
                    <h1>Admin Election System</h1>
                    <p>Manage and oversee election processes with ease. Add candidates, set voting timeframes, and ensure a smooth voting experience for everyone.</p>
                    <p>ACADEMIC YEAR 2025-2026</p>
                </div>
                <div className="col-2">
                    <h2>User Login</h2>
                    <form onSubmit={handleLogin}>
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />

                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button
                            type="button"
                            onClick={() => setShowResetModal(true)} // Open the modal
                        >
                            Reset Password
                        </button>
                        {error && <p className="error">{error}</p>}

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
            <ResetPasswordModal 
                showModal={showResetModal} 
                setShowModal={setShowResetModal} 
            />
        </div>
    );
}

export default Login;
