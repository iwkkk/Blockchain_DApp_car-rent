import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { tezos, contractAddress } from "../utils/tezos";

export default function SignContract(props) {
  const [carNumber, setCarNumber] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const contractInstance = await tezos.wallet.at(contractAddress);
    setInstance(contractInstance);
  };

  const signContract = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods
        .signContract(carNumber)
        .send({ amount: deposit });
      await operation.confirmation();
    } catch (err) {
      alert(err.message)
    }
    setCarNumber("");
    setDeposit(0);
    setLoading(false);
  };

  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Sign Agreement & Pay Deposit
      </Typography>
      <div className="form-container">
        <TextField
          id="standard-basic"
          label="Car Number"
          className="text-field-key"
          onChange={(e) => setCarNumber(e.target.value)}
          value={carNumber}
        />
        <br />
        <TextField
          id="standard-basic"
          label="Deposit Amount"
          className="text-field-key"
          onChange={(e) => setDeposit(e.target.value)}
          value={deposit}
        />
        <br />
        <br />
        <Button
          onClick={() => signContract()}
          variant="contained"
          color="primary"
        >
          {loading ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
