import { useState } from "react";
import axios from 'axios';
import "./FileUpload.css";

const FileUpload =({contract, account, provider})=>{
    const [file, setFile] = useState(null);
    const [fileName, setFileName]= useState("No image");
    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (file) {
          try {
            const formData = new FormData();
            formData.append("file", file);
    
            const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
                pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
                "Content-Type": "multipart/form-data",
              },
            });
            const imgHash = `ipfs://${resFile.data.IpfsHash}`;
            const signer = contract.connect(provider.getSigner());
            const tx = await signer.add(account, imgHash);
            await tx.wait();

            console.log("Pinata response:", resFile.data);
            alert("File Uploaded Successfully!");
            setFile(null);
            setFileName("No image selected");
          } catch (error) {
            console.error("Upload error:", error);
            alert("File Upload Failed!");
          }
        } else {
          alert("No File Selected!");
        }
      };
    

    const retrieveFile = (event) => {

    };

    return( <div>
       <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
            Choose Image
        </label>
        <input type="file" disabled={!account} id="file-upload" name="data" onChange={retrieveFile} />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload">Upload</button>
       </form>
    </div>
    )
    };
    
    export default FileUpload;