import { useState } from "react";
import { Col, Row, Container, Button, Stack, Form } from "react-bootstrap";
import {Image} from "react-bootstrap";
import UserService from "../services/user.service";
import { useForm } from "react-hook-form";

export default function Reviews({reviews, bookId}){
    let [isWriting, setWriting] = useState(false)

    function ReviewEntry({content}){
        return(
            <Row className="border p-2 my-1">
                <Col md={"auto"} className="justify-content-center text-center">
                    <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
                    <p className="">{content.email}</p>
                    <p>{content.firstName + " " + content.lastName}</p>
                </Col>
                <Col className="border p-3">
                    <p>{content.content}</p>
                </Col>
            </Row>
        )
    }

    function WriteReview(){
        const {
            register,
            handleSubmit,
            formState: { errors }
          } = useForm({
            defaultValues:{}
          });

        function onSend(data){
            let content = data.reviewContent
            UserService.postUserReview(bookId, content).then(() =>{

            })
        }

        return(
            <Form onSubmit={handleSubmit(onSend)}>
                <textarea placeholder="Write your review" required className="w-100" {...register("reviewContent")}></textarea>
                <Stack direction="horizontal">
                    <div className="ms-auto"/>
                    <Button className="w-auto m-1" variant="success" type="submit">Send Review</Button>
                    <Button className="w-auto" variant="danger" onClick={()=>setWriting(false)}>Cancel</Button>  
                </Stack>
            </Form>
        )
    }

    return(
        <Container className="px-5">
            <Row className="align-content-center flex-row">
                {isWriting? 
                <WriteReview/> 
                :
                <Button className="w-auto" variant="success" onClick={() => setWriting(true)}>Write Review</Button>
                }
            </Row>
            {reviews.map((review) => <ReviewEntry content={review} key={review.reviewId}/>)}
        </Container>
    )
}