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
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1ZjU2ZTA0Mi0wMTNhLTQ0YjAtYmMxOC0yODQ3YmI4YTE3ZTEiLCJlbWFpbCI6Im11ZGFzaXJzaGFoOTc3N0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGUzN2IwMzk3MWE4YzRmY2E1NDciLCJzY29wZWRLZXlTZWNyZXQiOiJlYzdkN2M2OWM3MzJkYzU0ZTBkOGEzNGJhY2UxZDJlZDMyMTY5NTQ3ZDU0NWFiYjFmMTg4YWU2NWFhMzE1NzlkIiwiZXhwIjoxNzc3Mzk1NzcxfQ.utH4Av4DIeZbi3I0mAjeMSg4j0gQisoYsWYvdNZF6qI`,
                pinata_api_key: `8e37b03971a8c4fca547`,
                pinata_secret_api_key: `ec7d7c69c732dc54e0d8a34bace1d2ed32169547d545abb1f188ae65aa31579d`,
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
     const data = event.target.files[0];
     console.log(data);
     const reader = new window.FileReader();
     reader.readAsArrayBuffer(data);
     reader.onloadend=()=>{
        setFile(event.target.files[0]);
     }
     setFileName(event.target.files[0].name);
     event.preventDefault();
    };

    return( <div>
       <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
            Choose Image
        </label>
        <input type="file" disabled={!account} id="file-upload" name="data" onChange={retrieveFile} />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>Upload</button>
       </form>
    </div>
    )
    };
    
    export default FileUpload;