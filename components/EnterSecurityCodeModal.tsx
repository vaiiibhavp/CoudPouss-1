"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import Image from "next/image";

interface EnterSecurityCodeModalProps {
  open: boolean;
  onClose: () => void;
  onValidate: () => void;
}

export default function EnterSecurityCodeModal({
  open,
  onClose,
  onValidate,
}: EnterSecurityCodeModalProps) {
  const [code, setCode] = useState(["", "", ""]);
  const [error, setError] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError(false);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleValidate = () => {
    if (code.every((digit) => digit !== "")) {
      onValidate();
    } else {
      setError(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Security Code Icon */}
          <Box
            sx={{
              mb: 3,
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/icons/security-code.png"
              alt="Security Code"
              width={60}
              height={60}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Title */}
          <Typography
            
            fontWeight="600"
            sx={{
              color: "#2C6587",
              mb: "1rem",
              fontSize:"1.375rem",
            }}
          >
            Enter Security Code
          </Typography>

          {/* Message */}
          <Typography
            sx={{
              color: "#737373",
              mb: "1rem",
              lineHeight: "1.125rem",
              fontSize:"0.875rem",
              px: 2,
            }}
          >
            The user will validate this last (final) 3 digits of the code. Please
            input it provided by the user to validate the service completion.
          </Typography>

          {/* Security Code Display */}
          <Typography
            sx={{ color: "#0F232F", mb: "0.75rem", fontSize:"1.188rem", lineHeight:"1.75rem" }}
          >
            3 2 5 - 5 5 8
          </Typography>

          {/* Input Fields */}
          <Box sx={{ display: "flex", gap: 1.5, mb: 1 }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                id={`code-input-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                variant="outlined"
                size="small"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    padding: "0.75rem 0",
                  },
                }}
                sx={{
                  width: "3.125rem",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                    "&:hover fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: error ? "#EF5350" : undefined,
                    },
                  },
                }}
              />
            ))}
          </Box>

          {/* Error Message */}
          {error && (
            <Typography
              variant="caption"
              sx={{ color: "#EF4444", mb: 2 }}
            >
              Please enter valid code
            </Typography>
          )}

          {/* Validate Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleValidate}
            sx={{
              bgcolor: "#E6E6E6",
              color: "#424242",
              textTransform: "none",
              fontSize: "19px",
              lineHeight: "20px",
              letterSpacing: "1%",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              mt: 2,
              boxShadow:"none",
              "&:hover": {
                boxShadow:"none"
              },
            }}
          >
            Validate
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
