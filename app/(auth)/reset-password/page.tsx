'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import { buildInputData, isValidPassword } from '@/utils/validation';
import { apiPost } from '@/lib/api';

type ResetStep = 'enter-email' | 'verify-otp' | 'set-password';

interface SignUpApiError {
  [key: string]: string;
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>('enter-email');
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    otp: ['', '', '', ''],
    newPassword: '',
    reEnterPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if(name == "newPassword"){
      const {valid, errors} = isValidPassword(value) 
      if(!valid){
        console.log(errors)
        setPasswordErrors(errors)
      }else{
        setPasswordErrors([])
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = async() => {
    setLoading(true)
    if (step === 'enter-email') {
      if (!formData.emailOrMobile) {
        setErrors({ emailOrMobile: 'Please enter email or mobile number' });
        setLoading(false)
        return;
      }

      let {data,error} = await apiCallToSignUpUser("");

      if(data){
        setStep('verify-otp');
      }else{
        setErrors({ emailOrMobile: "Something Went Wrong!" });
      }
    } else if (step === 'verify-otp') {
      if (formData.otp.some((digit) => !digit)) {
        setErrors({ otp: 'Please enter valid code' });
        setLoading(false)
        return;
      }

      let {data,error} = await apiCallToSignUpUser("");

      if(data){
        setStep('set-password');
      }else{
        setErrors({ otp: "Something Went Wrong!" });
      }
    }
  };

  
  const apiCallToSignUpUser = async(submit:string) : Promise<SignUpApiResponse> =>{
    try {
      let payload = {}
      let url = ""
      let validData = buildInputData(formData.emailOrMobile)
      console.log(validData)
      let error = {}

      if (step === "enter-email") {
        url = "userService/auth/start"

        if(validData.email){
          payload = {
            "email": validData.email || "",
          } 
        }else{
          payload = {
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
          }  
        }
      }else if (step === "verify-otp") {
        url = "userService/auth/reset/verify"

        if(validData.email){
          payload = {
            "email": validData.email || "",
            "otp": formData.otp.join("")
          } 
        }else{
          payload = {
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "otp": formData.otp.join("")
          }  
        }
      }

      if(submit){
        url = "userService/auth/reset/confirm";

        if(validData.email){
          payload = {
            "email": validData.email || "",
            "password": formData.newPassword,
            "confirmPassword" : formData.reEnterPassword,
          } 
        }else{
          payload = {
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "password": formData.newPassword,
            "confirmPassword" : formData.reEnterPassword,
          }  
        }
      }

      let response  = await apiPost(url,payload)
      
      if (response?.error?.message) {
        error =  { submit: response.error.message || "Something went wrong." }
        setErrors({
          profilePicture: response.error.message,
        });
      }

      return {
        data: null,
        error
      };
    } catch (error:any) {
      console.error("Signup error:", error);
      return {
          data: null,
          error:  error || "Something went wrong. Please try again."
      };
    } finally {
      setLoading(false);
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.reEnterPassword) {
      setErrors({ password: 'Please fill all password fields' });
      return;
    }

    if (formData.newPassword !== formData.reEnterPassword) {
      setErrors({ password: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual reset password API call
      console.log('Reset password:', formData);
      let {data,error} = await apiCallToSignUpUser("submit");
      console.log(data)
      if(data){
        router.push(ROUTES.LOGIN);
      }else{
        // setErrors({ emailOrMobile: "Something Went Wrong!" });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'enter-email':
        return (
          <Box>
            <Typography sx={{ color: '#424242', mb: 1, fontWeight: 600, lineHeight: "1.75rem", fontSize: "1.5rem" }}>
              Reset Password
            </Typography>
            <Typography sx={{ mb: 3, color: "#787878", fontSize: "1.125rem", lineHeight: "1.5rem", fontWeight: 400 }}>
              Enter your Registered Email or Phone Number below to get reset your password.
            </Typography>

            <Box>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  color: "#555555",
                  mb: 2
                }}
              >
                Email/ Mobile No
              </Typography>
              <TextField
                fullWidth
                name="emailOrMobile"
                placeholder="Enter Email/ Mobile No"
                value={formData.emailOrMobile}
                onChange={handleChange}
                error={!!errors.emailOrMobile}
                helperText={errors.emailOrMobile}
                margin="normal"
                sx={{ m: 0, mb: "3.6875rem" }}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleContinue}
              sx={{
                bgcolor: '#214C65',
                color: 'white',
                py: 1.5,
                mb: 2,
                textTransform: 'none',
                fontWeight:700,
                fontSize: '1.1875rem',
                '&:hover': {
                  bgcolor: '#25608A',
                },
              }}
            >
              Continue
            </Button>
            <Link
              href={ROUTES.LOGIN}
              sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: "140%",
                fontWeight:400,
                justifyContent: 'center',
                color: '#424242',
                textDecoration: 'none',
                fontSize: "1rem",
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
              Back to Login
            </Link>
          </Box>
        );

      case 'verify-otp':
        return (
          <Box>
            <Typography sx={{ color: '#424242', fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem", mb: "0.75rem" }}>
              Enter OTP
            </Typography>
            <Typography sx={{ mb: 3, color: "#787878", lineHeight: "1.5rem", fontSize: "1.125rem", fontWeight: 500 }}>
              To continue Please enter the 4 Digit OTP sent to your Email or Phone Number.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', mb: 2 }}>
              {formData.otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' },
                  }}
                  sx={{
                    width: 60,
                    '& .MuiOutlinedInput-root': {
                      height: 60,
                      width: "5.03125rem"
                    },
                  }}
                />
              ))}
            </Box>
            {errors.otp && (
              <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
                {errors.otp}
              </Typography>
            )}
            <Link
              href="#"
              sx={{

                display: 'block',
                textAlign: 'center',
                mb: "2.4375rem",
                color: 'primary.normal',
                textDecoration: 'none',
                fontSize: '1.25rem',
                lineHeight: '1.5rem',
                fontWeight: 600,
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Resend code
            </Link>
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleContinue}
              sx={{
                bgcolor: '#2F6B8E',
                color: 'white',
                
                py: 1.5,
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#25608A',
                },
              }}
            >
              Verify OTP
            </Button>
            <Link
              href={ROUTES.LOGIN}
              sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: "140%",

                justifyContent: 'center',
                color: '#424242',
                textDecoration: 'none',
                fontSize: "1rem",
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
              Back to Login
            </Link>
          </Box>
        );

      case 'set-password':
        return (
          <Box component="form" onSubmit={handleResetPassword}>
            <Typography sx={{ color: '#424242', mb: 1.5, fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem" }}>
              Set New Password
            </Typography>
            <Typography  sx={{ mb: 3,color: "#787878", fontSize: "1.125rem", lineHeight: "1.5rem", fontWeight: 500 }}>
              Your new password must be different from previously used passwords
            </Typography>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter New Password"
              value={formData.newPassword}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {
              passwordErrors && passwordErrors.map((err)=>{
                return(
                  <Typography color="error" variant="body2" sx={{fontSize:"0.9rem", textAlign: "left",fontWeight:400 }}>
                    {err}
                  </Typography>
                )
              })
            }
            <TextField
              fullWidth
              label="Re-enter New Password"
              name="reEnterPassword"
              type={showReEnterPassword ? 'text' : 'password'}
              placeholder="Re-enter New Password"
              value={formData.reEnterPassword}
              onChange={handleChange}
              margin="normal"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowReEnterPassword(!showReEnterPassword)} edge="end">
                      {showReEnterPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.submit && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.submit}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#2F6B8E',
                color: 'white',
                py: 1.5,
                mb: 2,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#25608A',
                },
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
            <Link
              href={ROUTES.LOGIN}
              sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: "140%",

                justifyContent: 'center',
                color: '#424242',
                textDecoration: 'none',
                fontSize: "1rem",
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
              Back to Login
            </Link>
          </Box>
        );

      default:
        return null;
    }
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
            alt="CoudPouss Service"
            fill
            style={{
              objectFit: 'cover',
              objectPosition: 'top',
            }}
            sizes="50vw"
            priority
            quality={90}
          />
        </Box>
      </Box>

      {/* Right side - Reset Password Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '45%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          overflowY: 'auto',
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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: "0.526875rem"

              }} >
                <Image
                  alt='logo'
                  width={80}

                  height={80}
                  src={"/icons/appLogo.png"}
                />
                <Typography sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "1.5rem",
                  fontWeight: 600
                }}>
                  CoudPouss
                </Typography>
              </Box>

            </Box>

            {/* Step Content */}
            {renderStepContent()}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
