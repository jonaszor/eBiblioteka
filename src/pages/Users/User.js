import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack, Form, Modal } from "react-bootstrap";

import BorrowService from "../../services/borrow.service";
import { Link, useLoaderData } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm} from "react-hook-form";

import useUser from "../../services/useUser";
import UserService from "../../services/user.service";
import Select from 'react-select'
import BookService from "../../services/book.service";


const User = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();
  const [isAccountBlocked, setisAccountBlocked] = useState(false);
  const [getWatchList, setWatchList] = useState([]);
  const [getReviews, setReviews] = useState([]);
  const [getDebt, setDebt] = useState([]);

  console.log(content)

  useEffect(() => {
    setisAccountBlocked(content.isAccountBlocked);
    setWatchList(content.watchList);
    setReviews(content.reviews);
    setDebt(content.amountToPay)
    console.log(getReviews);
  },[currentUser, content])

  async function handleClickBlockAcc (){
    await UserService.postUsertoggleBlock(content.id, isAccountBlocked);
    setisAccountBlocked(!isAccountBlocked);
  }

  async function handleRemoveFromWL(event){
    let id = event.target.id;
    let response = (await UserService.postUsertoggleWatchlist(id, false)).data;
    const newWatchList = getWatchList.filter((book) => book.id != id);
    setWatchList(newWatchList);
  }

  async function handleRemoveReview(event){
    let id = event.target.id;
    console.log(id, content.id)
    let response = (await UserService.deleteReview(id, content.id)).data;
    const newReviewsList = getReviews.filter((review) => review.bookId != id);
    setReviews(newReviewsList);
  }

  async function handleDebtPay(){
    let debtRep = document.getElementById('debt-rep').value
    try{
      let response = (await UserService.postPay(content.id, debtRep)).data;
      const newDebt = (getDebt - debtRep <= 0 ? 0 : getDebt - debtRep)
      setDebt(newDebt);
    }catch(error){

    }
  }

  function WatchList(){
    return(
      getWatchList && getWatchList.length != 0 && getWatchList.map((book) => 
        <Col xs={6} md={6} className="p-1" key={book.id} >
          <Row>
            <Col md={2} xs={3} className="mx-auto text-align: center; ">
              <Link to={`/books/${book.id}`} className="text-decoration-none" >
                <Image src={book.imageUrl} fluid className="mh-100 mx-auto"/>
              </Link>
            </Col>
            <Col fluid={"true"} md={9} xs={6} className="mx-auto">
              <Link to={`/books/${book.id}`} >
                <h4 className="mt-2 text-decoration-none text-dark" >{book.title}</h4>
              </Link>
              {(content.id === currentUser.id ) && <Button className="btn-danger" id={book.id} onClick={handleRemoveFromWL}><i className="fa-solid fa-xmark"></i> Remove from WL</Button>}
            </Col>  
          </Row>
        </Col>
    ))
  }

  function ReviewsList(){
    return(
      getReviews && getReviews.length != 0 && getReviews.map((review) => 
        <Col xs={6} md={6} className="p-1" key={review.id}>
          <Row>
            <Col md={1} xs={1}></Col>
            <Col fluid={"true"} md={7} xs={7} className="mx-auto align-middle">
              <p className="m-0 align-middle" style={{borderBottom: "1px solid black"}}><em className="align-middle">{review.content}</em></p>
            </Col>
            {(content.id === currentUser.id || currentUser.role === 'admin' ) && 
            <Col md={1} xs={1}>
              <Button className="mx-auto btn-danger" id={review.bookId} onClick={handleRemoveReview}><i className="fa-solid fa-xmark"></i></Button>
            </Col>
            }
            <Col md={3} xs={3} fluid>
              <Link to={`/books/${review.bookId}`}><Button className="mx-auto btn-info">Show <i className="fa-solid fa-eye"></i></Button></Link>
            </Col>
          </Row>
        </Col>
    ))
  }

  function BorrowConfirmationWindow({show, onClose}){

    const [suggestions, setSuggestions] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(()=>{
      async function fetchSuggestions(){
        let books = (await BookService.getBooks()).data
        //console.log(books)
        return books
      }

      fetchSuggestions().then((data) =>{
        setSuggestions(data.map(book => ({
            value: book.id,
            label: book.id+": "+book.title
        })))
      })
    },[show])

    function onConfirm(){
      BorrowService.postToggleBorrowStatus(selected, content.id, true).then(
        (success) =>{
          alert("Book was added to borrowed")
          onClose()
        },
        (failure) =>{
          alert("Book could not be borrowed: "+failure.response.data)
        }
      )
    }

    return(
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Row className="p-1 text-center">Select book to add:</Row>
          <Row>
            <Select options={suggestions} isClearable isSearchable
              onChange={(choice)=>setSelected(choice?.value)}
            />
          </Row>
        </Col>
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onConfirm} disabled={(!selected)}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal> 
    )
  }

  function BorrowList(){

    const [getBorrowed, setBorrowed] = useState([]);

    const [confirmation, setConfirmation] = useState({show: false})

    useEffect(()=>{  
      async function fetchBorrowed(){
        let borrowedEntries = (await BorrowService.getBorrowedByUserId(content.id)).data
        //console.log(bookedEntries)
        return borrowedEntries
      }
  
        fetchBorrowed().then((entries) => {
          let activeBorrowed = entries.filter(entry => (entry.returnedDate == null))
          console.log(activeBorrowed)
          setBorrowed(activeBorrowed)
        })
    },[content, confirmation])

    async function handleRemoveFromBorrowed(bookId, borrowId){
      console.log("handling it")
      try{
        let response = (await BorrowService.postToggleBorrowStatus(bookId, content.id, false)).data;
        setBorrowed(getBorrowed.filter(el => el.id !== borrowId))
      }catch(error){
  
      }
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return(
      <>
      <BorrowConfirmationWindow {...confirmation} onClose={() => setConfirmation({...confirmation, show: false})}/>
      {currentUser.role === "admin" &&
      <Row>
        <Button variant="success" className="w-auto ms-auto" onClick={() => setConfirmation({show:true})}>+ Add book</Button> 
      </Row>
      }
      
      {(getBorrowed.length > 0) && getBorrowed.map((borrow) => 
        <Col xs={6} md={6} className="p-1" key={borrow.id} >
          <Row>
            <Col md={2} xs={3} className="mx-auto text-align: center; ">
              <Link to={`/books/${borrow.bookBasicinfo.id}`} className="text-decoration-none" >
                <Image src={borrow.bookBasicinfo.imageUrl} fluid className="mh-100 mx-auto"/>
              </Link>
            </Col>
            <Col fluid={"true"} md={9} xs={6} className="mx-auto">
              <Link to={`/books/${borrow.bookBasicinfo.id}`} >
                <h4 className="mt-2 text-decoration-none text-dark" >{borrow.bookBasicinfo.title}</h4>
              </Link>
              <p><b>Data wypożyczenia: </b>{new Date(borrow.borrowedDate).toLocaleDateString('pl-PL', options)}</p>
              {borrow.returnedDate && <p><b>Data oddania: </b>{new Date(borrow.returnedDate).toLocaleDateString('pl-PL', options)}</p>}
              {(currentUser.role == "admin") && 
                <Button className="btn-info" id={borrow.bookBasicinfo.id} onClick={() => handleRemoveFromBorrowed(borrow.bookBasicinfo.id, borrow.id)}><i className="fa-solid fa-xmark"></i> Return</Button>
              }
            </Col>  
          </Row>
        </Col>
    )}</>)

  }

  function ReservedList(){

    const [getReserved, setReserved] = useState([]);

    useEffect(()=>{
      async function fetchBooked(){
        let bookedEntries = (await BorrowService.getBookedByUserId(content.id)).data
        console.log(bookedEntries)
        return bookedEntries
      }
      if(getReserved == []){
        fetchBooked().then((entries) => {
          let activeBooking = entries.filter(entry => (entry.isActive))
          console.log(activeBooking)
          setReserved(activeBooking)
        })
      }
      
    },[content])

    async function handleRemoveFromBooked(bookId, bookingId){
      console.log("handling it")
      try{
        let response = (await BorrowService.postToggleBookedStatus(bookId, content.id, false)).data;
        setReserved(getReserved.filter(el => el.id !== bookingId))
      }catch(error){
  
      }
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    return(
      (getReserved.length > 0) && getReserved.map((booking) => 
        <Col xs={6} md={6} className="p-1" key={booking.id} >
          <Row>
            <Col md={2} xs={3} className="mx-auto text-align: center; ">
              <Link to={`/books/${booking.bookBasicinfo.id}`} className="text-decoration-none" >
                <Image src={booking.bookBasicinfo.imageUrl} fluid className="mh-100 mx-auto"/>
              </Link>
            </Col>
            <Col fluid={"true"} md={9} xs={6} className="mx-auto">
              <Link to={`/books/${booking.bookBasicinfo.id}`} >
                <h4 className="mt-2 text-decoration-none text-dark" >{booking.bookBasicinfo.title}</h4>
              </Link>
              <p><b>Data rezerwacji: </b>{new Date(booking.borrowedDate).toLocaleDateString('pl-PL', options)}</p>
              {booking.bookingLimitDate && <p><b>Limit rezerwacji: </b>{new Date(booking.bookingLimitDate).toLocaleDateString('pl-PL', options)}</p>}
              {(currentUser) && 
                <Button className="btn-info" id={booking.bookBasicinfo.id} onClick={() => handleRemoveFromBooked(booking.bookBasicinfo.id, booking.id)}><i className="fa-solid fa-xmark"></i> Return</Button>
              }
            </Col>  
          </Row>
        </Col>
    ))
  }

  function DebtSection(){
    if(currentUser.role !== "admin")
      return
    return(
      <Col sm={12} xs={12}>
        <hr/>
        <h4>Debit:</h4>
        <Row>
          <Col sm={6} xs={6}>
            <p className="m-0">Current debt: {(getDebt != 0) && <b style={{color: "#AB2328"}}>{getDebt} zł</b>} {(getDebt == 0) && "-"}</p>
          </Col>
          <Col sm={6} xs={6}>
            <Row>
              <Col sm={8} xs={8}>
                <Form id="test">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="number" defaultValue={getDebt}/>
                    <Form.Label>Enter the amount of debt to be repaid:</Form.Label>
                  </Form.Group>
                </Form>
              </Col>
              <Col sm={4} xs={4}>
                <Button onClick={handleDebtPay}>Pay</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    )
  }

  function UserDetails(){
    return(
      <Row>
        <DebtSection/>

        <Col sm={12} xs={12}>
          <hr/>
          <h4>Borrowed:</h4>
          <Row>
            <BorrowList/>
          </Row>
        </Col>

        <Col sm={12} xs={12}>
          <hr/>
          <h4>Reserved:</h4>
          <Row>
            <ReservedList/>
          </Row>
        </Col>

        <Col sm={12} xs={12}>
          <hr/>
          <h4>WatchList:</h4>
          <Row>
            <WatchList/>
          </Row>
        </Col>
        
        <Col sm={12} xs={12}>
          <hr/>
          <h4>Reviews:</h4>
          <Row>
            <ReviewsList/>
          </Row>
        </Col>

        
        
      </Row>
    )
  }

  function EditSection({userData}){

    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .min(3,"Name is too short")
            .required("Name is required"),
        lastName: Yup.string()
            .min(3,"Name is too short")
            .required("Name is required"),
        description: Yup.string().
            nullable(),
    })

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: userData
    });

    function onSubmit(data){
      let dataToSend = {
        firstName: data.firstName,
        lastName: data.lastName,
        description: (data.description == null) ? ("") : (data.description)
      }
      UserService.patchUser(userData.id, dataToSend).then((response) => {
        if(response.status < 400){
            alert("Dane zostały zmienione");
        }
        else{
            alert("Dane nie mogły zostać zmienione: "+response.data)
        }
    })
      console.log(dataToSend)
    }

    return(
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="w-100 my-1">
          <input
              name="firstName"
              {...register('firstName')}
              type="text"
              className={"form-control " + (errors.firstName ? 'is-invalid' : '')}
              placeholder="First name"
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </Row>
        <Row className="w-100 my-1">
          <input
              name="lastName"
              {...register('lastName')}
              type="text"
              className={"form-control " + (errors.lastName ? 'is-invalid' : '')}
              placeholder="Last name"
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </Row>
        <Row className="w-100 my-1">
          <textarea
            name="description"
            {...register('description')}
            className={"form-control " + (errors.description ? 'is-invalid' : '')}
            placeholder="Description"
          />
          <div className="invalid-feedback">{errors.description?.message}</div>  
        </Row>
        <Row className="w-100 my-1">
          <Col className="my-1">
            <Button className="float-end my-1" type="submit">Save <i className="fa-solid fa-floppy-disk"></i></Button>
          </Col>
          
        </Row>
      </form>
    )
  }


  function UserEntryAsAdmin({userData}){
    return(
      <div>
        <h3>Manage user profile:</h3>
      <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={8}>
                <h5 className="">{userData.email} [{(isAccountBlocked == true) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == false) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Liked books: {userData.reactions.filter(reaction => reaction.like).length} <i className="fa-solid fa-thumbs-up"></i></p>}
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Disliked books: {userData.reactions.filter(reaction => !reaction.like).length} <i className="fa-solid fa-thumbs-down"></i></p>}
                <EditSection userData={userData}></EditSection>
                
              </Col>
              <Col md={2}>
                <Row>
                  <Col xs={6}>
                    <Link to={`/users`}><Button>Back <i class="fa-solid fa-circle-chevron-left"></i></Button></Link>
                  </Col>
                  <Col xs={6} >
                  {(currentUser?.role == "admin") && <Link to={`/user/${userData.id}/profile`}><Button variant={!isAccountBlocked ? "danger" : "success"} onClick={handleClickBlockAcc}>{isAccountBlocked ? <i className="fa-solid fa-user-slash"></i>  : <i className="fa-solid fa-user"></i>}{isAccountBlocked ? 'Block'  : 'Un-Block'}</Button></Link>}
                  </Col>
                  
                </Row>
              </Col>
            </Row>
            <UserDetails userData={userData}/>
          </div>
        </div>
    )
  }

  function UserEntryAsUser({userData}){
    return(
      <div>
        <h3>Your profile:</h3>
        <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={9}>
                <h5 className="">{userData.email} [{(isAccountBlocked == true) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == false) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Liked books: {userData.reactions.filter(reaction => reaction.like).length} <i className="fa-solid fa-thumbs-up"></i></p>}
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Disliked books: {userData.reactions.filter(reaction => !reaction.like).length} <i className="fa-solid fa-thumbs-down"></i></p>}
                <p className="m-0">Current debt: {(getDebt != 0) && <b style={{color: "#AB2328"}}>{getDebt} zł</b>} {(getDebt == 0) && "-"}</p>

                <EditSection userData={userData} className="m-0"></EditSection>
                
              </Col>
              <Col md={1}>
                <Link to={`/users`}><Button className="mx-auto">Back <i className="fa-solid fa-circle-chevron-left"></i></Button></Link>
              </Col>
            </Row>
            <UserDetails userData={userData}/>
          </div>
      </div>
    )
  }

  function UserEntry({userData}){
    return(
      <div>
        <h3>User profile:</h3>
        <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={9}>
                <h5 className="">{userData.firstName} [{(isAccountBlocked == true) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == false) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Liked books: {userData.reactions.filter(reaction => reaction.like).length} <i className="fa-solid fa-thumbs-up"></i></p>}
                {(userData.reactions && userData.reactions.length != 0) &&  <p className="m-0">Disliked books: {userData.reactions.filter(reaction => !reaction.like).length} <i className="fa-solid fa-thumbs-down"></i></p>}
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                
              </Col>
              <Col md={1}>
                <Link to={`/users`}><Button className="mx-auto">Back <i className="fa-solid fa-circle-chevron-left"></i></Button></Link>
              </Col>
            </Row>
            <UserDetails userData={userData}/>
          </div>
      </div>
    )
  }

  function DefineView({userData}){
    if(currentUser.id === userData.id){
      return (<UserEntryAsUser userData={content}/>)
    }else if(currentUser.role === "admin"){
      return (<UserEntryAsAdmin userData={content}/>)
    }else{
      return (<UserEntry userData={content}/>)
    }
  }

  return (
    <div className="container bg-light">
        {content && currentUser && <DefineView userData={content}/>
        }
    </div>
  );
};

export default User;
