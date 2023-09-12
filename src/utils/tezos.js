// Setup Tezos toolkit
import { TezosToolkit } from "@taquito/taquito";
import { wallet } from "./wallet";

export const tezos = new TezosToolkit("https://ghostnet.smartpy.io");
export const contractAddress = "KT1UCGH6tR18iaQfQWoJPxjo2x8cTTuULQPG";
//export const contractAddress = "KT1DLdFQkn9bTaxduKAvVm7mG1hxgXccne4i";

// Specify wallet provider for Tezos instance
tezos.setWalletProvider(wallet);
