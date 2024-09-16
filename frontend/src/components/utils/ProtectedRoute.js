import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useFilter } from './FilterContext';

const ProtectedRoute = ({ children }) => {
    const { isAuth, setIsAuth ,setMessage, setLogoutMessage,logoutMessage} = useFilter();
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuth(false);
                setLoading(false);
                return;
            }

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
    }, [token, setIsAuth]);
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuth) {
        if (logoutMessage) {
            setMessage(logoutMessage);
            setLogoutMessage('');
        } else {
            setMessage("Please login to access the page.");
        }
        return <Navigate to="/login" replace />;
    }


    return children;
};

export default ProtectedRoute;
