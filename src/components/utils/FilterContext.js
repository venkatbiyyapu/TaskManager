import React, { createContext, useState, useContext } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [id,setId] = useState(localStorage.getItem('userId') || '')
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isAuth, setIsAuth] = useState(localStorage.getItem('isAuth') || false);
    const clearFilters = () => {
        setFilterStatus('');
        setFilterPriority('');
        setSortOrder(null);
    }

    return (
        <FilterContext.Provider
            value={
                {
                    filterStatus,
                    setFilterStatus,
                    filterPriority, 
                    setFilterPriority,
                    sortOrder, 
                    setSortOrder,
                    selectedTask,
                    setSelectedTask,
                    id,
                    setId,
                    isAuth,
                    setIsAuth,
                    clearFilters,
                }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => useContext(FilterContext);
