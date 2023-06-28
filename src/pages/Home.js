import React, { useState, useEffect } from "react";

import { Link, useLoaderData } from "react-router-dom";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import useUser from "../services/useUser";
import NewsService from "../services/news.service";


const Home = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();
  const [getNews, setNews] = useState([]);


  const formatDate = (date) => {
    date = new Date(date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
};

  useEffect(() => {
    setNews(content)
  }, []);

  async function removeNews (event){
    const id = event.target.id;
    let response = (await NewsService.deleteNews(id)).data;
    const newNewsList = getNews.filter((news) => news.id != id);
    console.log(newNewsList);
    setNews(newNewsList);
  }

  function News({data}){
    return(
      <Row className="border p-3 shadow m-2" style={{/*height:"20vh"*/}}>
          <Col xs={10}>
            <h6 className="mx-2 font-weight-bold"><i class="fa-solid fa-newspaper"></i> Added: {formatDate(data.createdDate)} {data.createdDate !== data.lastUpdate && "| Update: " + formatDate(data.lastUpdate)}</h6>
            <p className="m-3">{data.content}</p>
          </Col>
          <Col xs={2}>
            <Row>
              <Col xs={6}>
              <Button className="btn-danger" id={data.id} onClick={removeNews}>Delete</Button>
              </Col>
              <Col xs={6}>
                <Link to={`/news/${data.id}`}><Button className="btn-info" >Edit</Button></Link>
              </Col>
            </Row>
          </Col>
        </Row>
    )
  }

  return (
    <div className="container bg-light pb-2">
      <Row className="py-3">
        <Col>
          <h3>News page</h3>
        </Col>
        <Col xs={"auto"} className="text-center">
          {(currentUser?.role == "admin" || currentUser?.role == "pracownik") && <Link to={"./news/add"}><Button variant="success">+ Add news</Button></Link>}
        </Col>
      </Row>
        {getNews && getNews.length != 0 && getNews.map((news) => {
          return <News data={news}/>
        })
        }
    </div>
  );
};

export default Home;
