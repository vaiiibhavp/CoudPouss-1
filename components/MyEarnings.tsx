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
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WithdrawalModal from "./WithdrawalModal";
import Image from "next/image";

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

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "0.75rem",
    border: "1px solid #D5D5D5",
    backgroundColor: "#FFFFFF",
    "& fieldset": {
      border: "none",
    },
    "& input": {
      padding: "0.875rem 1rem",
      fontSize: "1rem",
      fontWeight: 500,
      color: "#131313",
      lineHeight: "1.25rem",
    },
  },
};

export default function MyEarnings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("Sept 2025");
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "Bessie Cooper",
    accountNumber: "123456789O",
    confirmAccountNumber: "123456789O",
    ifscCode: "GB29 NW 9268 19",
    bankName: "Global Trust Bank",
  });

  const allTransactions: Transaction[] = [
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
    {
      id: "5",
      elderName: "Robert Fox",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T1234567891",
      amount: "€145.50",
      date: "2 Aug 2024",
      time: "2:15PM",
      status: "Completed",
    },
    {
      id: "6",
      elderName: "Cameron Williamson",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T1234567892",
      amount: "€200.00",
      date: "1 Aug 2024",
      time: "10:45AM",
      status: "Completed",
    },
    {
      id: "7",
      elderName: "Leslie Alexander",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T1234567893",
      amount: "€175.80",
      date: "31 Jul 2024",
      time: "4:20PM",
      status: "Completed",
    },
    {
      id: "8",
      elderName: "Dianne Russell",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "T1234567894",
      amount: "€190.30",
      date: "30 Jul 2024",
      time: "11:10AM",
      status: "Completed",
    },
  ];

  const transactions = showAllTransactions ? allTransactions : allTransactions.slice(0, 4);

  const withdrawals: Transaction[] = [
    {
      id: "1",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "W123456789O",
      amount: "€500.00",
      date: "5 Aug 2024",
      time: "2:15PM",
      status: "Completed",
    },
    {
      id: "2",
      elderName: "Wade Warren",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "W1234567891",
      amount: "€750.00",
      date: "2 Aug 2024",
      time: "10:45AM",
      status: "Pending",
    },
    {
      id: "3",
      elderName: "Jenny Wilson",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "W1234567892",
      amount: "€300.00",
      date: "1 Aug 2024",
      time: "4:30PM",
      status: "Completed",
    },
    {
      id: "4",
      elderName: "Jane Cooper",
      elderAvatar: "/icons/testimonilas-1.png",
      transactionId: "W1234567893",
      amount: "€1000.00",
      date: "31 Jul 2024",
      time: "11:20AM",
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
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          mb: { xs: 2, md: 3 },
        }}
      >
        {/* My Earnings Card */}
        <Box
          sx={{
            flex: 1,
            p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            bgcolor: "white",
            borderRadius: "0.75rem",
            border: "0.0625rem solid #DBE0E5",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "#2C6587",
              fontWeight: 700,
              fontSize: "1.25rem", // 20px
              lineHeight: "1.5rem", // 24px
              letterSpacing: "0%",
              verticalAlign: "middle",
            }}
          >
            My Earnings
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(14, 27, 39, 0.5)",
                mb: 1,
                fontWeight: 500,
                fontSize: "1.018rem", // ~16.29px
                lineHeight: "1",
                letterSpacing: "0%",
              }}
            >
              Available Balance
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mb: "1rem",
                color: "#0E1B27",
                fontWeight: 800,
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.29rem" }, // ~36.64px
                lineHeight: { xs: "2rem", sm: "2.25rem", md: "2.714rem" }, // ~43.43px
                letterSpacing: "3%",
              }}
            >
              €53,278.22
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                mb: "3.438rem",
              }}
            >
              <TrendingUpIcon sx={{ color: "#4CAF50", fontSize: "1rem" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4CAF50",
                  fontWeight: 500,
                  fontSize: "1.018rem", // ~16.29px
                  lineHeight: "1",
                  letterSpacing: "0%",
                }}
              >
                +0.97% increase from last month
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setWithdrawalModalOpen(true)}
              sx={{
                bgcolor: "#214C65",
                color: "white",
                textTransform: "none",
                py: "1.125rem", // 10px
                px: "3.75rem", // 60px; keep fullWidth so horizontal padding is minimal impact
                fontSize: "1rem",
                fontWeight: 700,
                lineHeight: "1.125rem", // 18px
                letterSpacing: "0%",
                borderRadius: "0.75rem", // 12px
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
            p: { xs: "1rem", sm: "1rem 1.25rem", md: "1rem 1.5rem" }, // 16px top/bottom, 24px left/right
            bgcolor: "#FFFFFF",
            borderRadius: "0.75rem", // 12px
            border: "1px solid #DBE0E5",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem", // 12px
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: "0.75rem",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#2C6587",
                fontWeight: 700,
                fontSize: "1.25rem", // 20px
                lineHeight: "1.5rem", // 24px
                letterSpacing: "0%",
                verticalAlign: "middle",
              }}
            >
              Earning Dashboard
            </Typography>
            <FormControl
              size="small"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "0.75rem", // 12px
                  paddingTop: "0.5rem", // 8px
                  paddingBottom: "0.5rem", // 8px
                  paddingLeft: "1rem", // 16px
                  paddingRight: "1.5rem", // 24px
                  gap: "0.75rem", // 12px
                  backgroundColor: "#EAF0F3",
                },
              }}
            >
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
              height: { xs: 150, sm: 175, md: 200 },
              // bgcolor: "#F9FAFB",
              borderRadius: 2,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              p: { xs: 1, md: 2 },
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
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: "white",
          borderRadius: 2,
          border: "0.0625rem solid #DBE0E5",
          mb: { xs: 2, md: 3 },
          overflowX: "auto",
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
              fontWeight: 600,
              lineHeight: "1.125rem", // 18px
              letterSpacing: "0%",
              color: "#2C6587",
              alignItems: "center",
            },
            "& .Mui-selected": {
              color: "#2C6587 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#2C6587",
            },
          }}
        >
          <Tab label="Transactions" />
          <Tab label="Withdraw History" />
        </Tabs>

        {activeTab === 0 && (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                minWidth: 600,
                "& .MuiTableRow-root": {
                  borderBottom: "none",
                },
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                },
                "& .MuiTableBody-root .MuiTableCell-root": {
                  p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                },
                "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)": {
                  bgcolor: "#F5F5F5",
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  },
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                    }}
                  >
                    Elder's name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Payment Date & Time
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    Payment Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={transaction.elderAvatar}
                          alt={transaction.elderName}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "0.875rem", // 14px
                            lineHeight: "1.125rem", // 18px
                            letterSpacing: "0%",
                            verticalAlign: "middle",
                            color: "#545454",
                          }}
                        >
                          {transaction.elderName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {transaction.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {transaction.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {transaction.date} - {transaction.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#10B981",
                        }}
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
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table
              sx={{
                minWidth: 600,
                "& .MuiTableRow-root": {
                  borderBottom: "none",
                },
                "& .MuiTableCell-root": {
                  borderBottom: "none",
                },
                "& .MuiTableBody-root .MuiTableCell-root": {
                  p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                },
                "& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)": {
                  bgcolor: "#F5F5F5",
                  "& .MuiTableCell-root:first-of-type": {
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderTopRightRadius: "12px",
                    borderBottomRightRadius: "12px",
                  },
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                    }}
                  >
                    Elder's name
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                    }}
                  >
                    Payment Date & Time
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "#1F2128",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px", md: "13px" },
                      verticalAlign: "middle",
                      bgcolor: "#F5F5F5",
                      p: { xs: "8px 12px", sm: "10px 20px", md: "12px 40px" },
                      borderTopRightRadius: "12px",
                      borderBottomRightRadius: "12px",
                    }}
                  >
                    Payment Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Avatar
                          src={withdrawal.elderAvatar}
                          alt={withdrawal.elderName}
                          sx={{ width: 24, height: 24 }}
                        />
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: "0.875rem", // 14px
                            lineHeight: "1.125rem", // 18px
                            letterSpacing: "0%",
                            verticalAlign: "middle",
                            color: "#545454",
                          }}
                        >
                          {withdrawal.elderName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {withdrawal.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {withdrawal.amount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#545454",
                        }}
                      >
                        {withdrawal.date} - {withdrawal.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "0.875rem", // 14px
                          lineHeight: "1.125rem", // 18px
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color:
                            withdrawal.status === "Completed"
                              ? "#10B981"
                              : "#FF9800",
                        }}
                      >
                        {withdrawal.status}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 0 && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              sx={{
                textTransform: "none",
                color: "#2C6587",
                fontWeight: 400,
                fontSize: "0.875rem", // 14px
                lineHeight: "140%",
                letterSpacing: "0%",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                "&:hover": {
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                },
              }}
            >
              {showAllTransactions ? "Show less" : "View more"}
              <Image
                alt="arrow"
                width={20}
                height={20}
                src="/icons/CaretRight.png"
              />
            </Button>
          </Box>
        )}
      </Box>

      {/* Bank Details */}
      <Box
        sx={{
          p: { xs: "1rem", sm: "1.25rem", md: "1.5rem" }, // 24px
          bgcolor: "#FFFFFF",
          borderRadius: "0.75rem", // 12px
          border: "1px solid #EAF5F4",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem", // 20px
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#2C6587",
              fontWeight: 700,
              fontSize: "1.25rem", // 20px
              lineHeight: "1.5rem", // 24px
              letterSpacing: "0%",
              verticalAlign: "middle",
            }}
          >
            Bank Details
          </Typography>
          {!isEditingBankDetails && (
            <Button
              endIcon={
                <Image
                  alt="edit"
                  width={16}
                  height={16}
                  src="/icons/circular_pencil.png"
                />
              }
              onClick={() => setIsEditingBankDetails(true)}
              sx={{
                textTransform: "none",
                color: "#787878",
                fontWeight: 400,
                fontSize: "1rem", // 16px
                lineHeight: "140%",
                letterSpacing: "0%",
                borderRadius: "6.25rem", // 100px
                border: "0.03125rem solid #EAF0F3", // 0.5px
                px: "0.75rem", // 12px
                py: "0.375rem", // 6px
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: "transparent",
                  borderColor: "#EAF0F3",
                },
              }}
            >
              Edit
            </Button>
          )}
        </Box>

        {!isEditingBankDetails ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: "1.25rem", // 20px
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  fontWeight: 600,
                  fontSize: "1.0625rem", // 17px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  mb: 1,
                }}
              >
                Account Holder Name
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1", // 100%
                  letterSpacing: "0%",
                  color: "#424242",
                }}
              >
                {bankDetails.accountHolderName}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  fontWeight: 600,
                  fontSize: "1.0625rem", // 17px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  mb: 1,
                }}
              >
                Account Number
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1", // 100%
                  letterSpacing: "0%",
                  color: "#424242",
                }}
              >
                {bankDetails.accountNumber}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  fontWeight: 600,
                  fontSize: "1.0625rem", // 17px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  mb: 1,
                }}
              >
                IFSC Code
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1", // 100%
                  letterSpacing: "0%",
                  color: "#424242",
                }}
              >
                {bankDetails.ifscCode}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#939393",
                  fontWeight: 600,
                  fontSize: "1.0625rem", // 17px
                  lineHeight: "1rem", // 16px
                  letterSpacing: "0%",
                  mb: 1,
                }}
              >
                Bank Name
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "1.125rem", // 18px
                  lineHeight: "1", // 100%
                  letterSpacing: "0%",
                  color: "#424242",
                }}
              >
                {bankDetails.bankName}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission here
              setIsEditingBankDetails(false);
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Account Holder Name
                </Typography>
                <TextField
                  fullWidth
                  value={bankDetails.accountHolderName}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountHolderName: e.target.value,
                    })
                  }
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Account Number
                </Typography>
                <TextField
                  fullWidth
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      accountNumber: e.target.value,
                    })
                  }
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Confirm Account Number
                </Typography>
                <TextField
                  fullWidth
                  value={bankDetails.confirmAccountNumber}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      confirmAccountNumber: e.target.value,
                    })
                  }
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  IFSC Code
                </Typography>
                <TextField
                  fullWidth
                  value={bankDetails.ifscCode}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      ifscCode: e.target.value,
                    })
                  }
                  sx={inputStyles}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: "#858686",
                    fontSize: "1.0625rem",
                    lineHeight: "1.25rem",
                    fontWeight: 500,
                    mb: 0.5,
                  }}
                >
                  Bank Name
                </Typography>
                <TextField
                  fullWidth
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails({
                      ...bankDetails,
                      bankName: e.target.value,
                    })
                  }
                  sx={inputStyles}
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-end", gap: "0.625rem" }}>
              <Button
                type="button"
                onClick={() => setIsEditingBankDetails(false)}
                sx={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #214C65",
                  borderRadius: "0.75rem", // 12px
                  color: "#214C65",
                  fontSize: { xs: "1rem", md: "1.1875rem" }, // 19px
                  fontWeight: 700,
                  lineHeight: "1.25rem", // 20px
                  letterSpacing: "1%",
                  padding: { xs: "0.875rem 2rem", md: "1.125rem 3.75rem" }, // 10px top/bottom, 60px left/right
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: "#FFFFFF",
                    borderColor: "#214C65",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#214C65",
                  border: "none",
                  borderRadius: "0.75rem",
                  color: "#FFFFFF",
                  fontSize: { xs: "1rem", md: "1.1875rem" }, // 19px
                  fontWeight: 700,
                  lineHeight: "1.25rem", // 20px
                  letterSpacing: "1%",
                  padding: { xs: "0.875rem 2rem", md: "0.625rem 3.75rem" }, // 10px top/bottom, 60px left/right
                  textTransform: "none",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Update
              </Button>
            </Box>
          </Box>
        )}
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
