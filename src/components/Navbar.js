import { Link, NavLink } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavBar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AuthService from "../services/auth.service"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function Navbar({user}){
    return(
        <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand ms-3">
          E-Biblioteka
        </Link>
        <div className="navbar-nav me-auto">

          <li className="nav-item">
            <NavLink to={"/books"} className="nav-link">
              Books
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={"/author"} className="nav-link">
              Authors
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={"/tag"} className="nav-link">
              Tags
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to={"/category"} className="nav-link">
              Categories
            </NavLink>
          </li>

          {(user?.role == "employee") && ( //Przykładowo
            <li className="nav-item">
              <NavLink to={"/mod"} className="nav-link">
                Moderator Board
              </NavLink>
            </li>
          )}

          {user && (
            <li className="nav-item">
              <NavLink to={"/users"} className="nav-link">
                Users
              </NavLink>
            </li>
          )}
        </div>

        {user ? (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to={`/user/${user.id}/profile`} className="nav-link">
                {user.email}
              </NavLink>
            </li>
            <li className="nav-item">
            <NavLink to={"/logout"} className="nav-link">
                Logout
              </NavLink>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to={"/login"} className="nav-link">
                Login
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to={"/register"} className="nav-link">
                Sign Up
              </NavLink>
            </li>
          </div>
        )}
      </nav>
    )
}