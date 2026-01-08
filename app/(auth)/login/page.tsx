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
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState({
    mobileNo: '',
    phoneCountryCode: '',
    countryCode: 'us',
  });
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
      // Clear the error after showing toast
      dispatch(clearAuthError());
    }
    
    // Update previous loading state
    prevLoadingRef.current = loading;
  }, [loading, isAuthenticated, user, error, router, dispatch]);

  const initialValues: LoginFormValues = {
    emailOrMobile: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormValues) => {
    // Dispatch login action
    dispatch(loginUser({
      emailOrMobile: values.emailOrMobile,
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
                  handleChange(e);
                  if (error) {
                    dispatch(clearAuthError());
                  }
                };

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
                          <Field name="emailOrMobile">
                            {({ field, meta }: FieldProps) => (
                              <TextField
                                {...field}
                                sx={{
                                  m: 0,
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
                                placeholder="Enter Email/ Mobile No"
                                onChange={handleFieldChange}
                                onBlur={handleBlur}
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : ''}
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
                              />
                            )}
                          </Field>
                        </Box>

                        {/* <Box>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: "1.0625rem",
                              lineHeight: "1.25rem",
                              color: "#424242",
                              mb: "0.5rem"
                            }}
                          >
                            Mobile No.
                          </Typography>
                          <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                            <Box sx={{ width: "auto", flexShrink: 0 }}>
                              <CountrySelectDropdown
                                value={formData.countryCode || 'us'}
                                onChange={(countryCode, dialCode) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    countryCode: countryCode,
                                    phoneCountryCode: `+${dialCode}`,
                                  }));
                                  setFieldValue('phoneCountryCode', `+${dialCode}`);
                                }}
                                error={phoneError}
                                defaultCountry="us"
                                preferredCountries={["in", "us"]}
                              />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Field name="mobileNo">
                                {({ field, meta }: FieldProps) => {
                                  const isError = !!(meta.touched && meta.error) || (meta.touched && phoneError);
                                  return (
                                    <>
                                      <TextField
                                        {...field}
                                        fullWidth
                                        placeholder="Enter Mobile No."
                                        onChange={(e) => {
                                          handleChange(e);
                                          setFormData((prev) => ({
                                            ...prev,
                                            mobileNo: e.target.value,
                                          }));
                                          if (phoneError && e.target.value) {
                                            setPhoneError(false);
                                          }
                                        }}
                                        onBlur={handleBlur}
                                        error={isError}
                                        helperText={isError ? (meta.error || "Please enter a valid phone number") : ''}
                                        sx={{
                                          m: 0,
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
                                        FormHelperTextProps={{
                                          sx: {
                                            marginTop: "12px",
                                            marginLeft: 0,
                                            marginRight: 0,
                                            marginBottom: 0,
                                          },
                                        }}
                                      />
                                    </>
                                  );
                                }}
                              </Field>
                            </Box>
                          </Box>
                        </Box> */}

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
                                error={!!(meta.touched && meta.error)}
                                helperText={meta.touched && meta.error ? meta.error : ''}
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