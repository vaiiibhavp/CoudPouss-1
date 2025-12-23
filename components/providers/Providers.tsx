'use client';

import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ThemeProvider from '@/components/providers/ThemeProvider';
import AuthProvider from './AuthProvider';
import ReduxProvider from '@/lib/redux/ReduxProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ReduxProvider>
  );
}

