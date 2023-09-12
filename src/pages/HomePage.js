import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import StickyHeadTable from "../components/Table"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "0 20%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  button: {
    margin: "20!important",
  },
}));

export default function HomePage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>

      <Grid container justifyContent="center" spacing={1}>
        <Grid item xs={12} align="center">
          <StickyHeadTable></StickyHeadTable>
        </Grid>
        <Grid item xs={12} align="center">
          <Link to="AUD" style={{ textDecoration: 'none' }} >
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 20 }}
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Add / Update / Delete Car
            </Button>
          </Link>
          {/* <br /> */}
          <Link to="SignContract" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 20 }}
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Sign Contract
            </Button>
          </Link>
          {/* <br /> */}
          <Link to="payrent" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 20 }}
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Pay Rent
            </Button>
          </Link>
          {/* <br /> */}
          <Link to="comment" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: 20 }}
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              Make comment
            </Button>
          </Link>
          {/* <br /> */}
          <Link to="endcontract" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ margin: 20 }}
              size="large"
              endIcon={<ArrowForwardIcon />}
            >
              End Contract
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}
