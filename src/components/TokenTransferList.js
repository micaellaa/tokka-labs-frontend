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
import { DatePicker } from "@mui/x-date-pickers/DatePicker"; 
import dayjs from "dayjs";

const TokenTransferList = () => {
  // For no search queries applied
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // For when any search query is applied
  const [searchTransactions, setSearchTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [noMoreData, setNoMoreData] = useState(false);
  const [searchHash, setSearchHash] = useState(""); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); 

  const startAndEndNotIncomplete = (startDate === null && endDate === null) || (startDate !== null && endDate !== null);

  useEffect(() =>{
    if (!searchHash && startAndEndNotIncomplete) fetchTransactions();
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
      
      if (searchHash || (startDate && endDate)) {
        setSearchTransactions(response.data);
        paginateSearchTransactions(response.data, 1); 
      } else {
        setNoMoreData(response.data.length === pageSize);
        setTransactions(response.data); 
      }
      setTransactionsLoading(false);
    } catch (error) {
      setNoMoreData(true);
      setTransactionsLoading(false);
      console.error("Error fetching transactions:", error);
    }
  };

  const paginateSearchTransactions = (allData, page) => {
    const startIndex = (page - 1) * pageSize;
    const paginatedData = allData.slice(startIndex, startIndex + pageSize);
    setTransactions(paginatedData); 
  };

  const handleNextPage = () => {
    if (searchHash) {
      const nextPage = currentPage + 1;
      if (nextPage <= Math.ceil(searchTransactions.length / pageSize)) {
        setCurrentPage(nextPage);
        paginateSearchTransactions(searchTransactions, nextPage);
      } else {
        setNoMoreData(true);
      }
    } else {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearch = () => {
    setNoMoreData(false);
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
