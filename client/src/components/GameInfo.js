import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommentSection from './Comments';

const GameInfo = ({loggedInUser}) => {
const { id } = useParams();
const [game, setGame] = useState(null);
const [comments, setComments] = useState([]);

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


return (
    <Wrapper>
    
    {game ? (
        <div>
        <Content style={{ backgroundImage: `url(${game.bkg_img})` }}>
            <GameName>{game.name}</GameName>
        </Content>
          {/* <GameImg src={game.bkg_img} alt={game.name} /> */}
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
        <Comments>
    <CommentSection gameId={game._id} loggedInUser={loggedInUser} />
    {comments.map((comment) => (
    <div key={comment.userId}>
    <p>
        <ProfileLink href={`/profile/${comment.userId}`}>{comment.username}</ProfileLink>
    </p>
        <p>{comment.text}</p>
        {comment.recommended && <button />}

    </div>
))}
</Comments>
        </div>
    ) : (
        <p>Loading...</p>
    )}
    </Wrapper>
);
};

const Wrapper = styled.div`
    height: 100%;
    background-color: #3e3e3e;
    margin: 0;
    body, html {
        height: 100%;
        margin: 0;
        background-color: #3e3e3e;
    }
    
`
const ProfileLink = styled.a`
color:white;
text-decoration: none;
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
display: grid;
grid-template-columns: auto auto auto auto auto auto auto auto auto;
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
`
const Genres = styled.p`
text-align: left;
margin-bottom: 20px;
`

const Content = styled.div`
    padding: 10px;
    position: relative;
    z-index: 1;
    background-size: cover;
    background-position: center;
    height: 500px; 

    &::after {
    content: ''; //to make it blurry
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px; 
    background: linear-gradient(to bottom, rgba(62, 62, 62, 0), #3e3e3e);
    z-index: 2;
    }
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
/* const GameImg = styled.img`
    width: 100%;
    border-radius: 8px;
` */
export default GameInfo;
