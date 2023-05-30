import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import BookService from "../../services/book.service";
import { Link, useLoaderData } from "react-router-dom";

import useUser from "../../services/useUser";
import UserService from "../../services/user.service";

const User = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();
  const [isAccountBlocked, setisAccountBlocked] = useState(false);
  

  useEffect(() => {
    setisAccountBlocked(content.isAccountBlocked);
  },[])

  async function handleClick (){
    await UserService.postUsertoggleBlock(content.id, isAccountBlocked);
    setisAccountBlocked(!isAccountBlocked);
  }

  function UserEntryAsAdmin({userData}){
    console.log(userData);
    return(
      <div>
        <h3>Manage user profile:</h3>
      <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={8}>
                <h5 className="">{userData.email} [{(isAccountBlocked == false) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == true) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                <p className="m-0">First & Last name: <b>{userData.firstName} {userData.lastName}</b></p>
                <p className="m-0">Debt: {(userData.amountToPay != 0) && <b style={{color: "#AB2328"}}>{userData.amountToPay} zł</b>} {(userData.amountToPay == 0) && "-"}</p>
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                
              </Col>
              <Col md={2}>
                <Row className="mx-auto">
                  <Col md={8} className="mx-auto">
                  <Link to={`/users`}><Button className="mx-auto">Powrót</Button></Link>
                  </Col>
                </Row>
                <Row className="mt-2 mx-auto">
                  <Col md={8} className="mx-auto">
                  {(currentUser?.role == "admin") && <Link to={`/user/${userData.id}/profile`}><Button variant={isAccountBlocked ? "danger" : "success"} onClick={handleClick}>{isAccountBlocked ? "Zablokuj" : "Odblokuj"}</Button></Link>}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row md={3}>
              <Col md={2}>
              </Col>
              <Col fluid={"true"} md={9}>
                {userData.watchList && userData.watchList.length != 0 && userData.watchList.map((book) => 
                    <p>
                      <ul>
                        <li>[{book.id}] {book.title}</li>
                        <li>{book.imageUrl}</li>
                      </ul>
                    </p>
                    
                )}
              </Col>
              <Col md={1}>
              </Col>
            </Row>
          </div>
        </div>
    )
  }

  function UserEntryAsUser({userData}){
    console.log(userData);
    return(
      <div>
        <h3>Your profile:</h3>
        <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={9}>
                <h5 className="">{userData.firstName} [{(isAccountBlocked == false) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == true) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                <p className="m-0">Watchlist: {userData.watchList.length}</p>
                
              </Col>
              <Col md={1}>
                <Link to={`/users`}><Button className="mx-auto">Powrót</Button></Link>
              </Col>
            </Row>
            <Row md={3}>
              <Col md={2}>
              </Col>
              <Col fluid={"true"} md={9}>
                {userData.watchList && userData.watchList.length != 0 && userData.watchList.map((book) => 
                    <p>
                      <ul>
                        <li>[{book.id}] {book.title}</li>
                        <li>{book.imageUrl}</li>
                      </ul>
                    </p>
                    
                )}
              </Col>
              <Col md={1}>
              </Col>
            </Row>
            
          </div>
      </div>
    )
  }

  function UserEntry({userData}){
    console.log(userData);
    return(
      <div>
        <h3>User profile:</h3>
        <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={9}>
                <h5 className="">{userData.firstName} [{(isAccountBlocked == false) && <b style={{color: "#AB2328"}}>Blocked</b>}{(isAccountBlocked == true) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                <p className="m-0">Watchlist: {userData.watchList.length}</p>
                
              </Col>
              <Col md={1}>
                <Link to={`/users`}><Button className="mx-auto">Powrót</Button></Link>
              </Col>
            </Row>
            <Row md={3}>
              <Col md={2}>
              </Col>
              <Col fluid={"true"} md={9}>
                {userData.watchList && userData.watchList.length != 0 && userData.watchList.map((book) => 
                    <p>
                      <ul>
                        <li>[{book.id}] {book.title}</li>
                        <li>{book.imageUrl}</li>
                      </ul>
                    </p>
                    
                )}
              </Col>
              <Col md={1}>
              </Col>
            </Row>
          </div>
      </div>
    )
  }

  function DefineView({userData}){
    if(currentUser.role === "admin"){
      return (<UserEntryAsAdmin userData={content}/>)
    }else if(currentUser.id === userData.id){
      return (<UserEntryAsUser userData={content}/>)
    }else{
      return (<UserEntry userData={content}/>)
    }
  }

  return (
    <div className="container bg-light">
        {content && currentUser && <DefineView userData={content}/>
        }
    </div>
  );
};

export default User;
