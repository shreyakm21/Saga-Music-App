import React, { useState } from 'react';
import { login, signup } from '../api/axios';

const LoginSignup = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleLogin = async () => {
        try {
            const response = await login(formData);
            console.log('Login Successful:', response.data);
        } catch (error) {
            console.error('Login Error:', error);
        }
    };

    const handleSignup = async () => {
        try {
            const response = await signup(formData);
            console.log('Signup Successful:', response.data);
        } catch (error) {
            console.error('Signup Error:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleSignup}>Signup</button>
        </div>
    );
};

export default LoginSignup;
