import React, { useState } from "react";
import { Button, CardContent, InputAdornment, OutlinedInput, Avatar} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Link, useNavigate } from "react-router-dom";
import { PostWithAuth, RefreshToken } from "../../services/HttpService";

const useStyles = makeStyles((theme) => ({
  comment : {
        display: "flex",
        flexWrap: "wrap",
        justifyContent : "flex-start",
        alignItems : "center",
      },
      small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
      },
      link: {
          textDecoration : "none",
          boxShadow : "none",
          color : "white"
      }
}));


function CommentForm(props) {
    const {userId, userName, postId, setCommentRefresh} = props;
    const classes =useStyles();
    const [text, setText] = useState("");

    let history = useNavigate();

    const logout = () => {
      localStorage.removeItem("tokenKey")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("refreshKey")
      localStorage.removeItem("userName")
      navigate(0)
    }


     const saveComment = () => {
        PostWithAuth("/comments",{
            postId: postId, 
            userId : userId,
            text : text,
          })
          .then((res) => {
            if(!res.ok) {
                RefreshToken()
                .then((res) => { if(!res.ok) {
                    logout();
                } else {
                   return res.json()
                }})
                .then((result) => {
                    console.log(result)

                    if(result != undefined){
                        localStorage.setItem("tokenKey",result.accessToken);
                        saveComment();
                        setCommentRefresh();
                    }})
                .catch((err) => {
                    console.log(err)
                })
            } else 
            res.json()
        })
          .catch((err) => {
            console.log(err)
          })
    }
    const handleChange = (value) => {
        setText(value);
    }
    
    const handleSubmit = () => {
        saveComment();
        setText("");
        setCommentRefresh();
    }

    return (
        <CardContent className = {classes.comment}>

        <OutlinedInput
        
        id="outlined-adornment-amount"
        multiline
        inputProps = {{maxLength : 250}}
        fullWidth
        onChange = {(i) =>  handleChange(i.target.value)}     
        startAdornment = {
            <InputAdornment position="start">
                <Link  className={classes.link} to={{pathname : '/users/' + userId}}>
                    <Avatar aria-label="recipe" className={classes.small}>
                        
                    </Avatar>
                </Link>
            </InputAdornment>
        }
            endAdornment = {
                <InputAdornment position = "end">
                    <Button
                        variant="contained"
                        style={{background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        color: 'white'}}
                onClick={handleSubmit}> Comment</Button>
                </InputAdornment>
            }
        value={text}
        style = {{ color : "black",backgroundColor: 'white'}}
        ></OutlinedInput>
        </CardContent>
    )
}

export default CommentForm;