import { useLocation, useNavigate } from 'react-router-dom';
import "../css/studentSurvey.css";

function SurveySubmissions() {
    const location = useLocation();
    const navigate = useNavigate();
    const names = location.state?.names || [];

    return (
        <div className="survey-page">
            <div className="survey-wrapper" style={{ maxWidth: '800px' }}>
                <div className="survey-card">
                    <h2 className="survey-title">Survey Submissions</h2>
                    
                    <div className="results-layout">
                        <div className="names-column">
                            {names.length > 0 ? (
                                <ol className="student-list">
                                    {names.map((name, index) => (
                                        <li key={index} className="student-name-item">{name}</li>
                                    ))}
                                </ol>
                            ) : (
                                <p>No names to display. Please decrypt first.</p>
                            )}
                        </div>

                        <div className="stats-card">
                            <p>Submissions: <strong>{names.length}</strong></p>
                        </div>
                    </div>

                    <div className="survey-secondary-actions">
                        <button className="btn-secondary" onClick={() => navigate(-1)}>Back</button>
                        <button className="btn-secondary" onClick={() => navigate('/')}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SurveySubmissions;