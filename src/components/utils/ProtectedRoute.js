import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFilter } from './FilterContext';

const ProtectedRoute = ({ children }) => {
    const { isAuth, setIsAuth } = useFilter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsAuth(false);
            setLoading(false);
            return;
        }

        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:3001/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuth(true);
                } else {
                    throw new Error('Invalid token');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuth(false);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [setIsAuth]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace state={{ message: 'User is not authenticated. Please log in first.' }} />;
    }

    return children;
};

export default ProtectedRoute;
