import Upload from './artifacts/contracts/Upload.sol/Upload.json';
import { useState, useEffect } from "react";
import './App.css';
import { ethers } from 'ethers';
import FileUpload from './components/FileUpload.jsx';
import Display from './components/Display.jsx';
import Modal from "./components/Modal.jsx";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to connect to the wallet and Ethereum network
  useEffect(() => {
    const loadProvider = async () => {
      setLoading(true);  // Show loading message
  
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          window.ethereum.on("chainChanged", ()=> { 
            window.location.reload();
          });
          window.ethereum.on("accountsChanged", ()=>{    // on changing the account
            window.location.reload();
          })

          await provider.send("eth_requestAccounts", []);  
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
          
          // Initialize contract instance
          const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
          console.log(contract);
  
          // Set contract and provider in state
          setContract(contract);
          setProvider(provider);
        } catch (err) {
          setError(`Failed to connect: ${err.message}`);
          console.error(err);
        }
      } else {
        setError("MetaMask is not installed. Please install it to proceed.");
      }
      setLoading(false);
    };
  
    loadProvider();
  }, []);  // Empty dependency array means this effect runs once on mount
  
  return (
    <>
      {/* {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>} */}
     <div className='App'>
      <h1 style={{color: "white"}}> GDRIVE 3.0</h1>
      <div className='bg'></div>
      <div className='bg bg2'></div>
      <div className='bg bg3'></div>

      <p style={{color:"white"}}>Account: {account ? account:"Not Connected"}</p>
     </div>
      
      <FileUpload 
      account={account}
      provider={provider}
     contract={contract}    
      ></FileUpload>
      {/* If Modal is open, display it
      {modalOpen && <Modal />} */}
    </>
  );
}

export default App;
