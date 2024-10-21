// TokenTransferComponent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; // From MUI X package
import dayjs from "dayjs";

const TokenTransferList = () => {
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [noMoreData, setNoMoreData] = useState(false);
  const [searchHash, setSearchHash] = useState(""); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 

  useEffect(() =>{
    fetchTransactions();
  }, [currentPage, pageSize]); // to handle changing pages too

  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      if (searchHash) {
        params.txhash = searchHash; 
      }
      if (startDate && endDate) {
        params.startTime = dayjs(startDate).unix(); 
        params.endTime = dayjs(endDate).unix(); 
      }

      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/transaction/getHistory`,
        { params }
      );
      if (response.data.length === 0) {
        setNoMoreData(true);
      } else {
        setTransactions(response.data);
        setNoMoreData(false);
      }
      setTransactionsLoading(false);
      setTransactions(response.data);
    } catch (error) {
      setNoMoreData(true);
      setTransactionsLoading(false);
      console.error("Error fetching transactions:", error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearch = () => {
    fetchTransactions();
    setCurrentPage(1);
  };

  return (
    <div>
      <div>
        <Typography variant="h5">Ethereum Transactions</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Search by Transaction Hash"
            variant="outlined"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            sx={{ flex: 1 }}
          />

          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />

          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Stack>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Fee (ETH)</TableCell>
                <TableCell>Fee (USDT)</TableCell>
              </TableRow>
            </TableHead>
            {transactionsLoading ? (
              <Stack direction="row" justifyContent="center">
                <CircularProgress />
              </Stack>
            ) : (
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.txId}>
                      <TableCell>{tx.txId}</TableCell>
                      <TableCell>{tx.feeETH}</TableCell>
                      <TableCell>{tx.feeUSDT}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography align="center" variant="body1">
                        No transactions found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Pagination
            count={currentPage} // Total number of pages
            page={currentPage}
            hidePrevButton
            hideNextButton
            color="primary"
            shape="rounded"
          />
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={noMoreData}
          >
            Next
          </Button>
        </Stack>
      </div>
    </div>
  );
};

export default TokenTransferList;
