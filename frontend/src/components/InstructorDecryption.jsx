import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';

function InstructorDecryption() {
    const [decryptionKey, setDecryptionKey] = useState("");
    const [isDecrypting, setIsDecrypting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDecrypt = async (e) => {
    e.preventDefault();
    setIsDecrypting(true);

    try {
        const response = await fetch('http://localhost:3001/api/survey/reveal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                decryptionKey, 
                surveyId: id 
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // SUCCESS: Pass the decrypted names and survey ID to the dashboard
            navigate(`/survey-submissions/${id}`, { 
                state: { 
                    names: data.names, 
                    id: id 
                } 
            });
        } else {
            alert(data.error || "Invalid Decryption Key");
        }
    } catch (error) {
        console.error("Decryption failed:", error);
        alert("Server error. Ensure backend is running on port 3001.");
    } finally {
        setIsDecrypting(false);
    }
};

    return (
        <>
            <Header variant="page" />
            <div className="survey-page">
            <div className="survey-wrapper">
                <form className="survey-card" onSubmit={handleDecrypt}>
                    <h2 className="survey-title">View Survey Submissions</h2>
                    
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <p className="gpa-info" style={{ color: '#666' }}>
                            To view survey submissions, please enter your decryption key:
                        </p>
                    </div>

                    <input 
                        type="password" 
                        className="full-name-input" 
                        placeholder="Enter 32-character key..."
                        value={decryptionKey}
                        onChange={(e) => setDecryptionKey(e.target.value)}
                        required
                    />

                    <div className="survey-actions" style={{ marginTop: '20px', display: 'flex'}}>
                        <button 
                            type="submit" 
                            className="survey-submit"
                            disabled={isDecrypting}
                            style={{ 
                                backgroundColor: isDecrypting ? '#ccc' : '#b2dfdb',
                                cursor: isDecrypting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isDecrypting ? "Checking..." : "Decrypt"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default InstructorDecryption;