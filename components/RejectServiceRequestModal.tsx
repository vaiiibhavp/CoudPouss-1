import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
    Radio,
    TextField,
} from "@mui/material";
import Image from "next/image";

interface RejectServiceRequestModalProps {
    open: boolean;
    onClose: () => void;
    onReject: (reason: string) => void;
}

const REASONS = [
    "Price higher than competitors",
    "Late response",
    "Rejected for another reason",
];

export default function RejectServiceRequestModal({
    open,
    onClose,
    onReject,
}: RejectServiceRequestModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>(REASONS[0]);
    const [customReason, setCustomReason] = useState<string>("");

    const handleReject = () => {
        const finalReason =
            selectedReason === "Rejected for another reason" && customReason.trim()
                ? customReason.trim()
                : selectedReason;

        onReject(finalReason);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={false}
            PaperProps={{
                sx: {
                    width: "32.5rem",
                    height: "31.625rem",
                    borderRadius: "1.5rem",
                    p: "2.5rem",
                    overflow: "hidden",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                },
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    overflow: "auto",
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    {/* Top icon */}
                    <Image
                        alt="doc"
                        height={60}
                        width={60}
                        src={"/icons/fi_2279060.png"}
                    />

                    {/* Title */}
                    <Typography
                        fontWeight={500}
                        sx={{
                            fontSize: "1.375rem",
                            lineHeight: "1.875rem",
                            my: 2,
                            color: "#2C6587",
                        }}
                    >
                        Reject Service request
                    </Typography>

                    {/* Reason options */}
                    <Box sx={{ width: "100%", mb: 3 }}>
                        {REASONS.map((reason) => {
                            const selected = selectedReason === reason;
                            const isOther = reason === "Rejected for another reason";

                            return (
                                <Box
                                    key={reason}
                                    onClick={() => setSelectedReason(reason)}
                                    sx={{
                                        mb: 1.5,
                                        paddingTop: "0.875rem",
                                        paddingRight: "1rem",
                                        paddingBottom: "0.875rem",
                                        paddingLeft: "1rem",
                                        borderRadius: "0.75rem",
                                        border: "0.0625rem solid",
                                        borderColor: selected ? "#0F4C81" : "#D5D5D5",
                                        bgcolor: "#FFFFFF",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#424242", fontSize: 14 }}
                                        >
                                            {reason}
                                        </Typography>
                                        <Radio
                                            checked={selected}
                                            onChange={() => setSelectedReason(reason)}
                                            value={reason}
                                            size="small"
                                            sx={{
                                                p: 0,
                                                "& .MuiSvgIcon-root": { fontSize: 20 },
                                                color: "#CBD5E1",
                                                "&.Mui-checked": { color: "#0F4C81" },
                                            }}
                                        />
                                    </Box>

                                    {/* Textarea for "other reason" */}
                                    {isOther && selected && (
                                        <TextField
                                            multiline
                                            minRows={3}
                                            placeholder="Write your reason here..."
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                color: "#D5D5D5",
                                                mt: 1.5,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "0.625rem",
                                                    fontSize: 14,
                                                    backgroundColor: "#FFFFFF",
                                                },
                                            }}
                                            onClick={(e) => {
                                                // Prevent click from toggling selection off
                                                e.stopPropagation();
                                            }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Buttons */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: "1rem",
                            width: "100%",
                            mt: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={onClose}
                            sx={{
                                borderRadius: "0.75rem",
                                textTransform: "none",
                                fontWeight: 500,
                                padding: "0.625rem",
                                border: "0.0625rem solid",
                                borderColor: "#214C65",
                                gap: "0.625rem",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleReject}
                            sx={{
                                borderRadius: "0.75rem",
                                textTransform: "none",
                                fontWeight: 500,
                                padding: "0.625rem",
                                gap: "0.625rem",
                                bgcolor: "#214C65",
                                "&:hover": {
                                    bgcolor: "#214C65",
                                    opacity: 0.9,
                                },
                            }}
                        >
                            Reject
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
