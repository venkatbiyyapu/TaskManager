import React, { useEffect , useState } from 'react';
import { Navigate} from 'react-router-dom';

const ProtectedRoute = ({ children}) => {
    // const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const validateToken = async () => {
            try {
                const response = await fetch('http://localhost:3001/validateToken', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Send token for validation
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    throw new Error('Invalid token');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            validateToken();
        } else {
            setIsAuthenticated(false);
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ message: 'User is not authenticated. Please log in first.' }} />;
    }

    return children;
};

export default ProtectedRoute;

