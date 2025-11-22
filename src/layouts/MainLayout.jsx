import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16">
                <Outlet />
            </div>
        </div>
    );
};

export default MainLayout;
