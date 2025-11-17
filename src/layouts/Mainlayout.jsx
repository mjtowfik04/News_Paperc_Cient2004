import React from 'react';
import Navber from './Navber';
import { Outlet } from 'react-router';
import Footer from './Footer';

const Mainlayout = () => {
    return (
        <>
        <Navber/>
        <Outlet/>
        <Footer/>
            
        </>
    );
};

export default Mainlayout;