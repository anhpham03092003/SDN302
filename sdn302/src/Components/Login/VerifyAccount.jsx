import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function VerifyAccount() {
    const { id, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/authentication/verify/${id}/${token}`);
                alert(response.data.message);
                navigate('/login');
            } catch (error) {
                console.error("Verification error:", error);
                alert("Verification failed. Please try again.");
            }
        };

        verifyAccount();
    }, [id, token, navigate]);

    return (
        <div>
            <h1>Verifying your account...</h1>
        </div>
    );
}

export default VerifyAccount;
