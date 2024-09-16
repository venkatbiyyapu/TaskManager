import React, { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import handleDate from '../utils/DateUtil';
import { useFilter } from '../utils/FilterContext';
export default function Edit() {
    // const location = useLocation();
    const {selectedTask , message ,setMessage , backendUrl} = useFilter();
    const [title, setTitle] = useState(selectedTask.title);
    const [description, setDescription] = useState(selectedTask.description);
    const [status, setStatus] = useState(selectedTask.status);
    const [priority, setPriority] = useState(selectedTask.priority);
    // const [error, setError] = useState('');
    const navigate = useNavigate();

    const formattedDate = handleDate(selectedTask.dueDate);
    const [dueDate, setDueDate] = useState(formattedDate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = { title, description, dueDate, status, priority};
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${backendUrl}/editTask/${selectedTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });
            const data = await response.json();
            if (response.ok) {
                // navigate('/dashboard', { state: { message : data.message, filterStatus, filterPriority , sortOrder} });
                navigate('/dashboard', { state:{ message : data.message }});
            } else {
                setMessage(data.message || 'Failed to edit task');
            }
        } catch (error) {
            setMessage('Server error. Please try again later.');
        }
    };
    return (
        <div className="add-edit-overlay overlay">
            <div className='form dashboard-form'>
                <h2>EDIT TASK</h2>
                {message && <p style={{ color: 'red' }}>{message}</p>}
                <form onSubmit={handleSubmit} className='form-container'>
                    <div className="form-fields">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-fields">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-fields">
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-fields">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                    <div className="form-fields">
                        <label>Priority</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                    <div className='add-buttons'>
                        <button type="submit" className='cancle-btn btns' id='save-btn'>Save</button>
                        <Link to="/dashboard" className='cancle-btn btns'>Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );

    // return (
    //     <div>
    //         {message && <p style={{ color: 'red' }}>{message}</p>}
    //         <form onSubmit={handleSubmit}>
    //             <div>
    //                 <label>Title</label>
    //                 <input
    //                     type="text"
    //                     value={title}
    //                     onChange={(e) => setTitle(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Description</label>
    //                 <textarea
    //                     value={description}
    //                     onChange={(e) => setDescription(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Due Date</label>
    //                 <input
    //                     type="date"
    //                     value={dueDate}
    //                     onChange={(e) => setDueDate(e.target.value)}
    //                     required
    //                 />
    //             </div>
    //             <div>
    //                 <label>Status</label>
    //                 <select value={status} onChange={(e) => setStatus(e.target.value)}>
    //                     <option value="To Do">To Do</option>
    //                     <option value="In Progress">In Progress</option>
    //                     <option value="Done">Done</option>
    //                 </select>

    //             </div>
    //             <div>
    //                 <label>Priority</label>
    //                 <select value={priority} onChange={(e) => setPriority(e.target.value)}>
    //                     <option value="High">High</option>
    //                     <option value="Medium">Medium</option>
    //                     <option value="Low">Low</option>
    //                 </select>

    //             </div>
    //             <button type="submit">Save</button>
    //             <Link to="/dashboard" >Cancel</Link>
    //         </form>
    //     </div>
    // );
}
