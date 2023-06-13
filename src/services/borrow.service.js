import axios from "axios";
import authHeader from "./auth-header";

const API_URL_BORROW = "https://borrowingserviceforelib.azurewebsites.net/api";

const getBookedByUserId = (userId)=>{
    return axios.get(API_URL_BORROW + "/Booking/ForCustomer/"+userId,{headers: {...authHeader()} })
  }

  const getBorrowedByUserId = (userId)=>{
    return axios.get(API_URL_BORROW + "/Borrow/ByCustomer/"+userId,{headers: {...authHeader()} })
  }

const postToggleBookedStatus = (bookId, customerId, isBooking)=>{
    if (isBooking){
        return axios.post(API_URL_BORROW + "/Booking/" + bookId,{customerId: customerId}, {headers: {...authHeader()}})
    }
    else{
        return axios.post(API_URL_BORROW + "/Booking/UnBook/" + bookId,{customerId: customerId}, {headers: {...authHeader()}})
    }
}

const postToggleBorrowStatus = (bookId, customerId, isBorrowing)=>{
    if (isBorrowing){
        return axios.post(API_URL_BORROW + "/Borrow/" + bookId,{customerId: customerId}, {headers: {...authHeader()}})
    }
    else{
        return axios.post(API_URL_BORROW + "/Borrow/Return/" + bookId,{customerId: customerId}, {headers: {...authHeader()}})
    }
}

const BorrowService = {
    getBookedByUserId, 
    postToggleBookedStatus,
    getBorrowedByUserId,
    postToggleBorrowStatus
}

export default BorrowService;