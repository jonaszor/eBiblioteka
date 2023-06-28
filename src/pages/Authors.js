import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Stack, Button, Row, Col, CloseButton, Badge, Container } from "react-bootstrap";
import { Link, useFetcher } from "react-router-dom";

const Authors = ({edit}) => {
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
          <h1 className="">Authors page:</h1>
        </Col>
        <Col md={"auto"}>
          <Stack className="m-3 ms-auto" direction="horizontal">
            {edit && 
            <fetcher.Form method="POST" action="./../add">
              <input
              className="mx-2"
                name="firstName"
                required
                placeholder="First Name"
              />
              <input
                name="lastName"
                required
                placeholder="Last Name"
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
          <p>{content.map((author) => 
              <Link key={author.id} to={!edit && "../books?author="+author.id}>
                <Badge className="ms-1 p-1"  bg={edit ? "danger" : "info"}>{author.firstname +" "+author.lastname}
                  {edit && <CloseButton variant="white" onClick={() => fetcher.submit(null, {action: "./../delete/"+author.id, method: "DELETE"})}/>}
                </Badge>
              </Link>    
              )}
          </p>
        :
        <div>loading</div>
        }
        </Row>
    </Container>
  );
};

export default Authors;
