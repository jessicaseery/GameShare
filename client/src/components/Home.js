import React, { useState, useEffect } from "react";
import styled from "styled-components"
import { Link } from "react-router-dom";

const Home = ({loggedInUserId, setGameNamesAndIds}) => {
    const [games, setGames] = useState([]);
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [wishlist, setWishlist] = useState([])

    useEffect(() => {
        fetch("http://localhost:8000/games")
            .then((response) => response.json())
            .then((data) => {
                const gameNamesAndIds = data.map(({ _id, name }) => ({ id: _id, name }));
                setGameNamesAndIds(gameNamesAndIds);
                setGames(data);
            })
            .catch((error) => console.error("Error fetching games:", error));
            if (loggedInUserId) {
            fetch(`http://localhost:8000/users/${loggedInUserId}/favorites`)
            .then((response) => response.json())
            .then((data) => {
                setFavoriteGames(data);
            })
            .catch((error) => console.error("Error fetching favorite games:", error));
            fetch(`http://localhost:8000/users/${loggedInUserId}/wishlist`)
            .then((response) => response.json())
            .then((data) => {
                setWishlist(data);
            })
            .catch((error) => console.error("Error fetching wishlisted games:", error));
        }
    }, [loggedInUserId, setGameNamesAndIds]);

    const handleAddToFavorites = async (gameId) => {
        try {
            if (isFavorite(gameId)) {
                const response = await fetch(`http://localhost:8000/users/${loggedInUserId}/favorites/${gameId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to remove game from favorites');
                }
                setFavoriteGames(prevFavoriteGames => prevFavoriteGames.filter(id => id !== gameId));
            } else {
            const response = await fetch(`http://localhost:8000/users/${loggedInUserId}/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameId }),
            });
            if (!response.ok) {
                throw new Error('Failed to add game to favorites');
            }
            setFavoriteGames(prevFavoriteGames => [...prevFavoriteGames, gameId]);
            }
        } catch (error) {
            console.error('Error adding game to favorites:', error);
        }
    };
    const handleAddToWishlist = async (gameId) => {
        try {
            if (isWishlist(gameId)) {
                const response = await fetch(`http://localhost:8000/users/${loggedInUserId}/wishlist/${gameId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to remove game from wishlist');
                }
                setWishlist(prevWishlist => prevWishlist.filter(id => id !== gameId));
            } else {
            const response = await fetch(`http://localhost:8000/users/${loggedInUserId}/wishlist`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameId }),
            });
            if (!response.ok) {
                throw new Error('Failed to add game to wishlist');
            }
            setWishlist(prevWishlist => [...prevWishlist, gameId]);
            }
        } catch (error) {
            console.error('Error adding game to wishlist, try again', error);
        }
    };

    const isFavorite = (gameId) => {
        if (Array.isArray(favoriteGames)) {
            return favoriteGames.includes(gameId);
        }
        return false;
    };
    const isWishlist = (gameId) => {
        if (Array.isArray(wishlist)) {
            return wishlist.includes(gameId);
        }
        return false;
    };

    return(
        <Wrapper>
        {games.map((game) => (
        <Game key={game._id}>
            <GameContent>
        <Link to={`/games/${game._id}`}>
            <GameImage src={game.bkg_img} alt={game.name} />
            <GameName>{game.name}</GameName>   
        </Link>
        {loggedInUserId && (
            <div>
        <FavoriteButton customprops={{ favorite: isFavorite(game._id) }} onClick={() => handleAddToFavorites(game._id)}>
            ❤️
        </FavoriteButton>
        <WishlistButton customprops={{ wishlist: isWishlist(game._id) }} onClick={() => handleAddToWishlist(game._id)}>
        ⭐
    </WishlistButton>
    </div>
        )}
        </GameContent>
        </Game>
        ))}
    </Wrapper>
    )
}
const Game = styled.div`
    position: relative;
    filter: grayscale(20%);
&:hover {
    filter: grayscale(0%);
}
`
const GameContent = styled.div`
position: relative;
`
const Wrapper = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
gap: 20px;
justify-content: center;
align-items: center;
padding: 20px;
padding-top: 100px;
`

const FavoriteButton = styled.button`
    background: none;
    border: none;
    color: ${({ customprops }) => (customprops.favorite ? 'pink' : 'rgba(128, 128, 128, 1)')};
    filter: ${({ customprops }) => (customprops.favorite ? 'none' : 'grayscale(100%)')};
    font-size: 24px;
    cursor: pointer;
    
`
const WishlistButton = styled.button`
    background: none;
    border: none;
    color: ${({ customprops }) => (customprops.wishlist ? 'yellow' : 'rgba(128, 128, 128, 1)')};
    filter: ${({ customprops }) => (customprops.wishlist ? 'none' : 'grayscale(100%)')};
    font-size: 24px;
    cursor: pointer;
`;

const GameImage = styled.img`
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
`

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