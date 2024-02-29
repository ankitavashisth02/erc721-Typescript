import React, { useState,useEffect } from "react";
import { IState } from "./App";
import nftImg from "./assets/NFT-Img.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Body: React.FC<{ state: IState | null }> = (props) => {
    const contract = props.state!.contract;

    const [loading, setLoading] = useState<boolean>(false);
    const [burning, setBurning] = useState<boolean>(false);
    const [mintedAmount, setMintedAmount] = useState(0);
    const [burnState, setBurnState] = useState<boolean>(false);
  
    useEffect(() => {
      try {
        const fetchBalance = async () => {
          // e.preventDefault();
          const fetchAmount = (await contract?.currentPrice());
          console.log(fetchAmount);
          setMintedAmount(Number(fetchAmount) / 10 ** 18);
          console.log(
            "Amount that is fetched : ",
            Number(fetchAmount) / 10 ** 18
          );
        };
        fetchBalance();
      } catch (error) {
        console.log(error);
      }
    },[contract]);
  
    const onHandleChange = async () => {
      const tokenId = await contract?.tokenId1();
      console.log(Number(tokenId));
      //console.log("Amount:", amount.value.toString());
      setBurning(true);
  
      const burned = await contract?.burn1(Number(tokenId));
  
      await burned.wait();
  
      setBurning(false);
      toast("nft Burned !!");
      console.log("Burned");
      setBurnState(false);
    };
  
    async function mintNFT(tokenURI : string) {
      try {
        //console.log(tokenURI);
        const amt = await contract?.currentPrice();
        console.log(Number(amt));
        const options = { value: Number(amt) };
  
        setLoading(true);
  
        const txn = await contract?.mintNFT(tokenURI, options);
        toast("Transaction is proccessing..");
        if(!await txn.wait()){
            setLoading(false)
        }
        
        await txn.wait();
        setLoading(false);
  
        toast("Minted");
        //console.log("Minted NFT!");
        setBurnState(true);
      
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <div className="center-container">
        <img src={nftImg} alt="nft" />
        <button
          onClick={() =>
            mintNFT(
              "https://gateway.pinata.cloud/ipfs/QmbmoyEnwjArC8JXhDU4zQcoPq2FdvjzeoJHZTBjRBsBGg"
            )
          }
        >
          {loading ? "Minting.." : `Mint@ ${mintedAmount}`}
        </button>
  
        {burnState && (
          <button onClick={() => onHandleChange()}>
            {burning ? "Burning.." : "Burn last token"}
          </button>
        )}
        <ToastContainer />
      </div>
    );
};

export default Body;