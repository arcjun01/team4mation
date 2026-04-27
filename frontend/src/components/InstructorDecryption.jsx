import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/InstructorDecryption.css';
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
        const response = await fetch('/api/survey/reveal', {
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
                    userKey: decryptionKey, 
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
            <Header variant="large" />
            <div className="decryption-page">
            <div className="decryption-wrapper top-gap-large">
                <div className='question-container '><h1>View Survey Submissions</h1></div>
                
                <form className="decryption-card" onSubmit={handleDecrypt}>
                    <div className="decryption-info-section">
                        <p className="decryption-info">
                            To view survey submissions, please enter your decryption key:
                        </p>
                    </div>

                    <input 
                        type="password" 
                        className="decryption-input" 
                        placeholder="Enter 32-character key..."
                        value={decryptionKey}
                        onChange={(e) => setDecryptionKey(e.target.value)}
                        required
                    />
                </form>

                <div className='decryption-button-group'>
                    <button 
                        type="button" 
                        className="button"
                        onClick={() => navigate(-1)}
                        >
                        Back to Submissions
                    </button>

                    <button 
                        type="submit" 
                        className="button"
                        disabled={isDecrypting}
                        onClick={handleDecrypt}
                    >
                        {isDecrypting ? "Checking..." : "Decrypt"}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}

export default InstructorDecryption;