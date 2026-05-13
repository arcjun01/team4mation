import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import PurgeModal from "./PurgeModal";
import '../css/FormingGroups.css';
import Navbar from './Navbar';

const FormingGroups = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Receiving names from the previous page state, or we'll fetch from backend
    const [students, setStudents] = useState(location.state?.names || []);
    const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
    const [isPurging, setIsPurging] = useState(false);
    const [surveyConfig, setSurveyConfig] = useState(null);
    const [availabilityMap, setAvailabilityMap] = useState({});

    // Helper function to get availability for a student
    const getStudentAvailability = (student) => {
        if (!student || !student.id) {
            return [];
        }
        return availabilityMap[student.id] || [];
    };

    // Helper function to find shared availability between all group members
    const getSharedAvailability = (groupMembers) => {
        if (!groupMembers || groupMembers.length === 0) return [];

        // collect only members that have availability data
        const availabilityLists = groupMembers
            .map((m) => getStudentAvailability(m) || [])
            .filter((arr) => Array.isArray(arr) && arr.length > 0);

        if (availabilityLists.length === 0) return [];

        // compute intersection across all availability lists
        let shared = new Set(availabilityLists[0]);
        for (let i = 1; i < availabilityLists.length; i++) {
            const nextSet = new Set(availabilityLists[i]);
            shared = new Set([...shared].filter(x => nextSet.has(x)));
            if (shared.size === 0) return []; // early exit
        }

        return Array.from(shared).sort();
    };

    // Helper function to format consecutive times into ranges
    const formatAvailabilityRanges = (availabilityArray) => {
        if (!availabilityArray || availabilityArray.length === 0) return 'N/A';

        const timeToNumber = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return null;
            let hour = parseInt(match[1]);
            const period = match[2];
            if (period === 'AM') { if (hour === 12) hour = 0; }
            else { if (hour !== 12) hour += 12; }
            return hour;
        };

        const extractHourAndPeriod = (timeStr) => {
            const match = timeStr.match(/(\d+)\s+(AM|PM)/);
            if (!match) return { hour: null, period: null };
            return { hour: parseInt(match[1]), period: match[2] };
        };

        const parseSlot = (slot) => {
            const lastDashIndex = slot.lastIndexOf('-');
            const day = slot.substring(0, lastDashIndex).trim();
            const time = slot.substring(lastDashIndex + 1).trim();
            const hour = timeToNumber(time);
            return { day, time, hour };
        };

        const byDay = {};
        for (const slot of availabilityArray) {
            const parsed = parseSlot(slot);
            if (!byDay[parsed.day]) byDay[parsed.day] = [];
            byDay[parsed.day].push(parsed);
        }

        const results = [];
        const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (const day of dayOrder) {
            if (!byDay[day]) continue;
            const slots = byDay[day].sort((a, b) => a.hour - b.hour);
            const dayTimes = [];
            let rangeStart = slots[0];
            let rangeEnd = slots[0];

            for (let i = 1; i < slots.length; i++) {
                if (slots[i].hour === rangeEnd.hour + 1) {
                    rangeEnd = slots[i];
                } else {
                    if (rangeStart.hour === rangeEnd.hour) {
                        dayTimes.push(rangeStart.time);
                    } else {
                        const startHP = extractHourAndPeriod(rangeStart.time);
                        const endHP = extractHourAndPeriod(rangeEnd.time);
                        dayTimes.push(startHP.period === endHP.period
                            ? `${startHP.hour}-${endHP.hour} ${endHP.period}`
                            : `${startHP.hour} ${startHP.period}-${endHP.hour} ${endHP.period}`);
                    }
                    rangeStart = slots[i];
                    rangeEnd = slots[i];
                }
            }
            if (rangeStart.hour === rangeEnd.hour) {
                dayTimes.push(rangeStart.time);
            } else {
                const startHP = extractHourAndPeriod(rangeStart.time);
                const endHP = extractHourAndPeriod(rangeEnd.time);
                dayTimes.push(startHP.period === endHP.period
                    ? `${startHP.hour}-${endHP.hour} ${endHP.period}`
                    : `${startHP.hour} ${startHP.period}-${endHP.hour} ${endHP.period}`);
            }
            results.push(`${day}: ${dayTimes.join(', ')}.`);
        }
        return results.join('\n');
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/api/config/${id}`);
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setSurveyConfig(data);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching config:", error);
    //         }

    //         try {
    //             const submissionsResponse = await fetch(`/api/teams/${id}/submissions`);
    //             if (submissionsResponse.ok) {
    //                 const submissionsData = await submissionsResponse.json();

    //                 // START OF DECRYPTION FIX: Prioritize names from location.state
    //                 const passedStudents = location.state?.names || [];

    //                 if (submissionsData.students && submissionsData.students.length > 0) {
    //                     const builtStudents = submissionsData.students.map((student, idx) => {
    //                         // Find the decrypted name that matches this ID
    //                         const decryptedMatch = passedStudents.find(ps => ps.id === student.student_id);
    //                         return {
    //                             id: student.student_id,
    //                             name: decryptedMatch ? decryptedMatch.name : `Student ${idx + 1}`,
    //                             gender: student.gender || 'N/A',
    //                             gpa: student.gpa || 0,
    //                             availability: submissionsData.availabilityMap ? submissionsData.availabilityMap[student.student_id] : []
    //                         };
    //                     });
    //                     setStudents(builtStudents);
    //                 }

    //                 if (submissionsData.availabilityMap) {
    //                     setAvailabilityMap(submissionsData.availabilityMap);
    //                 }
    //                 return; 
    //             }

    //             // Fallback for teams endpoint
    //             const teamResponse = await fetch(`/api/teams/${id}`);
    //             if (teamResponse.ok) {
    //                 const teamData = await teamResponse.json();
    //                 if (teamData.availabilityMap) setAvailabilityMap(teamData.availabilityMap);

    //                 const passedStudents = location.state?.names || [];
    //                 if (passedStudents.length === 0 && teamData.studentCount > 0) {
    //                     const studentIds = Object.keys(teamData.availabilityMap || {});
    //                     const builtStudents = studentIds.map((id, idx) => ({
    //                         id: id,
    //                         name: `Student ${idx + 1}`,
    //                         gender: 'N/A',
    //                         gpa: 0,
    //                         availability: teamData.availabilityMap[id] || []
    //                     }));
    //                     setStudents(builtStudents);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };
    //     fetchData();
    // }, [id, location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch config
                const configResponse = await fetch(`/api/config/${id}`);
                if (configResponse.ok) {
                    setSurveyConfig(await configResponse.json());
                }

                // ✅ Call the grouper endpoint FIRST — this is what runs the algorithm
                const teamResponse = await fetch(`/api/teams/${id}`);
                if (!teamResponse.ok) throw new Error("Failed to fetch teams");

                const teamData = await teamResponse.json();
                const passedStudents = location.state?.names || [];

                if (teamData.availabilityMap) {
                    setAvailabilityMap(teamData.availabilityMap);
                }

                // teamData.teams is already grouped by the algorithm
                const namedGroups = teamData.teams.map((group, groupIdx) => ({
                    number: groupIdx + 1,
                    members: group.map((student, idx) => {
                        const sid = student.student_id;
                        const decrypted = passedStudents.find(p => p.id === sid);
                        return {
                            id: sid,
                            name: decrypted?.name || `Student ${idx + 1}`,
                            gender: student.gender || 'N/A',
                            gpa: student.gpa || 0,
                        };
                    })
                }));

                setGroupsState(namedGroups);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id, location.state]);

    const [groupsState, setGroupsState] = useState([]);

    // useEffect(() => {
    //     const buildGroups = () => {
    //         const out = [];
    //         for (let i = 0; i < students.length; i += 4) {
    //             out.push({
    //                 number: (i / 4) + 1,
    //                 members: students.slice(i, i + 4)
    //             });
    //         }
    //         setGroupsState(out);
    //     };
    //     buildGroups();
    // }, [students]);

    const handlePurge = async () => {
        setIsPurging(true);
        try {
            const response = await fetch(`/api/survey/purge/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setIsPurgeModalOpen(false);
                navigate(`/survey-submissions/${id}`, { state: { names: [] } });
            }
        } catch (error) {
            console.error("Purge Error:", error);
        } finally {
            setIsPurging(false);
        }
    };

    // DnD sensors
    const sensors = useSensors(useSensor(PointerSensor));

    const DraggableStudent = ({ student }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: `student-${student.id}` });
        const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
        return (
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="group-table-row draggable">
                <div className="group-table-cell">{student.name}</div>
                <div className="group-table-cell">{student.gender}</div>
                <div className="group-table-cell">{student.gpa ? student.gpa.toFixed(2) : 'N/A'}</div>
                <div className="group-table-cell" style={{ whiteSpace: 'pre-wrap' }}>{formatAvailabilityRanges(getStudentAvailability(student))}</div>
            </div>
        );
    };

    const DroppableGroup = ({ group, children }) => {
        const { isOver, setNodeRef } = useDroppable({ id: `group-${group.number}` });
        const overClass = isOver ? 'droppable--over' : '';
        return (
            <div ref={setNodeRef} className={`group-card droppable ${overClass}`} data-group-number={group.number}>
                {children}
            </div>
        );
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id; // e.g. student-123
        const overId = over.id; // e.g. group-2
        if (!activeId || !overId) return;
        if (!activeId.startsWith('student-') || !overId.startsWith('group-')) return;

        const studentId = activeId.replace('student-', '');
        const targetGroupNumber = parseInt(overId.replace('group-', ''), 10);

        setGroupsState((prev) => {
            const sourceIdx = prev.findIndex(g => g.members.some(m => String(m.id) === String(studentId)));
            const targetIdx = prev.findIndex(g => g.number === targetGroupNumber);
            if (sourceIdx === -1 || targetIdx === -1) return prev;
            const newGroups = prev.map(g => ({ ...g, members: [...g.members] }));
            const studentIdx = newGroups[sourceIdx].members.findIndex(m => String(m.id) === String(studentId));
            const [moved] = newGroups[sourceIdx].members.splice(studentIdx, 1);
            newGroups[targetIdx].members.push(moved);
            return newGroups;
        });
    };

    return (
        <div className="instructor-page-shell">
            <Navbar surveyId={id} />
            <div className="instructor-page-content">
                <div className="survey-page-wrapper">
                    <div className="main-container">
                        <div className="content-container">
                            <div className="question-container">
                                <h1>Forming Groups</h1>
                            </div>

                            {surveyConfig && (
                                <div className="question-container forming-groups-config-section">
                                    <div className="forming-groups-config-grid">
                                        <div className="forming-groups-config-box">
                                            <p className="forming-groups-config-label">Class Name</p>
                                            <p className="forming-groups-config-value">{surveyConfig.courseName || surveyConfig.course_name || 'N/A'}</p>
                                        </div>
                                        <div className="forming-groups-config-box">
                                            <p className="forming-groups-config-label">Total Submissions</p>
                                            <p className="forming-groups-config-value">{students.length}</p>
                                        </div>
                                        <div className="forming-groups-config-box">
                                            <p className="forming-groups-config-label">Group Size</p>
                                            <p className="forming-groups-config-value">
                                                {surveyConfig.limitType || surveyConfig.limit_type || 'N/A'}: {surveyConfig.team_limit || surveyConfig.maxSize || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="results-layout">
                                <div className="student-groups-container">
                                    <div className="forming-groups-grid">
                                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                            {groupsState.map((group) => (
                                                <DroppableGroup key={group.number} group={group}>
                                                    <div className="group-header"><span>Group #{group.number}</span></div>
                                                    <div className="group-body">
                                                        <div className="group-table-header">
                                                            <div className="group-table-cell">Name</div>
                                                            <div className="group-table-cell">Gender</div>
                                                            <div className="group-table-cell">GPA</div>
                                                            <div className="group-table-cell">Availability</div>
                                                        </div>
                                                        {group.members.map((student) => (
                                                            <DraggableStudent key={student.id} student={student} />
                                                        ))}
                                                    </div>
                                                    <div className="shared-availability-section">
                                                        <div className="shared-availability-label">Shared Availability:</div>
                                                        <div className="shared-availability-content">
                                                            {Object.keys(availabilityMap).length > 0
                                                                ? formatAvailabilityRanges(getSharedAvailability(group.members))
                                                                : 'N/A'}
                                                        </div>
                                                    </div>
                                                </DroppableGroup>
                                            ))}
                                        </DndContext>
                                    </div>
                                </div>

                                {/* SIDEBAR - All original inline styles preserved exactly */}
                                <div className="stats-card-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '100px', alignItems: 'center' }}>
                                    <button
                                        className="sidebar-btn"
                                        onClick={() => {
                                            const previewUrl = `/team4mation/student-view/teams/${id}`;
                                            if (groupsState && groupsState.length > 0) {
                                                const groupsForPreview = groupsState.map(g => ({
                                                    number: g.number,
                                                    members: g.members.map(m => ({ ...m, availability: getStudentAvailability(m) }))
                                                }));
                                                localStorage.setItem(`preview_data_${id}`, JSON.stringify({ groups: groupsForPreview }));
                                            } else {
                                                const previewStudents = students.map(s => ({ ...s, availability: getStudentAvailability(s) }));
                                                localStorage.setItem(`preview_data_${id}`, JSON.stringify({ students: previewStudents || [] }));
                                            }
                                            window.open(previewUrl, '_blank');
                                        }}
                                        style={{ padding: '12px', width: '100%' }}
                                    >
                                        <span className="icon">View 👁️</span>
                                    </button>

                                    <button
                                        className="sidebar-btn trash-btn"
                                        onClick={() => setIsPurgeModalOpen(true)}
                                        title="Purge Data"
                                        style={{ padding: '12px', width: '100%' }}
                                    >
                                        <span className="icon">Purge 🗑️</span>
                                    </button>
                                </div>
                            </div>

                            <div className="button-group forming-groups-button-tray">
                                <button className="button" onClick={() => navigate(-1)}>
                                    Back to Submissions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <PurgeModal
                    isOpen={isPurgeModalOpen}
                    onClose={() => setIsPurgeModalOpen(false)}
                    onConfirm={handlePurge}
                    isLoading={isPurging}
                />
            </div>
        </div>
    );
};

export default FormingGroups;
