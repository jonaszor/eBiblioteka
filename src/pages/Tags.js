import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Stack, Button, Row, Col, CloseButton, Badge } from "react-bootstrap";
import { Link, Form, useSubmit } from "react-router-dom";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = Yup.object().shape({
  tag: Yup.string()
    .required('You need to input sumething')
  })

  

const Tags = ({edit}) => {
  const [content] = useState(useLoaderData());
  const [currentUser] = useUser();
  const submit = useSubmit();

  const {
      register,
      handleSubmit,
      formState: { errors }
    } = useForm({
      resolver: yupResolver(validationSchema)
    });

  const onSubmit = () =>{

  }

  return (
    <div className="container bg-light pb-5">
        <Col>
          <h1>Tags page:</h1>
          <Stack className="float-right mb-3" direction="horizontal" gap={3}>
            {((currentUser?.role == "admin") && !edit) ? 
              <Link to={"./edit"}><Button>Edit</Button></Link>
            :
              <Link to={"./.."}><Button>Return</Button></Link>
              }
            {edit && 
            <Form method="POST">
              <input
                name="tagName"
                required
              />
              <Button variant="success" className="m-2" type="submit">Add</Button>
            </Form>
            
            }
          </Stack>
        </Col>
        
        {content ? 
          <p>{content.map((tag) => 
                  <Badge className="ml-3 p-1 border" key={tag.id}>{tag.name}
                  {edit && <CloseButton variant="white" onClick={submit("/delete/"+tag.id, {method: "DELETE"})}/>}</Badge>
              )}
          </p>
        :
        <div>loading</div>
        }
    </div>
  );
};

export default Tags;
