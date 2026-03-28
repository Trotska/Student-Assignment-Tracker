import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
//import AssignmentForm from '../components/AssignmentForm';
import { useAuth } from '../context/AuthContext';
import { AssignmentListSection } from '../components/AssignmentListSection';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [setEditingAssignment] = useState(null);

  // Fetch assignments on component mount
  // Notes for liam, This runs when the component mounts and whenever the user changes (e.g., login/logout).
  // It fetches the assignments for the logged-in user and updates the state with the fetched data. If there's an error during fetching, it alerts the user.
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axiosInstance.get('/api/assignments', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setAssignments(response.data);
      } catch (error) {
        alert('Failed to fetch assignments.');
      }
    };

    fetchAssignments();
  }, [user]);

  return (
    
   
    
    <div className="container mx-auto p-6">

      <AssignmentListSection
      assignments={assignments}
      setAssignments={setAssignments}
      setAssignmentsEditing={setEditingAssignment}/>
    </div>
  );
};

export default Assignments;
