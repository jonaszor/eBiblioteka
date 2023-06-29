import axios from "axios";
import authHeader from "./auth-header";

import AuthService from "./auth.service";

const API_URL_USER = "https://newsservice.cytr.us/api/";

const getNewsList = () => {
  return axios.get(API_URL_USER + "News");
};

const getNewsById = (newsId) => {
  console.log("getbyid")
  return axios.get(API_URL_USER + `News/${newsId}`);
};

const postAddNews = (Content) => {
  return axios.post(API_URL_USER + `News`, JSON.stringify({"Content": Content}))
};

const putNews = (newsId, Content) => {
  return axios.put(API_URL_USER + `News/${newsId}`, JSON.stringify({"Content": Content}))
};

const deleteNews = (newsId) => {
  console.log("delete")
  return axios.delete(API_URL_USER + `News/${newsId}`)
};



/*const saveUser = (token) =>{
    decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(response.data));
}*/

const NewsService = {
  getNewsList,
  postAddNews,
  deleteNews,
  getNewsById,
  putNews
};

export default NewsService;

