import { useLoaderData, useParams } from "react-router-dom";
import useUser from "../services/useUser";
import { Row,Col,Stack,Button,Badge,Image, Container } from "react-bootstrap";
import { Link, useSubmit } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useState,useEffect } from "react";
import { ReactTags } from "react-tag-autocomplete";
import BookService from "../services/book.service";
import ConfirmationWindow from "../components/ConfirmationWindow";

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
    const [content, setContent] = useState(useLoaderData());
    const [suggestions, setSuggestions] = useState({});
    const [currentUser] = useUser();
    const params = useParams();
    const [confirmation, setConfirmation] = useState({show: false, content: "", onConfirm: ()=>{}})

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
      } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: (isAdd) ? {} :{
            ...content, 
            authors: content["authors"].map((author)=>({value: author.id, label: author.firstname + " " + author.lastname})),
            categories: content["categories"].map((item) => ({value: item.id, label: item.name})),
            tag: content["tags"].map((item) => ({value: item.id, label: item.name})),
            authorsId: [], categoriesId: [], tagsId: []
        }
      });

    function onSubmit(data){
        function onConfirm(data){
                data = data //Przez to zaczęło działać???
                data.authorsId = data.authors?.map((x) => x.value);
                data.categoriesId = data.categories?.map((x) => x.value);
                data.tagsId = data.tags?.map((x) => x.value);
                console.log(data)
                //console.log(JSON.stringify(data))
                if(isAdd)
                    BookService.addBook(data).then((response) => {
                        if(response.status < 400){
                            alert("Książka została dodana");
                        }
                        else{
                            alert("Książka nie mogła zostać dodana: "+response.data)
                        }
                    }).finally(() => setConfirmation({...confirmation, show: false}));
                    //submit(data, {method: "POST"})
                else
                    BookService.editBookbyId(params.id, data).then((response) => {
                        if(response.status < 400){
                            alert("Książka została zedytowana");
                        }
                        else{
                            alert("Książka nie mogła zostać zedytowana: "+response.data)
                        };
                    }).finally(() => setConfirmation({...confirmation, show: false}));
                    //submit(data, {method: "PATCH"})
            }
        setConfirmation({
            show: true,
            content: "Wprowadzone dane są poprawne?",
            onConfirm: () => onConfirm(data)
        })
      }

    

    //console.log(errors)

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

    function MyTagsInput({name, control, suggestions, placeholder, className, error}){
        return (
            <Row className={className}>
                <Controller
                    name={name}
                    control={control}
                    defaultValue={[]}
                    className={'form-control'}
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
            <ConfirmationWindow {...confirmation} onClose={() => setConfirmation({...confirmation, show: false})}/>
      <Link to={"./.."}>{"<< Powrót"}</Link>
        {(content || isAdd) ?  
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container className="border p-3" fluid>
            <Row md={3}>
                <Col md={3} className="text-center">
                    <Image src={watch('imageUrl')} thumbnail className="w-100 h-75"/>
                    <input
                        name="imageUrl" 
                        type="text" 
                        {...register('imageUrl')}
                        className={"form-control " + (errors.imageUrl ? 'is-invalid' : '')}
                        placeholder="Cover image URL"
                    />
                    <div className="invalid-feedback">{errors.imageUrl?.message}</div>
                </Col>
                <Col fluid={"true"} md={9} className="p-5">
                    <Row className="w-100 my-1">
                        <input
                            name="title"
                            type="text"
                            {...register('title')}
                            className={"form-control " + (errors.title ? 'is-invalid' : '')+" h1"}
                            placeholder="Title"
                        />
                        <div className="invalid-feedback">{errors.title?.message}</div>
                      
                    </Row>
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
                    <Row>
                      <textarea
                        name="description"
                        {...register('description')}
                        className={"form-control " + (errors.description ? 'is-invalid' : '') + " flex-grow-1"}
                        placeholder="Description"
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>  
                    </Row>
                    
                    <Row className="w-100 my-1 align-items-center">
                        <Col className="">
                            <input
                                name="pdfUrl"
                                type="text"
                                {...register('pdfUrl')}
                                className={"form-control " + (errors.pdfUrl ? 'is-invalid' : '')}
                                placeholder="URL to PDF file"
                            />
                            <div className="invalid-feedback">{errors.pdfUrl?.message}</div>
                        </Col>
                        
                        <Col>
                            <input
                                name="bookAmount"
                                type="number"
                                {...register('bookAmount')}
                                className={"form-control " + (errors.bookAmount ? 'is-invalid' : '')}
                                placeholder="Amount of books"
                            />
                            <div className="invalid-feedback">{errors.bookAmount?.message}</div>
                        </Col>
                    </Row>

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