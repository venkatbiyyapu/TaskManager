import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdListAlt } from "react-icons/md";
import { RiProgress5Line } from "react-icons/ri";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import handleDate from '../utils/DateUtil';
import { useFilter } from '../utils/FilterContext';
import { HiUserCircle } from "react-icons/hi2";
import { AiOutlineLogout } from "react-icons/ai";
import { TbMailFilled } from "react-icons/tb";
import { FaPhoneSquare } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";


const Dashboard = () => {
    const navigate = useNavigate();
    const [taskList, setTaskList] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const token = localStorage.getItem('token');
    const {
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        sortOrder,
        setSortOrder,
        selectedTask,
        setSelectedTask,
        id,
        message,
        setMessage,
        clearFilters,
        setLogoutMessage,
        backendUrl
    } = useFilter();
    

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

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${backendUrl}/getUserDetails/${id}`, {
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
                const res = await fetch(`${backendUrl}/getTasks/${id}`, {
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

    const handleTaskSelect = (task) => {
        setSelectedTask(task);
        document.getElementById("taskContainerDetails").style.display = document.getElementById("taskContainerDetails").style.display === 'none' ? "block" : 'none';
    };

    const handleEdit = () => {
        navigate(`/dashboard/edit/${selectedTask._id}`);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/deleteTask/${selectedTask._id}`, {
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
        clearFilters();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuth');
        setLogoutMessage('Logged out successfully..Please login again!');
        navigate('/login');

    };

    const filteredTasks = taskList
        .filter(task => !filterStatus || task.status === filterStatus)
        .filter(task => !filterPriority || task.priority === filterPriority);

    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
    const sortedTasks = sortOrder
    ? filteredTasks.sort((a, b) => {
        if (sortOrder === 'asc') {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
    })
    : filteredTasks; 

    const sorting = (order, id) => {
        setSortOrder(order);
        if (id === 'one') {
            document.getElementById(id).style.background = 'linear-gradient(to right, green, yellow, red)';
            document.getElementById('two').style.background = 'white';
            document.getElementById('two').style.color = 'black';
        }
        else {
            document.getElementById(id).style.background = 'linear-gradient(to right, red, yellow, green)';
            document.getElementById('one').style.background = 'white';
            document.getElementById('one').style.color = 'black';
        }
        document.getElementById(id).style.color = 'white';
    }

    return (
        <div className="dashboard">
            <div className='navbar'>
                <h3>TaskTrack</h3>
                <h1>Dashboard</h1>
                <div className='user-details'>
                    <h5 className='user-select'>
                        <span className='user-logo'><HiUserCircle/></span>
                        <span className='welcome-msg'>
                            <span>Welcome, </span>
                            <span>{userDetails.fullName}</span>
                        </span>
                        <span onClick={handleLogout} className='logout'><AiOutlineLogout /></span>
                    </h5>
                    <p className='drop-down'>
                        <span> <TbMailFilled /> {userDetails.email}</span>
                        <span><FaPhoneSquare />{userDetails.phone}</span>
                    </p>
                </div>
            </div>
            <div className='content'>
                <div className='filters-container'>
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
                    <div className='priority'>
                        <label>Sort by Priority: </label>
                        <div className='sort'>
                            <p onClick={() => sorting('asc', 'one')} id='one' className='btns'>Low to High</p>
                            <p onClick={() => sorting('desc', 'two')} id='two' className='btns'>High to Low</p>
                            {/* <p onClick={() => setSortOrder('asc')}>Low to High</p>
                            <p onClick={() => setSortOrder('desc')}>High to Low</p> */}
                        </div>
                    </div>
                    <div onClick={clearFilters} className='cross btns'><RxCross2 /></div>
                </div>
                <div className='tasks-container'>
                    <h1 className='task-heading'>
                        <span>Tasks</span>
                        <Link to='/dashboard/add' className='add-btn btns'>
                            ADD Task
                        </Link>
                    </h1>
                    {sortedTasks.length > 0 ? (
                        <ul id='tasks-list'>
                            {sortedTasks.map((task) => {
                                const IconComponent = imgStatus[task.status];
                                return (
                                    <div
                                        key={task._id}
                                        style={{ borderLeft: `5px solid ${priorityColor[task.priority]}` }}
                                        className='items'
                                    >
                                        <p className="task-title">{IconComponent && <span><IconComponent /></span>} <span className='title'>{task.title} </span></p>
                                        <span className='view-more btns' onClick={() => handleTaskSelect(task)}
                                        >View More Details</span>
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
                        <div className='task-details-container'>
                            <h2>Task Details</h2>
                            <div className='details-align-left'>
                                <p><strong>Title:</strong> <span>{selectedTask.title}</span></p>
                                <p><strong>Description:</strong> <span>{selectedTask.description}</span></p>
                                <p><strong>Due Date:</strong> <span>{handleDate(selectedTask.dueDate)}</span></p>
                                <p><strong>Status:</strong> <span>{selectedTask.status}</span></p>
                                <p><strong>Priority:</strong> <span>{selectedTask.priority}</span></p>
                                <div className='details-buttons'>
                                    <p onClick={handleEdit} className='edit-btn btns'>Edit Task</p>
                                    <p onClick={handleDelete} className='delete-btn btns'>Delete Task</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {message && (
                    <p style={{ color: 'red' }}>{message}</p>
                )}
            </div>
        </div >
    );

    // return (
    //     <div className="dashboard">
    //         <h1>Welcome, {userDetails.fullName}</h1>
    //         <h2>{userDetails.email}</h2>
    //         <h2>{userDetails.phone}</h2>
    //         <button onClick={handleLogout}>Logout</button>


    //         <div>
    //             <label>Filter Status: </label>
    //             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
    //                 <option value="">All</option>
    //                 <option value="To Do">To Do</option>
    //                 <option value="In Progress">In Progress</option>
    //                 <option value="Done">Done</option>
    //             </select>
    //         </div>

    //         <div>
    //             <label>Filter Priority: </label>
    //             <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
    //                 <option value="">All</option>
    //                 <option value="High">High</option>
    //                 <option value="Medium">Medium</option>
    //                 <option value="Low">Low</option>
    //             </select>
    //         </div>

    //         <div>
    //             <label>Sort by Priority: </label>
    //             <button onClick={() => setSortOrder('asc')}>Low to High</button>
    //             <button onClick={() => setSortOrder('desc')}>High to Low</button>
    //         </div>
    //         <button onClick={clearFilters}>Clear Filters</button>

    //         <div>
    //             {sortedTasks.length > 0 ? (
    //                 <ul>
    //                     {sortedTasks.map((task) => {
    //                         const IconComponent = imgStatus[task.status];
    //                         return (
    //                             <div
    //                                 onClick={() => handleTaskSelect(task)}
    //                                 key={task._id}
    //                                 style={{ cursor: 'pointer', marginBottom: '10px' }}
    //                             >
    //                                 <div style={
    //                                     {
    //                                         color: priorityColor[task.priority],
    //                                         display: 'inline-block'
    //                                     }}>
    //                                     <span>{task.title}</span>
    //                                     {IconComponent && <IconComponent style={{ marginLeft: '10px' }} />}
    //                                 </div>
    //                             </div>
    //                         );
    //                     })}
    //                 </ul>
    //             ) : (
    //                 <p>No tasks available. Add a Task</p>
    //             )}
    //         </div>

    //         <div id="taskContainerDetails" style={{ display: 'none' }}>
    //             {selectedTask && (
    //                 <div>
    //                     <h2>Task Details</h2>
    //                     <p><strong>Title:</strong> {selectedTask.title}</p>
    //                     <p><strong>Description:</strong> {selectedTask.description}</p>
    //                     <p><strong>Due Date:</strong> {handleDate(selectedTask.dueDate)}</p>
    //                     <p><strong>Status:</strong> {selectedTask.status}</p>
    //                     <p><strong>Priority:</strong> {selectedTask.priority}</p>

    //                     <div>
    //                         <button onClick={handleEdit}>Edit Task</button>
    //                         <button onClick={handleDelete}>Delete Task</button>
    //                     </div>
    //                 </div>
    //             )}
    //         </div>

    //         {message && (
    //             <p style={{ color: 'red' }}>{message}</p>
    //         )}
    //         <Link to='/dashboard/add'>
    //             Add Task
    //         </Link>
    //     </div>
    // );
};

export default Dashboard;

