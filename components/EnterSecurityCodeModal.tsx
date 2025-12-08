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
  const [code, setCode] = useState(["", "", "", "", "", ""]);
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
          p: 2,
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
            py: 2,
          }}
        >
          {/* Security Code Icon */}
          <Box
            sx={{
              mb: 3,
              width: 80,
              height: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/icons/security-code.png"
              alt="Security Code"
              width={80}
              height={80}
              style={{ objectFit: "contain" }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{
              color: "#1F2937",
              mb: 2,
            }}
          >
            Enter Security Code
          </Typography>

          {/* Message */}
          <Typography
            variant="body2"
            sx={{
              color: "#6B7280",
              mb: 3,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            The user will validate this last (final) 3 digits of the code. Please
            input it provided by the user to validate the service completion.
          </Typography>

          {/* Security Code Display */}
          <Typography
            variant="body2"
            sx={{ color: "#6B7280", mb: 1 }}
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
                  width: 40,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
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
              bgcolor: "#2F6B8E",
              color: "white",
              textTransform: "none",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              mt: 2,
              "&:hover": {
                bgcolor: "#25608A",
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
