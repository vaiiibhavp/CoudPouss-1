"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { setTokens } from "@/lib/redux/authSlice";
import { AppDispatch } from "@/lib/redux/store";
import Image from "next/image";
import { apiPost, apiPostFormData } from "@/lib/api";
import {
  buildInputData,
  isValidEmailOrMobile,
  parseMobile,
} from "@/utils/validation";
import { API_ENDPOINTS } from "@/constants/api";
import PhoneInputWrapper from "@/components/PhoneInputWrapper";

type SignupStep =
  | "enter-contact"
  | "verify-otp"
  | "create-password"
  | "add-details";

interface SignUpApiError {
  [key: string]: string;
}

interface ProfilePhotoApi {
  data?: any;
  error?: {
    message?: string;
  };
}

interface SignUpApiResponse {
  data: any | null;
  error: SignUpApiError | null;
}

// Yup validation schemas for each step
const enterContactSchema = Yup.object().shape({
  emailOrMobile: Yup.string()
    .required("Email or Mobile Number is required")
    .test(
      "is-valid-email-or-mobile",
      "Please enter a valid email or mobile number",
      (value) => {
        if (!value) return false;
        return isValidEmailOrMobile(value);
      }
    ),
});

const verifyOtpSchema = Yup.object().shape({
  otp: Yup.array()
    .of(Yup.string())
    .length(4, "Please enter valid code")
    .test("all-filled", "Please enter valid code", (values) => {
      return values?.every((val) => val && val.length === 1) || false;
    }),
});

const createPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-requirements",
      "Your password must be 8 characters long and include a capital letter, a small letter, and a number.",
      (value) => {
        if (!value) return false;
        if (value.length < 8) return false;
        if (!/[A-Z]/.test(value)) return false;
        if (!/[a-z]/.test(value)) return false;
        if (!/[0-9]/.test(value)) return false;
        return true;
      }
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Please make sure your passwords match"),
});

const addDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long"),
  mobileNo: Yup.string()
    .required("Mobile number is required")
    .test("is-valid-phone", "Please enter a valid phone number", (value) => {
      if (!value) return false;
      const cleaned = value.replace(/\s/g, "");
      return cleaned.length >= 10;
    }),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  address: Yup.string().required("Address is required"),
});

export default function ProfessionalSignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [step, setStep] = useState<SignupStep>("enter-contact");
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: ["", "", "", ""],
    password: "",
    confirmPassword: "",
    name: "",
    mobileNo: "",
    phoneCountryCode: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
    profilePicturePreview: "",
  });
  const [phoneError, setPhoneError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Start countdown timer when OTP step is reached
  useEffect(() => {
    if (step === "verify-otp") {
      setOtpCountdown(60);
    }
  }, [step]);

  // Auto-populate email and mobile from emailOrMobile when reaching add-details step
  useEffect(() => {
    if (step === "add-details" && formData.emailOrMobile) {
      try {
        const validData = buildInputData(formData.emailOrMobile);
        setFormData((prev) => {
          const updates: any = {};
          
          if (validData.email && !prev.email) {
            updates.email = validData.email;
          }
          
          if (validData.mobile && validData.phone_country_code && !prev.mobileNo) {
            updates.mobileNo = `${validData.phone_country_code}${validData.mobile}`;
            updates.phoneCountryCode = validData.phone_country_code;
          }
          
          if (Object.keys(updates).length > 0) {
            return { ...prev, ...updates };
          }
          
          return prev;
        });
      } catch (error) {
        console.log("Could not auto-populate from emailOrMobile:", error);
      }
    }
  }, [step]);

  // Countdown timer effect
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => {
        setOtpCountdown(otpCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    if (step === "enter-contact") {
      let { data, error } = await apiCallToSignUpUser("");
      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_otp_verified === true) {
        setStep("create-password");
        setLoading(false);
        return;
      }

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        setStep("verify-otp");
      } else if (error) {
        console.log("error", {error});
        const errorMsg =
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (
          errorMsg.includes("OTP already verified. Redirect to Password page.")
        ) {
          setStep("create-password");
        } else if (errorMsg.includes("Email already registered")) {
          toast.error(errorMsg);
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    } else if (step === "verify-otp") {
      let { data, error } = await apiCallToSignUpUser("");

      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_otp_verified === true) {
        setStep("create-password");
        setLoading(false);
        return;
      }

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        if (data?.status === "success") {
          const successMsg = data?.message;
          toast.success(successMsg);
        }
        setStep("create-password");
      } else if (error) {
        const errorMsg =
          error.message ||
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (errorMsg.includes("OTP already verified")) {
          setStep("create-password");
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    } else if (step === "create-password") {
      let { data, error } = await apiCallToSignUpUser("");

      const responseData: any = data?.data || data;
      const nestedData = responseData?.data || responseData;

      if (nestedData && nestedData.is_password_set === true) {
        setStep("add-details");
        setLoading(false);
        return;
      }

      if (data && !error) {
        setStep("add-details");
      } else if (error) {
        const errorMsg =
          error.submit ||
          error.otp ||
          error.password ||
          error.general ||
          error.msg ||
          "Something Went Wrong";
        if (errorMsg.includes("OTP already sent")) {
          setStep("verify-otp");
        } else if (errorMsg.includes("OTP already verified")) {
          setStep("create-password");
        } else if (errorMsg.includes("Password already set")) {
          setStep("add-details");
        } else {
          toast.error(errorMsg);
        }
      }
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const { data, error } = await apiCallToSignUpUser("resendOTP");
      if (data && !error) {
        toast.success("OTP has been resent successfully");
        setOtpCountdown(60);
      } else if (error) {
        const errorMsg = error.message || error.msg || error.general || "Failed to resend OTP. Please try again.";
        toast.error(errorMsg);
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const apiCallToSignUpUser = async (
    submit: string
  ): Promise<SignUpApiResponse> => {
    try {
      let payload = {};
      let url = "";
      let validData: any = {};

      if (!(step === "add-details" && submit === "submit") && formData.emailOrMobile) {
        try {
          validData = buildInputData(formData.emailOrMobile);
        } catch (error: any) {
          return {
            data: null,
            error: { general: error.message || "Invalid email or mobile input" },
          };
        }
      }

      if (step === "enter-contact") {
        url = API_ENDPOINTS.AUTH.START;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            role: "service_provider",
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            role: "service_provider",
          };
        }
      } else if (step === "verify-otp") {
        url = API_ENDPOINTS.AUTH.VERIFY_OTP;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            otp: formData.otp.join(""),
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            otp: formData.otp.join(""),
          };
        }
      } else if (step === "create-password") {
        url = API_ENDPOINTS.AUTH.CREATE_PASSWORD;

        if (validData.email) {
          payload = {
            email: validData.email || "",
            password: formData.password,
            confirm_password: formData.confirmPassword,
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
            password: formData.password,
            confirm_password: formData.confirmPassword,
          };
        }
      }

      if (submit == "submit") {
        url = API_ENDPOINTS.AUTH.CREATE_ACCOUNT;

        let phoneCountryCode = formData.phoneCountryCode;
        let mobile = formData.mobileNo;

        if (phoneCountryCode && mobile) {
          const countryCodeWithPlus = phoneCountryCode.startsWith("+")
            ? phoneCountryCode
            : `+${phoneCountryCode}`;
          if (mobile.startsWith(countryCodeWithPlus)) {
            mobile = mobile.substring(countryCodeWithPlus.length).trim();
          }
        }

        if (!phoneCountryCode && mobile) {
          const mobileData = parseMobile(mobile);
          if (mobileData) {
            phoneCountryCode = mobileData.countryCode;
            mobile = mobileData.mobile;
          }
        }

        payload = {
          email: formData.email || "",
          address: formData.address,
          name: formData.name,
          role: "service_provider",
          mobile: mobile || "",
          phone_country_code: phoneCountryCode || "",
        };
      }

      if (submit == "resendOTP") {
        url = API_ENDPOINTS.AUTH.RESEND_OTP;

        if (validData.email) {
          payload = {
            email: validData.email || "",
          };
        } else {
          payload = {
            mobile: validData.mobile || "",
            phone_country_code: validData.phone_country_code || "",
          };
        }
      }

      let response = await apiPost(url, payload);

      console.log({response},"this is the response");

      let responseData: any = response.data;
      const nestedData = responseData?.data;

      const isOtpVerified =
        nestedData?.is_otp_verified === true ||
        responseData?.is_otp_verified === true;
      const isPasswordSet =
        nestedData?.is_password_set === true ||
        responseData?.is_password_set === true;
      const hasRedirectFlags = isOtpVerified || isPasswordSet;

      if (hasRedirectFlags) {
        return {
          data: responseData,
          error: null,
        };
      }

      let errorObj: SignUpApiError | null = null;
      if (response?.error) {
        errorObj = {};
        if (step === "enter-contact") {
          errorObj = {
            submit: response.error.message || "Something went wrong.",
          };
        } else if (step === "verify-otp") {
          errorObj = { otp: response.error.message || "Something went wrong." };
        } else if (step === "create-password") {
          errorObj = {
            password: response.error.message || "Something went wrong.",
          };
        } else if (step === "add-details") {
          errorObj = {
            message: response.error.message || "Something went wrong.",
          };
        }

        if (
          responseData &&
          responseData.status === "error" &&
          !hasRedirectFlags
        ) {
          const errorMessage =
            responseData.message ||
            response.error.message ||
            "Something went wrong.";
          if (step === "enter-contact") {
            errorObj = { submit: errorMessage };
          } else if (step === "verify-otp") {
            errorObj = { otp: errorMessage };
          } else if (step === "create-password") {
            errorObj = { password: errorMessage };
          }
        }
        setErrors(errorObj);
      }

      return {
        data: responseData,
        error: errorObj,
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorObj: SignUpApiError = {
        general: error.message || "Something went wrong. Please try again.",
      };
      return {
        data: null,
        error: errorObj,
      };
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let { data, error } = await apiCallToSignUpUser("submit");
      
      if (data && data.status === "success" && data.data) {
        const responseData = data.data;
        
        const accessToken = responseData.access_token;
        const refreshToken = responseData.refresh_token;
        const accessTokenExpire = responseData.access_token_expire;
        const refreshTokenExpire = responseData.refresh_token_expire;
        const userData = responseData.user_data || {};
        
        if (typeof window !== "undefined") {
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7*24*60*60}`;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("userEmail", userData.email || "");
          localStorage.setItem("userInitial", (userData.name?.charAt(0) || "U").toUpperCase());
          localStorage.setItem("role", userData.role || "");
        }
        
        const user = {
          email: userData.email || "",
          initial: (userData.name?.charAt(0) || "U").toUpperCase(),
          role: userData.role || "",
        };
        
        dispatch(setTokens({
          accessToken,
          refreshToken,
          accessTokenExpire,
          refreshTokenExpire,
          user,
        }));
        
        toast.success("Account created successfully");
        
        // Redirect to professional onboarding instead of home
        router.push(ROUTES.PROFESSIONAL_ONBOARDING_SELECT_PLAN);
      } else if (data && data.status === "success") {
        toast.success("Account created successfully"); 
        router.push(ROUTES.PROFESSIONAL_ONBOARDING_SELECT_PLAN);
      } else {
        if (error) {
          const errorMsg = error.general || error.msg || error.message || "Something Went Wrong";
          toast.error(errorMsg);
          if (errorMsg.includes("Name is required")) {
            setErrors({ name: errorMsg });
          } else if (errorMsg.includes("Address")) {
            setErrors({ address: errorMsg });
          } else if (
            errorMsg.includes("country code") ||
            errorMsg.includes("Mobile")
          ) {
            setErrors({ mobileNo: errorMsg });
          } else if (errorMsg.includes("email")) {
            setErrors({ email: errorMsg });
          } else {
            toast.error(errorMsg);
          }
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<void> => {
    setLoading(true);
    try {
      const url = API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PIC;
      const validData = buildInputData(formData.emailOrMobile);
      
      const formDataPayload = new FormData();
      
      if (validData.email) {
        formDataPayload.append("email", validData.email || "");
      } else {
        formDataPayload.append("mobile", validData.mobile || "");
        formDataPayload.append("phone_country_code", validData.phone_country_code || "");
      }
      
      formDataPayload.append("file", file);

      const response: ProfilePhotoApi = await apiPostFormData(url, formDataPayload);
      if (response?.error?.message) {
        toast.error(response.error.message);
        return;
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "enter-contact":
        return (
          <Formik
            initialValues={{ emailOrMobile: formData.emailOrMobile || "" }}
            validationSchema={enterContactSchema}
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
                    fontWeight: 500,
                    fontSize: { xs: "0.9375rem", md: "1.0625rem" },
                    lineHeight: "1.25rem",
                    color: "#424242",
                    mb: "0.5rem",
                  }}
                >
                  Email / Mobile No
                </Typography>
                <Field name="emailOrMobile">
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
                      placeholder="Enter Email/ Mobile No"
                      onChange={(e) => {
                        handleChange(e);
                        setFormData((prev) => ({
                          ...prev,
                          emailOrMobile: e.target.value,
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
                    />
                  )}
                </Field>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: { xs: 1.25, md: 1.5 },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  Continue
                </Button>
              </Form>
            )}
          </Formik>
        );

      case "verify-otp":
        return (
          <Box>
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
                touched,
                setFieldValue,
                handleSubmit,
                submitCount,
              }) => {
                const handleOtpChangeFormik = (
                  index: number,
                  value: string
                ) => {
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue.length > 1) return;
                  const newOtp = [...values.otp];
                  newOtp[index] = numericValue;
                  setFieldValue("otp", newOtp);
                  setFormData((prev) => ({ ...prev, otp: newOtp }));

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
                  <Form>
                    <Typography
                      sx={{
                        fontSize: { xs: "16px", md: "18px" },
                        fontWeight: "500",
                        lineHeight: "100%",
                        color: "#555555",
                        margin: "0 auto",
                        mb: { xs: 1.5, md: 2 },
                        // maxWidth: "382px",
                      }}
                    >
                      Code
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "20px",
                        justifyContent: "space-between",
                        // maxWidth: "382px",
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
                            width: "80.5px",
                            "& .MuiOutlinedInput-root": {
                              height: "54px",
                              borderColor: formikErrors.otp && submitCount > 0 ? "#EF5350" : "",
                              width: "80.5px",
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
                    {otpCountdown > 0 ? (
                      <Typography
                        sx={{
                          display: "block",
                          textAlign: "center",
                          mb: { xs: 2, md: 3 },
                          fontSize: { xs: "1.125rem", md: "1.25rem" },
                          lineHeight: "1.5rem",
                          fontWeight: 600,
                          color: "#2C6587",
                        }}
                      >
                        Resend code in {otpCountdown} seconds
                      </Typography>
                    ) : (
                      <Box sx={{ textAlign: "center", mb: { xs: 2, md: "2.5rem" } }}>
                        <Typography
                          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.preventDefault();
                            setOtpCountdown(60);
                            apiCallToSignUpUser("resendOTP");
                          }}
                          sx={{
                            cursor: "pointer",
                            display: "inline-block",
                            fontSize: { xs: "1.125rem", md: "1.25rem" },
                            lineHeight: "1.5rem",
                            fontWeight: 600,
                            color: "#2C6587",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Resend code
                        </Typography>
                      </Box>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        bgcolor: "primary.dark",
                        color: "white",
                        py: { xs: 1.25, md: 1.5 },
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Verify OTP
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        );

      case "create-password":
        return (
          <Box>
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
              CoudPouss
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
                fontWeight: `700`,
                fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                color: `primary.normal`,
                mb: { xs: "0.5rem", md: "0.75rem" },
                lineHeight: { xs: "1.5rem", md: "1.75rem" },
                textAlign: "center",
              }}
            >
              Create a strong password
            </Typography>
            <Formik
              initialValues={{
                password: formData.password || "",
                confirmPassword: formData.confirmPassword || "",
              }}
              validationSchema={createPasswordSchema}
              onSubmit={async (values) => {
                setFormData((prev) => ({
                  ...prev,
                  password: values.password,
                  confirmPassword: values.confirmPassword,
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
              }) => {
                return (
                  <Form>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
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
                          placeholder="Enter Password"
                          onChange={(e) => {
                            handleChange(e);
                            const value = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              password: value,
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
                                      src="/icons/EyeOpen.svg" 
                                      alt="Hide password" 
                                      style={{ width: 24, height: 24 }}
                                    />
                                  ) : (
                                    <img 
                                      src="/icons/EyeClose.svg" 
                                      alt="Show password" 
                                      style={{ width: 24, height: 24 }}
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
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Confirm Password
                    </Typography>
                    <Field name="confirmPassword">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          sx={{
                            m: 0,
                            mb: "44px",
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
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter Password"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
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
                                  onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                  }
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <img 
                                      src="/icons/EyeOpen.svg" 
                                      alt="Hide password" 
                                      style={{ width: 24, height: 24 }}
                                    />
                                  ) : (
                                    <img 
                                      src="/icons/EyeClose.svg" 
                                      alt="Show password" 
                                      style={{ width: 24, height: 24 }}
                                    />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Field>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{
                        bgcolor: "primary.dark",
                        color: "white",
                        py: { xs: 1.25, md: 1.5 },
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                        "&:hover": {
                          bgcolor: "#25608A",
                        },
                      }}
                    >
                      Next
                    </Button>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        );

      case "add-details":
        return (
          <Formik
            initialValues={{
              name: formData.name || "",
              mobileNo: formData.mobileNo || "",
              email: formData.email || "",
              address: formData.address || "",
            }}
            validationSchema={addDetailsSchema}
            onSubmit={async (values) => {
              setFormData((prev) => ({
                ...prev,
                name: values.name,
                mobileNo: values.mobileNo,
                email: values.email,
                address: values.address,
              }));
              await handleSubmit();
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
              <Box component={Form} onSubmit={handleSubmit}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                  }}
                >
                  <Image
                    alt="appLogo"
                    width={140}
                    height={140}
                    src={"/icons/appLogo.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Typography
                    sx={{
                      fontWeight: `700`,
                      fontSize: { xs: `1.25rem`, sm: `1.375rem`, md: `1.5rem` },
                      marginLeft: { xs: "4px", md: "6px" },
                      color: `primary.normal`,
                      mb: "0.75rem",
                      lineHeight: { xs: "1.5rem", md: "1.75rem" },
                      textAlign: "center",
                    }}
                  >
                    CoudPouss
                  </Typography>
                </Box>

                <Typography
                  gutterBottom
                  sx={{
                    mb: 1,
                    mt: { xs: 1.5, md: 2 },
                    fontSize: { xs: "20px", sm: "22px", md: "24px" },
                    fontWeight: 700,
                    color: "#424242",
                    lineHeight: { xs: "24px", md: "28px" },
                  }}
                >
                  Add Personal Details
                </Typography>
                <Typography
                  sx={{
                    mb: { xs: 2, md: 3 },
                    color: "#6D6D6D",
                    lineHeight: "20px",
                    fontSize: { xs: "16px", md: "18px" },
                  }}
                >
                  Enter profile details
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 100, sm: 110, md: 120 },
                      height: { xs: 100, sm: 110, md: 120 },
                      borderRadius: "50%",
                      bgcolor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      overflow: "hidden",
                      borderColor: "primary.dark",
                    }}
                  >
                    {formData.profilePicturePreview ? (
                      <img
                        src={formData.profilePicturePreview}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography
                        variant="h4"
                        sx={{
                          color: "primary.dark",
                          fontSize: "1.125rem",
                          fontWeight: 400,
                        }}
                      >
                        {formData.name
                          ? formData.name
                              .split(" ")
                              .map((n) => n.charAt(0).toUpperCase())
                              .join("")
                          : "BC"}
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("profile-upload")?.click();
                    }}
                    sx={{
                      cursor: "pointer",
                      color: "primary.normal",
                      textDecoration: "none",
                      lineHeight: "140%",
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    upload profile picture
                  </Typography>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const previewURL = URL.createObjectURL(file);
                        setFormData((prev) => ({
                          ...prev,
                          profilePicture: file,
                          profilePicturePreview: previewURL,
                        }));
                        await uploadProfileImage(file);
                      }
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Name
                    </Typography>
                    <Field name="name">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter Name"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
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
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Mobile No.
                    </Typography>
                    <Field name="mobileNo">
                      {({ field, meta, form }: FieldProps) => {
                        const isError = !!(meta.touched && meta.error) || (meta.touched && phoneError);
                        return (
                          <>
                            <PhoneInputWrapper
                              value={form.values.mobileNo || ""}
                              onChange={(phone: string, country?: any) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  mobileNo: phone,
                                  phoneCountryCode: country?.dialCode
                                    ? `+${country.dialCode}`
                                    : "",
                                }));
                                form.setFieldValue("mobileNo", phone);
                                form.setFieldTouched("mobileNo", true);
                                if (phoneError && phone) {
                                  setPhoneError(false);
                                }
                              }}
                              setShowPhoneError={(isValid: boolean) => {
                                if (meta.touched) {
                                  setPhoneError(!isValid);
                                }
                              }}
                              error={isError}
                              placeholder="Enter Mobile No."
                              defaultCountry="us"
                              preferredCountries={["in", "us"]}
                            />
                            {isError && (
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: "16px",
                                  lineHeight: "140%",
                                  letterSpacing: "0%",
                                  color: "#EF5350",
                                  marginTop: "12px !important",
                                  marginLeft: "0 !important",
                                  marginRight: "0 !important",
                                  marginBottom: "0 !important",
                                }}
                              >
                                {meta.error || "Please enter a valid phone number"}
                              </Typography>
                            )}
                          </>
                        );
                      }}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Email
                    </Typography>
                    <Field name="email">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="email"
                          placeholder="Enter Email"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          sx={{
                            m: 0,
                            "& .MuiFormHelperText-root": {
                              fontWeight: 400,
                              fontSize: "16px",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: "#EF5350",
                              margin: 0,
                              marginTop: "12px",
                              mt: "12px",
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: { xs: "15px", md: "17px" },
                        lineHeight: "20px",
                        color: "#6D6D6D",
                        mb: "8px",
                      }}
                    >
                      Address
                    </Typography>
                    <Field name="address">
                      {({ field, meta }: FieldProps) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder="Enter Address"
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }));
                          }}
                          onBlur={handleBlur}
                          error={!!(meta.touched && meta.error)}
                          helperText={(meta.touched && meta.error) || ""}
                          margin="normal"
                          multiline
                          rows={3}
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
                      )}
                    </Field>
                  </Box>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: "primary.dark",
                    color: "white",
                    py: { xs: 1.25, md: 1.5 },
                    mt: { xs: "30px", md: "40px" },
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.125rem", md: "1.1875rem" },
                    "&:hover": {
                      bgcolor: "#25608A",
                    },
                  }}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Box>
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
        minHeight: "100vh",
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {/* Left side - Image Section */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: { md: "55%" },
          position: "relative",
          bgcolor: "grey.100",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: "100vh",
          }}
        >
          <Image
            src="/image/main.png"
            alt="CoudPouss Service"
            fill
            style={{
              objectFit: "cover",
              objectPosition: "top",
            }}
            sizes="66.666vw"
            priority
          />
        </Box>
      </Box>

      {/* Right side - Signup Form */}
      <Box
        sx={{
          width: { xs: "100%", md: "45%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: { xs: 2, sm: 3, md: 4 },
          overflowY: "auto",
          pt: step !== "enter-contact" ? { xs: 2, sm: 4, md: 10 } : { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 2, sm: 3, md: 4 },
              width: "100%",
            }}
          >
            {/* Logo Section */}
            {step != "add-details" && (
              <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    width: { xs: 100, sm: 120, md: 140 },
                    height: { xs: 100, sm: 120, md: 140 },
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    mb: { xs: "12px", md: "16px" },
                  }}
                >
                  <Image
                    alt="appLogo"
                    width={140}
                    height={140}
                    src={"/icons/appLogo.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Box>
            )}

            {/* Step Content */}
            {renderStepContent()}

            {/* Login Link */}
            {step == "enter-contact" && (
              <Box sx={{ textAlign: "center", mt: { xs: 2, md: 3 } }}>
                <Typography
                  sx={{
                    color: "secondary.naturalGray",
                    fontSize: { xs: "16px", md: "18px" },
                    lineHeight: "20px",
                  }}
                >
                  Already have an account?{" "}
                  <Link
                    href={ROUTES.LOGIN}
                    style={{
                      fontFamily: "Lato, sans-serif",
                      fontWeight: 600,
                      lineHeight: "1.5rem",
                      letterSpacing: "0em",
                      textAlign: "center",
                      color: "#2C6587",
                      textDecorationLine: "underline",
                      textDecorationThickness: "0.08em",
                      textUnderlineOffset: "0.03em",
                      textDecorationSkipInk: "auto",
                      display: "inline-block",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: { xs: "1.125rem", md: "1.25rem" },
                      }}
                    >
                      Log In
                    </Box>
                  </Link>
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

