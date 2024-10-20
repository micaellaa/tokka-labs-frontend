// TokenTransferComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const TokenTransferList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/transaction/getHistory`
        );
        // TODO params here
        // {
        //   params: { page: currentPage, pageSize: pageSize }
        // });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Real-Time Token Transfer Events</h1>

      <div>
        <h1>Ethereum Transactions</h1>
        {/* search form here */}
        <div>
          <ul>
            {transactions.map((tx) => (
              <li key={tx.txId}>
                <div>
                  <strong>Transaction ID:</strong> {tx.txId}
                  <br />
                  <strong>Fee (ETH):</strong> {tx.feeETH}
                  <br />
                  <strong>Fee (USDT):</strong> {tx.feeUSDT}
                  <br />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TokenTransferList;
