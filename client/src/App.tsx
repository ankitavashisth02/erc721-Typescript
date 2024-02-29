import React, {useState, useEffect} from 'react';
import './App.css';
import Body from './Body';
import abi from './assets/MyNFT.json';
import {ethers} from  "ethers";

interface IAccount {
  account : string | null;
}

export interface IState {
  provider : ethers.BrowserProvider | null;
  signer : ethers.JsonRpcSigner | null;
  contract : ethers.Contract | null;
}

const App : React.FC = () =>{
  const [accounts, setAccounts] = useState<IAccount>({
    account : null
  });

  const [state, setState] = useState<IState | null>({
    provider: null,
    signer: null,
    contract: null
  });

  // console.log(accounts);

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x2016a0A892FdfD0ee9f714F29CBcdD49F5c58515";
      const contractAddressAbi = abi.abi;

      // const contractAddressAbi = abi;

      try {
        const { ethereum } = window;
        if (ethereum) {
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractAddressAbi,
            signer
          );

          setAccounts({
            account: account[0]
          });
          
          setState({ provider, signer, contract });
        } else {
          alert("metamask not installed");
        }
      } catch (error) {
        console.log(error);
      }
    };
    connectWallet();
  }, []);

  return (
    <React.Fragment>
      <h1>Connected Account : {accounts.account}</h1>
      <Body state={state} />
    </React.Fragment>
  );
}

export default App;