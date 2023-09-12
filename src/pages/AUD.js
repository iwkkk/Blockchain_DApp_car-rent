import React, { useState, useEffect } from "react";
import { Button, TextField, Tabs, Tab, Box, Container } from "@material-ui/core";
import PropTypes from 'prop-types';
import { tezos, contractAddress } from "../utils/tezos";
import { makeStyles } from '@material-ui/core/styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container>
          <Box>
            {children}
          </Box>
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function AddOrUpdateOrDelete(props) {
  const [carNumber, setCarNumber] = useState("");
  const [carName, setCarName] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [rent, setRent] = useState(0);
  const [description, setDescription] = useState("");
  const [instance, setInstance] = useState("");
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getInstance();
  }, [props]);

  const getInstance = async () => {
    const contractInstance = await tezos.wallet.at(contractAddress);
    setInstance(contractInstance);
    console.log(contractInstance);
  };

  const addCar = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods
        .addCar(carName, carNumber, deposit, description, rent)
        .send();
      await operation.confirmation();
      setCarNumber("");
      setCarName("");
      setDeposit(0);
      setRent(0);
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const updateCar = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods
        .update(carNumber, deposit, description, carName, rent)
        .send();
      await operation.confirmation();
      setCarNumber("");
      setCarName("");
      setDeposit(0);
      setRent(0);
      setDescription("");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const deleteCar = async () => {
    try {
      setLoading(true);
      const operation = await instance.methods
        .deleteCar(carNumber)
        .send();
      await operation.confirmation();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} onChange={handleChange} orientation="vertical" className={classes.tabs} >
        <Tab label="Add Car" {...a11yProps(0)} />
        <Tab label="Update Car" {...a11yProps(1)} />
        <Tab label="Delete Car" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="form-container">
          <TextField
            id="standard-basic"
            label="Enter Car Number"
            className="text-field-key"
            onChange={(e) => setCarNumber(e.target.value)}
            value={carNumber}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Car Name"
            className="text-field-key"
            onChange={(e) => setCarName(e.target.value)}
            value={carName}
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
          <TextField
            id="standard-basic"
            label="Rent Per Month"
            className="text-field-key"
            onChange={(e) => setRent(e.target.value)}
            value={rent}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Car Description"
            className="text-field-key"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <br />
          <br />
          <Button
            onClick={() => addCar()}
            variant="contained"
            color="primary"
          >
            {loading ? "Loading..." : "Add"}
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="form-container">
          <TextField
            id="standard-basic"
            label="Enter Car Number"
            className="text-field-key"
            onChange={(e) => setCarNumber(e.target.value)}
            value={carNumber}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Car Name"
            className="text-field-key"
            onChange={(e) => setCarName(e.target.value)}
            value={carName}
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
          <TextField
            id="standard-basic"
            label="Rent Per Month"
            className="text-field-key"
            onChange={(e) => setRent(e.target.value)}
            value={rent}
          />
          <br />
          <TextField
            id="standard-basic"
            label="Car Description"
            className="text-field-key"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <br />
          <br />
          <Button
            onClick={() => updateCar()}
            variant="contained"
            color="primary"
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="form-container">
          <TextField
            id="standard-basic"
            label="Enter Car Number"
            className="text-field-key"
            onChange={(e) => setCarNumber(e.target.value)}
            value={carNumber}
          />
          <br />
          <br />
          <Button
            onClick={() => deleteCar()}
            variant="contained"
            color="primary"
          >
            {loading ? "Loading..." : "Delete"}
          </Button>
        </div>
      </TabPanel>
    </div>
  );
}
