import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import UserService from "../services/user.service";
import useUser from "../services/useUser";
import { Link, useLoaderData } from "react-router-dom";
import Reviews from "../components/Reviews";
import Reactions from "../components/Reactions";
import BorrowService from "../services/borrow.service";
import ConfirmationWindow from "../components/ConfirmationWindow";

const BookPage = () => {
  const content = useLoaderData();
  
  const [currentUser] = useUser();
  const [userProfile, setProfile] = useState(null);
  const [isAddedToWatchList, setisAddedToWatchList] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [confirmation, setConfirmation] = useState({show: false, content: "", onConfirm: ()=>{}})

  function handleClickWatchlist () {
      UserService.postUsertoggleWatchlist(content.id, !isAddedToWatchList)
      .then(
        () => {setisAddedToWatchList(!isAddedToWatchList)},
        (why) => alert("Nie można było dodać do watchlisty: "+ why)
      )
  }

  function handleClickBooking(){
    let onConfirm = () => BorrowService.postToggleBookedStatus(content.id, currentUser.id, !isBooked)
    .then(
      (succesfulRequest)=>{
        setIsBooked(!isBooked)
      },
      (failedRequest)=>{
        console.error(failedRequest)
        alert("Nie można było zarezerwować książki:\n" + failedRequest.message +"\n"+failedRequest.response.data)
      }
    ).finally(
      () => setConfirmation({...confirmation, show: false})
    )

    setConfirmation({
      show: true,
      content: "Potwierdź zarezerwowanie",
      onConfirm: onConfirm
    })
  }

  function handleClickBorrow(){
    let onConfirm = () => BorrowService.postToggleBorrowStatus(content.id, currentUser.id, true)
    .then(
      (succesfulRequest)=>{
        setIsBooked(!isBooked)
      },
      (failedRequest)=>{
        console.error(failedRequest)
        alert("Nie można było pożyczyć książki:\n" + failedRequest.message +"\n"+failedRequest.response.data)
      }
    ).finally(
      () => setConfirmation({...confirmation, show: false})
    )

    setConfirmation({
      show: true,
      content: "Potwierdź pożyczenie",
      onConfirm: onConfirm
    })
  }

  useEffect(() => {
    async function getProfile(){
      let userProfile = (await UserService.getUserProfileById(currentUser.id)).data
      setProfile(userProfile)
      return userProfile
    }

    async function getBooked(){
      let bookedEntries = (await BorrowService.getBookedByUserId(currentUser.id)).data
      //console.log(bookedEntries)
      return bookedEntries
    }

    async function getBorrowed(){
      let borrowedEntries = (await BorrowService.getBorrowedByUserId(currentUser.id)).data
      //console.log(bookedEntries)
      return borrowedEntries
    }

    if(currentUser){
      getProfile().then((profile) => { //Wait until you have profile, then. Maybe the watchlist part should be moved to a seperate component
        let isInWatchlist = profile.watchList.some((book) => book.id == content.id)
        setisAddedToWatchList(isInWatchlist)
      })
      getBooked().then((entries) => {
        let activeBooking = entries.filter(entry => (entry.isActive && (entry.bookBasicinfo.id == content.id)))
        //console.log(activeBooking)
        setIsBooked(activeBooking.length > 0)
      })
      getBorrowed().then((entries) => {
        let activeBorrowed = entries.filter(entry => ((entry.returnedDate == null) && (entry.bookBasicinfo.id == content.id)))
        //console.log(activeBorrowed)
        setIsBorrowed(activeBorrowed.length > 0)
      })
    }
  },[currentUser])

  return (
    <div className="container bg-light shadow-lg p-3">
      <Link to={"./.."}><Button>Back <i class="fa-solid fa-circle-chevron-left"></i></Button></Link>
        {content ?  
        <Container className="border p-3" fluid>
          <Row md={3}>
            <Col md={3} className="text-center">
              <Image src={content.imageUrl} thumbnail className="mx-2"/>
            </Col>
            <Col fluid={"true"} md={9} className="">
              <Stack direction="horizontal" className="flex-row-reverse" gap={1}>
                {(currentUser?.role == "admin") && <Link to={"./edit"}><Button>Edit</Button></Link>}
                {currentUser &&
                 <Button disabled={((content.bookAmount < 1) || isBorrowed) ? true : false } onClick={handleClickBorrow}>
                  {isBorrowed ? "Wypożyczona" : "Wypożycz książkę"}
                 </Button>}

                {currentUser &&
                <Button {...(content.bookAmount < 1) ? "disabled" : ""} variant={isBooked ? "danger" : "success"} onClick={handleClickBooking}> 
                  {isBooked ? "Anuluj Rezerwacje" : "Zarezerwuj książkę"}
                </Button>}

                {currentUser &&
                <Button variant={isAddedToWatchList ? "danger" : "success"} onClick={handleClickWatchlist}>
                  {isAddedToWatchList ? "Usuń z watchlisty" : "Dodaj do watchlisty"}
                </Button>}

              </Stack>
              <h1 className="mx-2">{content.title}</h1>
              
              <p>Autorzy: {content.authors.map((author) => 
                  <span className="ms-1 p-1 border rounded" key={author.id}>{author.firstname + " " +author.lastname}</span>
              )}</p>
              <p>Kategorie: {content.categories.map((category) => 
                  <Badge bg="primary" className="ms-1 text-white" key={category.id}>{category.name}</Badge>
              )}</p>
              <p>Tagi: {content.tags.map((tag) => 
                  <Badge bg="primary" className="ms-1 text-white" key={tag.id}>{tag.name}</Badge>
              )}</p>
              <p className="p-3">Opis: {content.description}</p>
            </Col>
           
          </Row>
        </Container>
        :
        <div>loading</div>}
      <hr className="w-100"/>
      <ConfirmationWindow {...confirmation} onClose={() => setConfirmation({...confirmation, show: false})}>
        {confirmation.content}
      </ConfirmationWindow>
      <Reactions reactions={content.reactions} profile={userProfile} bookId={content.id}/>
      <Reviews reviews = {content?.reviews} bookId={content.id}/>
    </div>
  );
};

export default BookPage;
