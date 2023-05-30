import React, { useState, useEffect } from "react";
import { Image, Badge, Row, Col } from "react-bootstrap";

import BookService from "../services/book.service";
import { Link, useLoaderData } from "react-router-dom";

const Books = () => {
  const content = useLoaderData();

  function BookEntry({bookData}){
    return(
        <Row className="border p-3 shadow m-2" style={{/*height:"20vh"*/}}>
           <Col className="" xs={3}>
            <Link to={`/books/${bookData.id}`} className="text-decoration-none">
              <Image src={bookData.imageUrl} thumbnail fluid className="mx-2 p-1"/>
            </Link>
          </Col>
          <Col xs={9}>
            <h5 className="mx-2">{bookData.title}</h5>
            {/*<Button {...(bookData.bookAmount < 1) ? "disabled" : ""} className="float-end mx-1">Zobacz</Button>*/}
        
            <span className="ml-2">Autorzy: {bookData.authors.map((author) => 
                <span className="ml-1 p-1 border rounded" key={author.id}>{author.firstname + " " +author.lastname}</span>
            )}</span>
            <span className="ml-2">Kategorie: {bookData.categories.map((category) => 
                <Badge bg="primary" className="ml-1 text-white" key={category.id}>{category.name}</Badge>
            )}</span>
            <span className="ml-2">Tagi: {bookData.tags.map((tag) => 
                <Badge bg="primary" className="ml-1 text-white" key={tag.id}>{tag.name}</Badge>
            )}</span>
            <p className="m-3">Opis: {bookData.description}</p>
          </Col>
            
            
        </Row>
    )
}

  return (
    <div className="container bg-light">
        <h3>Books page</h3>
        {content && content.map((book) =>
            <BookEntry bookData={book} key={book.id}/>
        )}
    </div>
  );
};

export default Books;
