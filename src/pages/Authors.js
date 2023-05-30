import React, { useState, useEffect } from "react";

import BookService from "../services/book.service";


const Authors = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    BookService.getAuthors().then(
      (response) => {
        setContent(response.data);
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
    <div className="container bg-light pb-5">
        <h1>Authors page:</h1>
        {content ? 
          <p>{content.map((author) => 
                  <span className="ml-1 p-1 border rounded btn-info" key={author.id}>{author.firstname + " " +author.lastname}</span>
              )}
          </p>
        :
        <div>loading</div>
        }
    </div>
  );
};

export default Authors;
