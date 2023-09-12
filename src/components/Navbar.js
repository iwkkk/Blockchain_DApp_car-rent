import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connectWallet, getAccount } from "../utils/wallet";
import { Button, AppBar, Toolbar, Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    // flexGrow: 1,
    marginRight: "auto",
  },
}));

const Navbar = () => {
  const [account, setAccount] = useState("");

  useEffect(() => {
    (async () => {
      // TODO 5.b - Get the active account
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);

  // TODO 4.a - Create onConnectWallet function
  const onConnectWallet = async () => {
    await connectWallet();
    const account = await getAccount();
    setAccount(account);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title} >
            <a href="/" style={{ textDecoration: 'none', color:'inherit' }}>
              Car Renting Dapp
            </a>
          </Typography>
          <Button color="inherit" variant="outlined" flexgrow={1} onClick={() => onConnectWallet()} >
            {/* Show account address if wallet is connected */}
            {account ? account : "Connect Wallet"}
          </Button>
        </Toolbar>
      </AppBar>
    </div >
  );
};


export default Navbar;
