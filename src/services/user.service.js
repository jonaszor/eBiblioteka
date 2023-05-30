import axios from "axios";
import authHeader from "./auth-header";

const API_URL_USER = "https://userserviceforelib.azurewebsites.net/api/";

const getUsersList = () => {
  return axios.get(API_URL_USER + "User", { headers: authHeader() });
};

const getUserProfileById = (id) => {
  console.log(id);
  return axios.get(API_URL_USER + `User/ById/${id}`, { headers: authHeader() });
};

/*const saveUser = (token) =>{
    decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(response.data));
}*/

const UserService = {
  getUsersList,
  getUserProfileById
};

export default UserService;
