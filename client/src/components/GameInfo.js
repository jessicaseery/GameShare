import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const GameInfo = () => {
const { id } = useParams();
const [game, setGame] = useState(null);

useEffect(() => {
    fetch(`http://localhost:8000/games/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching game: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => setGame(data))
        .catch((error) => console.error("Error fetching game:", error.message));
}, [id]);


return (
    <Wrapper>
    {game ? (
        <Content style={{ backgroundImage: `url(${game.bkg_img})`}}>
        <GameName>{game.name}</GameName>
        {/* <GameImg src={game.bkg_img} alt={game.name} /> */}

        <ReleaseDate>Released on {game.released}</ReleaseDate>
        <Platforms>Platforms: {game.platforms.map((platform) => platform.name).join(', ')}</Platforms>

        <BottomInfo>
        <p>Developer: {game.developper}</p>
        
        <p>Genres: {game.genre.map((genre) => genre.name).join(', ')}</p>
        <p>{game.description}</p>
        </BottomInfo>
        </Content>
    ) : (
        <p>Loading...</p>
    )}
    </Wrapper>
);
};

const Wrapper = styled.div`
    height: 100vh;
    overflow: hidden;
    background-color: #3e3e3e;
`
const ReleaseDate = styled.p`
color: white;
text-align: center;
border-radius: 10px;
`
const Platforms = styled.p`
color: white;
background-color: grey;
border-radius: 10px;
padding: 4px;
text-align: center;
`
const BottomInfo = styled.div`
color: white;
margin-top: 50px;
font-size: 18px;

`

const Content = styled.div`
    padding: 20px;
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
