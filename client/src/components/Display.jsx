import { useState } from "react";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    let dataArray;
    const otherAddress = document.querySelector(".address").value;

   try {
    if (otherAddress) {
        dataArray = await contract.display(otherAddress);
      } else {
        dataArray = await contract.display(account);
      }
   } catch (error) {
    alert("You dont have access");
   }
   if (dataArray.length > 0) {
    const images = dataArray.map((item, i) => {
      let cid = item;
      // Remove 'ipfs://' prefix if present
      if (cid.startsWith("ipfs://")) {
        cid = cid.slice(7);
      }
      // Remove any suffix after colon (e.g., ':1')
      if (cid.includes(":")) {
        cid = cid.split(":")[0];
      }
      const gatewayUrl = `https://ipfs.io/ipfs/${cid}`;
      return (
        <a href={gatewayUrl} key={i} target="_blank" rel="noopener noreferrer">
          <img src={gatewayUrl} alt="Uploaded content" className="image-list" />
        </a>
      );
    });
    setData(images);
  } else {
    alert("No images to display");
  }
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input type="text" placeholder="Enter Address" className="address" />
      <button className="center button" onClick={getData}>
        Get Data
      </button>
    </>
  );
};

export default Display;
