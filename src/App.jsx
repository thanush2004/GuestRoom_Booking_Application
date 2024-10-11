import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate
import Home from './houseowner/Homepage';
import HouseOwner from './houseowner/HouseOwner';
import Login from './login/login';
import NotFound from './login/NotFound';
import Signup from './signup/signup';
import RoomManager from './houseowner/RoomManager';
import Customer from './customer/Customer'

const App = () => {
  const [roomsData, setRoomsData] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Redirect from root path to /login */}
        <Route path="/" element={<Home/>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<Home roomsData={roomsData} />} />
       
        <Route path="/houseowner" element={<HouseOwner/>} />
        <Route path="/customer" element={<Customer/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/RoomManager" element={<RoomManager />} />

        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
