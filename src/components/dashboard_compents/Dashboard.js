import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import handleDate from '../utils/date';

const Dashboard = () => {
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [userDetails, setUserDetails] = useState({});
     const location = useLocation();
    const [message, setMessage] = useState(location.state?.message || '');
    const id = localStorage.getItem("userId");
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`/getUserDetails/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }); 
                if (res.ok) {
                    const { user } = await res.json();
                    setUserDetails(user);
                } else {
                    console.error('Failed to fetch tasks');
                    setMessage("Failed to fetch tasks")
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage(error)
            }
        };
        fetchUserDetails();
    },[id]);
    
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch(`/getTasks/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }); 
                if (res.ok) {
                    const { tasks } = await res.json();
                    setTaskList(tasks);
                } else {
                    setMessage('Failed to fetch tasks');
                    console.error('Failed to fetch tasks');
                }
            } catch (error) {
                setMessage(error);
                console.error('Error:', error);
            }
        };
        fetchTasks();
    },[id]);
    // console.log('Dash');
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                navigate(location.pathname, { replace: true, state: {} });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        document.getElementById("taskContainerDetails").style.display = document.getElementById("taskContainerDetails").style.display === 'none' ? "block" : 'none';
    };

    const handleEdit = () => {
        // navigate(`/dashboard/edit/${selectedTask._id}`, { state: { selectedTask, fullName, id } });
        navigate(`/dashboard/edit/${selectedTask._id}`, { state: { selectedTask, id } });
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/deleteTask/${selectedTask._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                setTaskList(taskList.filter(task => task._id !== selectedTask._id));
                document.getElementById("taskContainerDetails").style.display = "none";
            } else {
                console.error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');  // Clear token from localStorage
        navigate('/login');                // Redirect to login page
    };

    return (
        <div className="dashboard">
            <h1>Welcome, {userDetails.fullName}</h1>
            <h2>{userDetails.email}</h2>
            <h2>{userDetails.phone}</h2>
            <button onClick={handleLogout}>Logout</button>

            <div>
                {taskList.length > 0 ? (
                    <ul>
                        {taskList.map((task) => (
                            <li
                                onClick={() => handleTaskSelect(task)}
                                key={task._id}
                                style={{ cursor: 'pointer', marginBottom: '10px' }}
                            >
                                <span>{task.title}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks available. Add a Task</p>
                )}
            </div>

            <div id="taskContainerDetails" style={{ display: 'none' }}>
                {selectedTask && (
                    <div>
                        <h2>Task Details</h2>
                        <p><strong>Title:</strong> {selectedTask.title}</p>
                        <p><strong>Description:</strong> {selectedTask.description}</p>
                        <p><strong>Due Date:</strong> {handleDate(selectedTask.dueDate)}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Priority:</strong>{selectedTask.priority}</p>

                        <div>
                            <button onClick={handleEdit}>Edit Task</button>
                            <button onClick={handleDelete}>Delete Task</button>
                        </div>
                    </div>
                )}
            </div>
            {message && (
                    <p style={{ color: 'red'}}>{message}</p>
                )}
            <Link to='/dashboard/add' state={id}>
                Add Task
            </Link>
        </div>
    );
};

export default Dashboard;
