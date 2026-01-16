"use client";

import React from "react";
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";

interface ApplicationStatusModalProps {
    open: boolean;
    onClose: () => void;
}

const statusSteps = [
    {
        title: "Subscribed",
        description: "You are successfully subscribed.",
        status: "completed" as const,
    },
    {
        title: "Documents Received",
        description: "Your documents have been received and are being processed.",
        status: "completed" as const,
    },
    {
        title: "Under Review",
        description:
            "Your profile is in review and will be assessed by a system administrator within 72 hours.",
        status: "in-progress" as const,
    },
    {
        title: "Approved",
        description: "Pending.",
        status: "upcoming" as const,
    },
];

export default function ApplicationStatusModal({ open, onClose }: ApplicationStatusModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "1rem",
                    p: { xs: 2, sm: 5 },
                    boxShadow: "0 0.75rem 2rem rgba(0,0,0,0.15)",
                },
            }}
        >
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Box>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}  >
                            <Typography fontWeight={600} sx={{ color: "#0F232F", fontSize: "20px", lineHeight: "24px" }}>
                                Application Status
                            </Typography>

                            <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                                <CloseIcon />
                            </IconButton>

                        </Box>

                        <Typography
                            sx={{
                                color: "#737373",
                                fontSize: "18px",
                                lineHeight: "24px",
                                mt: 0.5,
                                fontWeight: 500,
                            }}
                        >
                            Your profile is currently under review by our system administrators. This process may take up
                            to 72 hours. Once approved, you will be able to start sending quotes for service requests.
                        </Typography>
                    </Box>

                </Box>

                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2,border: "1px solid #E5E7EB",  borderRadius:"12px", p: 3 }}>
                    {statusSteps.map((step, index) => {
                        const isCompleted = step.status === "completed";
                        const isInProgress = step.status === "in-progress";
                        const bulletColor = isCompleted
                            ? "#2F9C47"
                            : isInProgress
                                ? "#E3B341"
                                : "#9CA3AF";
                        return (
                            <Box key={step.title} sx={{ display: "flex", gap: 2, position: "relative" }}>
                                <Box sx={{ position: "relative" }}>
                                    <Box
                                        sx={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            border: `3px solid #2E7D32`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            bgcolor: isCompleted ? "#2E7D32" : isInProgress ? "white" : "white",
                                        }}
                                    >
                                        {isCompleted ? (
                                            // <CheckIcon sx={{ fontSize: 12, color: "white",background:"red" }} />

                                            <Image src="/icons/check.png" alt="m" width={9.6} height={9.6} />
                                        ) : (
                                            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#2E7D32" }} />
                                        )}
                                    </Box>
                                    {index < statusSteps.length - 1 && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                left: "50%",
                                                top: 28,
                                                width: 2,
                                                height: "calc(100% - 12px)",
                                                bgcolor: "#E5E7EB",
                                                transform: "translateX(-50%)",
                                            }}
                                        />
                                    )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography
                                        sx={{
                                            color: "#0F232F",
                                            fontWeight: 700,
                                            fontSize: "0.95rem",
                                            lineHeight: "1.2rem",
                                            mb: 0.5,
                                        }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#6B7280",
                                            fontSize: "0.85rem",
                                            lineHeight: "1.3rem",
                                        }}
                                    >
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </DialogContent>
        </Dialog>
    );
}
