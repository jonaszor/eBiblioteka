import React, { useState, useEffect } from "react";

import BookService from "../services/book.service";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    BookService.getPublicContent().then(
      (response) => {
        setContent(JSON.stringify(response.data));
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  );
};

export default Home;
