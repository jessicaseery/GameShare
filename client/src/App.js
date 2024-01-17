import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import Home from "./components/Home"
import GlobalStyles from "./GlobalStyles";
import GameInfo from "./components/GameInfo";

const App = () => {

  return (
    <BrowserRouter>
    <GlobalStyles/>
    <Header />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/games/:id" element={<GameInfo/>}/>
        </Routes>
    </BrowserRouter>
  );
}


export default App;