import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AssignmentList = ({ assignments, setAssignments, setEditingAssignment }) => {
  const { user } = useAuth();

  const handleDelete = async (assignmentId) => {
    try {
      await axiosInstance.delete(`/api/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setAssignments(assignments.filter((assignment) => assignment._id !== assignmentId));
    } catch (error) {
      alert('Failed to delete assignment.');
    }
  };

  return (
    <div>
      {assignments.map((assignment) => (
        <div key={assignment._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{assignment.title}</h2>
          <p>{assignment.description}</p>
          <p>Course: {assignment.course}</p>
          <p>Date: {new Date(assignment.date).toLocaleDateString()}</p>
          <p>Priority: {assignment.priority}</p>
          {/* <p className="text-sm text-gray-500">Deadline: {new Date(assignment.deadline).toLocaleDateString()}</p> */}
          <div className="mt-2">
            <button
              onClick={() => setEditingAssignment(assignment)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(assignment._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignmentList;
