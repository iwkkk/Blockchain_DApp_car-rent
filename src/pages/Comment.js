import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@material-ui/core";
import { tezos, contractAddress } from "../utils/tezos";

export default function SignContract(props) {
    const [carNumber, setCarNumber] = useState("");
    const [comment, setComment] = useState("");
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getInstance();
    }, [props]);

    const getInstance = async () => {
        const contractInstance = await tezos.wallet.at(contractAddress);
        setInstance(contractInstance);
    };

    const makeComment = async () => {
        try {
            setLoading(true);
            const operation = await instance.methods
                .makeComment(carNumber, comment)
                .send();
            await operation.confirmation();
            setCarNumber("");
            setComment("");
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="center">
            <Typography variant="h4" component="h2">
                Make Comments
            </Typography>
            <div className="form-container">
                <TextField
                    id="carnumber"
                    label="Car Number"
                    className="text-field-key"
                    onChange={(e) => setCarNumber(e.target.value)}
                    value={carNumber}
                />
                <br />
                <TextField
                    id="comment"
                    label="Comment"
                    className="text-field-key"
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                />
                <br />
                <br />
                <Button
                    onClick={() => makeComment()}
                    variant="contained"
                    color="primary"
                >
                    {loading ? "Loading..." : "Confirm"}
                </Button>
            </div>
        </div>
    );
}
