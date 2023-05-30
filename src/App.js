import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import bgImage from './bg.jpg';

import AuthService from "./services/auth.service";
import Navbar from "./components/Navbar";

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div style={{backgroundImage: "url("+bgImage+")", minHeight: "100vh", backgroundRepeat: "repeat"}} >

      <Navbar user={currentUser}/>

      <div className="container mt-3" >
        <Outlet/>
      </div>
    </div>
  );
};

export default App;
