import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Stack, Button, Row, Col, CloseButton, Badge, Container } from "react-bootstrap";
import { Link, Form, useSubmit, useFetcher } from "react-router-dom";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Tags = ({edit}) => {
  const [content, setContent] = useState(useLoaderData());
  const [currentUser] = useUser();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data) {
      fetcher.load(".")
      //setContent(fetcher.data)
    }
  }, [fetcher]);


  return (
    <Container className="bg-light pb-5">
      <Row>

      
        <Col md={3} className="me-auto">
          <h1 className="">Tags page:</h1>
        </Col>
        <Col md={"auto"}>
          <Stack className="m-3 ms-auto" direction="horizontal">
            {edit && 
            <fetcher.Form method="POST" action="./../add">
              <input
                name="tagName"
                required
              />
              <Button variant="success" className="m-2" type="submit">Add</Button>
            </fetcher.Form>
            }

            {((currentUser?.role == "admin") && !edit) ? 
              <Link to={"./edit"}><Button>Edit</Button></Link>
            :
              <Link to={"./.."}><Button>Return</Button></Link>
            }
          </Stack>
        </Col>
        
        {content ? 
          <p>{content.map((tag) => 
                  <Badge className="ms-1 p-1" key={tag.id} bg={edit ? "danger" : "info"}>{tag.name}
                    {edit && <CloseButton variant="white" onClick={() => fetcher.submit(null, {action: "./../delete/"+tag.id, method: "DELETE"})}/>}
                  </Badge>
              )}
          </p>
        :
        <div>loading</div>
        }
        </Row>
    </Container>
  );
};

export default Tags;
