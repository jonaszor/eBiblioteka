import { useEffect, useState } from "react";
import { Row, Button, Badge } from "react-bootstrap";
import UserService from "../services/user.service";

export default function Reactions({reactions, profile, bookId}){ //Works, but the number doesn't update in real time

    let [hasLiked, setLiked] = useState(false)
    let [hasDisliked, setDisliked] = useState(false)

    function partition(array, filter) { //Might be useful elsewhere as a tool
        let pass = [], fail = [];
        array.forEach((e, idx, arr) => (filter(e, idx, arr) ? pass : fail).push(e));
        return [pass, fail];
      }
    
    let [likes, dislikes] = partition(reactions, (e) => e["like"])
    //console.log(reactions)

    useEffect(()=>{
        if(profile){
            let currentReaction = profile.reactions.find((reaction) => reaction.bookId == bookId)
            if(currentReaction){
                if(currentReaction.like){
                setLiked(true)
                }
                else{
                    setDisliked(true)
                }
            }
            
        }
    },[profile, bookId])

    function onLike(){

        if(hasLiked){
            UserService.postUserReaction(bookId, true)
            setLiked(false)
        }
        else{
            UserService.postUserReaction(bookId, false, true)
            setLiked(true)
            setDisliked(false)
        }
    }

    function onDislike(){
        if(hasDisliked){
            UserService.postUserReaction(bookId, true)
            setDisliked(false)
        }
        else{
            UserService.postUserReaction(bookId, false, false)
            setLiked(false)
            setDisliked(true)
        }
    }

    return(
    <Row className="flex-row-reverse px-4">
        <Button onClick={onDislike} variant={hasDisliked? "danger":"outline-danger"} disabled={!profile} className="w-auto m-1">Dislike <Badge>{dislikes.length}</Badge></Button>
        <Button onClick={onLike} variant={hasLiked? "success": "outline-success"} disabled={!profile} className="w-auto m-1">Like <Badge>{likes.length}</Badge></Button> 
    </Row>
    )
}