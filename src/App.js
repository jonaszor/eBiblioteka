import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import bgImage from './bg.jpg';

import AuthService from "./services/auth.service";
import NavBarScroll from "./components/Navbar";

const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:3000/eBiblioteka`;

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <div style={{backgroundImage: `url("${PUBLIC_URL}/bg.jpg")`, minHeight: "100vh", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed", backgroundSize: "cover"}} >

      <NavBarScroll user={currentUser}/>

      <div className="container mt-3" >
        <Outlet/>
      </div>
    </div>
  );
};

export default App;
