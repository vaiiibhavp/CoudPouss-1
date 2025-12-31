'use client';

import React from 'react';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeProvider from '@/components/providers/ThemeProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-center"
              richColors
            />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ReduxProvider>
  );
}

