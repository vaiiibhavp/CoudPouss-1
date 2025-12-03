

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
        }}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
}

