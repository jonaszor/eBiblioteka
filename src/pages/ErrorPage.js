import { Col, Container, Row } from "react-bootstrap";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import App from "../App";
import { AxiosError } from "axios";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    (<div id="notfound">
		<div className="notfound">
			<div className="notfound-404">
				<h1>Oops!</h1>
				<h2>404 - The Page can't be found</h2>
			</div>
		</div>
	</div>));
}