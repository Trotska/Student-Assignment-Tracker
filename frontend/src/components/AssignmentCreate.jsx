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

  const initials = (formData.course || formData.title || "NEW")
    .trim()
    .slice(0, 3)
    .toUpperCase();

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-[16px] border border-[#b4bfca] bg-variable-collection-background-lightblue p-3"
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[56px_minmax(180px,1fr)_140px_110px_140px_minmax(490px,1fr)_90px] lg:items-center">
        <div className="h-10 w-10 rounded-full bg-variable-collection-button-blue text-[#4f378a] font-medium flex items-center justify-center">
          {initials || "NEW"}
        </div>

        <input
          name="title"
          type="text"
          placeholder="Assignment title"
          value={formData.title}
          onChange={handleChange}
          className="h-10 rounded-md border border-[#b4bfca] bg-white px-3 text-sm"
          required
        />

        <input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="h-10 rounded-full border border-[#b4bfca] bg-white px-4 text-sm"
          required
        />

        <input
          name="course"
          type="text"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          className="h-10 rounded-full border border-[#b4bfca] bg-white px-4 text-sm"
        />

        <input
          name="priority"
          type="text"
          placeholder="Priority"
          value={formData.priority}
          onChange={handleChange}
          className="h-10 rounded-md border border-[#b4bfca] bg-white px-3 text-sm"
          required
        />

        <input
          name="description"
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="h-10 rounded-md border border-[#b4bfca] bg-white px-3 text-sm"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-md bg-variable-collection-checkmark-blue px-3 text-white text-sm disabled:opacity-60"
        >
          {isSubmitting ? "Saving" : "Save"}
        </button>
      </div>

      {newAssignmentCreated && (
        <p className="mt-2 text-xs text-[#2e7d32]">Assignment created successfully.</p>
      )}
    </form>
  );
};

export default AssignmentCreate;