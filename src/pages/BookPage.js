import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import BookService from "../services/book.service";
import UserService from "../services/user.service";
import useUser from "../services/useUser";
import { Link, redirect, useLoaderData, useParams } from "react-router-dom";
import AuthService from "../services/auth.service";
import Reviews from "../components/Reviews";

const BookPage = () => {
  const content = useLoaderData();
  
  const [currentUser] = useUser();
  const [isAddedToWatchList, setisAddedToWatchList] = useState(false);

  function handleClick () {
      UserService.postUsertoggleWatchlist(content.id, !isAddedToWatchList)
  }

  function partition(array, filter) { //Might be useful elsewhere as a tool
    let pass = [], fail = [];
    array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
    return [pass, fail];
  }

  let [likes, dislikes] = partition(content.reactions, (e) => e["like"])

  useEffect(() => {
    /*

    //let user = AuthService.getCurrentUser();
    let userProfile = async () => await UserService.getUserProfileById("265582f0-e8f2-4465-b304-3d8926571e3f"); //TODO: change to actual id
    userProfile = async () => await userProfile.data;
    console.log(userProfile);
    let watchList = userProfile.watchList;
    console.log(watchList);
    if(watchList.length == 0){
      setisAddedToWatchList(false);
    }else{
      let bookFound = watchList.find((book) => book.id == content.id);
      if(!bookFound)
        setisAddedToWatchList(false);
      else
        setisAddedToWatchList(true);
    }
    */
  },[])

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
                <Button {...(content.bookAmount < 1) ? "disabled" : ""} className="mx-1">Wypożycz</Button>
                <Button variant={isAddedToWatchList ? "danger" : "success"} onClick={handleClick}>{isAddedToWatchList ? "Usun z watchlisty" : "Dodaj do watchlisty"}</Button>
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
      <Row className="flex-row-reverse px-4">
        <Button variant="danger" className="w-auto m-1">Dislike <Badge>{dislikes.length}</Badge></Button>
        <Button variant="success" className="w-auto m-1">Like <Badge>{likes.length}</Badge></Button> 
      </Row>
      <Reviews reviews = {content?.reviews}/>
    </div>
  );
};

export default BookPage;
