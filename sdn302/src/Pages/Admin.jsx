import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

function Admin() {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
