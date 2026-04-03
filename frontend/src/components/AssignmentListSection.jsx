import { useState } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import AssignmentCreate from "./AssignmentCreate";


///Bug Lists
//1. first assignment in the list isnt information within it fields
//2. Check mark box ticks when the assignment box is expanded, should only tick when the check mark box is clicked

//Possible Patches
//1. add reacts UseEffect to properly handle states
//2.

export const AssignmentListSection = ({ assignments = [], isLoading = false, setAssignments, setAssignmentsEditing }) => {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [/*checked*/, setChecked] = useState({});
  //const [editingDescriptionId, setEditingDescriptionId] = useState(null);
  //const [descriptionDrafts, setDescriptionDrafts] = useState({});
  //const [savingDescriptionId, setSavingDescriptionId] = useState(null);
  const [newAssignmentCreated, setNewAssignmentCreated] = useState(false);


  //assignment drafts states
  const [assignmentDrafts, setAssignmentDrafts] = useState({});
  const [savingAssignmentId, setSavingAssignmentId] = useState(null);
  

  const safeAssignments = Array.isArray(assignments) ? assignments : [];


  //#region Helper Functions
  const getCourseInitials = (course) => {
    if (!course || typeof course !== "string") return "N/A";
    return course.trim().slice(0, 3).toUpperCase();
  };

  const formatDateParts = (rawDate) => {
    const parsedDate = new Date(rawDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return { shortDate: "No date", year: "----", time: "--:--" };
    }

    const shortDate = parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const year = parsedDate.getFullYear().toString();
    const time = parsedDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });

    return { shortDate, year, time };
  };

  const handleRowClick = (id, assignment) => {
    setExpandedId((prev) => (prev === id ? null : id));

      assignmentDrafts[id] = {
        title: assignment?.title || "",
        description: assignment?.description || "",
        course: assignment?.course || "",
        date: assignment?.date || "",
        priority: assignment?.priority || "",
      };
      setAssignmentDrafts({ ...assignmentDrafts });

  };


  const handleCheck = (e, id) => {
    e.stopPropagation();
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleClose = (e, id) => {
    e.stopPropagation();
    setExpandedId(null);
  };
  //#endregion

  //#region Description Edit Handlers
  // const handleDescriptionClick = (e, assignment) => {
  //   e.stopPropagation();
  //   const rowId = assignment?._id || assignment?.id;
  //   if (!rowId) return;

  //   setEditingDescriptionId(rowId);
  //   setDescriptionDrafts((prev) => ({
  //     ...prev,
  //     [rowId]: assignment?.description || "",
  //   }));
  // };

  // const handleDescriptionDraftChange = (rowId, value) => {
  //   setDescriptionDrafts((prev) => ({
  //     ...prev,
  //     [rowId]: value,
  //   }));
  // };

  // const handleCancelDescriptionEdit = (e) => {
  //   e.stopPropagation();
  //   setEditingDescriptionId(null);
  // };

  // const handleSaveDescription = async (e, assignment) => {
  //   e.stopPropagation();

  //   const assignmentId = assignment?._id;
  //   if (!assignmentId) {
  //     alert("Cannot update assignment without a valid ID.");
  //     return;
  //   }

  //   if (!user?.token) {
  //     alert("Please log in again before saving changes.");
  //     return;
  //   }

  //   const newDescription = descriptionDrafts[assignmentId] ?? "";

  //   setSavingDescriptionId(assignmentId);
  //   try {
  //     const response = await axiosInstance.put(
  //       `/api/assignments/${assignmentId}`,
  //       { description: newDescription },
  //       { headers: { Authorization: `Bearer ${user.token}` } }
  //     );

  //     setAssignments((prev) =>
  //       prev.map((item) =>
  //         item._id === assignmentId ? response.data : item
  //       )
  //     );

  //     setEditingDescriptionId(null);
  //   } catch (error) {
  //     alert("Failed to save description.");
  //   } finally {
  //     setSavingDescriptionId(null);
  //   }
  // };
  //#endregion

  //#region Assignment Edit Handlers
  //Handles the create assignment button
 const handleCreateNewAssignmentButton = () => {
    if(setNewAssignmentCreated === true){
      setNewAssignmentCreated(false);
    } else {
      setNewAssignmentCreated(true);
    }
  };

  const handleAssignmentDraftChange = (rowId, assignment, value) => {

    setAssignmentDrafts((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [assignment]: value,
      },
    }));
  };

  const handleCancelAssignmentEdit = (e, rowId, originalAssignment) => {
    e.stopPropagation();
    setAssignmentDrafts((prev) => ({
      ...prev,
      [rowId]: {
        title: originalAssignment?.title || "",
        description: originalAssignment?.description || "",
        course: originalAssignment?.course || "",
        date: originalAssignment?.date || "",
        priority: originalAssignment?.priority || "",
      },
    }));
    setExpandedId(null);
  };

  //Saves the changes made to an assignment
  /**
   * Handles the save action for an assignment.
   * @param {*} e - The event object.
   * @param {*} assignment - The assignment object.
   * @param {*} rowId - The ID of the row being edited.
   * @returns {Promise<void>}
   */
  const handleSaveAssignment = async (e, assignment, rowId) => {
    e.stopPropagation();
    const assignmentId = assignment?._id;
    if (!assignmentId) {
      alert("Cannot update assignment without a valid ID.");
      return;
    }
    if (!user?.token) {
      alert("Please log in again before saving changes.");
      return;
    }
    const updatedData = assignmentDrafts[rowId] || {};

    setSavingAssignmentId(assignmentId);
    try {
      const response = await axiosInstance.put(
        `/api/assignments/${assignmentId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAssignments((prev) =>
        prev.map((item) =>
          item._id === assignmentId ? response.data : item
        )
      );
      setExpandedId(null);
    }
      catch (error) {
        alert("Failed to save assignment changes.");
      } finally {
        setSavingAssignmentId(null);
      }
  };

  const handleDeleteAssignment = async (e, assignmentId) => {
    e.stopPropagation();
    if (!assignmentId) {
      alert("Cannot delete assignment without a valid ID.");
      return;
    }
    if (!user?.token) {
      alert("Please log in again before deleting.");
      return;
    }
    try {
      await axiosInstance.delete(
        `/api/assignments/${assignmentId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setAssignments((prev) => prev.filter((item) => item._id !== assignmentId));
    }
    catch (error) {
      alert("Failed to delete assignment.");
    }
  };

  // const handleCreateNewAssignment = (assignment) => {
  //   setAssignmentsEditing({
  //     title: "",
  //     description: "",
  //     course: "",
  //     date: "",
  //     priority: "",
  //   });

  // };

  //#endregion

  //#region react renderer
  return (
    <div className="w-[1472px] h-[635px] items-end absolute top-[152px] left-[88px] bg-variable-collection-background-lightblue rounded-[28px] overflow-hidden flex flex-col">
      <div className="items-start gap-4 p-6 relative self-stretch w-full flex-[0_0_auto] flex flex-col">
        <div className="text-[length:var(--m3-headline-small-font-size)] leading-[var(--m3-headline-small-line-height)] relative self-stretch mt-[-1.00px] font-m3-headline-small font-[number:var(--m3-headline-small-font-weight)] text-[#1d1b20] tracking-[var(--m3-headline-small-letter-spacing)] [font-style:var(--m3-headline-small-font-style)]">
          Assignments
        </div>
      </div>

      {/*Assignment List*/}    
      <div className="items-stretch relative self-stretch w-full flex-[0_0_auto] flex flex-col">
        {isLoading && (
          <div className="px-6 py-4 text-[#49454f] text-sm">Loading assignments...</div>
        )}

        {!isLoading && safeAssignments.length === 0 && (
          <div className="px-6 py-4 text-[#49454f] text-sm">
            No assignments found yet. Create one from the form to see it here.
          </div>
        )}

        {safeAssignments.map((assignment, index) => {
          const rowId = assignment?._id || assignment?.id || index;
          const { shortDate, year, time } = formatDateParts(assignment?.date);

          return (
          <div key={rowId} className="self-stretch w-full">
            <div
              className="flex flex-col items-stretch justify-center relative self-stretch w-full cursor-pointer"
              style={{
                height:
                  index === 0 || index === 2 || index === 3 ? "57px" : "56px",
              }}
              onClick={() => handleRowClick(rowId, assignment)}
            >
              {index === 0 && (
                <div className="flex flex-col items-start justify-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mt-[-0.50px]">
                  <div className="relative self-stretch w-full h-px object-cover bg-[#cac4d0]" />
                </div>
              )}

              {index === 1 && (
                <div className="flex flex-col items-start justify-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mt-[-1.00px]">
                  <div className="relative self-stretch w-full h-px object-cover bg-[#cac4d0]" />
                </div>
              )}

              {(index === 2 || index === 3) && (
                <div className="flex flex-col items-start justify-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mt-[-0.50px]">
                  <div className="relative self-stretch w-full h-px object-cover bg-[#cac4d0]" />
                </div>
              )}

              <div className="absolute w-full h-full top-0 left-0" />
              {/*initials*/}              
              <div className="flex h-14 items-center gap-4 px-4 py-2 relative self-stretch w-full">
                <div className="inline-flex flex-col items-start flex-[0_0_auto] justify-center relative">
                  <div className="w-10 h-10 rounded-[100px] relative bg-variable-collection-button-blue overflow-hidden">
                    <div className="absolute top-[calc(50.00%_-_20px)] left-[calc(50.00%_-_20px)] w-10 h-10 flex items-center justify-center font-m3-title-medium font-[number:var(--m3-title-medium-font-weight)] text-[#4f378a] text-[length:var(--m3-title-medium-font-size)] text-center tracking-[var(--m3-title-medium-letter-spacing)] leading-[var(--m3-title-medium-line-height)] [font-style:var(--m3-title-medium-font-style)]">
                      {getCourseInitials(assignment?.course)}
                    </div>
                  </div>
                </div>

                {/*Code Change to Title */}
                <div className="flex flex-col items-start justify-center relative flex-1 self-stretch grow">
                  <div className="relative flex items-center self-stretch [font-family:'Roboto-Regular',Helvetica] font-normal text-[#1d1b20] text-base tracking-[0.50px] leading-6">
                    {/* onclick={handleRowClick} */}
                    {assignment?.title || "Untitled Assignment"}
                  </div>
                </div>


                {/*Date*/}               
                <div className="flex w-[204px] h-[34px] items-center justify-end gap-1.5 relative rounded-md">
                  <div className="flex w-[119px] h-[34px] items-center justify-center gap-[5px] px-[11px] py-1.5 relative ml-[-12.00px] bg-variable-collection-button-blue rounded-[100px]">
                    <div
                      // className={`relative w-fit mt-[-1.00px] ${assignment.dateMarginLeft} font-body-regular font-[number:var(--body-regular-font-weight)] text-black text-[length:var(--body-regular-font-size)] text-center tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] whitespace-nowrap [font-style:var(--body-regular-font-style)]`}
                    >
                      {shortDate}
                    </div>
                    <div
                      // className={`relative w-fit mt-[-1.00px] ${assignment.dateMarginRight} font-body-regular font-[number:var(--body-regular-font-weight)] text-black text-[length:var(--body-regular-font-size)] text-center tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] whitespace-nowrap [font-style:var(--body-regular-font-style)]`}
                    >
                      {year}
                    </div>
                  </div>
                    
                  {/*Time */}
                  <div className="flex w-[91px] h-[34px] items-start gap-2.5 px-[11px] py-1.5 relative bg-variable-collection-button-blue rounded-[100px]">
                    <div
                      // className={`${assignment.timeMarginRight} relative w-fit mt-[-1.00px] font-body-regular font-[number:var(--body-regular-font-weight)] text-black text-[length:var(--body-regular-font-size)] text-center tracking-[var(--body-regular-letter-spacing)] leading-[var(--body-regular-line-height)] whitespace-nowrap [font-style:var(--body-regular-font-style)]`}
                    >
                      {time}
                    </div>
                  </div>
                </div>

                {/*Prioritys */}
                <div className="inline-flex items-center gap-2.5 relative flex-[0_0_auto] mt-[-4.00px] mb-[-4.00px]">
                  <div className="inline-flex h-12 items-center justify-center gap-0.5 relative flex-[0_0_auto] rounded-[20px]">
                    <div
                      // className={`${assignment.priorityColorLeft} inline-flex flex-col h-10 items-center justify-center relative flex-[0_0_auto] rounded-[20px_4px_4px_20px] overflow-hidden`}
                    >
                      <div className="inline-flex items-center gap-2 pl-4 pr-3 py-2.5 relative flex-1 grow">
                        <div className="relative w-fit mt-[-1.00px] font-m3-label-large font-[number:var(--m3-label-large-font-weight)] text-variable-collection-text-color text-[length:var(--m3-label-large-font-size)] tracking-[var(--m3-label-large-letter-spacing)] leading-[var(--m3-label-large-line-height)] whitespace-nowrap [font-style:var(--m3-label-large-font-style)]">
                          {assignment?.priority || "Not set"}
                        </div>
                      </div>
                    </div>

                    <div
                      // className={`${assignment.priorityColorRight} flex flex-col w-12 h-10 items-center justify-center relative rounded-[4px_20px_20px_4px] overflow-hidden`}
                    >
                      <div className="flex items-center justify-center pl-3 pr-3.5 py-[9px] relative flex-1 self-stretch w-full grow">
                        {/* <Icon4 className="!relative !w-[22px] !h-[22px] !aspect-[1]" /> */}
                      </div>
                    </div>
                  </div>
                    
                {/*Delete button */}
                {/*may need to redesign css at some point*/}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteAssignment(e, assignment?._id)}
                    className="flex w-[93px] h-[43px] items-center justify-center rounded-lg bg-[#b3261e] text-white text-sm font-medium hover:bg-[#8f1f19] transition-colors"
                  >
                    Delete
                  </button>

                  {expandedId === rowId ? (
                    <div
                      className="inline-flex flex-col items-center justify-center pl-0 pr-1 py-1 relative flex-[0_0_auto] cursor-pointer"
                      onClick={(e) => handleClose(e, rowId)}
                    >
                      <div className="inline-flex items-center justify-center p-[11px] relative flex-[0_0_auto] rounded-[100px]">
                        <div className="relative w-[18px] h-[18px] bg-variable-collection-checkmark-blue rounded-sm flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L13 13M13 1L1 13"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="inline-flex flex-col items-center justify-center pl-0 pr-1 py-1 relative flex-[0_0_auto] cursor-pointer"
                      onClick={(e) => handleCheck(e, rowId)}
                    >
                      <div className="inline-flex items-center justify-center p-[11px] relative flex-[0_0_auto] rounded-[100px]">
                        <div className="relative w-[18px] h-[18px] bg-variable-collection-checkmark-blue rounded-sm" />
                        {/* <CheckSmall className="!absolute !top-[calc(50.00%_-_12px)] !left-[calc(50.00%_-_12px)] !w-6 !h-6" /> */}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {index === 1 && (
                <div className="flex flex-col items-start justify-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mb-[-1.00px]">
                  <div className="relative self-stretch w-full h-px object-cover bg-[#cac4d0]" />
                </div>
              )}

              {index === 2 && (
                <div className="flex flex-col items-start justify-center px-4 py-0 relative self-stretch w-full flex-[0_0_auto] mb-[-0.50px]">
                  <div className="relative self-stretch w-full h-px object-cover bg-[#cac4d0]" />
                </div>
              )}
            </div>
            
                        {/*expanded description */}
            {expandedId === rowId && (
              <div className="relative self-stretch w-full  flex-[0_0_auto] px-4 pb-4">
                <div className="w-full rounded-[16px] bg-variable-collection-button-blue p-6 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[#49454f]">Title</label>
                      <input
                        type="text"
                        value={assignmentDrafts[rowId]?.title ?? ""}
                        onChange={(e) => handleAssignmentDraftChange(rowId, "title", e.target.value)}
                        className="w-full rounded-md border border-[#9a8fae] bg-white px-3 py-2 text-sm text-[#1d1b20]"
                        placeholder="Assignment title"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[#49454f]">Course</label>
                      <input
                        type="text"
                        value={assignmentDrafts[rowId]?.course ?? ""}
                        onChange={(e) => handleAssignmentDraftChange(rowId, "course", e.target.value)}
                        className="w-full rounded-md border border-[#9a8fae] bg-white px-3 py-2 text-sm text-[#1d1b20]"
                        placeholder="Course code"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[#49454f]">Due Date</label>
                      <input
                        type="datetime-local"
                        value={assignmentDrafts[rowId]?.date ?? ""}
                        onChange={(e) => handleAssignmentDraftChange(rowId, "date", e.target.value)}
                        className="w-full rounded-md border border-[#9a8fae] bg-white px-3 py-2 text-sm text-[#1d1b20]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[#49454f]">Priority</label>
                      <input
                        type="text"
                        value={assignmentDrafts[rowId]?.priority ?? ""}
                        onChange={(e) => handleAssignmentDraftChange(rowId, "priority", e.target.value)}
                        className="w-full rounded-md border border-[#9a8fae] bg-white px-3 py-2 text-sm text-[#1d1b20]"
                        placeholder="Low, Medium, High"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1">
                    <label className="text-xs text-[#49454f]">Description</label>
                    <textarea
                      value={assignmentDrafts[rowId]?.description ?? ""}
                      onChange={(e) => handleAssignmentDraftChange(rowId, "description", e.target.value)}
                      className="w-full min-h-[120px] rounded-md border border-[#9a8fae] bg-white px-3 py-2 text-sm text-[#1d1b20]"
                      placeholder="Assignment details"
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleSaveAssignment(e, assignment, rowId)}
                      disabled={savingAssignmentId === assignment?._id}
                      className="rounded-md bg-[#4f378a] px-4 py-2 text-white text-sm disabled:opacity-60"
                    >
                      {savingAssignmentId === assignment?._id ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCancelAssignmentEdit(e, rowId, assignment)}
                      disabled={savingAssignmentId === assignment?._id}
                      className="rounded-md bg-[#d0c8dd] px-4 py-2 text-[#1d1b20] text-sm disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        );

        })}

      </div>

      {/*Create new assignment Button*/}
      <div className="flex items-start justify-start gap-2 pl-4 pr-6 py-5 relative self-stretch w-full flex-[0_0_auto]">
       {newAssignmentCreated ? (
       (<div className="" onClick={handleCreateNewAssignmentButton}>
        <div>
        <AssignmentCreate
        assignments={assignments}
        setAssignments={setAssignments}
        editingAssignment={setAssignmentsEditing}
        setEditingAssignment={setAssignmentsEditing}/>
        </div>
       </div>)
       
       ) : (
               (<div className="" onClick={handleCreateNewAssignmentButton}>

        Create New Assignment
       </div>)
        )}

      </div>  
      

      <div className="flex items-start justify-end gap-2 pl-4 pr-6 py-5 relative self-stretch w-full flex-[0_0_auto]" />
    </div>

    
  );
  // #endregion
};
