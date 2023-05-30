import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import BookService from "../services/book.service";
import useUser from "../services/useUser";
import { Link, redirect, useLoaderData, useParams } from "react-router-dom";

const BookPage = () => {
  const content = useLoaderData();
  
  const [currentUser] = useUser();

  return (
    <div className="container bg-light shadow-lg">
      <Link to={"./.."}>{"<< Powrót"}</Link>
        {content ?  
        <Container className="border p-3" fluid>
          <Row md={3}>
            <Col md={3} className="text-center">
              <Image src={content.imageUrl} thumbnail className="mx-2"/>
            </Col>
            <Col fluid={"true"} md={9}>
              <Stack className="float-right">
                {(currentUser?.role == "admin") && <Link to={"./edit"}><Button>Edit</Button></Link>}
                <Button {...(content.bookAmount < 1) ? "disabled" : ""} className="mx-1">Wypożycz</Button>
              </Stack>
              <h1 className="mx-2">{content.title}</h1>
              
              <p>Autorzy: {content.authors.map((author) => 
                  <span className="ml-1 p-1 border rounded" key={author.id}>{author.firstname + " " +author.lastname}</span>
              )}</p>
              <p>Kategorie: {content.categories.map((category) => 
                  <Badge bg="primary" className="ml-1 text-white" key={category.id}>{category.name}</Badge>
              )}</p>
              <p>Tagi: {content.tags.map((tag) => 
                  <Badge bg="primary" className="ml-1 text-white" key={tag.id}>{tag.name}</Badge>
              )}</p>
              <p className="m-3">Opis: {content.description}</p>
            </Col>

            
          </Row>
        </Container>
        :
        <div>loading</div>} 
    </div>
  );
};

export default BookPage;
