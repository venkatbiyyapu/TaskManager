import React, { useState } from 'react';
import {useNavigate, Link } from 'react-router-dom';
import { useFilter } from '../utils/FilterContext';

export default function Add() {
  const {id, message, setMessage , backendUrl} = useFilter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('High');
  // const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, dueDate, status, priority };
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${backendUrl}/addTask/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/dashboard');
      } else {
        setMessage(data.message || 'Failed to add task');
      }
    } catch (error) {
      setMessage('Server error. Please try again later.');
    }
  };
  return (
    <div className='add-edit-overlay overlay'>
      <div className='form dashboard-form'>
        <h2>ADD NEW TASK</h2>
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
            <button type="submit" className='add-btn btns'>ADD</button>
            <Link to="/dashboard" className='cancle-btn btns'>CANCEL</Link>
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <h2>Add New Task</h2>
  //     {message && <p style={{ color: 'red' }}>{message}</p>}
  //     <form onSubmit={handleSubmit}>
  //       <div>
  //         <label>Title</label>
  //         <input
  //           type="text"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label>Description</label>
  //         <textarea
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label>Due Date</label>
  //         <input
  //           type="date"
  //           value={dueDate}
  //           onChange={(e) => setDueDate(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label>Status</label>
  //         <select value={status} onChange={(e) => setStatus(e.target.value)}>
  //           <option value="To Do">To Do</option>
  //           <option value="In Progress">In Progress</option>
  //           <option value="Done">Done</option>
  //         </select>
  //       </div>
  //       <div>
  //         <label>Priority</label>
  //         <select value={priority} onChange={(e) => setPriority(e.target.value)}>
  //           <option value="High">High</option>
  //           <option value="Medium">Medium</option>
  //           <option value="Low">Low</option>
  //         </select>
  //       </div>
  //       <button type="submit">Add</button>
  //       <Link to="/dashboard">Cancel</Link>
  //     </form>
  //   </div>
  // );
}
