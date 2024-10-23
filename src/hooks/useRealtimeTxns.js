import { useState, useEffect } from "react"
import io from "socket.io-client";

export const useRealtimeTxns = () => {
  const [transactions, setTransactions] = useState([]);

  const SOCKET_SERVER_URL = "http://localhost:3333";
  useEffect(() => {
    // Create a socket connection to the backend
    console.log("socket", SOCKET_SERVER_URL)
    const socket = io(SOCKET_SERVER_URL);

    
    // Listen for the 'swapEvent' from the backend
    socket.on("swapEvent", (data) => {
      console.log("socketData", data)
      setTransactions((prevSwaps) => [
        {
          sender: data.sender,
          recipient: data.recipient,
          amount0: parseFloat(data.amount0), // Convert to a number
          amount1: parseFloat(data.amount1), // Convert to a number
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

  return { transactions }
}