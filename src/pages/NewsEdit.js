import React, {useEffect, useState } from "react";

import {useLoaderData, Navigate, useNavigate } from "react-router-dom";
import {Button, Row, Col, Form,  } from "react-bootstrap";

import useUser from "../services/useUser";
import NewsService from "../services/news.service";

const NewsEdit = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();
  let navigate = useNavigate();
  const [getNewsContent, setNewstContent] = useState("");


  useEffect(() => {
    console.log(content)
    setNewstContent(content.content);
  }, []);

  async function editNews (tresc) {
    let response = (await NewsService.putNews(content.id, getNewsContent)).data;
    if(response)
      navigate('/')
  }

  return (
    <div className="container bg-light pb-2">
      <Row className="py-3">
        <Col>
          <h3><i class="fa-solid fa-newspaper"></i> Add news page</h3>
        </Col>
      </Row>
      <Row className="py-3">
        <Col xs={10}>
          <Form>
           <Form.Group controlId="form-group-id">
            <Form.Control as="textarea" id="news-content" value={getNewsContent} onChange={e => setNewstContent(e.target.value)} placeholder="News content" rows={3} />
           </Form.Group>
          </Form>
        </Col>
        <Col xs={2} className="mx-auto">
          <Button className="btn-info" onClick={editNews}><i class="fa-solid fa-floppy-disk"></i> Save edit</Button>
        </Col>
      </Row>
    </div>
  );
};

export default NewsEdit;
