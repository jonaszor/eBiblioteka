import React, { useState, useEffect } from "react";

import BookService from "../services/book.service";

const Categories = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    BookService.getCategories().then(
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
    <div className="container">
      <header className="jumbotron">
        <h1>Categories page:</h1>
        {content ? 
          <p>{content.map((category) => 
                  <span className="ml-1 p-1 border rounded btn-info" key={category.id}>{category.name}</span>
              )}
          </p>
        :
        <div>loading</div>
        }
      </header>
    </div>
  );
};

export default Categories;
