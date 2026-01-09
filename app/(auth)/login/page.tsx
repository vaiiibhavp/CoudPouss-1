// app/login/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { toast } from 'sonner';
import { isValidEmailOrMobile } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';
import { loginUser, clearAuthError } from '@/lib/redux/authSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import CountrySelectDropdown from '@/components/CountrySelectDropdown';

// Yup validation schema
const loginSchema = Yup.object().shape({
  emailOrMobile: Yup.string()
    .required('Email or Mobile Number is required')
    .test('is-valid-email-or-mobile', 'Please enter a valid email or mobile number', (value) => {
      if (!value) return false;
      return isValidEmailOrMobile(value);
    }),
  password: Yup.string()
    .required('Password is required'),
});

interface LoginFormValues {
  emailOrMobile: string;
  password: string;
  mobileNo?: string;
  phoneCountryCode?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
  const [countryCode, setCountryCode] = useState('us');
  const [hasTypedAfterError, setHasTypedAfterError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const prevLoadingRef = useRef(false);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    // Clear any existing auth errors when component mounts
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    const wasLoading = prevLoadingRef.current;
    const isLoading = loading;
    
    // Reset error flag when new login attempt starts
    if (!wasLoading && isLoading) {
      hasShownErrorRef.current = false;
      setHasTypedAfterError(false); // Reset typed flag on new login attempt
      setApiErrorMessage(null); // Clear stored error message on new login attempt
    }
    
    // Show success toast when login completes successfully
    // Check if loading just finished (was true, now false) and user is authenticated
    if (wasLoading && !isLoading && isAuthenticated && user) {
      toast.success('Login successful! Welcome back.');
      // Navigate based on user role
      if (user.role === "elderly_user") {
        router.push(ROUTES.AUTH_HOME);
      } else if (user.role === "service_provider") {
        router.push(ROUTES.PROFESSIONAL_HOME);
      } else {
        // Fallback to home if role is unknown
        router.push(ROUTES.AUTH_HOME);
      }
      hasShownErrorRef.current = false; // Reset error flag on success
      setHasTypedAfterError(false); // Reset on success
      setApiErrorMessage(null); // Clear error message on success
    } else if (isAuthenticated && !wasLoading && user) {
      // Already authenticated on page load (not from login attempt)
      // Navigate based on user role
      if (user.role === "elderly_user") {
        router.push(ROUTES.AUTH_HOME);
      } else if (user.role === "service_provider") {
        router.push(ROUTES.PROFESSIONAL_HOME);
      } else {
        router.push(ROUTES.AUTH_HOME);
      }
    }
    
    // Show error toast when login fails
    // Check if loading just finished (was true, now false) and there's an error
    if (wasLoading && !isLoading && error && !isAuthenticated && !hasShownErrorRef.current) {
      toast.error(error);
      hasShownErrorRef.current = true;
      setHasTypedAfterError(false); // Reset typed flag when new error occurs
      setApiErrorMessage(error); // Store error message so it persists even after clearing Redux error
      // Don't clear error immediately - keep it so we can show red borders
    }
    
    // Update previous loading state
    prevLoadingRef.current = loading;
  }, [loading, isAuthenticated, user, error, router, dispatch]);

  const initialValues: LoginFormValues = {
    emailOrMobile: '',
    password: '',
  };

  // Function to check if input indicates phone number (3 consecutive digits)
  const checkIfPhoneMode = (value: string): boolean => {
    // Check if value starts with 3 or more consecutive digits
    return /^\d{3,}/.test(value);
  };

  const handleSubmit = async (values: LoginFormValues) => {
    let finalEmailOrMobile = values.emailOrMobile.trim();
    
    // If in phone mode and we have a country code, prepend it
    if (isPhoneMode && phoneCountryCode && finalEmailOrMobile) {
      // If the number already starts with +, remove the existing country code first
      // This handles cases where user might have typed +91 at the start
      if (finalEmailOrMobile.startsWith('+')) {
        // Match country code pattern: + followed by 1-4 digits and optional space
        const cleanedNumber = finalEmailOrMobile.replace(/^\+\d{1,4}\s*/, '');
        // Prepend the selected country code
        finalEmailOrMobile = `${phoneCountryCode}${cleanedNumber}`;
      } else {
        // Number doesn't start with +, so it's a clean number - just prepend country code
        finalEmailOrMobile = `${phoneCountryCode}${finalEmailOrMobile}`;
      }
    }
    
    // Dispatch login action
    dispatch(loginUser({
      emailOrMobile: finalEmailOrMobile,
      password: values.password
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* Left side - Image Section */}


      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '56%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '100vh',
          }}
        >
          <Image
            src="/image/main.png"
            alt="Codimous Service"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
            sizes="50vw"
            priority
            quality={90}
          />
          {/* Overlay for better text readability */}

        </Box>
      </Box>

      {/* Right side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '45%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // padding: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: { xs: '32px 12px', md: 4 },
              width: '100%',
            }}
          >
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  // bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Image
                  alt='appLogo'
                  width={140}
                  height={140}
                  src={"/icons/appLogo.png"}
                />
              </Box>
              <Typography

                sx={{
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",

                }}
              >
                CoudPouss
              </Typography>
              <Typography

                sx={{
                  fontWeight: 400,
                  fontSize: "1rem",
                  lineHeight: "140%",
                  color: "secondary.neutralWhiteDark",
                }}
              >
                Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
              </Typography>
            </Box>

            {/* Login Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors: formikErrors, touched, handleChange, handleBlur, setFieldValue }) => {
                // Clear auth error when user starts typing
                const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                  let newValue = e.target.value;
                  
                  // Mark that user has started typing after error
                  if ((error || apiErrorMessage) && !hasTypedAfterError) {
                    setHasTypedAfterError(true);
                    dispatch(clearAuthError()); // Clear Redux error when user starts typing (removes red border)
                    // Keep apiErrorMessage so the message can still be displayed until next login attempt
                  }
                  
                  // First, check if this looks like an email - if so, skip phone mode entirely
                  const looksLikeEmail = newValue.includes('@');
                  
                  // If it's an email, just use regular email handling
                  if (looksLikeEmail) {
                    // Exit phone mode if we're in it
                    if (isPhoneMode) {
                      setIsPhoneMode(false);
                    }
                    // Use regular email/text input handling
                    handleChange(e);
                    if (error) {
                      dispatch(clearAuthError());
                    }
                    return; // Exit early for email input
                  }
                  
                  // Helper function to extract number from value (handles country code prefix)
                  const extractNumber = (value: string): string => {
                    if (phoneCountryCode) {
                      const codePrefix = `${phoneCountryCode} `;
                      if (value.startsWith(codePrefix)) {
                        return value.substring(codePrefix.length).replace(/\D/g, '');
                      } else if (value.startsWith(phoneCountryCode)) {
                        return value.substring(phoneCountryCode.length).replace(/\D/g, '');
                      }
                    }
                    // Try to detect any country code pattern (+ followed by 1-4 digits)
                    const countryCodeMatch = value.match(/^\+(\d{1,4})\s*/);
                    if (countryCodeMatch) {
                      return value.substring(countryCodeMatch[0].length).replace(/\D/g, '');
                    }
                    // No country code, just extract digits
                    return value.replace(/\D/g, '');
                  };
                  
                  // If already in phone mode, extract the number part first
                  let cleanedNumber = '';
                  if (isPhoneMode && phoneCountryCode) {
                    cleanedNumber = extractNumber(newValue);
                  } else {
                    // Not in phone mode yet - only check for phone mode if value starts with digits
                    // This prevents emails from triggering phone mode
                    if (checkIfPhoneMode(newValue)) {
                      cleanedNumber = extractNumber(newValue);
                    } else {
                      // Not a phone number, treat as regular input
                      handleChange(e);
                      return; // Exit early for non-phone input
                    }
                  }
                  
                  // Check if we should switch to phone mode or stay in phone mode
                  // Need at least 3 digits to be in phone mode
                  const shouldBePhoneMode = cleanedNumber.length >= 3;
                  
                  // If switching to phone mode, activate it
                  if (shouldBePhoneMode && !isPhoneMode) {
                    setIsPhoneMode(true);
                  }
                  
                  // If exiting phone mode (was in phone mode but now shouldn't be)
                  if (!shouldBePhoneMode && isPhoneMode) {
                    setIsPhoneMode(false);
                    // Clear the field completely when exiting phone mode (remove any country code residue)
                    setFieldValue('emailOrMobile', '', false);
                    return; // Exit early to avoid processing further
                  }
                  
                  // If in phone mode or entering phone mode, handle phone number
                  if (shouldBePhoneMode && (isPhoneMode || phoneCountryCode)) {
                    // Use the cleaned number
                    const numberToStore = cleanedNumber;
                    
                    // Update the field with just the number (no country code)
                    setFieldValue('emailOrMobile', numberToStore, false);
                  } else if (!shouldBePhoneMode) {
                    // Not in phone mode - handle as regular email/text input
                    // But make sure we don't have leftover country code
                    if (newValue.startsWith('+')) {
                      // User typed something starting with + but it's not a valid phone number
                      // Clear it and use regular input
                      setFieldValue('emailOrMobile', '', false);
                    } else {
                      // Regular email/text input
                      handleChange(e);
                    }
                  }
                };
                
                // Get display value for phone mode (show country code + number)
                const getDisplayValue = () => {
                  if (isPhoneMode && phoneCountryCode && values.emailOrMobile) {
                    return `${phoneCountryCode} ${values.emailOrMobile}`;
                  }
                  return values.emailOrMobile || '';
                };
                
                // Determine if field should show error border (API error and user hasn't typed yet)
                const showApiErrorBorder = !!error && !hasTypedAfterError;
                // Use stored error message for display (persists even after clearing Redux error)
                const displayErrorMessage = apiErrorMessage || error || 'Please enter valid email/mobile number and password';

                return (
                  <>
                    <Form>
                      <Typography sx={{
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: "1.25rem",
                        lineHeight: "1.5rem",
                        color: 'primary.normal',
                        mb: "0.75rem",
                      }}>
                        Welcome Back!
                      </Typography>
                      <Typography sx={{
                        fontWeight: 400,
                        size: "1rem",
                        textAlign: "center",
                        lineHeight: "140%",
                        color: "secondary.neutralWhiteDark",
                        mb: "2.125rem"
                      }}>
                        Enter your email and password to login
                      </Typography>

                      <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                      }} >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "1.0625rem",
                              lineHeight: "1.25rem",
                              color: "#424242",
                              mb: "0.5rem"
                            }}
                          >
                            Email/ Mobile No
                          </Typography>
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            {/* Conditionally render country code selector - kept for changing country code */}
                            {isPhoneMode && (
                              <Box sx={{ width: "auto", flexShrink: 0 }}>
                                <CountrySelectDropdown
                                  value={countryCode}
                                  onChange={(newCountryCode, dialCode) => {
                                    setCountryCode(newCountryCode);
                                    setPhoneCountryCode(`+${dialCode}`);
                                  }}
                                  error={!!(touched.emailOrMobile && formikErrors.emailOrMobile) || showApiErrorBorder}
                                  defaultCountry="us"
                                  preferredCountries={["in", "us"]}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Field name="emailOrMobile">
                                {({ field, meta }: FieldProps) => (
                                  <TextField
                                    name={field.name}
                                    value={getDisplayValue()}
                                    sx={{
                                      m: 0,
                                      "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                          borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                        },
                                        "&:hover fieldset": {
                                          borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                        },
                                        "&.Mui-focused fieldset": {
                                          borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                        },
                                      },
                                      "& .MuiFormHelperText-root": {
                                        fontWeight: 400,
                                        fontSize: "16px",
                                        lineHeight: "140%",
                                        letterSpacing: "0%",
                                        color: "#EF5350",
                                        marginTop: "12px !important",
                                        marginLeft: "0 !important",
                                        marginRight: "0 !important",
                                        marginBottom: "0 !important",
                                      },
                                    }}
                                    fullWidth
                                    placeholder={isPhoneMode ? "Enter Mobile No" : "Enter Email/ Mobile No"}
                                    onChange={handleFieldChange}
                                    onBlur={handleBlur}
                                    error={!!(meta.touched && meta.error) || showApiErrorBorder}
                                    helperText={meta.touched && meta.error ? meta.error : (showApiErrorBorder && displayErrorMessage ? displayErrorMessage : '')}
                                    margin="normal"
                                    required
                                    type={isPhoneMode ? "tel" : "text"}
                                    inputProps={{
                                      // Remove pattern validation - we're displaying formatted value with country code
                                      // Yup validation will handle the actual validation
                                      pattern: undefined,
                                      inputMode: isPhoneMode ? "numeric" : "text",
                                      maxLength: isPhoneMode ? 20 : undefined,
                                    }}
                                    FormHelperTextProps={{
                                      sx: {
                                        marginTop: "12px",
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginBottom: 0,
                                      },
                                    }}
                                  />
                                )}
                              </Field>
                            </Box>
                          </Box>
                        </Box>

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "1.0625rem",
                              lineHeight: "1.25rem",
                              color: "#424242",
                              mb: "0.5rem"
                            }}
                          >
                            Password
                          </Typography>
                          <Field name="password">
                            {({ field, meta }: FieldProps) => (
                              <TextField
                                {...field}
                                fullWidth
                                sx={{
                                  m: 0,
                                  "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                      borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                    },
                                    "&:hover fieldset": {
                                      borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                    },
                                    "&.Mui-focused fieldset": {
                                      borderColor: showApiErrorBorder ? "#ef4444" : undefined,
                                    },
                                  },
                                  "& .MuiFormHelperText-root": {
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "140%",
                                    letterSpacing: "0%",
                                    color: "#EF5350",
                                    marginTop: "12px !important",
                                    marginLeft: "0 !important",
                                    marginRight: "0 !important",
                                    marginBottom: "0 !important",
                                  },
                                }}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter Password"
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                error={!!(meta.touched && meta.error) || showApiErrorBorder}
                                helperText={meta.touched && meta.error ? meta.error : (showApiErrorBorder && displayErrorMessage ? displayErrorMessage : '')}
                                margin="normal"
                                required
                                FormHelperTextProps={{
                                  sx: {
                                    marginTop: "12px",
                                    marginLeft: 0,
                                    marginRight: 0,
                                    marginBottom: 0,
                                  },
                                }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                      >
                                        {showPassword ? (
                                          <img 
                                            src="/icons/blueOpenIcon.svg" 
                                            alt="Hide password" 
                                            style={{ width: 20, height: 20 }}
                                          />
                                        ) : (
                                          <img 
                                            src="/icons/blueHideIcon.svg" 
                                            alt="Show password" 
                                            style={{ width: 20, height: 20 }}
                                          />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          </Field>
                        </Box>

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            fontSize: "1.1875rem",
                            fontWeight: 700,
                            bgcolor: "primary.dark"
                          }}
                          size="large"
                          disabled={loading}
                        >
                          {loading ? 'Logging in...' : 'Log In'}
                        </Button>

                      </Box>
                    </Form>

                    <Box sx={{ textAlign: 'center', mt: "2.125rem" }}>
                      <Typography sx={{
                        color: 'secondary.naturalGray',
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        lineHeight: "1.25rem"
                      }}>
                        Don&apos;t have an account?{' '}
                        <Link
                          href={ROUTES.SIGNUP}
                          style={{
                            fontFamily: "Lato, sans-serif",
                            fontWeight: 600,
                            fontSize: "1.25rem", // 20px -> 20 / 16 = 1.25rem
                            lineHeight: "1.5rem", // 24px -> 24 / 16 = 1.5rem
                            letterSpacing: "0em",
                            textAlign: "center",
                            color: "#2C6587", // or primary.normal if defined in theme
                            textDecoration: "underline",
                            textDecorationThickness: "0.08em", // 8% of font-size
                            textUnderlineOffset: "0.03em", // 3% of font-size
                            textDecorationSkipInk: "auto", // skip-ink effect
                            display: "inline-block", // ensures text-align works if needed
                          }}
                        >
                          Sign up
                        </Link>
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <Link
                          href={ROUTES.RESET_PASSWORD}
                          style={{
                            color: '#6D6D6D',
                            fontSize: "1.125rem",
                            lineHeight: "1.25rem",
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          Forgot password?
                        </Link>
                      </Typography>
                    </Box>
                  </>
                );
              }}
            </Formik>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}