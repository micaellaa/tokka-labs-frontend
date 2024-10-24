import { useState, useEffect } from "react"
import io from "socket.io-client";

export const useRealtimeTransfers = () => {
  const [transfers, setTransfers] = useState([]);

  const SOCKET_SERVER_URL = "http://localhost:3333";
  useEffect(() => {
    // Create a socket connection to the backend
    
    const socket = io(SOCKET_SERVER_URL);
    
    // Listen for the 'swapEvent' from the backend
    socket.on("transferEvent", (data) => {
      console.log("transfer data", {
        hash: data.hash,
        sender: data.sender,
        recipient: data.recipient,
        amount0: parseFloat(data.amount0), 
        amount1: parseFloat(data.amount1), 
        feeETH: parseFloat(data.feeETH), 
        feeUSDT: parseFloat(data.feeUSDT), 
        price: data.price,
        liquidity: data.liquidity,
        tick: data.tick,
      });
      setTransfers((prevSwaps) => [
        {
          hash: data.hash,
          sender: data.sender,
          recipient: data.recipient,
          amount0: parseFloat(data.amount0), 
          amount1: parseFloat(data.amount1), 
          feeETH: parseFloat(data.feeETH), 
          feeUSDT: parseFloat(data.feeUSDT), 
          price: data.price,
          liquidity: data.liquidity,
          tick: data.tick,
        },
        ...prevSwaps,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { transfers }
}