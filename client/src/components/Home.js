import React, { useState, useEffect } from "react";
import styled from "styled-components"
import { Link } from "react-router-dom";

const Home = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {

    fetch("http://localhost:8000/games")
        .then((response) => response.json())
        .then((data) => setGames(data))
        .catch((error) => console.error("Error fetching games:", error));
    }, []);

    return(
        <Wrapper>
        {games.map((game) => (
        <Link to={`/games/${game._id}`} key={game._id}>
            <Game>
            <GameImage src={game.bkg_img} alt={game.name} />
            <GameName>{game.name}</GameName>
            </Game>
        </Link>
        ))}
    </Wrapper>
    )
}

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #3e3e3e;
    height: 100%;
`;

const Game = styled.div`
    position: relative;
    filter: grayscale(20%);

&:hover {
    filter: grayscale(0%);
}
`;

const GameImage = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
`;

const GameName = styled.p`
    color: white;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 25px;
    font-family: 'Khand', sans-serif;
    font-weight: bold;
    text-shadow: 1px 3px 2px black;
`;

export default Home