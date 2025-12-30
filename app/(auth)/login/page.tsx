// app/login/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
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
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { validateLoginForm } from '@/utils/validation';
import { ROUTES } from '@/constants/routes';
import { loginUser, clearAuthError } from '@/lib/redux/authSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';


export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated,user } = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Clear any existing auth errors when component mounts
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push(ROUTES.AUTH_HOME);
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Clear auth error when user starts typing
    if (error) {
      dispatch(clearAuthError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLoginForm(formData.emailOrMobile, formData.password);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Dispatch login action
    dispatch(loginUser({
      emailOrMobile: formData.emailOrMobile,
      password: formData.password
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
          width: '55%',
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
              padding: 4,
              width: '100%',
            }}
          >
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
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
            <Box component="form" onSubmit={handleSubmit}>
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
                  <TextField
                    sx={{
                      m: 0
                    }}
                    fullWidth
                    name="emailOrMobile"
                    placeholder="Enter Email/ Mobile No"
                    value={formData.emailOrMobile}
                    onChange={handleChange}
                    error={!!errors.emailOrMobile}
                    helperText={errors.emailOrMobile}
                    margin="normal"
                    required
                  />
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
                  <TextField
                    fullWidth
                    sx={{
                      m: 0
                    }}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    margin="normal"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ?  <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}

                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                {(errors.submit || error) && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {errors.submit || error}
                  </Typography>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    fontSize: "1.1875rem",
                    fontWeight:700,
                    bgcolor: "primary.dark"
                  }}
                  size="large"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </Button>

              </Box>


              <Box sx={{ textAlign: 'center', mt: "2.125rem" }}>
                <Typography sx={{
                  color: 'secondary.naturalGray',
                  fontSize: "1.125rem",
                  fontWeight:600,
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
                      color: 'secondary.naturalGray',
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
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}