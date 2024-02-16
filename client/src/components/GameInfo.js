import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommentSection from './Comments';

const GameInfo = ({loggedInUser}) => {
const { id } = useParams();
const [game, setGame] = useState(null);
const [comments, setComments] = useState([]);

const fetchComments = async () => {
    const response = await fetch(`http://localhost:8000/games/${id}`);
    const data = await response.json();
    return data.comments || [];
};

useEffect(() => {
    fetch(`http://localhost:8000/games/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching game: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setGame(data);
            const apiComments = data.comments || [];

            setComments(apiComments);
        })
        .catch((error) => console.error("Error fetching game:", error.message));
}, [id]);

const refreshComments = async () => {
    const updatedComments = await fetchComments();
    setComments(updatedComments);
};

const handleDeleteComment = async (commentId) => {
    try {
        const res = await fetch(`http://localhost:8000/games/${id}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                commentId: commentId,
            }),
        });
        const resData = await res.json();
        console.log(resData);
        refreshComments();
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};

return (
    <Wrapper>
    {game ? (
        <div>
        <Content style={{ backgroundImage: `url(${game.bkg_img})` }}>
            <GameName>{game.name}</GameName>
        </Content>
        <BottomInfo>
            <div>
            <ReleaseDate>Released on {game.released}</ReleaseDate>
            <Platforms>Platforms: {game.platforms.map((platform) => platform.name).join(', ')}</Platforms>
            <Developper>Developer: {game.developper}</Developper>
            <Genres>Genres: {game.genre.map((genre) => genre.name).join(', ')}</Genres>
            </div>
            <Infobox>
            <Subtitle>Description</Subtitle>
            {game.description}
            <div>
                <Subtitle>Characters</Subtitle>
                {game.characters && game.characters.length > 0 ? (
                <CharacterSection>
                    {game.characters.map((character, index) => (
                    <Character key={index}>
                        <CharacterName>{character.name}</CharacterName>
                        <CharacterImg src={character.image} alt={character.name} />
                    </Character>
    ))}
                </CharacterSection>
    ) : (
                <p>No characters available for this game.</p>
    )}
            </div>
        </Infobox>
        </BottomInfo>
        <Loginpls>
        {loggedInUser ? (
        <Comments>
        <Text>Leave this game a comment!</Text> 
    <CommentSection gameId={game._id} loggedInUser={loggedInUser} refreshComments={refreshComments} />
    <AllIndComments>
    {comments.map((comment) => (
    <IndvComments key={comment.userId}>
    <p>
        <ProfileLink href={`/profile/${comment.userId}`}>{comment.username}</ProfileLink>
        
        
    </p>
    {comment.recommended && <Recommended>✔️</Recommended>}
        <CommentText>{comment.text}</CommentText>
        {comment.userId === loggedInUser.userId && (
            <DeleteButton onClick={() => handleDeleteComment(comment._id)}>🗑️</DeleteButton>
        )}

    </IndvComments>
))}
</AllIndComments>
</Comments>
) : (
    <Text>Please log in to comment and view comments.</Text>
)}
</Loginpls>
        </div>
    ) : (
        <p>Loading...</p>
    )}
    </Wrapper>
)
};

const Wrapper = styled.div`
color: white;
height: 100%;
background-color: #3e3e3e;
`
const DeleteButton = styled.button`
background-color: red;
cursor: pointer;
color: white;
font-size: 10px;
float: right;
border-radius: 20px;
&:hover {
        background-color: darkred;
    }
`
const Loginpls = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
width: 500px;
margin: auto;
`
const Recommended = styled.button`
background-color: transparent;
border: 1px solid green;
color: white;
width: 20px;
font-size: 10x;
border-radius: 10px;
float: left;
padding: 0px;
`
const CommentText = styled.p`
display: flex;
flex-wrap: wrap;
width: 500px;
word-wrap: break-word;
word-break: break-all;
`
const Text = styled.p`
font-size: 20px;
font-family: 'Khand', sans-serif;
color: white;
`
const IndvComments = styled.div`
background-color: white;
color: black;
border: 2px solid purple;
padding: 8px;
width: fit-content;
font-family: 'Khand', sans-serif;
font-weight: bold;
text-align: center;
margin-right: 5%;
height: fit-content;
margin-top: 10px;
border-radius: 10px;
`
const AllIndComments = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
`
const ProfileLink = styled.a`
color: black;
margin-right: 3px;
margin-left: 3px;
font-weight: bold;
float: left;
padding: 2px;
font-size: 17px;
&:hover {
    color: deeppink;
    }
`
const ReleaseDate = styled.p`
color: white;
text-align: left;
border-radius: 10px;
margin-top: 50px;
font-size: 20px;
`
const Character = styled.div`
border: 3px solid purple;
border-radius: 10px;
margin: 8px;
`
const CharacterName = styled.p`
text-align: center;
`
const CharacterSection = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: center;
`
const CharacterImg = styled.img`
width: 175px;
height: 175px;
`
const Subtitle = styled.p`
font-size:40px;
text-decoration: underline;
margin-top: 20px;
`
const Developper = styled.p`
text-align: left;
max-width: 300px;
`
const Platforms = styled.p`
color: white;
border-radius: 10px;
margin-top: 10px;
text-align: left;
`
const Comments = styled.div`
text-align: center;
color: white;
margin-top: 50px;
margin-bottom: 50px;
`
const BottomInfo = styled.div`
color: white;
font-size: 18px;
display: grid;
grid-template-columns: auto auto;
`
const Infobox = styled.div`
font-family: 'Khand', sans-serif;
text-align: center;
border: 2px white solid;
padding: 50px;
background-color: grey;
border-radius: 20px;
margin: 20px;
width: fit-content;
`
const Genres = styled.p`
text-align: left;
margin-bottom: 20px;
`
const Content = styled.div`
padding: 10px;
position: relative;
z-index: 1;
background-size:cover;
width: 80%;
height: 500px;
margin: auto;
box-shadow: inset 0px 0px 30px 30px #3e3e3e;
padding-bottom: 80px ;
`
const GameName = styled.h1`
font-size: 80px;
color: white;
font-family: 'Khand', sans-serif;
font-weight: bold;
text-shadow: 1px 3px 2px black;
display: flex;
justify-content: center;
margin-top: 200px;
`

export default GameInfo;