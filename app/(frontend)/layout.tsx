

import React from 'react';
import { Box } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          overflowX: 'hidden',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          maxWidth: '100%',
          width: '100%',
          wordBreak: 'break-all',
        }}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
}

