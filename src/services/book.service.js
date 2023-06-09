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

const editBookbyId = (id, data) => {
  return axios.patch(API_URL_BOOK + "/Book/"+id, data, { headers: authHeader() })
}

const addBook = (data) =>{
  return axios.post(API_URL_BOOK + "/Book", data, {headers: {...authHeader(), 'Content-Type': 'application/json'} })
}

const getCategories = () => {
  return axios.get(API_URL_BOOK + "/Category");
};

const postCategories = (categoryName)=>{
  return axios.post(API_URL_BOOK + "/Category", categoryName ,{headers: {...authHeader(), 'Content-Type': 'application/json'} })
}

const deleteCategories = (categoryId)=>{
  return axios.delete(API_URL_BOOK + "/Category/"+categoryId,{headers: {...authHeader()} })
}

const getTags = () => {
  return axios.get(API_URL_BOOK + "/Tag");
};

const postTag = (tagName)=>{
  return axios.post(API_URL_BOOK + "/Tag", tagName ,{headers: {...authHeader(), 'Content-Type': 'application/json'} })
}

const deleteTag = (tagId)=>{
  return axios.delete(API_URL_BOOK + "/Tag/"+tagId,{headers: {...authHeader()} })
}

const bookUpdateTagsById = (bookId, tagObject) => {
   return axios.delete(API_URL_BOOK + "/Book/"+ bookId +"/RemoveTags", {headers: {...authHeader()}, data: tagObject.oldTags})
   .then(axios.post(API_URL_BOOK + "/Book/"+ bookId +"/AddToTags", tagObject.newTags, {headers: {...authHeader()} }))
   .then(axios.delete(API_URL_BOOK + "/Book/"+ bookId +"/RemoveCategories", {headers: {...authHeader()}, data: tagObject.oldCategories}))
   .then(axios.post(API_URL_BOOK + "/Book/"+ bookId +"/AddToCategories", tagObject.newCategories, {headers: {...authHeader()} }))
   .then(axios.delete(API_URL_BOOK + "/Book/"+ bookId +"/RemoveAuthors", {headers: {...authHeader()}, data: tagObject.oldAuthors}))
   .then(axios.post(API_URL_BOOK + "/Book/"+ bookId +"/AddAuthors", tagObject.newAuthors, {headers: {...authHeader()} }))
}

const getAuthors = () => {
  return axios.get(API_URL_BOOK + "/Author");
};

const postAuthor = (firstName, lastName)=>{
  return axios.post(API_URL_BOOK + "/Author", {firstName, lastName} ,{headers: {...authHeader(), 'Content-Type': 'application/json'} })
}

const deleteAuthor = (authorId)=>{
  return axios.delete(API_URL_BOOK + "/Author/"+authorId,{headers: {...authHeader()} })
}

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
  addBook,
  bookUpdateTagsById,
  categories:{
    getCategories,
    postCategories,
    deleteCategories
  },
  tags:{
    getTags,
    postTag,
    deleteTag
  },
  authors:{
    getAuthors,
    postAuthor,
    deleteAuthor
  },
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default BookService;
