import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const AssignmentCreate = ({ assignments, setAssignments }) => {
  const { user } = useAuth();
  const [newAssignmentCreated, setNewAssignmentCreated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    date: "",
    priority: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert("Please log in before creating assignments.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/assignments", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setAssignments((prev) => [...prev, response.data]);
      setFormData({
        title: "",
        description: "",
        course: "",
        date: "",
        priority: "",
      });
      setNewAssignmentCreated(true);
      setTimeout(() => setNewAssignmentCreated(false), 2500);
    } catch (error) {
      alert("Failed to create assignment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
            (<div
              className="flex flex-col items-stretch justify-center relative self-stretch w-full cursor-pointer"
              style={{
                height:
                   "57px"
              }}/>)
       
  );
};

export default AssignmentCreate;