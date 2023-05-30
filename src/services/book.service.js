import axios from "axios";
import authHeader from "./auth-header";

const API_URL_BOOK = "https://bookserviceforelib.azurewebsites.net/api";

const getPublicContent = () => {
  return axios.get(API_URL_BOOK + "/Author");
};

const getBooks = () => {
  return axios.get(API_URL_BOOK + "/Book");
};

const getBookbyId = (id) => {
  return axios.get(API_URL_BOOK + "/Book/"+id);
};

const editBookbyId = (id) => {
  return axios.patch(API_URL_BOOK + "/Book/"+id, { headers: authHeader() })
}

const getCategories = () => {
  return axios.get(API_URL_BOOK + "/Category");
};

const getTags = () => {
  return axios.get(API_URL_BOOK + "/Tag");
};

const postTag = (tagName)=>{
  return axios.post(API_URL_BOOK + "/Tag", tagName ,{headers: {...authHeader(), 'Content-Type': 'application/json'} })
}

const getAuthors = () => {
  return axios.get(API_URL_BOOK + "/Author");
};

const getUserBoard = () => {
  return axios.get(API_URL_BOOK + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL_BOOK + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL_BOOK + "admin", { headers: authHeader() });
};

/*const saveUser = (token) =>{
    decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(response.data));
}*/

const BookService = {
  getPublicContent,
  getBooks,
  getBookbyId,
  editBookbyId,
  getCategories,
  tags:{
    getTags,
    postTag,
  },
  getAuthors,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default BookService;
