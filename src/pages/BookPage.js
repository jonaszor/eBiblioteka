import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import BookService from "../services/book.service";
import UserService from "../services/user.service";
import useUser from "../services/useUser";
import { Link, redirect, useLoaderData, useParams } from "react-router-dom";
import AuthService from "../services/auth.service";
import Reviews from "../components/Reviews";
import Reactions from "../components/Reactions";

const BookPage = () => {
  const content = useLoaderData();
  
  const [currentUser] = useUser();
  const [userProfile, setProfile] = useState(null);
  const [isAddedToWatchList, setisAddedToWatchList] = useState(false);

  function handleClick () {
      UserService.postUsertoggleWatchlist(content.id, !isAddedToWatchList).then(() => {
        setisAddedToWatchList(!isAddedToWatchList)
      })
  }

  useEffect(() => {
    async function getProfile(){
      let userProfile = (await UserService.getUserProfileById(currentUser.id)).data
      setProfile(userProfile)
      return userProfile
    }

    if(currentUser){
      getProfile().then((profile)=>{ //Wait until you have profile, then. Maybe the watchlist part should be moved to a seperate component
        let isInWatchlist = profile.watchList.some((book) => book.id == content.id)
        setisAddedToWatchList(isInWatchlist)
      })
    }
  },[currentUser])

  return (
    <div className="container bg-light shadow-lg p-3">
      <Link to={"./.."}>{"<< Powrót"}</Link>
        {content ?  
        <Container className="border p-3" fluid>
          <Row md={3}>
            <Col md={3} className="text-center">
              <Image src={content.imageUrl} thumbnail className="mx-2"/>
            </Col>
            <Col fluid={"true"} md={9} className="">
              <Stack direction="horizontal" className="flex-row-reverse">
                {(currentUser?.role == "admin") && <Link to={"./edit"}><Button>Edit</Button></Link>}
                {currentUser && <Button {...(content.bookAmount < 1) ? "disabled" : ""} className="mx-1">Wypożycz</Button>}
                {currentUser && <Button variant={isAddedToWatchList ? "danger" : "success"} onClick={handleClick}>{isAddedToWatchList ? "Usun z watchlisty" : "Dodaj do watchlisty"}</Button>}
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
      <Reactions reactions={content.reactions} profile={userProfile} bookId={content.id}/>
      <Reviews reviews = {content?.reviews} bookId={content.id}/>
    </div>
  );
};

export default BookPage;
