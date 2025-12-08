"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditIcon from "@mui/icons-material/Edit";
import WithdrawalModal from "./WithdrawalModal";

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

export default function MyEarnings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("Sept 2025");
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const transactions: Transaction[] = [
    {
      id: "1",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€123.20",
      date: "3 Aug 2024",
      time: "9:30AM",
      status: "Completed",
    },
    {
      id: "2",
      elderName: "Wade Warren",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€118.20",
      date: "3 Aug 2024",
      time: "9:30AM",
      status: "Completed",
    },
    {
      id: "3",
      elderName: "Jenny Wilson",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€168.20",
      date: "3 Aug 2024",
      time: "9:30AM",
      status: "Completed",
    },
    {
      id: "4",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T123456789O",
      amount: "€135.20",
      date: "3 Aug 2024",
      time: "9:30AM",
      status: "Completed",
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      {/* My Earnings Header and Earning Dashboard */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          mb: 3,
        }}
      >
        {/* My Earnings Card */}
        <Box
          sx={{
            flex: 1,
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
            My Earnings
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              Available Balance
            </Typography>
            <Typography
              variant="h3"
              fontWeight="700"
              sx={{ color: "#1F2937", mb: 1 }}
            >
              €53,278.22
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: 3,
              }}
            >
              <TrendingUpIcon sx={{ color: "#10B981", fontSize: "1rem" }} />
              <Typography variant="body2" sx={{ color: "#10B981" }}>
                +0.97% increase from last month
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setWithdrawalModalOpen(true)}
              sx={{
                bgcolor: "#2F6B8E",
                color: "white",
                textTransform: "none",
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#1e4a5f",
                },
              }}
            >
              Request Withdrawal
            </Button>
          </Box>
        </Box>

        {/* Earning Dashboard Card */}
        <Box
          sx={{
            flex: 2,
            p: 3,
            bgcolor: "white",
            borderRadius: 2,
            border: "0.0625rem solid #E5E7EB",
            boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="600" sx={{ color: "#2F6B8E" }}>
              Earning Dashboard
            </Typography>
            <FormControl size="small">
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                sx={{
                  fontSize: "0.875rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#E5E7EB",
                  },
                }}
              >
                <MenuItem value="Sept 2025">Sept 2025</MenuItem>
                <MenuItem value="Aug 2025">Aug 2025</MenuItem>
                <MenuItem value="July 2025">July 2025</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Chart Placeholder */}
          <Box
            sx={{
              height: 200,
              bgcolor: "#F9FAFB",
              borderRadius: 2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              p: 2,
              position: "relative",
            }}
          >
            {/* Simple line chart representation */}
            <svg width="100%" height="100%" viewBox="0 0 600 180">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <path
                d="M 0 120 Q 75 80, 150 100 T 300 90 T 450 70 T 600 85 L 600 180 L 0 180 Z"
                fill="url(#gradient)"
              />
              <path
                d="M 0 120 Q 75 80, 150 100 T 300 90 T 450 70 T 600 85"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
            </svg>
            {/* Week labels */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-around",
                px: 2,
              }}
            >
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Week 1
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Week 2
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Week 3
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Week 4
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Transactions Table */}
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          border: "0.0625rem solid #E5E7EB",
          boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            borderBottom: "0.0625rem solid #E5E7EB",
            mb: 3,
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "500",
              color: "#6B7280",
            },
            "& .Mui-selected": {
              color: "#2F6B8E !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2F6B8E",
            },
          }}
        >
          <Tab label="Transactions" />
          <Tab label="Withdraw History" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "600", color: "#374151" }}>
                    Elder's name
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#374151" }}>
                    Transaction ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#374151" }}>
                    Total Amount
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#374151" }}>
                    Payment Date & Time
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#374151" }}>
                    Payment Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
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
        )}

        {activeTab === 1 && (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body1" sx={{ color: "#6B7280" }}>
              No withdrawal history available
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            onClick={() => router.push(ROUTES.PROFESSIONAL_TRANSACTION_HISTORY)}
            sx={{
              textTransform: "none",
              color: "#2F6B8E",
              fontWeight: "500",
            }}
          >
            View more ▶
          </Button>
        </Box>
      </Box>

      {/* Bank Details */}
      <Box
        sx={{
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          border: "0.0625rem solid #E5E7EB",
          boxShadow: "0 0.0625rem 0.1875rem rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ color: "#2F6B8E" }}>
            Bank Details
          </Typography>
          <Button
            startIcon={<EditIcon />}
            sx={{
              textTransform: "none",
              color: "#2F6B8E",
              fontWeight: "500",
            }}
          >
            Edit
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              Account Holder Name
            </Typography>
            <Typography variant="body1" fontWeight="500">
              Bessie Cooper
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              Account Number
            </Typography>
            <Typography variant="body1" fontWeight="500">
              123456789O
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              IFSC Code
            </Typography>
            <Typography variant="body1" fontWeight="500">
              GB29 NW 9268 19
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: "#6B7280", mb: 1 }}>
              Bank Name
            </Typography>
            <Typography variant="body1" fontWeight="500">
              Global Trust Bank
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        open={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        availableBalance="€53,278.22"
      />
    </Box>
  );
}
