import {React, StrictMode} from "react";
import {createRoot} from "react-dom/client";
import { Routes, Route,  Link, Outlet, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider, redirect } from "react-router-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import AuthService from "./services/auth.service";
import BookService from "./services/book.service";
import UserService from "./services/user.service";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BoardUser from "./pages/BoardUser";
import BoardModerator from "./pages/BoardModerator";
import BoardAdmin from "./pages/BoardAdmin";

import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Tags from "./pages/Tags";
import Categories from "./pages/Categories";
import BookPage from "./pages/BookPage";
import BookEdit from "./pages/BookEdit";
import ErrorPage from "./pages/ErrorPage";

import Users from "./pages/Users/Users";

const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/',
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

const currentUser = AuthService.getCurrentUser();

const root = createRoot(document.getElementById("root"));

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route element={<App/>} errorElement={<ErrorPage/>}>
        <Route path="/" element={<Home/>} />
        <Route path="books" 
          element={<Books/>} 
          loader={async () => (await BookService.getBooks()).data}
        />
        <Route path="books/:id" 
          element={<BookPage/>} 
          loader={async ({params}) => ((await BookService.getBookbyId(params.id)).data)}
        />
        <Route element={<ProtectedRoute isAllowed={currentUser && currentUser.role == "admin"}/>}>
          <Route path="books/:id/edit" 
            element={<BookEdit/>} 
            loader={async ({params}) => ((await BookService.getBookbyId(params.id)).data)}
            action={async ({params}) => ((await BookService.editBookbyId(params.id)).data)}
          />
        </Route>
        <Route path="author" element={<Authors/>} />
        <Route path="tag" element={<Tags/>}
          loader={async () => (await BookService.tags.getTags()).data}
          action={async (data) => console.log(data)}
        />
        <Route element={<ProtectedRoute isAllowed={currentUser && currentUser.role == "admin"}/>}>
          <Route path="tag/edit" element={<Tags edit={true}/>}
            loader={async () => (await BookService.tags.getTags()).data}
            action={async ({params, request}) => {
              let formData = await request.formData();
              return await BookService.tags.postTag(formData.get("tagName"))}}
          />
          <Route path="tag/delete"
            action={async (data) => console.log(data)}
          />
        </Route>
        <Route path="category" element={<Categories/>} />
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route element={<ProtectedRoute isAllowed={!!currentUser}/>}>
          <Route path="profile" element={<Profile/>} />
          <Route path="user/:id/profile" 
            element={<BoardUser/>} 
            loader={async (id) => ((await UserService.getUserProfileById(id)).data)}/>
          <Route path="users" 
            element={<Users/>} 
            loader={async () => ((await UserService.getUsersList()).data)}/>
        </Route>
        <Route element={<ProtectedRoute isAllowed={currentUser  && (currentUser.role == "employee" || currentUser.role == "admin")}/>}>
          <Route path="mod" element={<BoardModerator/>} />
        </Route>
        <Route element={<ProtectedRoute isAllowed={currentUser && currentUser.role == "admin"}/>}>
          <Route path="admin" element={<BoardAdmin/>} />
        </Route>
      </Route>
  ),{
    basename: "/eBiblioteka",
  }
)

root.render(
  <RouterProvider router={router}/>
);
serviceWorker.unregister();
