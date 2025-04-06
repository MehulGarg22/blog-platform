import React from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from "../landingpage";
import Dashboard from "../dashboard/dashboard";
import Navbar from "../navbar/navbar";

export default function MyRoutes(){
    return(
        <div>
            <Navbar/>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard/>}/>
            </Routes>
        </div>
    );
}