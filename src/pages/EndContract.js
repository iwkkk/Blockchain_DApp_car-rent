import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { tezos, contractAddress } from "../utils/tezos";

export default function EndContract(props) {
  const [carNumber, setCarNumber] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const contractInstance = await tezos.wallet.at(contractAddress);
    setInstance(contractInstance);
  };

  const endAgreement = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods.endContract(carNumber).send();
      await operation.confirmation();
      setCarNumber("");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        End Contract
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
        <br />
        <Button
          onClick={() => endAgreement()}
          variant="contained"
          color="primary"
        >
          {loading ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
