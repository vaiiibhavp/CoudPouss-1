"use client";

import { Box, IconButton, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

interface DictaphoneProps {
  listening: boolean;
  supported: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

const Dictaphone = ({
  listening,
  supported,
  onStart,
  onStop,
  onReset,
}: DictaphoneProps) => {
  if (!supported) {
    return (
      <Typography fontSize="0.75rem" color="error">
        Speech not supported
      </Typography>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton onClick={listening ? onStop : onStart}>
        {listening ? <MicIcon color="primary" /> : <MicOffIcon />}
      </IconButton>

      <Typography fontSize="0.75rem" color="text.secondary">
        {listening ? "Listening..." : "Mic off"}
      </Typography>

      <IconButton size="small" onClick={onReset}>
        Reset
      </IconButton>
    </Box>
  );
};

export default Dictaphone;
