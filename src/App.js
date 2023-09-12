import React, { Component } from "react";
import "./App.css";
import ButtonAppBar from "./components/Navbar.js";
import Router from "./Router";
window.Buffer = window.Buffer || require("buffer").Buffer; 


// class App extends Component {
//   state = {
//     address: "",
//     balance: "",
//     instance: null,
//   };

  // componentDidMount = async () => {
  //   try {
  //     const tezos = await getTezos();
  //     const accountPkh = await tezos.wallet.pkh();
  //     const accountBalance = await tezos.tz.getBalance(accountPkh);
  //     const instance = await tezos.wallet.at(contractAddress);
  //     this.setState({
  //       address: accountPkh,
  //       balance: parseInt(accountBalance) / 1000000,
  //       instance: instance,
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
const App = () => {
    return (
      <div className="App">
        <ButtonAppBar/>
        <br />
        <Router />
      </div>
    );
};

export default App;

