import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
    const location = useLocation();
    const { fullName, id } = location.state || {};

    return (
        <div className="dashboard">
            <h1>Welcome, {fullName}</h1>
            <p>Your ID is: {JSON.stringify(id)}</p>
        </div>
    );
};

export default Dashboard;
