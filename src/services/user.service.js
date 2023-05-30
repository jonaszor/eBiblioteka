import axios from "axios";
import authHeader from "./auth-header";

const API_URL_USER = "https://userserviceforelib.azurewebsites.net/api/";

const getUsersList = () => {
  return axios.get(API_URL_USER + "User", { headers: authHeader() });
};

/*const saveUser = (token) =>{
    decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(response.data));
}*/

const UserService = {
  getUsersList,
};

export default UserService;
