'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  // Link,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Link from 'next/link';
import { ArrowBack } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import { buildInputData, isValidEmailOrMobile } from '@/utils/validation';
import { apiPost } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';
import { ApiResponse } from '@/types';

type ResetStep = 'enter-email' | 'verify-otp' | 'set-password';
type UserType = 'elder' | 'professional';

interface SignUpApiError {
  [key: string]: string;
}

interface OtpData {
  message: string;
}

interface SignUpApiResponse {
  data?: any | null;
  message?:string;
  error: SignUpApiError | null;
}

// Yup validation schemas for each step
const enterEmailSchema = Yup.object().shape({
  emailOrMobile: Yup.string()
    .required('Email or Mobile Number is required')
    .test(
      'is-valid-email-or-mobile',
      'Please enter a valid email or mobile number',
      (value) => {
        if (!value) return false;
        return isValidEmailOrMobile(value);
      }
    ),
});

const verifyOtpSchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string())
    .length(4, 'Please enter valid code')
    .test('all-filled', 'Please enter valid code', (values) => {
      return values?.every((val) => val && val.length === 1) || false;
    }),
});

const setPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Password is required')
    .test(
      'password-requirements',
      'Your password must be 8 characters long and include a capital letter, a small letter, and a number.',
      (value) => {
        if (!value) return false;
        if (value.length < 8) return false;
        if (!/[A-Z]/.test(value)) return false;
        if (!/[a-z]/.test(value)) return false;
        if (!/[0-9]/.test(value)) return false;
        return true;
      }
    ),
  reEnterPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Please make sure your passwords match'),
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType: UserType = (searchParams.get('type') as UserType) || 'elder';
  const [step, setStep] = useState<ResetStep>('enter-email');
  // const [step, setStep] = useState<ResetStep>('verify-otp');
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    otp: ['', '', '', ''],
    newPassword: '',
    reEnterPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleContinue = async() => {
    setLoading(true)
    if (step === 'enter-email') {
      let {data,error} = await apiCallToResetPassword("");

      if(data){
        setStep('verify-otp');
      }else{
        if(error){
          setErrors({ emailOrMobile: error.message || "Something Went Wrong!" });
        }
      }
    } else if (step === 'verify-otp') {
      let {data,error} = await apiCallToResetPassword("");

      if(data){
        setStep('set-password');
      }else{
         if(error){
          setErrors({ otp: error.message || "Something Went Wrong!" });
        }
      }
    }
  };

  
  const apiCallToResetPassword = async(submit:string) : Promise<SignUpApiResponse> =>{
    try {
      let payload = {}
      let url = ""
      let validData = buildInputData(formData.emailOrMobile)
      let error = {}
      setErrors({})

      // Add user_type to payload if professional
      const basePayload = userType === 'professional' ? { user_type: 'professional' } : {};

      if (step === "enter-email") {
        url = API_ENDPOINTS.AUTH.RESET_PASSWORD_START

        if(validData.email){
          payload = {
            ...basePayload,
            "email": validData.email || "",
          } 
        }else{
          payload = {
            ...basePayload,
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
          }  
        }
      }else if (step === "verify-otp") {
        url = API_ENDPOINTS.AUTH.VERIFY_RESET_PASSWORD_OTP

        if(validData.email){
          payload = {
            ...basePayload,
            "email": validData.email || "",
            "otp": formData.otp.join("")
          } 
        }else{
          payload = {
            ...basePayload,
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "otp": formData.otp.join("")
          }  
        }
      }

      if(submit == "submit"){
        url = API_ENDPOINTS.AUTH.RESET_PASSWORD

        if(validData.email){
          payload = {
            ...basePayload,
            "email": validData.email || "",
            "password": formData.newPassword,
            "confirm_password" : formData.reEnterPassword,
          } 
        }else{
          payload = {
            ...basePayload,
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "password": formData.newPassword,
            "confirm_password" : formData.reEnterPassword,
          }  
        }
      }

      if(submit == "resendOTP"){
        url = API_ENDPOINTS.AUTH.RESEND_OTP;

        if(validData.email){
          payload = {
            ...basePayload,
            "email": validData.email || "",
          } 
        }else{
          payload = {
            ...basePayload,
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
          }  
        }
      }

      const response = await apiPost<OtpData>(url,payload)

      if(response){
        if(response.data?.message?.includes("OTP sent successfully")){
          setErrors({otp : "OTP sent successfully"})
        }
      }
      
      if (response?.error?.message) {
        error =  { submit: response.error.message || "Something went wrong." }
        setErrors({
          profilePicture: response.error.message,
        });
      }

      return {
        data: response.data,
        error:null
      };
    } catch (error:any) {
      console.error("Reset password error:", error);
      return {
          data: null,
          error:  error || "Something went wrong. Please try again."
      };
    } finally {
      setLoading(false);
    }
  }

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      let {data,error} = await apiCallToResetPassword("submit");
      if(data){
        router.push(ROUTES.LOGIN);
      }else{
        if(error){
          setErrors({ submit: error.message || "Something Went Wrong!" });
        }
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
          <Formik
            initialValues={{ emailOrMobile: formData.emailOrMobile || "" }}
            validationSchema={enterEmailSchema}
            onSubmit={async (values, { setFieldError }) => {
              setFormData((prev) => ({
                ...prev,
                emailOrMobile: values.emailOrMobile,
              }));
              await handleContinue();
            }}
            enableReinitialize
          >
            {({
              values,
              errors: formikErrors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form>
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
                  <Field name="emailOrMobile">
                    {({ field, meta }: FieldProps) => (
                      <TextField
                        {...field}
                        fullWidth
                        placeholder="Enter Email/ Mobile No"
                        onChange={(e) => {
                          handleChange(e);
                          setFormData((prev) => ({
                            ...prev,
                            emailOrMobile: e.target.value,
                          }));
                        }}
                        onBlur={handleBlur}
                        error={!!(meta.touched && meta.error) || !!errors.emailOrMobile}
                        helperText={(meta.touched && meta.error) || errors.emailOrMobile || ""}
                        margin="normal"
                        sx={{ 
                          m: 0, 
                          mb: "3.6875rem",
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
                    )}
                  </Field>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: "140%",
                    fontWeight: 400,
                    justifyContent: 'center',
                    color: '#424242',
                    textDecoration: 'none',
                    fontSize: "1rem",
                  }}
                >
                  <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
                  Back to Login
                </Link>
              </Form>
            )}
          </Formik>
        );

      case 'verify-otp':
        return (
          <Box  sx={{
            px: { xs: 0, md: 4 }
          }} >
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                color: `primary.normal`,
                mb: { xs: "0.5rem", md: "0.75rem" },
                lineHeight: { xs: "1.5rem", md: "1.75rem" },
                textAlign: "center",
              }}
            >
              Welcome To CoudPouss!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "0.875rem", sm: "0.9375rem", md: "1rem" },
                textAlign: "center",
                lineHeight: "140%",
                mb: { xs: "2rem", md: "2.5rem" },
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and
              companionship whenever needed.
            </Typography>

            <Typography
              sx={{
                fontWeight: 400,
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
                textAlign: "center",
                lineHeight: "140%",
                mb: { xs: "1rem", md: "1.5rem" },
                color: "secondary.neutralWhiteDark",
              }}
            >
              To continue Please enter the 4 Digit OTP sent to your Email or
              Phone Number.
            </Typography>
            <Formik
              initialValues={{ otp: formData.otp || ["", "", "", ""] }}
              validationSchema={verifyOtpSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={async (values) => {
                setFormData((prev) => ({ ...prev, otp: values.otp }));
                await handleContinue();
              }}
              enableReinitialize
            >
              {({
                values,
                errors: formikErrors,
                setFieldValue,
                handleSubmit,
                submitCount,
              }) => {
                const handleOtpChangeFormik = (
                  index: number,
                  value: string
                ) => {
                  // Only allow numeric digits (0-9)
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue.length > 1) return;
                  const newOtp = [...values.otp];
                  newOtp[index] = numericValue;
                  setFieldValue("otp", newOtp);
                  setFormData((prev) => ({ ...prev, otp: newOtp }));

                  // Auto-focus next input
                  if (numericValue && index < 3) {
                    const nextInput = document.getElementById(
                      `otp-${index + 1}`
                    );
                    nextInput?.focus();
                  }
                };

                const handleOtpKeyDownFormik = (
                  index: number,
                  e: React.KeyboardEvent<HTMLDivElement>
                ) => {
                  if (
                    e.key === "Backspace" &&
                    !values.otp[index] &&
                    index > 0
                  ) {
                    const prevInput = document.getElementById(
                      `otp-${index - 1}`
                    );
                    prevInput?.focus();
                  }
                };

                return (
                  <Form  >
                    <Typography
                      sx={{
                        fontSize: { xs: "16px", md: "18px" },
                        fontWeight: "500",
                        lineHeight: "100%",
                        color: "#555555",
                        margin: "0 auto",
                        mb: { xs: 1.5, md: 2 },
                        
                      }}
                    >
                      Code
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "space-between",

                      margin: "0 auto",
                        mb: formikErrors.otp && submitCount > 0 ? 1 : 2,
                      }}
                    >
                      {values.otp.map((digit, index) => (
                        <TextField
                          key={index}
                          id={`otp-${index}`}
                          value={digit || ""}
                          error={!!(formikErrors.otp && submitCount > 0)}
                          onChange={(e) =>
                            handleOtpChangeFormik(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDownFormik(index, e)}
                          inputProps={{
                            maxLength: 1,
                            inputMode: "numeric",
                            pattern: "[0-9]*",
                            style: {
                              textAlign: "center",
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                            },
                          }}
                          InputProps={{
                            sx: {
                              "& input": {
                                fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.5rem" },
                              },
                            },
                          }}
                          sx={{
                            borderColor: formikErrors.otp && submitCount > 0 ? "#EF5350" : "",
                            "& .MuiOutlinedInput-root": {
                              borderColor: formikErrors.otp && submitCount > 0 ? "#EF5350" : "",
                              width: "100%",
                              borderRadius: "12px",
                            },
                          }}
                        />
                      ))}
                    </Box>
                    {formikErrors.otp && submitCount > 0 && (
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#EF5350",
                          mb: 2,
                          mt: "12px",
                          textAlign: "center",
                        }}
                      >
                        Please enter valid code
                      </Typography>
                    )}
                    {errors.otp && !formikErrors.otp && (
                      <Typography
                        sx={{
                          fontWeight: 400,
                          fontSize: "16px",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: "#EF5350",
                          mb: 2,
                          mt: "12px",
                          textAlign: "center",
                        }}
                      >
                        {errors.otp}
                      </Typography>
                    )}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        apiCallToResetPassword("resendOTP");   
                      }}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        marginBottom: "2.4375rem",
                        color: '#2C6587',
                        textDecoration: 'none',
                        fontSize: '1.25rem',
                        lineHeight: '1.5rem',
                        fontWeight: 600,
                      }}
                    >
                      Resend code
                    </Link>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        bgcolor: '#214C65',
                        color: 'white',
                        py: 1.5,
                        fontWeight: 700,

                        mb: 2,
                        textTransform: 'none',
                        fontSize: '1.188rem',
                        '&:hover': {
                          bgcolor: '#25608A',
                        },
                      }}
                    >
                      Verify OTP
                    </Button>
                    <Link
                      href={ROUTES.LOGIN}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        lineHeight: "140%",
                        justifyContent: 'center',
                        color: '#424242',
                        textDecoration: 'none',
                        fontSize: "1rem",
                      }}
                    >
                      <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
                      Back to Login
                    </Link>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        );

      case 'set-password':
        return (
          <Formik
            initialValues={{
              newPassword: formData.newPassword || "",
              reEnterPassword: formData.reEnterPassword || "",
            }}
            validationSchema={setPasswordSchema}
            onSubmit={async (values) => {
              setFormData((prev) => ({
                ...prev,
                newPassword: values.newPassword,
                reEnterPassword: values.reEnterPassword,
              }));
              await handleResetPassword();
            }}
            enableReinitialize
          >
            {({
              values,
              errors: formikErrors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form>
                <Typography sx={{ color: '#424242', mb: 1.5, fontWeight: 600, fontSize: "1.5rem", lineHeight: "1.75rem" }}>
                  Set New Password
                </Typography>
                <Typography  sx={{ mb: 3,color: "#787878", fontSize: "1.125rem", lineHeight: "1.5rem", fontWeight: 500 }}>
                  Your new password must be different from previously used passwords
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px",
                  }}
                >
                  New Password
                </Typography>
                <Field name="newPassword">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      fullWidth
                      sx={{
                        m: 0,
                        mb: 2,
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
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter New Password"
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }));
                      }}
                      onBlur={handleBlur}
                      error={!!(meta.touched && meta.error)}
                      helperText={(meta.touched && meta.error) || ""}
                      margin="normal"
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
                <Typography
                  sx={{
                    mt: "8px",
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px",
                  }}
                >
                  Re-enter New Password
                </Typography>
                <Field name="reEnterPassword">
                  {({ field, meta }: FieldProps) => (
                    <TextField
                      {...field}
                      sx={{
                        m: 0,
                        mb: 3,
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
                      type={showReEnterPassword ? "text" : "password"}
                      placeholder="Re-enter New Password"
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          reEnterPassword: e.target.value,
                        }));
                      }}
                      onBlur={handleBlur}
                      error={!!(meta.touched && meta.error)}
                      helperText={(meta.touched && meta.error) || ""}
                      margin="normal"
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
                              onClick={() => setShowReEnterPassword(!showReEnterPassword)}
                              edge="end"
                            >
                              {showReEnterPassword ? (
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
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    lineHeight: "140%",
                    justifyContent: 'center',
                    color: '#424242',
                    textDecoration: 'none',
                    fontSize: "1rem",
                  }}
                >
                  <ArrowBack sx={{ fontSize: "1.25rem", mr: "0.75rem" }} />
                  Back to Login
                </Link>
              </Form>
            )}
          </Formik>
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
          px: { xs: 0, md: 4 },
          py: { xs: 2, md: 4 },
          overflowY: 'auto',
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
