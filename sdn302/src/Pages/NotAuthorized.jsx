import React from 'react';

function NotAuthorized() {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>403 - Not Authorized</h1>
            <p>You do not have permission to access this page.</p>
            <p>Back to <a href="/">Home</a></p>
        </div>
    );
}

export default NotAuthorized;
