import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            onClose();
            navigate('/admin');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            console.error(err);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Admin Login">
            <form onSubmit={handleSubmit}>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="p-2 bg-gray-700 rounded-md text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-2 bg-gray-700 rounded-md text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition-colors">
                        Login
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default LoginModal;