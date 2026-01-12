"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Box,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { apiGet } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface Transaction {
  id: string;
  elderName: string;
  avatar: string;
  transactionId: string;
  totalAmount: string;
  paymentDate: string;
  paymentStatus: string;
}

interface ApiTransaction {
  id?: string;
  transaction_id?: string;
  transactionId?: string;
  elder_name?: string;
  elderName?: string;
  name?: string;
  avatar?: string;
  profile_picture?: string;
  profilePicture?: string;
  total_amount?: number | string;
  totalAmount?: number | string;
  amount?: number | string;
  payment_date?: string;
  paymentDate?: string;
  created_at?: string;
  createdAt?: string;
  payment_status?: string;
  paymentStatus?: string;
  status?: string;
}

interface TransactionsApiResponse {
  message?: string;
  data?: {
    Transactions?: ApiTransaction[];
    transactions?: ApiTransaction[];
  };
  success?: boolean;
  status_code?: number;
}

// Helper function to format date
const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    
    return `${day} ${month} ${year} - ${displayHours}:${displayMinutes}${ampm}`;
  } catch {
    return dateString;
  }
};

// Helper function to format amount
const formatAmount = (amount?: number | string): string => {
  if (amount === undefined || amount === null) return "€0.00";
  
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "€0.00";
  
  return `€${numAmount.toFixed(2)}`;
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === "completed") return "#10B981";
  if (lowerStatus === "pending") return "#F59E0B";
  if (lowerStatus === "failed") return "#EF4444";
  return "#10B981"; // default to green
};

// Helper function to map API response to component format
const mapApiTransactionToTransaction = (apiTransaction: ApiTransaction): Transaction => {
  const id = apiTransaction.id || apiTransaction.transaction_id || apiTransaction.transactionId || "";
  const elderName = apiTransaction.elder_name || apiTransaction.elderName || apiTransaction.name || "Unknown";
  const avatar = apiTransaction.avatar || apiTransaction.profile_picture || apiTransaction.profilePicture || "/icons/testimonilas-1.png";
  const transactionId = apiTransaction.transaction_id || apiTransaction.transactionId || apiTransaction.id || "";
  const totalAmount = formatAmount(apiTransaction.total_amount || apiTransaction.totalAmount || apiTransaction.amount);
  
  const dateString = apiTransaction.payment_date || apiTransaction.paymentDate || apiTransaction.created_at || apiTransaction.createdAt;
  const paymentDate = formatDate(dateString);
  
  const paymentStatus = apiTransaction.payment_status || apiTransaction.paymentStatus || apiTransaction.status || "Completed";
  
  return {
    id,
    elderName,
    avatar,
    transactionId,
    totalAmount,
    paymentDate,
    paymentStatus,
  };
};

export default function TransactionsHistory() {
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("section", "transactions");
      if (status) {
        params.append("status", status);
      }
      // Add payment method and date filters if API supports them
      if (paymentMethod) {
        params.append("payment_method", paymentMethod);
      }
      if (date) {
        params.append("date", date);
      }

      const endpoint = `${API_ENDPOINTS.PROFILE.USER_PROFILE}?${params.toString()}`;
      const response = await apiGet<TransactionsApiResponse>(endpoint);

      if (response.success && response.data) {
        const apiData = (response.data.data || response.data) as any;
        const apiTransactions: ApiTransaction[] = apiData?.Transactions || apiData?.transactions || [];
        
        if (Array.isArray(apiTransactions) && apiTransactions.length > 0) {
          const mappedTransactions = apiTransactions.map(mapApiTransactionToTransaction);
          setTransactions(mappedTransactions);
        } else {
          setTransactions([]);
        }
      } else {
        setError("Failed to load transactions");
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [status, paymentMethod, date]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handlePaymentMethodChange = (event: SelectChangeEvent) => {
    setPaymentMethod(event.target.value);
  };

  const handleDateChange = (event: SelectChangeEvent) => {
    setDate(event.target.value);
  };

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 3,
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          padding: "20px 24px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              color: "#2F6B8E",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Transactions History
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              flexWrap: { xs: "wrap", md: "nowrap" },
            }}
          >
            <FormControl>
              <Select
                value={status}
                onChange={handleStatusChange}
                displayEmpty
                sx={{
                  borderRadius: "4px",
                  border: "1px solid #DCDDDD",
                  padding: "10px 16px",
                  minWidth: 120,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#818285",
                  fontWeight: 500,
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#818285",
                  },
                  "& .MuiSelect-select": {
                    padding: 0,
                  },
                }}
              >
                <MenuItem value="" sx={{ fontSize: "16px", color: "#818285" }}>
                  Status
                </MenuItem>
                <MenuItem value="completed" sx={{ fontSize: "16px" }}>
                  Completed
                </MenuItem>
                <MenuItem value="pending" sx={{ fontSize: "16px" }}>
                  Pending
                </MenuItem>
                <MenuItem value="failed" sx={{ fontSize: "16px" }}>
                  Failed
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <Select
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
                displayEmpty
                sx={{
                  borderRadius: "4px",
                  border: "1px solid #DCDDDD",
                  padding: "10px 16px",
                  minWidth: 150,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#818285",
                  fontWeight: 500,
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#818285",
                  },
                  "& .MuiSelect-select": {
                    padding: 0,
                  },
                }}
              >
                <MenuItem value="" sx={{ fontSize: "16px", color: "#818285" }}>
                  Payment Method
                </MenuItem>
                <MenuItem value="card" sx={{ fontSize: "16px" }}>
                  Card
                </MenuItem>
                <MenuItem value="bank" sx={{ fontSize: "16px" }}>
                  Bank Transfer
                </MenuItem>
                <MenuItem value="paypal" sx={{ fontSize: "16px" }}>
                  PayPal
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <Select
                value={date}
                onChange={handleDateChange}
                displayEmpty
                sx={{
                  borderRadius: "4px",
                  border: "1px solid #DCDDDD",
                  padding: "10px 16px",
                  minWidth: 120,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#818285",
                  fontWeight: 500,
                  backgroundColor: "#FFFFFF",
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#818285",
                  },
                  "& .MuiSelect-select": {
                    padding: 0,
                  },
                }}
              >
                <MenuItem value="" sx={{ fontSize: "16px", color: "#818285" }}>
                  Date
                </MenuItem>
                <MenuItem value="today" sx={{ fontSize: "16px" }}>
                  Today
                </MenuItem>
                <MenuItem value="week" sx={{ fontSize: "16px" }}>
                  This Week
                </MenuItem>
                <MenuItem value="month" sx={{ fontSize: "16px" }}>
                  This Month
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Table
          sx={{
            minWidth: 650,

            "& .MuiTableBody-root .MuiTableRow-root": {
              "&:not(:last-child)": {
                marginBottom: "8px",
              },
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "#F5F5F5",
                justifyContent: "space-between",
              }}
            >
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "12px 40px",
                }}
              >
                Elder's Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "12px 40px",
                }}
              >
                Transaction ID
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "12px 40px",
                }}
              >
                Total Amount
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "12px 40px",
                }}
              >
                Payment Date & Time
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  padding: "12px 40px",
                }}
              >
                Payment Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: "error.main" }}>{error}</Typography>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    No transactions found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction, index) => (
              <TableRow
                key={transaction.id}
                sx={{
                  bgcolor: index % 2 === 0 ? "grey.50" : "white",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <TableCell
                  sx={{
                    padding: "12px 40px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#545454",
                  }}
                >
                  <Avatar
                    src={transaction.avatar}
                    alt={transaction.elderName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#545454",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "18px",
                    }}
                  >
                    {transaction.elderName}
                  </Typography>
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px 40px",
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#545454",
                  }}
                >
                  {transaction.transactionId}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px 40px",
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#545454",
                  }}
                >
                  {transaction.totalAmount}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px 40px",
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#545454",
                  }}
                >
                  {transaction.paymentDate}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "12px 40px",
                    fontWeight: 400,
                    fontStyle: "regular",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: getStatusColor(transaction.paymentStatus),
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "18px",
                    }}
                  >
                    {transaction.paymentStatus}
                  </Typography>
                </TableCell>
              </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}






