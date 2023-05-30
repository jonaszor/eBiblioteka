import { Link, NavLink } from "react-router-dom"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavBar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import AuthService from "../services/auth.service"

export default function Navbar({user}){
    return(
        <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          E-Biblioteka v2
        </Link>
        <div className="navbar-nav mr-auto">

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

          {(user?.role == "admin") && ( 
            <li className="nav-item">
              <NavDropdown title="Admin" >
              <NavDropdown.Item>
                <NavLink style={{ textDecoration: 'none' }} to={"/admin"}>
                  Admin Board
                </NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <NavLink style={{ textDecoration: 'none' }} to={"/users"}>
                  Users list
                </NavLink>
              </NavDropdown.Item>
            </NavDropdown>
            </li>
          )}

          {user?.role && (
            <li className="nav-item">
              <NavLink to={"/user"} className="nav-link">
                User
              </NavLink>
            </li>
          )}
        </div>

        {user ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink to={"/profile"} className="nav-link">
                {user.email}
              </NavLink>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={AuthService.logout}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
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