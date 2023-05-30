import React from "react";
import AuthService from "../services/auth.service";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const currentUser = AuthService.getCurrentUser();
  AuthService.logout();
  window.location.reload(false);

  return (<Navigate to="/"/>);
};

export default Logout;
