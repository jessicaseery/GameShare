import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import Home from "./components/Home"
import GlobalStyles from "./GlobalStyles";
import GameInfo from "./components/GameInfo";

const App = () => {
  const [gameNamesAndIds, setGameNamesAndIds] = useState([]);
  return (
    <BrowserRouter>
    <GlobalStyles/>
    <Header gameNamesAndIds={gameNamesAndIds}/>
        <Routes>
          <Route path="/" element={<Home setGameNamesAndIds={setGameNamesAndIds}/>}/>
          <Route path="/games/:id" element={<GameInfo/>}/>
        </Routes>
    </BrowserRouter>
  );
}


export default App;