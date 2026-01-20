"use client";

import React, { useState } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Image from "next/image";

interface ApplicationStatusModalProps {
    open: boolean;
    onClose: () => void;
    status: "pending" | "under-review" | "approved" | "rejected";
}

// Your original steps (for under-review status)
const underReviewSteps = [
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
        description: "Your profile is in review and will be assessed by a system administrator within 72 hours.",
        status: "in-progress" as const,
    },
    {
        title: "Approved",
        description: "Pending.",
        status: "upcoming" as const,
    },
];

// New rejected status steps (based on your screenshot)
const rejectedSteps = [
    {
        title: "Subscribed",
        description: "Subscription confirmed.",
        status: "completed" as const,
    },
    {
        title: "Documents Uploaded",
        description: "Documents submitted.",
        status: "completed" as const,
    },
    {
        title: "Rejected",
        description: "Some documents are currently missing. Please upload the required documents within the next 15 days to avoid account deletion and a €30 fee charged to your registered card.",
        status: "rejected" as const,
    },
];

// Pending status steps
const pendingSteps = [
    {
        title: "Subscribed",
        description: "You are successfully subscribed.",
        status: "completed" as const,
    },
    {
        title: "Documents Uploaded",
        description: "Documents submitted.",
        status: "completed" as const,
    },
    {
        title: "Under Review",
        description: "Your profile will be reviewed by our system administrators within 72 hours.",
        status: "upcoming" as const,
    },
    {
        title: "Approved",
        description: "Pending review completion.",
        status: "upcoming" as const,
    },
];

// Approved status steps
const approvedSteps = [
    {
        title: "Subscribed",
        description: "You are successfully subscribed.",
        status: "completed" as const,
    },
    {
        title: "Documents Uploaded",
        description: "Documents submitted and verified.",
        status: "completed" as const,
    },
    {
        title: "Under Review",
        description: "Profile review completed.",
        status: "completed" as const,
    },
    {
        title: "Approved",
        description: "Application approved successfully.",
        status: "completed" as const,
    },
];

// Upload Documents Modal Component
interface UploadDocumentsModalProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
    onSuccess: () => void; // New prop for success callback
}

function UploadDocumentsModal({ open, onClose, onBack, onSuccess }: UploadDocumentsModalProps) {
    const [files, setFiles] = useState({
        idCopy: null as File | null,
        kbisExtract: null as File | null,
    });

    const [filePreviews, setFilePreviews] = useState<{
        idCopy: string | null;
        kbisExtract: string | null;
    }>({
        idCopy: null,
        kbisExtract: null,
    });

    const [fileTypes, setFileTypes] = useState<{
        idCopy: "image" | "pdf" | null;
        kbisExtract: "image" | "pdf" | null;
    }>({
        idCopy: null,
        kbisExtract: null,
    });

    const handleFileUpload = (field: keyof typeof files, file: File) => {
        if (file.type.startsWith("video/")) {
            alert("Videos are not supported. Please upload an image or PDF.");
            return;
        }

        const isImage = file.type.startsWith("image/");
        const isPDF = file.type === "application/pdf";

        if (!isImage && !isPDF) {
            alert("Unsupported file type. Please upload an image or PDF.");
            return;
        }

        setFiles(prev => ({
            ...prev,
            [field]: file,
        }));

        setFileTypes(prev => ({
            ...prev,
            [field]: isImage ? "image" : "pdf",
        }));

        if (isImage) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreviews(prev => ({
                ...prev,
                [field]: previewUrl,
            }));
        } else {
            setFilePreviews(prev => ({
                ...prev,
                [field]: null,
            }));
        }
    };

    const handleSubmit = () => {
        // Handle file submission logic here
        console.log("Files to upload:", files);
        onSuccess(); // Call success callback
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "1rem",
                    p: { xs: 2, sm: 3 },
                    boxShadow: "0 0.75rem 2rem rgba(0,0,0,0.15)",
                },
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    overflowY: "auto",
                    maxHeight: { xs: "80vh", sm: "80vh" },
                    scrollbarWidth: "none", // Firefox
                    msOverflowStyle: "none", // IE 10+
                    "&::-webkit-scrollbar": {
                        display: "none", // Chrome/Safari
                    },
                }}
            >
                {/* Header with Back Button */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Typography 
                        fontWeight={600} 
                        sx={{ 
                            color: "#0F232F", 
                            fontSize: "20px", 
                            lineHeight: "24px",
                            flex: 1
                        }}
                    >
                        Upload Documents
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Subtitle */}
                <Typography
                    sx={{
                        color: "#737373",
                        fontSize: "18px",
                        lineHeight: "24px",
                        mb: 3,
                        fontWeight: 500,
                    }}
                >
                    Unfortunately, your application could not be approved due to missing or invalid documents.
                </Typography>

                {/* Document Upload Sections */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

                    <Box
                    sx={{
                        display:"flex",
                        alignItems:'center',
                        flexDirection:"column",
                        gap:"12px"
                    }}
                    >
                        <Image alt="folder"  height={60} width={60}  src="/image/foderIcon.png"   />
                        <Typography
                        
                        sx={{
                            textAlign:"center",
                            fontWeight:600,
                            fontSize:"22px",
                            lineHeight:"30px",
                            color:"#2C6587"

                        }}
                        
                        >
                            Upload Documents
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "1.0625rem",
                                    lineHeight: "1.25rem",
                                    color: "#424242",
                                    mb: "0.5rem",
                                }}
                            >
                                A copy of ID
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "2px dashed #d1d5db",
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    mb: 3,
                                    position: "relative",
                                    minHeight: "160px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => document.getElementById("id-upload")?.click()}
                            >
                                {filePreviews.idCopy && fileTypes.idCopy === "image" ? (
                                    <Box sx={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                                        <Image
                                            src={filePreviews.idCopy}
                                            alt="ID Preview"
                                            fill
                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 1, p: 0.5 }}>
                                            <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                                                {files.idCopy?.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : fileTypes.idCopy === "pdf" ? (
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <PictureAsPdfIcon sx={{ fontSize: 48, color: "#d32f2f", mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {files.idCopy?.name}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Upload from device
                                        </Typography>
                                    </Box>
                                )}
                                <input
                                    id="id-upload"
                                    type="file"
                                    accept="image/*,.pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload("idCopy", file);
                                        }
                                    }}
                                />
                            </Paper>
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 500,
                                    fontSize: "1.0625rem",
                                    lineHeight: "1.25rem",
                                    color: "#424242",
                                    mb: "0.5rem",
                                }}
                            >
                                Kbis Extract
                            </Typography>
                            <Paper
                                elevation={0}
                                sx={{
                                    border: "2px dashed #d1d5db",
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    mb: 3,
                                    position: "relative",
                                    minHeight: "160px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => document.getElementById("kbis-upload")?.click()}
                            >
                                {filePreviews.kbisExtract && fileTypes.kbisExtract === "image" ? (
                                    <Box sx={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
                                        <Image
                                            src={filePreviews.kbisExtract}
                                            alt="Kbis Preview"
                                            fill
                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                        />
                                        <Box sx={{ position: "absolute", bottom: 8, left: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)", borderRadius: 1, p: 0.5 }}>
                                            <Typography variant="body2" color="white" sx={{ fontSize: "0.75rem", textAlign: "center" }}>
                                                {files.kbisExtract?.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : fileTypes.kbisExtract === "pdf" ? (
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <PictureAsPdfIcon sx={{ fontSize: 48, color: "#d32f2f", mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {files.kbisExtract?.name}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Image src="/icons/folder-upload-line.png" width={24} height={24} alt="Upload" style={{ marginBottom: "0.5rem" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Upload from device
                                        </Typography>
                                    </Box>
                                )}
                                <input
                                    id="kbis-upload"
                                    type="file"
                                    accept="image/*,.pdf"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleFileUpload("kbisExtract", file);
                                        }
                                    }}
                                />
                            </Paper>
                        </Box>
                    </Box>
                </Box>

                {/* Upload Button */}
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                    fullWidth
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{
                            bgcolor: "#214C65",
                            color: "white",
                            borderRadius: "8px",
                            py: 1.5,
                            px: 4,
                            fontWeight: 600,
                            fontSize: "16px",
                            textTransform: "none",
                            '&:hover': {
                                bgcolor: "#163344",
                            },
                        }}
                    >
                        Upload
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

// Success Modal Component
interface SuccessModalProps {
    open: boolean;
    onClose: () => void;
}

function SuccessModal({ open, onClose }: SuccessModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "1rem",
                    p: { xs: 2, sm: 4 },
                    boxShadow: "0 0.75rem 2rem rgba(0,0,0,0.15)",
                },
            }}
        >
            <DialogContent
                sx={{
                    p: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                {/* Success Icon */}
                <Box sx={{ mb: 3 }}>
                    <Image 
                        src="/icons/redFolder.png" 
                        alt="Success" 
                        width={60} 
                        height={60}
                    />
                </Box>

                

                {/* Message */}
                <Typography
                    sx={{
                        color: "#555555",
                        fontSize: "22px",
                        lineHeight: "30px",
                        mb: 2,
                        fontWeight: 600,
                    }}
                >
                    Documents uploaded successfully. Your documents will be reviewed within 72 hours.
                </Typography>

                {/* OK Button */}
            </DialogContent>
        </Dialog>
    );
}

// Main Component
export default function ApplicationStatusModal({ 
    open, 
    onClose, 
    status = "under-review"
}: ApplicationStatusModalProps) {
    
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Get the appropriate steps based on status
    const getSteps = () => {
        switch (status) {
            case "pending":
                return pendingSteps;
            case "approved":
                return approvedSteps;
            case "rejected":
                return rejectedSteps;
            case "under-review":
            default:
                return underReviewSteps;
        }
    };

    const steps = getSteps();
    const isRejected = status === "rejected";

    // Get the appropriate title and subtitle based on status
    const getTitle = () => {
        switch (status) {
            case "pending":
                return "Application Submitted";
            case "approved":
                return "Application Approved";
            case "rejected":
                return "Application Status";
            case "under-review":
            default:
                return "Application Status";
        }
    };

    const getSubtitle = () => {
        switch (status) {
            case "pending":
                return "Your application has been successfully submitted and is awaiting review.";
            case "approved":
                return "Congratulations! Your application has been approved. You can now start sending quotes for service requests.";
            case "rejected":
                return "Unfortunately, your application could not be approved due to missing or invalid documents.";
            case "under-review":
            default:
                return "Your profile is currently under review by our system administrators. This process may take up to 72 hours. Once approved, you will be able to start sending quotes for service requests.";
        }
    };

    const handleUploadClick = () => {
        setShowUploadModal(true);
    };

    const handleUploadModalClose = () => {
        setShowUploadModal(false);
    };

    const handleBackFromUpload = () => {
        setShowUploadModal(false);
    };

    const handleUploadSuccess = () => {
        setShowUploadModal(false);
        setShowSuccessModal(true);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        onClose(); // Also close the main modal
    };

    return (
        <>
            {/* Status Modal */}
            <Dialog
                open={open && !showUploadModal && !showSuccessModal}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "1rem",
                        p: { xs: 2, sm: isRejected ? 3 : 5 },
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
                                <Typography 
                                    fontWeight={600} 
                                    sx={{ 
                                        color:   "#0F232F", 
                                        fontSize: "20px", 
                                        lineHeight: "24px" 
                                    }}
                                >
                                    {getTitle()}
                                </Typography>

                                <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
                                    <CloseIcon />
                                </IconButton>

                            </Box>

                            <Typography
                                sx={{
                                    color:  "#737373",
                                    fontSize: "18px",
                                    lineHeight: "24px",
                                    mt: 0.5,
                                    fontWeight: 500,
                                }}
                            >
                                {getSubtitle()}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ 
                        mt: 2, 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: 2,
                        border: "1px solid #E5E7EB",  
                        borderRadius: "12px", 
                        p: 3,
                        bgcolor: "white",
                    }}>
                        {steps.map((step, index) => {
                            const isCompleted = step.status === "completed";
                            const isInProgress = step.status === "in-progress";
                            const isRejectedStep = step.status === "rejected";
                            
                            return (
                                <Box key={step.title} sx={{ display: "flex", gap: 2, position: "relative" }}>
                                    <Box sx={{ position: "relative" }}>
                                        <Box>
                                            {isCompleted ? (
                                                <Image 
                                                    style={{
                                                        height: 24,
                                                        width: 24
                                                    }}
                                                    src="/icons/checkStatus.png" 
                                                    alt="Completed" 
                                                    width={100} 
                                                    height={100} 
                                                />
                                            ) : isInProgress ? (
                                                <Image 
                                                    style={{
                                                        height: 24,
                                                        width: 24
                                                    }}
                                                    src="/icons/underReviewStatus.png" 
                                                    alt="In Progress" 
                                                    width={100} 
                                                    height={100} 
                                                />
                                            ) : isRejectedStep ? (
                                                <Image 
                                                    style={{
                                                        height: 24,
                                                        width: 24
                                                    }}
                                                    src="/icons/rejectedStatus.png"
                                                    alt="Rejected" 
                                                    width={100} 
                                                    height={100} 
                                                />
                                            ) : (
                                                <Box sx={{
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    border: "2px solid #9CA3AF",
                                                    bgcolor: "white",
                                                }} />
                                            )}
                                        </Box>
                                        {index < steps.length - 1 && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    left: "50%",
                                                    top: "24px",
                                                    width: 2,
                                                    height: "calc(100% + 8px)",
                                                    bgcolor: "#E5E7EB",
                                                    transform: "translateX(-50%)",
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography
                                            sx={{
                                                color:  "#0F232F",
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
                                                color:  "#6B7280",
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

                    {/* Upload Button for Rejected Status */}
                    {isRejected && (
                        <Box sx={{ mt: 3 , display: 'flex', justifyContent: 'end' }}>
                            <Button
                                variant="contained"
                                onClick={handleUploadClick}
                                sx={{
                                    bgcolor: "#214C65",
                                    color: "white",
                                    borderRadius: "8px",
                                    py: 1.5,
                                    px: 4,
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    textTransform: "none",
                                    '&:hover': {
                                        bgcolor: "#163344",
                                    },
                                }}
                            >
                                Upload Documents
                            </Button>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Upload Documents Modal */}
            <UploadDocumentsModal
                open={showUploadModal}
                onClose={handleUploadModalClose}
                onBack={handleBackFromUpload}
                onSuccess={handleUploadSuccess}
            />

            {/* Success Modal */}
            <SuccessModal
                open={showSuccessModal}
                onClose={handleSuccessModalClose}
            />
        </>
    );
}