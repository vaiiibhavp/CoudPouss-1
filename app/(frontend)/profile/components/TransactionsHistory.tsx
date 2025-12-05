"use client";

import React, { useState } from "react";
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
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

const transactions = [
  {
    id: "1",
    elderName: "Jane Cooper",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€129.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "2",
    elderName: "Jane Cooper",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€129.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "3",
    elderName: "Wade Warren",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€189.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "4",
    elderName: "Wade Warren",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€189.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "5",
    elderName: "Jenny Wilson",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€169.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "6",
    elderName: "Jenny Wilson",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€169.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "7",
    elderName: "Jane Cooper",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€39.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
  {
    id: "8",
    elderName: "Jane Cooper",
    avatar: "/icons/testimonilas-1.png",
    transactionId: "T1234567890",
    totalAmount: "€39.20",
    paymentDate: "3 Aug 2024 - 11:30AM",
    paymentStatus: "Completed",
  },
];

export default function TransactionsHistory() {
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");

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
            {transactions.map((transaction, index) => (
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
                      color: "#10B981",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "18px",
                    }}
                  >
                    {transaction.paymentStatus}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}






