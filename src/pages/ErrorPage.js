import { Col, Container, Row } from "react-bootstrap";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import App from "../App";
import { AxiosError } from "axios";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <Container id="error-page">
        <Row>
            <Col>
                {(error instanceof AxiosError) ? (
                    <div>
                        <h1>Oops!</h1>
                        <h2>{error.response.status}</h2>
                        <p>{error.response.statusText}</p>
                        {error.response.data && <p>{error.response.data}</p>}
                    </div>
                    
                 ) : (
                    <div>Oops</div>
                )}
            </Col>
        </Row>
    </Container> 
    
  );
}