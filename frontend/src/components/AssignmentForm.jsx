import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AssignmentForm = ({ assignments, setAssignments, editingAssignment, setEditingAssignment }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ 
    title: '',
    description: '',
    course: '', 
    date: '',
    priority: '', });

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title,
        description: editingAssignment.description,
        course: editingAssignment.course,
        date: editingAssignment.date,
        priority: editingAssignment.priority,
        //deadline: editingAssignment.deadline,
      });
    } else {
      setFormData({ title: '', description: '', course: '', date: '', priority: ''});
    }
  }, [editingAssignment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        const response = await axiosInstance.put(`/api/assignments/${editingAssignment._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments(assignments.map((assignment) => (assignment._id === response.data._id ? response.data : assignment)));
      } else {
        const response = await axiosInstance.post('/api/assignments', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments([...assignments, response.data]);
      }
      setEditingAssignment(null);
      setFormData({ title: '', description: '', course: '', date: '', priority: ''});
    } catch (error) {
      alert('Failed to save assignment.');
    }
  };

 //            title,
 //           userID: req.user.id,
 //           description,
 //           course,
 //           date,
 //           priority,

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingAssignment ? 'Edit Assignment' : 'Create Assignment'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Course"
        value={formData.course}
        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
      </button>
    </form>
  );
};

export default AssignmentForm;
