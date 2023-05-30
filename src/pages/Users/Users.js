import React, { useState, useEffect } from "react";
import { Image, Badge, Button, Container, Row, Col, Stack } from "react-bootstrap";

import BookService from "../../services/book.service";
import { Link, useLoaderData } from "react-router-dom";

import useUser from "../../services/useUser";

const Users = () => {
  const content = useLoaderData();
  const [currentUser] = useUser();

  function UserEntryAsAdmin({userData}){
    return(
      <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={8}>
                <h5 className="">{userData.email} [{(userData.isAccountBlocked == false) && <b style={{color: "#AB2328"}}>Blocked</b>}{(userData.isAccountBlocked == true) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                <p className="m-0">First & Last name: <b>{userData.firstName} {userData.lastName}</b></p>
                <p className="m-0">Debt: {(userData.amountToPay != 0) && <b style={{color: "#AB2328"}}>{userData.amountToPay} zł</b>} {(userData.amountToPay == 0) && "-"}</p>
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                
              </Col>
              <Col md={2}>
                <Row>
                  <Col md={6}>
                  {(currentUser?.role == "admin") && <Link to={`/user/${userData.id}/profile`}><Button>Manage</Button></Link>}
                  </Col>
                  <Col md={6}>
                  <Link to={`/user/${userData.id}/profile`}><Button className="mx-1">Profile</Button></Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
    )
  }

  function UserEntry({userData}){
    console.log(userData);
    return(
      <div className="border p-3 shadow m-2 overflow-hidden">
            <Row md={3}>
              <Col md={2}>
                <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" thumbnail className="mx-2 img-thumbnail" style={{maxHeight: "150px"}}/>
              </Col>
              <Col fluid={"true"} md={9}>
                <h5 className="">{userData.firstName} [{(userData.isAccountBlocked == false) && <b style={{color: "#AB2328"}}>Blocked</b>}{(userData.isAccountBlocked == true) && <b style={{color: "#5AAB2B"}}>Active</b>}]</h5>
                {(userData.description) && <p className="m-0">Description: {userData.description}</p>}
                <p className="m-0">Watchlist: {userData.watchList.length}</p>
                
              </Col>
              <Col md={1}>
                <Link to={`/user/${userData.id}/profile`}><Button className="mx-1">Profile</Button></Link>
              </Col>
            </Row>
          </div>
    )
  }

  return (
    <div className="container bg-light">
        <h3>Users list:</h3>
        {content && currentUser && content.map((user) => {
          if(currentUser.role == "admin"){
            return <UserEntryAsAdmin userData={user} key={user.id}/>
          }
          return <UserEntry userData={user} key={user.id}/>
          
        })}
    </div>
  );
};

export default Users;
