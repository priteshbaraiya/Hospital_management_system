import React, { useState, useEffect, useMemo } from 'react';
import * as api from '../../api/api';
import DepartmentFormModal from '../components/DepartmentFormModal';
import { Pagination, Toast, ToastContainer } from 'react-bootstrap';
import './ManageDepartments.css';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch departments');
    }
    setLoading(false);
  };

  const handleSave = async (departmentData) => {
    try {
      if (selectedDepartment) {
        await api.updateDepartment(selectedDepartment._id, departmentData);
        setSuccess('Department updated successfully');
      } else {
        await api.createDepartment(departmentData);
        setSuccess('Department created successfully');
      }
      fetchDepartments();
      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save department');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.deleteDepartment(id);
        setSuccess('Department deleted successfully');
        fetchDepartments(); // Refetch to update list
      } catch (err) {
        console.error(err);
        setError('Failed to delete department');
      }
    }
  };

  const filteredAndSortedDepartments = useMemo(() => {
    let filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dept.description && dept.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filtered;
  }, [departments, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAndSortedDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAndSortedDepartments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading departments...</p>;

  return (
    <div className="manage-departments-container">
      <ToastContainer position="top-end" className="p-3 message-toast">
        {success && <Toast bg="success" onClose={() => setSuccess('')} show={!!success} delay={3000} autohide><Toast.Body className="text-white">{success}</Toast.Body></Toast>}
        {error && <Toast bg="danger" onClose={() => setError('')} show={!!error} delay={3000} autohide><Toast.Body className="text-white">{error}</Toast.Body></Toast>}
      </ToastContainer>

      <div className="page-header">
        <h2>Manage Departments</h2>
      </div>

      <div className="controls-container">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search by name or description..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <button className="btn btn-primary" onClick={() => { setSelectedDepartment(null); setIsModalOpen(true); }}>
          <i className="bi bi-plus-circle me-2"></i>Add New Department
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th onClick={() => requestSort('name')}>Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
              <th onClick={() => requestSort('description')}>Description {sortConfig.key === 'description' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : null}</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? currentItems.map(department => (
              <tr key={department._id}>
                <td>{department.name}</td>
                <td>{department.description}</td>
                <td className="text-center action-buttons">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => { setSelectedDepartment(department); setIsModalOpen(true); }}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(department._id)}>Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="text-center no-results">No departments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <Pagination>
            {[...Array(totalPages).keys()].map(number => (
              <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => paginate(number + 1)}>
                {number + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {isModalOpen && (
        <DepartmentFormModal 
          department={selectedDepartment} 
          onSave={handleSave} 
          onClose={() => { setIsModalOpen(false); setSelectedDepartment(null); }} 
        />
      )}
    </div>
  );
};

export default ManageDepartments;
