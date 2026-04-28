import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import '../css/FormingGroups.css';

const ViewFormedTeams = () => {
    const { id } = useParams();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    return (
        <>
            <Header variant="page" />
            <div className="survey-page-wrapper top-gap">
                <div className="main-container">
                    <div className="content-container">
                        <div className="question-container" style={{ textAlign: 'center' }}>
                            <h1>Formed Teams Preview</h1>
                        </div>
                        {/* Cards will go here */}
                        <div className="button-tray" style={{ justifyContent: 'center', marginTop: '30px' }}>
                            <button className="button" onClick={() => window.close()}>
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewFormedTeams;