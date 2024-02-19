"use client";
import { useState, useEffect } from "react";
import { Auction } from "@prisma/client";
import axios from "axios";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Auctiondetails({ params }: { params: { id: string } }) {
  const [auction, setAuction] = useState<
    | {
        title: string;
        listedItems: {
          id: string;
          name: string;
          description: string;
          tags: string[];
          has3dModel: boolean;
          basePrice: number;
          startTime: Date;
          endTime: Date;
          bidderId: string | null;
          auctionId: string;
        }[];
      }
    | undefined
  >();
  console.log(auction);
  const [bidAmount, setBidAmount] = useState('');
  const [bidderemail, setBidderemail] = useState('');

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };
  const handleBidemailChange = (e) => {
    setBidderemail(e.target.value);
  };

  const handlePlaceBid = async (id:String,email:String) => {
    // Handle placing the bid with the bidAmount state
    try {
      console.log('Placing bid with amount:', bidAmount);

     let bidder_res= await axios.post("/api/getBidderDetails",email);
      let bidder_id=bidder_res.data.bidder.id;
      let item_id=id;
       await axios.post("/api/placeABid", { bidder_id, item_id, bidAmount });
console.log("Placed bid with amount",bidAmount,"for Item ID ",item_id);
toast.success("Your bid placed successfully");
      // alert(`You have successfully placed a bid of ${bidAmount} on this item.`);
      
    }catch{
console.log("Bid not placed...")
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      const response = await axios.post(`/api/deleteItemFromAuction`, { itemId });
      // Handle success, update UI, show notifications, etc.
      console.log('Item deleted successfully:', response.data);
      toast.success("Successfully removed from Auction!");
    } catch (error) {
      // Handle error, show error messages, etc.
      console.error('Error deleting item:', error);
      
    }
  };

  useEffect(() => {
    (async () => {
      const res = await axios.post("/api/getAuctionDetails", {
        auc_id: params.id,
      });
      setAuction(res.data.auction_details);
    })();
  }, [params.id]);

  return (
    <div className="container mx-auto text-center">
              <ToastContainer />

      <div className="maintitle mx-auto text-2xl font-semibold"> {auction?.title}</div>
      <div className="grid grid-cols-2 grid-flow-row gap-6 my-10 p-5">
        {auction?.listedItems.map((item, index) => (
          <div key={index} className="auction">
                    <div className="card card relative  h-[80%] w-[95%] bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-100 p-7 lg:h-fit lg:py-16  drop-shadow-lg ring-cyan-500 ">
                    <div className="flex  gap-12 justify-around">
                    <div className="text-blue-500 font-bold">{item.name}</div>
                    <Image  alt="dummyimage" src={"/imfo.png"} width={100} height={100}/>
                    </div>
                    <div className="border rounded-xl h-[80%] border-gray-900 drop-shadow-lg bg-blue/60 text-center p-3 m-5 lg:p-7">
                        <p className=" text-blue-500 font-semibold drop-shadow-md ">Description:</p>
                        <p> {`${item.description}`}</p>
                    </div>
                    <div className="flex gap-4 justify-around ">
                        <button>{item.tags}</button>
                        <p className="bg-[#6900FF] rounded-md text-white p-1">Have 3d model : <span className="font-bold"> {item.has3dModel}</span></p>
                    </div>

                    <div className="flex gap-3">
                    <button className="border-white bottom-2  bg-gray-400 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border  m-4 p-2 flex justify-around content-baseline mx-auto">
                                  <div className="bg-[#FFD700] size-3  rounded-lg m-1 "></div>
                                  <span>Base Price:- {item.basePrice}</span>
                    </button>
                    <button className="border-white bottom-2  bg-gray-400 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border  m-4 p-2 flex justify-around content-baseline mx-auto">
                                  <div className="bg-[#FFD700] size-3  rounded-lg m-1 "></div>
                                  <span>Base Price:- {item.basePrice}</span>
                    </button>

                    <button onClick={() => deleteItem(item.id)} className="border-white bottom-2 bg-red-700 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border m-4 p-2 flex justify-around content-baseline mx-auto">
  Delete
</button>

                    </div>
                   
                    <div className="flex justify-around gap-4">
                    <p className="text-sm">Start Date;- {item.startTime.toString()}</p>
                    <p className="text-sm">End Date;- {item.endTime.toString()}</p>
                    </div>
                    <div className="flex gap-5">
                    <button className="border-white bottom-2  bg-gray-400 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border  m-4 p-2 flex justify-around content-baseline mx-auto">
                                  <div className="bg-[#2a97e5] size-3  rounded-lg m-1 "></div>
                                  <span className="drop-shadow-md text-sm font-medium">Bidder ID:- {item.bidderId}</span>
                    </button>
                    <button className="border-white bottom-2  bg-gray-400 rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border  m-4 p-2 flex justify-around content-baseline mx-auto">
                                  <div className="bg-[#2852d1] size-3  rounded-lg m-1 "></div>
                                  <span className="drop-shadow-md text-sm font-medium">Auction Id:- {item.auctionId}</span>
                    </button>
                    </div>
                    <div className="mx-auto flex justify-center gap-4">
                    <button
        className="border ring-2 rounded-lg p-1 w-[50%] text-white bg-blue-700"
        onClick={()=>{handlePlaceBid(item.id,bidderemail)}}
      >
        Place Bid
      </button>
      <input
        className="rounded-md"
        type="text"
        value={bidAmount}
        onChange={handleBidAmountChange}
      />
      <input
        className="rounded-md"
        type="text"
        value={bidderemail}
        onChange={handleBidemailChange}
      />
                    </div>

                    </div>


            
          </div>
        ))}
      </div>
    </div>
  );
}
