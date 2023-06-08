import { Col, Row, Container } from "react-bootstrap";
import {Image} from "react-bootstrap";

export default function Reviews({reviews}){
    function ReviewEntry({content}){
        return(
            <Row className="border p-2 m-1">
                <Col md={3} className="justify-content-center">
                    <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
                    <p>{content.userId/**TODO: bede tu potrzebował imienia */}</p>
                    
                </Col>
                <Col className="border p-2">
                    <p>{content.content}</p>
                </Col>
            </Row>
        )
    }

    return(
        <Container className="px-5">
            {reviews.map((review) => <ReviewEntry content={review} key={review.reviewId}/>)}
        </Container>
    )
}