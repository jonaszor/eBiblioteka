import { useLoaderData } from "react-router-dom";
import useUser from "../services/useUser";
import { Row,Col,Stack,Button,Badge,Image, Container } from "react-bootstrap";
import { Link, useSubmit } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useState,useEffect } from "react";
import { ReactTags } from "react-tag-autocomplete";
import BookService from "../services/book.service";

const validationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Title is required"),
    authors: Yup.array()
        .min(1,"You need at least one author"),
    categories: Yup.array(),
    tags: Yup.array(),
    description: Yup.string().
        required("Description is required"),
    imageUrl: Yup.string()
        .url("This is not a valid link")
        .required("A cover image link is required"),
    bookAmount: Yup.number()
        .min(1,"You need to add at least one book"),
    pdfUrl: Yup.string()
})

export default function BookEdit({isAdd}){
    const submit = useSubmit();
    const [content, setContent] = useState(useLoaderData());
    const [suggestions, setSuggestions] = useState({});
    const [currentUser] = useUser();

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        getValues,
      } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: (isAdd) ? {} :{
            ...content, 
            authors: content["authors"].map((author)=>({value: author.id, label: author.firstname + " " + author.lastname})),
            categories: content["categories"].map((item) => ({value: item.id, label: item.name})),
            tag: content["tags"].map((item) => ({value: item.id, label: item.name}))
        }
      });

    function onSubmit(data){
        data.authorsId = isAdd ? [] : data.authors?.map((x) => x.value);
        data.categoriesId = isAdd ? [] : data.categories?.map((x) => x.value);
        data.tagsId = isAdd ? [] : data.tags?.map((x) => x.value);
        console.log(data)
        if(isAdd)
            submit(data, {method: "POST"})
        else
            submit(data, {method: "PATCH"})
    }

    console.log(errors)

    useEffect(()=>{ //load all tags, authors, categories for suggestions. Nope. Do they keep the old 'suggestions' ?
        BookService.authors.getAuthors().then((req) => setSuggestions({
            ...suggestions, 
            authors: req.data.map((author)=>({
                value: author.id,
                label: author.firstname+" "+author.lastname
            }))
        }));
        BookService.categories.getCategories().then((req) => setSuggestions({
            ...suggestions, 
            categories: req.data.map((cat)=>({
                value: cat.id,
                label: cat.name
            }))
        }));
        BookService.tags.getTags().then((req) => setSuggestions({
            ...suggestions, 
            tags: req.data.map((tag)=>({
                value: tag.id,
                label: tag.name
            }))
        }));
    },[])

    function MyTagsInput({name, control, suggestions, placeholder, className, error}){
        return (
            <Row className={className}>
                <Controller
                    name={name}
                    control={control}
                    defaultValue={[]}
                    render={({field}) =>(
                        <ReactTags {...field}
                            selected = {field.value}
                            onAdd={(tag) => {field.onChange([...field.value, tag])}}
                            onDelete={(tagIndex) => {field.onChange(field.value.filter((_,i) => (i !== tagIndex)))}}
                            suggestions={suggestions}
                            placeholderText={placeholder}
                        />
                    )}
                />  
                <div className="invalid-feedback">{error?.message}</div>
            </Row>
        )
    }
    

    return(
        <div className="container bg-light shadow-lg">
      <Link to={"./.."}>{"<< Powrót"}</Link>
        {(content || isAdd) ?  
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container className="border p-3" fluid>
            <Row md={3}>
                <Col md={3} className="text-center">
                    <Image src={getValues('imageUrl')} thumbnail className="mx-2 w-100 h-75"/>
                    <input
                        name="imageUrl" 
                        type="text" 
                        {...register('imageUrl')}
                        className={"form-control" + (errors.imageUrl ? 'is-invalid' : '')}
                    />
                    <div className="invalid-feedback">{errors.imageUrl?.message}</div>
                </Col>
                <Col fluid={"true"} md={9}>
                    <Row className="w-100 m-1">
                        <input
                            name="title"
                            type="text"
                            {...register('title')}
                            className={"form-control" + (errors.title ? 'is-invalid' : '')+" h1"}
                        />
                        <div className="invalid-feedback">{errors.title?.message}</div>
                      
                    </Row>
                    <MyTagsInput className="m-1"
                        name="authors"
                        control={control}
                        suggestions={suggestions['authors']}
                        placeholder={"Dodaj autorów"}
                        error={errors.authors}
                    />
                    <MyTagsInput className="m-1"
                        name="categories"
                        control={control}
                        suggestions={suggestions['categories']}
                        placeholder={"Dodaj kategorie"}
                        error={errors.categories}
                    />
                    <MyTagsInput className="m-1"
                        name="tags"
                        control={control}
                        suggestions={suggestions['tags']}
                        placeholder={"Dodaj tagi"}
                        error={errors.tags}
                    />
                    <textarea
                        name="description"
                        {...register('description')}
                        className={"form-control " + (errors.description ? 'is-invalid' : '') + " flex-grow-1"}
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>

                    <Button className="m-1 float-end" type="submit">Zapisz</Button>    
                </Col>

                {JSON.stringify()}
                 
            </Row>
            
            </Container>
        </form>
        :
        <div>loading</div>} 
    </div>
    );
}