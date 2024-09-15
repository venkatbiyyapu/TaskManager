import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdListAlt } from "react-icons/md";
import { RiProgress5Line } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import handleDate from '../utils/date';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [userDetails, setUserDetails] = useState({});
    const [filterStatus, setFilterStatus] = useState(location.state?.filterStatus ||'');
    const [filterPriority, setFilterPriority] = useState(location.state?.filterPriority ||'');
    const [sortOrder, setSortOrder] = useState(location.state?.sortOrder || "asc");
    const [message, setMessage] = useState(location.state?.message || '');
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem('token');

    const imgStatus = {
        "To Do": MdListAlt,
        "In Progress": RiProgress5Line,
        "Done": IoCheckmarkDoneSharp
    };
    const priorityColor = {
        "High": "red",
        "Medium": 'orange',
        "Low": "green"
    };

    const clearFilter = ()=>{
        setFilterPriority('');
        setFilterStatus("");
        setSortOrder("asc");
    }

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
                    setMessage("Failed to fetch tasks");
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage(error.toString());
            }
        };
        fetchUserDetails();
    }, [id]);

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
                setMessage(error.toString());
                console.error('Error:', error);
            }
        };
        fetchTasks();
    }, [id]);

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
        navigate(`/dashboard/edit/${selectedTask._id}`, { state: { selectedTask, filterStatus, filterPriority , sortOrder } });
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
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const filteredTasks = taskList
        .filter(task => !filterStatus || task.status === filterStatus)
        .filter(task => !filterPriority || task.priority === filterPriority);

    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortOrder === 'asc') {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
    });

    return (
        <div className="dashboard">
            <h1>Welcome, {userDetails.fullName}</h1>
            <h2>{userDetails.email}</h2>
            <h2>{userDetails.phone}</h2>
            <button onClick={handleLogout}>Logout</button>

            {/* Filter by Task Status */}
            <div>
                <label>Filter Status: </label>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>

            <div>
                <label>Filter Priority: </label>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div>
                <label>Sort by Priority: </label>
                <button onClick={() => setSortOrder('asc')}>Low to High</button>
                <button onClick={() => setSortOrder('desc')}>High to Low</button>
            </div>
            <button onClick={clearFilter}>Clear Filters</button>

            <div>
                {sortedTasks.length > 0 ? (
                    <ul>
                        {sortedTasks.map((task) => {
                            const IconComponent = imgStatus[task.status];
                            return (
                                <div
                                    onClick={() => handleTaskSelect(task)}
                                    key={task._id}
                                    style={{ cursor: 'pointer', marginBottom: '10px' }}
                                >
                                    <div style={
                                        {
                                            color: priorityColor[task.priority],
                                            display: 'inline-block'
                                        }}>
                                        <span>{task.title}</span>
                                        {IconComponent && <IconComponent style={{ marginLeft: '10px' }} />}
                                    </div>
                                </div>
                            );
                        })}
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
                        <p><strong>Priority:</strong> {selectedTask.priority}</p>

                        <div>
                            <button onClick={handleEdit}>Edit Task</button>
                            <button onClick={handleDelete}>Delete Task</button>
                        </div>
                    </div>
                )}
            </div>

            {message && (
                <p style={{ color: 'red' }}>{message}</p>
            )}
            <Link to='/dashboard/add' state={{filterStatus , filterPriority , sortOrder}}>
                Add Task
            </Link>
        </div>
    );
};

export default Dashboard;

