import {React} from "react";
import {createRoot} from "react-dom/client";
import { Route, Outlet, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider} from "react-router-dom";

import App from "./App";

import AuthService from "./services/auth.service";
import BookService from "./services/book.service";
import UserService from "./services/user.service";
import NewsService from "./services/news.service";

import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import Home from "./pages/Home";
import News from "./pages/News";
import NewsEdit from "./pages/NewsEdit";
import Profile from "./pages/Profile";
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
import User from "./pages/Users/User";
import fDataToJSON from "./services/formDataToJson";

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
        <Route path="/" 
          element={<Home/>} 
          loader={async () => (await NewsService.getNewsList()).data}
        />
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
          <Route path="books/add" 
            element={<BookEdit isAdd={true}/>} 
            //loader={async ({params}) => ((await BookService.getBookbyId(params.id)).data)}
            action={async ({request}) => {
              let data = await request.formData();
              console.log(fDataToJSON(data))
              return (await BookService.addBook(data)).data}}
          />
        </Route>
        <Route path="author" element={<Authors/>} 
          loader={async () => (await BookService.authors.getAuthors()).data}
        />
        <Route path="tag" element={<Tags/>}
          loader={async () => (await BookService.tags.getTags()).data}
        />
        <Route path="category" element={<Categories/>} 
          loader={async () => (await BookService.categories.getCategories()).data}
        />
        <Route element={<ProtectedRoute isAllowed={currentUser && currentUser.role == "admin"}/>}>
          <Route path="tag/edit" element={<Tags edit={true}/>}
            loader={async () => (await BookService.tags.getTags()).data}
          />
          <Route path="tag/delete/:id"
            action={async ({params}) => {
              return await BookService.tags.deleteTag(params.id)
            }}
          />
          <Route path="tag/add"
            action={async ({params, request}) => {
              let formData = await request.formData();
              return await BookService.tags.postTag(formData.get("tagName"))}}
          />

          <Route path="author/edit" element={<Authors edit={true}/>}
            loader={async () => (await BookService.authors.getAuthors()).data}
          />
          <Route path="author/delete/:id"
            action={async ({params}) => {
              return await BookService.authors.deleteAuthor(params.id)
            }}
          />
          <Route path="author/add"
            action={async ({params, request}) => {
              let formData = await request.formData();
              return await BookService.authors.postAuthor(formData.get("firstName"), formData.get("lastName"))}}
          />

          <Route path="category/edit" element={<Categories edit={true}/>}
            loader={async () => (await BookService.categories.getCategories()).data}
          />
          <Route path="category/delete/:id"
            action={async ({params}) => {
              return await BookService.categories.deleteCategories(params.id)
            }}
          />
          <Route path="category/add"
            action={async ({params, request}) => {
              let formData = await request.formData();
              return await BookService.categories.postCategories(formData.get("categoryName"))}}
          />
        </Route>
        <Route path="login" element={<Login/>} />
        <Route path="register" element={<Register/>} />
        <Route element={<ProtectedRoute isAllowed={!!currentUser}/>}>
          <Route path="profile" element={<Profile/>} />
          <Route path="logout" element={ <Logout/> }/>
          <Route path="user/profile" 
            element={<User/>} 
            loader={async () => ((await UserService.getUserProfie()).data)}/>
          <Route path="user/:id/profile" 
            element={<User/>} 
            loader={async ({params}) => ((await UserService.getUserProfileById(params.id)).data)}/>
          <Route path="users" 
            element={<Users/>} 
            loader={async () => ((await UserService.getUsersList()).data)}/>
        </Route>
        <Route element={<ProtectedRoute isAllowed={currentUser  && (currentUser.role == "employee" || currentUser.role == "admin")}/>}>
          <Route path="mod" element={<BoardModerator/>} />
          <Route path="news/add" element={<News/>} />
          <Route path="news/:id" 
            element={<NewsEdit/>} 
            loader={async ({params}) => {
              return (await NewsService.getNewsById(params.id)).data
            }}
          />
        </Route>
        <Route element={<ProtectedRoute isAllowed={currentUser && currentUser.role == "admin"}/>}>
          <Route path="admin" element={<BoardAdmin/>} />
        </Route>
      </Route>
  ),{
    //basename: "/eBiblioteka",
  }
)

root.render(
  <RouterProvider router={router}/>
);
//serviceWorker.unregister();
