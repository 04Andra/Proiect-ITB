import React, { useState, useEffect  } from "react";
import { ethers } from "ethers";
import abi from "./IBT-abi.json";
import "./IBTToken.css"

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Adresa contractului

function IBTToken() {
    const [myAccount, setMyAccount] = useState("");
    const [signer, setSigner] = useState(null);
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setMyAccount(accounts.length > 0 ? accounts[0] : "");
            });

            window.ethereum.on("chainChanged", (chainId) => {
                alert(`Ai schimbat networkul la: ${parseInt(chainId, 16)}`);
            });

            return () => {
                window.ethereum.removeListener("accountsChanged", () => {});
                window.ethereum.removeListener("chainChanged", () => {});
            };
        }
    }, []);

    const getBalance = async () => {

        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const balance = await contract.balanceOf(myAccount);
            const formattedBalance = ethers.formatUnits(balance, 18);
            setBalance(formattedBalance);
        } catch (error) {
            console.error(error);
        }
    };

    const connectWallet = async () => {

        if (!window.ethereum) {
            alert("MetaMask nu exista!");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await provider.getSigner();
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            setSigner(newSigner);
            setMyAccount(accounts[0]);
            console.log("Portofel conectat: " + accounts[0]);
        } catch (error) {
            alert("Erroare la conectarea portofelului metamask: " + error);
        }
    };

    const mintTokens = async () => {

        try {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const contractMint = await contract.mint(myAccount, ethers.parseUnits(amount, 18));
            await contractMint.wait();
            console.log(`Valoare: ${amount} adaugata in contul: ${myAccount}`);
            getBalance();
        } catch (error) {
            console.error("Error adaugare de monede:", error);
        }
    };

    return (
        <div className="wallet-container">
            {!myAccount ? (
                <button className="connect-wallet-button" onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <div className="account-info">
                    <p className="info-item">
                        <strong style={{color: "blue"}}>Account:</strong> {myAccount}
                    </p>
                    <p className="info-item">
                        <strong style={{color: "green"}}>Balance:</strong> {balance} IBT
                    </p>
                    <div className="mint-section">
                        <input
                            className="mint-input"
                            type="number"
                            placeholder="Cate monede vrei sa adaugi?"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button className="mint-button" onClick={mintTokens}>
                            Mint IBT Tokens
                        </button>
                    </div>
                    <button className="get-balance-button" onClick={getBalance}>
                        Get Balance
                    </button>
                </div>
            )}
        </div>
    );
}

export default IBTToken;

