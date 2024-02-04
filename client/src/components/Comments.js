import React, {useState} from "react";
import styled from "styled-components";

const CommentSection = ({ loggedInUser, gameId }) => {
    const [commentText, setCommentText] = useState('');
    const [recommended, setRecommended] = useState(true);

    const handleCommentSubmit = async () => {
    try {
        if (!loggedInUser) {
            console.log('User not logged in. Please log in to comment and view comments.');
            return;
        }
        const res = await fetch(`http://localhost:8000/games/${gameId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: loggedInUser.userId,
            username: loggedInUser.username,
            text: commentText,
            recommended,
        }),
        });

        const resData = await res.json();
        console.log(resData);
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
    };

    return (
    <Wrapper>
        {loggedInUser ? (
            <div>
        <div>
        <CommentText value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..."/>
        </div>
        <RightSide>
        <label>
            <input type="checkbox" checked={recommended} onChange={() => setRecommended((prev) => !prev)}/>
            Recommended
        </label>
        <SubmitBtn onClick={handleCommentSubmit}>Submit</SubmitBtn>
        </RightSide>
        </div>
        ) : (
            <p>Please log in to comment.</p>
        )}
    </Wrapper>
    );
};
const Wrapper = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
border: 3px solid purple;
width: 500px;
margin: auto;
background-color: violet;
`
const SubmitBtn = styled.button`
padding: 8px 15px;
background-color: grey;
color: white;
border: 3px black solid;
border-radius: 20px;
`
const RightSide = styled.div`
display: flex;
flex-direction: column;
`
const CommentText = styled.input`
width: 250px;
height:50px;
`

export default CommentSection