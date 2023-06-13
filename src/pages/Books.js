import React, { useState, useEffect } from "react";
import { Image, Badge, Row, Col, Button,Accordion } from "react-bootstrap";

import BookService from "../services/book.service";
import { Link, useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Form, useForm } from "react-hook-form";
import MyTagsInput from "../components/MyTagsInput";

const Books = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();
  const [filters, setFilters] = useState({
    title: "",
    tags: [],
    categories: [],
    authors: []
  });

  function filterCondition(book){
    if(book.title.includes(filters.title) == false)
      return false;

    let bookTagIds = book.tags.map(entry=>entry.id)
    let filterTagIds = filters.tags.map(entry=>entry.value)
    if(!filterTagIds.every(entry => bookTagIds.includes(entry)))
      return false

    let bookCategoryIds = book.categories.map(entry=>entry.id)
    let filterCategoryIds = filters.categories.map(entry=>entry.value)
    if(!filterCategoryIds.every(entry => bookCategoryIds.includes(entry)))
      return false 

    let bookAuthorIds = book.authors.map(entry=>entry.id)
    let filterAuthorIds = filters.authors.map(entry=>entry.value)
    if(!filterAuthorIds.every(entry => bookAuthorIds.includes(entry)))
      return false 

    return true
  }

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
        
            <span className="ms-2">Autorzy: {bookData.authors.map((author) => 
                <span className="ms-1 p-1 border rounded" key={author.id}>{author.firstname + " " +author.lastname}</span>
            )}</span>
            <span className="ms-5">Kategorie: {bookData.categories.map((category) => 
                <Badge bg="primary" className="ms-1 text-white" key={category.id}>{category.name}</Badge>
            )}</span>
            <span className="ms-5">Tagi: {bookData.tags.map((tag) => 
                <Badge bg="primary" className="ms-1 text-white" key={tag.id}>{tag.name}</Badge>
            )}</span>
            <p className="m-3">Opis: {bookData.description}</p>
          </Col>
        </Row>
    )
}

function Search({currentFilter, setFilter}){
  const [suggestions, setSuggestions] = useState({});

  const {
        register,
        handleSubmit,
        formState: { errors },
        control,
      } = useForm({
        defaultValues: currentFilter
      });

    useEffect(()=>{ //load all tags, authors, categories for suggestions. 
        const fetchData = async () => {
            try {
              const authorsResponse = await BookService.authors.getAuthors();
              const categoriesResponse = await BookService.categories.getCategories();
              const tagsResponse = await BookService.tags.getTags();
        
              setSuggestions((prevState) => ({
                ...prevState,
                authors: authorsResponse.data.map((author) => ({
                  value: author.id,
                  label: `${author.firstname} ${author.lastname}`
                })),
                categories: categoriesResponse.data.map((cat) => ({
                  value: cat.id,
                  label: cat.name
                })),
                tags: tagsResponse.data.map((tag) => ({
                  value: tag.id,
                  label: tag.name
                }))
              }));
            } catch (error) {
              // Handle error here
            }
          };
        
        fetchData();
    },[])

function handleSearch(data){
  console.log(data)
  setFilter(data)
}

return(
  <form onSubmit={handleSubmit(handleSearch)}>
    <Row>
      <Col>
        <input
          name="imageUrl" 
          type="text" 
          {...register('title')}
          className={"form-control " + (errors.imageUrl ? 'is-invalid' : '')+" my-2"}
          placeholder="Wyszukaj po tytule"
        />
      </Col>
      <Col sm={"auto"} className="align-items-center py-auto">
        <Button type="submit">Wyszukaj</Button>
      </Col>
    </Row>
    
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>More filters</Accordion.Header>
        <Accordion.Body>
          <MyTagsInput className="my-1"
            name="authors"
            control={control}
            suggestions={suggestions['authors']}
            placeholder={"Dodaj autorów"}
            error={errors.authors}
          />
          <MyTagsInput className="my-1"
            name="categories"
            control={control}
            suggestions={suggestions['categories']}
            placeholder={"Dodaj kategorie"}
            error={errors.categories}
          />
          <MyTagsInput className="my-1"
            name="tags"
            control={control}
            suggestions={suggestions['tags']}
            placeholder={"Dodaj tagi"}
            error={errors.tags}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </form>
)
}

  return (
    <div className="container bg-light">
      <Row className="py-3">
        <Col>
          <h3>Books page</h3>
        </Col>
        <Col xs={"auto"} className="text-center">
          {(currentUser?.role == "admin" || currentUser?.role == "pracownik") && <Link to={"./add"}><Button variant="success">+ Add</Button></Link>}
        </Col>
      </Row>
      <Row className="p-3">
        <Search currentFilter={filters} setFilter={setFilters}/>
      </Row>
        {content && content.filter(entry => filterCondition(entry)).map((book) =>
            <BookEntry bookData={book} key={book.id}/>
        )}
    </div>
  );
};

export default Books;
