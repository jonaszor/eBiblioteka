import { useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Row,Col,Stack,Button,Badge,Image, Container } from "react-bootstrap";
import { Link, useSubmit } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useState } from "react";
import { TagsInput } from "react-tag-input-component";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required"),
    authorsId: Yup.array()
        .min(1,"You need at least one author"),
    /*categories: Yup.array()
        .of(Yup.number()),
    tags: Yup.array()
        .of(Yup.number()),*/
    description: Yup.string().
        required("Description is required"),
    imageUrl: Yup.string()
        .url("This is not a valid link")
        .required("A cover image link is required"),
})

export default function BookEdit(){
    const submit = useSubmit();
    const [content, setContent] = useState(useLoaderData());
    const [currentUser] = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control
      } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: content
      });

    function onSubmit(data){
        data.authorsId = data.authorsTags.map(tagString => {
            const [id ,firstName, lastName] = tagString.split(" ");
            return content.authors.find(author => 
                (author.firstname == firstName) && (author.lastname == lastName))?.id
        }).filter(entry => entry!=undefined) //Fuck me. Worst piece of code I've written to date. What the hell is javascript
        console.log(data)
        submit(data, {method: "PATCH"})
    }

    

    return(
        <div className="container bg-light shadow-lg">
      <Link to={"./.."}>{"<< Powrót"}</Link>
        {content ?  
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container className="border p-3" fluid>
            <Row md={3}>
                <Col md={3} className="text-center">
                    <Image src={content.imageUrl} thumbnail className="mx-2"/>
                    <input 
                        name="imageUrl" 
                        type="text" 
                        {...register('imageUrl')}
                        className={"form-control" + (errors.username ? 'is-invalid' : '')}
                    />
                </Col>
                <Col fluid={"true"} md={9}>
                    <Row className="w-100">
                    <h1 className="mx-2 flex-grow-1">
                        <input
                            name="title"
                            type="text"
                            {...register('title')}
                            className={"form-control" + (errors.username ? 'is-invalid' : '')}
                        />
                    </h1> 
                    <Stack className="float-right">
                        <Button className="mx-1" type="submit">Zapisz(TODO)</Button> 
                    </Stack>  
                    </Row>
                

                <Controller className=""  //PRAWIE???
                    name="authorsTags"
                    control={control}
                    defaultValue={content["authors"].map(x => x.id +": "+x.firstname+" "+x.lastname)}
                    render={({ field }) => (
                        <TagsInput  {...field}  />
                    )}
                />
                
                
                <p>Autorzy: {content.authors.map((author) => //Bruh
                    <span className="ml-1 p-1 border rounded" key={author.id}>{author.firstname + " " +author.lastname}</span>
                )}</p>
                <p>Kategorie: {content.categories.map((category) => 
                    <Badge bg="primary" className="ml-1 text-white" key={category.id}>{category.name}</Badge>
                )}</p>
                <p>Tagi: {content.tags.map((tag) => 
                    <Badge bg="primary" className="ml-1 text-white" key={tag.id}>{tag.name}</Badge>
                )}</p>
                <textarea
                    name="description"
                    type="text"
                    {...register('description')}
                    className={"form-control " + (errors.description ? 'is-invalid' : '') + " flex-grow-1"}
                />
                </Col>
                {JSON.stringify(errors)}
                
            </Row>
            </Container>
        </form>
        :
        <div>loading</div>} 
    </div>
    );
}