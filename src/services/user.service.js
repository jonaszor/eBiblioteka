import axios from "axios";
import authHeader from "./auth-header";

import AuthService from "./auth.service";

const API_URL_USER = "https://userserviceforelib.azurewebsites.net/api/";

const getUsersList = () => {
  return axios.get(API_URL_USER + "User", { headers: authHeader() });
};

const getUserProfileById = (id) => {
  console.log(id);
  return axios.get(API_URL_USER + `User/ById/${id}`, { headers: authHeader() });
};

const getUserProfie = () => {
  const currentUser = AuthService.getCurrentUser();
  return axios.get(API_URL_USER + `User/ById/${currentUser.id}`, { headers: authHeader() });
};

const postUsertoggleBlock = (userid, isBlocked) => {
  if(isBlocked)
    return axios.post(API_URL_USER + `User/${userid}/UnBlock`,{},{headers: authHeader()})
  return axios.post(API_URL_USER + `User/${userid}/Block`,{},{headers: authHeader()})
};

const postUsertoggleWatchlist = (bookid, isAdding) => {
  if(isAdding)
    return axios.post(API_URL_USER + `User/AddToWatchList/${bookid}`,{},{headers: authHeader()})
  return axios.delete(API_URL_USER + `User/RemoveFromWatchList/${bookid}`,{headers: authHeader()})
};



/*const saveUser = (token) =>{
    decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(response.data));
}*/

const UserService = {
  getUsersList,
  getUserProfileById,
  getUserProfie,
  postUsertoggleBlock,
  postUsertoggleWatchlist
};

export default UserService;
