// TODO 2.a - Setup beacon wallet instance
import { BeaconWallet } from "@taquito/beacon-wallet";

export const wallet = new BeaconWallet({
  name: "Car Renting Dapp",
  preferredNetwork: "ghostnet",
});

// Setup connectWallet function (on ghostnet)
export const connectWallet = async () => {
  await wallet.requestPermissions({ network: { type: "ghostnet" } });
};

// Setup getAccount function
export const getAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount();
  if (activeAccount) {
    return activeAccount.address;
  } else {
    return "";
  }
};