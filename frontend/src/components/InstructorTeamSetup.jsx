import React from 'react';
import '../css/InstructorSetup.css';

const InstructorTeamSetup = () => {
    
    const [formData, setFormData] = useState({
    classSize: '',
    minSize: '',
    maxSize: '',
    prevCourse: ''
    });

    // Will add the form's elements here later
    return (
    <div className="setup-container">
        <h1 className="setup-title">Team Setup</h1>
    </div>
    );
};
export default InstructorTeamSetup;