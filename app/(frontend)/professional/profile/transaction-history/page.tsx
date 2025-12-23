"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Transaction {
  id: string;
  elderName: string;
  elderAvatar: string;
  transactionId: string;
  amount: string;
  date: string;
  time: string;
  status: string;
}

export default function TransactionHistoryPage() {
  const router = useRouter();

  const transactions: Transaction[] = [
    {
      id: "1",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€128.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "2",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€128.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "3",
      elderName: "Wade Warren",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€189.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "4",
      elderName: "Wade Warren",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€189.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "5",
      elderName: "Jenny Wilson",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€168.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "6",
      elderName: "Jenny Wilson",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€168.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "7",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€39.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
    {
      id: "8",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€39.20",
      date: "3 Aug 2024",
      time: "11:30AM",
      status: "Completed",
    },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* <Header
        showExploreServices={false}
        showBookServiceButton={false}
        showAuthButtons={false}
        showUserIcons={true}
        showMyRequests={false}
        homeRoute="/professional/dashboard"
      /> */}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ color: "#2F6B8E", mb: 4 }}
        >
          Account Setting
        </Typography>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          sx={{
            textTransform: "none",
            color: "#2F6B8E",
            fontWeight: "500",
            mb: 3,
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          Back to My Earnings
        </Button>

        {/* Transactions History Table */}
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            border: "0.0625rem solid #E5E7EB",
            boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: "#2F6B8E", mb: 3 }}
          >
            Transactions History
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#374151",
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    Elder&apos;s Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#374151",
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#374151",
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#374151",
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    Payment Date & Time
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      color: "#374151",
                      bgcolor: "#F9FAFB",
                    }}
                  >
                    Payment Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    sx={{
                      "&:hover": {
                        bgcolor: "#F9FAFB",
                      },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={transaction.elderAvatar}
                          alt={transaction.elderName}
                          sx={{ width: 40, height: 40 }}
                        />
                        <Typography variant="body2" fontWeight="500">
                          {transaction.elderName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {transaction.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600">
                        {transaction.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {transaction.date} - {transaction.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "#10B981", fontWeight: "500" }}
                      >
                        {transaction.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {/* <Footer /> */}
    </Box>
  );
}
