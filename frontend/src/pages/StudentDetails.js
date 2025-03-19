import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/StudentDetails.css"; // student details sytle

function StudentDetails() {
    const { id } = useParams(); //Gets Id From Url
    const [student, setStudent] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [patient, setPatients] = useState({}); // Store patient names

    const navigate = useNavigate();

    useEffect(() => {
        // Get student details
        fetch(`http://localhost:8060/students/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
        })
        .then(response => {
            if (!response.ok){
                throw new Error("student not found");
            }
            return response.json()
        })
        .then(data => setStudent(data))
        .catch(error => {
            console.error(error);
            setStudent(null);
        });

        // Get tasks
        fetch(`http://localhost:8060/${id}/tasks/week`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(async (data) => {
        
            setTasks(data || []);
            //Get Paitent For Id
            const patient_Id  = [...new Set(data.flatMap(week => week.Days.flatMap(day => day.Tasks.map(task => task.patient_id))))];

            const patientData = {};
            await Promise.all(
                patient_Id .map(async (patientId) => {
                    try {
                        const response = await fetch(`http://localhost:8060/patients/${patientId}`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                                "Content-Type": "application/json",
                            },
                        });
                        if (response.ok) {
                            const holder = await response.json();
                            patientData[patientId] = holder.name;
                        }
                    } catch (error) {
                        console.error(`Error fetching patient ${patientId}:`, error);
                    }
                })
            );

            setPatients(patientData);
        })
        .catch(error => {
            console.error(error);
            setTasks([]);
        });
    }, [id]);

    if (!student)
    {
     
        return (
            <p>Patient loading, please wait</p>
        )
    }

    return (
        <div className="student-container">
            {/* Header */}
            <div className="student-header">
                <button onClick={() => navigate("/InstructorDashboard")} className="back-button">
                    ⬅ Back to Dashboard
                </button>
                <div className="student-name">{student.name}</div>
            </div>

            {/* Tasks*/}
            <div className="tasks-section">
                <h2>All Tasks</h2>
                {tasks.length > 0 ? (
                    tasks.map((week, windex) => {
                        const totalTasks = week.Days.reduce((acc, day) => acc + day.Tasks.length, 0);
                        const completedTasks = week.Days.reduce((acc, day) => acc + day.Tasks.filter(task => task.completed).length, 0);
                        const weeklyCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
                        
                        return (
                            <div key={windex} className="task-week">
                                <h3>Week {week.Week} - Completion Rate: {weeklyCompletionRate}%</h3>
                                {week.Days.map((day, dindex) => (
                                    <div key={dindex} className="task-day">
                                        <h4>Day {day.Day} - Completion Rate: {day.CompletionRate}%</h4>
                                        <ul className="task-list">
                                            {day.Tasks.map((task, tindex) => (
                                                <li key={tindex} className="task-item">
                                                    <span className="task-id">Task: {patient[task.patient_id] || "Unknown Patient"} - {task.task_type.replace(/_/g, " ")}</span>
                                                    <span className={`task-status-${task.completed ? "completed" : "incomplete"}`}>
                                                        {task.completed ? " Complete" : " Incomplete"}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                ) : (
                    <p>No tasks available</p>
                )}
            </div>
        </div>
    );
}

export default StudentDetails;
