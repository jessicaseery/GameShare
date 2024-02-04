import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import Home from "./components/Home"
import GlobalStyles from "./GlobalStyles";
import GameInfo from "./components/GameInfo";
import Profile from "./components/Profile";

const App = () => {
  const [gameNamesAndIds, setGameNamesAndIds] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <BrowserRouter>
    <GlobalStyles/>
    <Header gameNamesAndIds={gameNamesAndIds} setLoggedInUser={setLoggedInUser} loggedInUser={loggedInUser}/>
        <Routes>
          <Route path="/" element={<Home setGameNamesAndIds={setGameNamesAndIds}/>}/>
          <Route path="/games/:id" element={<GameInfo loggedInUser={loggedInUser}/>}/>
          <Route path="/profile/:id" element={<Profile loggedInUser={loggedInUser}/>}/>
        </Routes>
    </BrowserRouter>
  );
}


export default App;