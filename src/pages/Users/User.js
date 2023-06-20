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
  const [getWatchList, setWatchList] = useState([]);
  const [getCurrentUserProfile, setCurrentUserProfile] = useState({});

  const isAddedToWatchList = async (id) => {
    console.log("isAddedToWatchList", getCurrentUserProfile)
    return getCurrentUserProfile.watchList.find((element) => element.id == id);
  }
  

  useEffect(() => {
    
  },[])

  useEffect(() => {
    setWatchList(content.watchList);
    setisAccountBlocked(content.isAccountBlocked);
    async function getProfile(){
      let userProfile = (await UserService.getUserProfileById(currentUser.id)).data
      return userProfile
    }

    if(currentUser){
      getProfile().then((profile)=>{ //Wait until you have profile, then. Maybe the watchlist part should be moved to a seperate component
        console.log(profile);
        setCurrentUserProfile(profile)
      })
    }
  },[currentUser])

  async function handleClickBlockAcc (){
    await UserService.postUsertoggleBlock(content.id, isAccountBlocked);
    setisAccountBlocked(!isAccountBlocked);
  }

  async function handleClickAddToWatchlist(event){
    let id = event.target.id;
    UserService.postUsertoggleWatchlist(id, isAddedToWatchList(id)).then(() => {
      
    });
  }

  function WatchList({userData}){
    return(
      getWatchList && getWatchList.length != 0 && getWatchList.map((book) => 
        <Row md={1} style={{minHeight: "4vh"}}>
          <Col md={1} xs={2} className="mx-auto text-align: center; ">
            <Link to={`/books/${book.id}`} className="text-decoration-none" >
              <Image src={book.imageUrl} thumbnail fluid className="mx-2 p-1 mh-50 mx-auto" style={{maxHeight: "10vh"}}/>
            </Link>
          </Col>
          <Col fluid={"true"} md={9} xs={6} className="mx-auto">
            <h4 className="mt-2">{book.title}</h4>
          </Col>
        </Row>
    ))
  }
  /*
  <Col fluid={"true"} md={2} xs={4}>
            <Link to={`/books/${book.id}`} className="text-decoration-none" ><Button className="mx-auto">Zobacz</Button></Link>
          </Col>*/

  function UserDetails({userData}){
    return(
      <Row>
        
        <Col sm={12} xs={12}>
          <hr/>
          <h4>WatchList:</h4>
          <WatchList userData={userData}></WatchList>
        </Col>
        
        <Col sm={12} xs={12}>
          <hr/>
          <h4>Reviews:</h4>
          <WatchList userData={userData}></WatchList>
        </Col>
      </Row>
    )
  }
/*<Col md={2}>
          {currentUser && <Button id={book.id} itemID={book.id} variant={isAddedToWatchList(book.id) ? "danger" : "success"} onClick={handleClickAddToWatchlist}>{isAddedToWatchList(book.id) ? "Usun z watchlisty" : "Dodaj do watchlisty"}</Button>}
          </Col>*/
  

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
                  {(currentUser?.role == "admin") && <Link to={`/user/${userData.id}/profile`}><Button variant={isAccountBlocked ? "danger" : "success"} onClick={handleClickBlockAcc}>{isAccountBlocked ? "Zablokuj" : "Odblokuj"}</Button></Link>}
                  </Col>
                </Row>
              </Col>
            </Row>
            <UserDetails userData={userData}/>
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
            <UserDetails userData={userData}/>
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
            <UserDetails userData={userData}/>
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
