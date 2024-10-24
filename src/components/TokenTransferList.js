import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Stack,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
  Typography,
  Pagination,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useRealtimeSwaps } from "../hooks/useRealtimeSwaps";
import { useRealtimeTransfers } from "../hooks/useRealtimeTransfers";

const TokenTransferList = () => {
  const { transactions: realtimeSwaps } = useRealtimeSwaps();
  const { transfers: realtimeTransfers } = useRealtimeTransfers();

  // For no search queries applied
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // For cached transactions based on the page number
  const [cachedTransactions, setCachedTransactions] = useState({});

  // For when a search query is applied
  const [searchTransactions, setSearchTransactions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [noMoreData, setNoMoreData] = useState(false);
  const [searchHash, setSearchHash] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const startAndEndNotIncomplete =
    (startDate === null && endDate === null) ||
    (startDate !== null && endDate !== null);

  useEffect(() => {
    if (!searchHash && startAndEndNotIncomplete) fetchTransactions();
  }, [currentPage, pageSize]); // to handle changing pages too

  const fetchTransactions = async () => {
    if (cachedTransactions[currentPage]) {
      setTransactions(cachedTransactions[currentPage]);
      return;
    }

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
        setNoMoreData(response.data.length < pageSize);

        setCachedTransactions((prevCache) => ({
          ...prevCache,
          [currentPage]: response.data,
        }));

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

  const [tabValue, setTabValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTableContent = useMemo(() => {
    switch (tabValue) {
      case 0:
        return (
          <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Fee (ETH)</TableCell>
                  <TableCell>Fee (USDT)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {realtimeSwaps?.length > 0 ? (
                  realtimeSwaps.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell>{tx.hash?.slice(0, 20)}...</TableCell>
                      <TableCell>{tx.feeETH}</TableCell>
                      <TableCell>{tx.feeUSDT}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography align="center" variant="body1">
                        No real-time swaps yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
      case 1:
        return (
          <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Fee (ETH)</TableCell>
                  <TableCell>Fee (USDT)</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {realtimeTransfers?.length > 0 ? (
                  realtimeTransfers.map((tx, index) => (
                    <TableRow key={index}>
                      <TableCell>{tx.hash?.slice(0, 20)}...</TableCell>
                      <TableCell>{tx.feeETH}</TableCell>
                      <TableCell>{tx.feeUSDT}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography align="center" variant="body1">
                        No real-time transfers yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        );
      default:
        return (
          <>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              style={{ marginBottom: "1rem" }}
            >
              <TextField
                label="Search by Transaction Hash"
                variant="outlined"
                value={searchHash}
                onChange={(e) => setSearchHash(e.target.value)}
                placeholder="Starts with..."
                sx={{ flex: 1 }}
                size="small"
              />

              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
              />

              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
              />

              <Button variant="contained" onClick={handleSearch}>
                Search
              </Button>
            </Stack>
            <TableContainer component={Paper} style={{ marginBottom: "1rem" }}>
              {transactionsLoading ? (
                <Stack
                  direction="row"
                  justifyContent="center"
                  style={{ margin: "1rem" }}
                >
                  <CircularProgress />
                </Stack>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Fee (ETH)</TableCell>
                      <TableCell>Fee (USDT)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {transactions?.length > 0 ? (
                      transactions.map((tx, index) => (
                        <TableRow key={index}>
                          <TableCell>{tx.hash?.slice(0, 20)}...</TableCell>
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
                </Table>
              )}
            </TableContainer>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Select
                labelId="page-size-select-label"
                size="small"
                value={pageSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  setPageSize(newSize);
                  setCurrentPage(1); // Reset to first page on page size change
                  setCachedTransactions({}); // Clear cache when changing page size
                  fetchTransactions(); // Fetch transactions again with new page size
                }}
                label="Items per page"
              >
                {[10, 25, 50, 75, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Pagination
                count={
                  cachedTransactions
                    ? Object.keys(cachedTransactions).length
                    : currentPage
                } // Total number of pages
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                hidePrevButton
                hideNextButton
                color="primary"
                shape="rounded"
              />
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={transactionsLoading || noMoreData}
              >
                Load More
              </Button>
            </Stack>
          </>
        );
    }
  }, [tabValue, realtimeSwaps, transactions]);

  return (
    <div style={{ padding: "1rem" }}>
      <Typography
        variant="h6"
        style={{ marginBottom: "1rem", textAlign: "center" }}
      >
        Ethereum Transactions
      </Typography>

      <Box sx={{ width: "100%" }} style={{ marginBottom: "1rem" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="transactions-tabs"
          >
            <Tab label="Realtime Swaps" />
            <Tab label="Realtime Transfers" />
            <Tab label="Historical Records" />
          </Tabs>
        </Box>
      </Box>
      {renderTableContent}
    </div>
  );
};

export default TokenTransferList;
