"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AdditionalCategoryWarningModalProps {
    open: boolean;
    onClose: () => void;
    onProceed: () => void;
}

export default function AdditionalCategoryWarningModal({
    open,
    onClose,
    onProceed,
}: AdditionalCategoryWarningModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    p: 0,
                },
            }}
        >
            <DialogContent sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    size="small"
                    sx={{ position: "absolute", right: 16, top: 16, color: "#9CA3AF" }}
                >
                    <CloseIcon />
                </IconButton>

                {/* Icon */}
                <Box
                    component="img"
                    src="/image/fi_9329880.png" // Using the same icon as AddServiceModal
                    alt="Warning"
                    sx={{ width: 60, height: 60, mb: 3 }}
                />

                {/* Title */}
                <Typography
                    sx={{
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        color: "#2C6587",
                        textAlign: "center",
                        lineHeight: "140%",
                        mb: 2,
                    }}
                >
                    Additional category you add will incur a monthly fee of €1.
                </Typography>

                {/* Subtitle */}
                <Typography
                    sx={{
                        fontSize: "0.875rem",
                        color: "#6D6D6D",
                        textAlign: "center",
                        lineHeight: "150%",
                        mb: 4,
                        maxWidth: "90%",
                    }}
                >
                    You are on Non-professional plan, that&apos;s why you need to pay €1 to add more category of services
                </Typography>

                {/* Proceed Button */}
                <Button
                    onClick={onProceed}
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: "#2F6B8E",
                        color: "white",
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 500,
                        py: 1.5,
                        borderRadius: "8px",
                        "&:hover": {
                            bgcolor: "#24536e",
                        },
                    }}
                >
                    Proceed
                </Button>
            </DialogContent>
        </Dialog>
    );
}
