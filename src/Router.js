import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import SignContract from "./pages/SignContract.js";
import AUD from "./pages/AUD.js";
import PayRent from "./pages/PayRent.js";
import EndContract from "./pages/EndContract.js";
import Comment from "./pages/Comment";

const Router = () => (
  <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signContract' element={<SignContract />} />
        <Route path='/AUD' element={<AUD />} />
        <Route path='/payrent' element={<PayRent />} />
        <Route path='/comment' element={<Comment />} />
        <Route path='/endcontract' element={<EndContract />} />
      </Routes>
  </BrowserRouter>
);

export default Router;
