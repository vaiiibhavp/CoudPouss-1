"use client";

import React from "react";
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
} from "@mui/material";

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
  return (
    <Card
      sx={{
        p: 4,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          color: "#2F6B8E",
          mb: 3,
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        Transactions History
      </Typography>

      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  py: 2,
                }}
              >
                Elder's Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  py: 2,
                }}
              >
                Transaction ID
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  py: 2,
                }}
              >
                Total Amount
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  py: 2,
                }}
              >
                Payment Date & Time
              </TableCell>
              <TableCell
                sx={{
                  color: "#2F6B8E",
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                  py: 2,
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
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    src={transaction.avatar}
                    alt={transaction.elderName}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {transaction.elderName}
                  </Typography>
                </TableCell>
                <TableCell sx={{ py: 2, color: "text.primary" }}>
                  {transaction.transactionId}
                </TableCell>
                <TableCell
                  sx={{ py: 2, color: "text.primary", fontWeight: 500 }}
                >
                  {transaction.totalAmount}
                </TableCell>
                <TableCell sx={{ py: 2, color: "text.primary" }}>
                  {transaction.paymentDate}
                </TableCell>
                <TableCell sx={{ py: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#10B981", fontWeight: 500 }}
                  >
                    {transaction.paymentStatus}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}


