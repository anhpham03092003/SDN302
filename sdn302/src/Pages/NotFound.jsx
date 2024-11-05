import React from 'react';

function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>404 - Not Found</h1>
            <p>You are not logged in or not member of this group</p>
            <p>Go to <a href="/login/loginForm">Login</a> or <a href="/">Home</a></p>
        </div>
    );
}

export default NotFound;
