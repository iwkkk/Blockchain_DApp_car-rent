import React, { useState, useEffect } from "react";
import { Button, TextField, Typography} from "@material-ui/core";
import { tezos, contractAddress } from "../utils/tezos";


export default function PayRent(props) {
  const [carNumber, setCarNumber] = useState("");
  const [rent, setRent] = useState(0);
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const contractInstance = await tezos.wallet.at(contractAddress);
    setInstance(contractInstance);
  };

  const payRent = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods
        .payRent(carNumber)
        .send({ amount: rent });
      await operation.confirmation();
      setCarNumber("");
      setRent(0);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };


  return (
    <div className="center">
      <Typography variant="h4" component="h2">
        Pay rent
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
          label="rent"
          className="text-field-key"
          onChange={(e) => setRent(e.target.value)}
          value={rent}
        />
        <br />
        <br />
        <Button
          onClick={() => payRent()}
          variant="contained"
          color="primary"
        >
          {loading ? "Loading..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
}
