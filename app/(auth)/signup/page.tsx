"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material";
import { Password, Visibility, VisibilityOff, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import Image from "next/image";
import { apiPost } from "@/lib/api";
import { buildInputData, emailRegex, isValidPassword, parseMobile } from "@/utils/validation";
import ResponseCache from "next/dist/server/response-cache";
import { API_ENDPOINTS } from "@/constants/api";

type SignupStep = "select-profile" | "enter-contact" | "verify-otp" | "create-password" | "add-details";
type UserType = "elderly_user" | "professional" | null;

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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("select-profile");
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    emailOrMobile: "",
    otp: ["", "", "", ""],
    password: "",
    confirmPassword: "",
    name: "",
    mobileNo: "",
    email: "",
    address: "",
    profilePicture: null as File | null,
    profilePicturePreview: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReEnterPassword, setShowReEnterPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if(name == "password"){
      const {valid, errors} = isValidPassword(value) 
      if(!valid){
        setPasswordErrors(errors)
      }else{
        setPasswordErrors([])
      }
    }

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

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleProfileSelect = (type: "elderly_user" | "professional") => {
    setUserType(type);
    if (type === "professional") {
      // Redirect to professional signup flow
      router.push(ROUTES.SIGNUP_PROFESSIONAL_ENTER_CONTACT);
    } else {
      // For elder, continue with current flow
      setStep("enter-contact");
    }
  };

  const handleContinue = async() => {
    setLoading(true);
    if (step === "enter-contact") {
      if (!formData.emailOrMobile) {
        setErrors({ emailOrMobile: "Please enter email or mobile number" });
        setLoading(false)
        return;
      }

      let {data,error} = await apiCallToSignUpUser("");
      if(data){
        setStep("verify-otp");
      }else{
        if(error){
          const errorMsg = error.submit || error.otp || error.password || error.general || error.msg || "Something Went Wrong";
          if(errorMsg.includes("OTP already sent")){
            setStep("verify-otp");
          }else if(errorMsg.includes("OTP already verified")){
            setStep("create-password");
          }else if(errorMsg.includes("Password already set")){
            setStep("add-details")
          }else{
            setErrors({ emailOrMobile: errorMsg });
          }
        }
      }

    } else if (step === "verify-otp") {
      if (formData.otp.some((digit) => !digit)) {
        setErrors({ otp: "Please enter valid code" });
        setLoading(false)
        return;
      }

      let {data,error} = await apiCallToSignUpUser("");
      if(data){
        setStep("create-password");
      }else{
         if(error){
          const errorMsg = error.submit || error.otp || error.password || error.general || error.msg || "Something Went Wrong";
          if(errorMsg.includes("OTP already sent")){
            setStep("verify-otp");
          }else if(errorMsg.includes("OTP already verified")){
            setStep("create-password");
          }else if(errorMsg.includes("Password already set")){
            setStep("add-details")
          }else{
            setErrors({ otp: errorMsg });
          }
        }
      }
    } else if (step === "create-password") {
      if(formData.password !== formData.confirmPassword){
        setErrors({ confirmPassword : "Please make sure your passwords match." });
        setLoading(false)
        return
      }
      
      let {data,error} = await apiCallToSignUpUser("");
      if(data){
        setStep("add-details");
      }else{
        if(error){
          const errorMsg = error.submit || error.otp || error.password || error.general || error.msg || "Something Went Wrong";
         if(errorMsg.includes("OTP already sent")){
            setStep("verify-otp");
          }else if(errorMsg.includes("OTP already verified")){
            setStep("create-password");
          }else if(errorMsg.includes("Password already set")){
            setStep("add-details")
          }else{
            setErrors({ confirmPassword: errorMsg });
          }
        }
      }
      setLoading(false)
    }
  };

  const apiCallToSignUpUser = async(submit:string) : Promise<SignUpApiResponse> =>{
    try {
      let payload = {}
      let url = ""
      let validData = buildInputData(formData.emailOrMobile)
      let error = {}

      if (step === "enter-contact") {
        url = API_ENDPOINTS.AUTH.START

        if(validData.email){
          payload = {
            "email": validData.email || "",
            "role": userType 
          } 
        }else{
          payload = {
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "role": userType
          }  
        }

      }else if (step === "verify-otp") {
        url = API_ENDPOINTS.AUTH.VERIFY_OTP

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
      } else if (step === "create-password") {
        url = API_ENDPOINTS.AUTH.CREATE_PASSWORD

        if(validData.email){
          payload = {
            "email": validData.email || "",
            "password": formData.password,
            "confirm_password" : formData.confirmPassword
          } 
        }else{
          payload = {
            "mobile": validData.mobile || "",
            "phone_country_code": validData.phone_country_code || "",
            "password": formData.password,
            "confirm_password" : formData.confirmPassword
          }  
        }
      }

      if(submit == "submit"){
        const mobileData = parseMobile(formData.mobileNo)
        url = API_ENDPOINTS.AUTH.CREATE_ACCOUNT
        
        payload = {
          "email": formData.email || "",
          "address": formData.address,
          "name" : formData.name,
          "role" : userType,
          "mobile": (mobileData && mobileData.mobile) || "",
          "phone_country_code": (mobileData && mobileData.countryCode) || "",
        } 
      }

      if(submit == "resendOTP"){
        url = API_ENDPOINTS.AUTH.RESEND_OTP;

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
      }

      let response  = await apiPost(url,payload)
      if (response?.error) {
        let error = {}
         if (step === "enter-contact") {
          error =  { submit: response.error.message || "Something went wrong." }
        }else if (step === "verify-otp") {
          error =  { otp: response.error.message || "Something went wrong." }
        }else if (step === "create-password") {
          error =  { password: response.error.message || "Something went wrong." }
        }
        setErrors(error)
      }

      return {
        data: response.data,
        error
      };
    } catch (error:any) {
      console.error("Signup error:", error);
      const errorObj: SignUpApiError = { general: error.message || "Something went wrong. Please try again." };
      return {
        data: null,
        error: errorObj,
      };
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: validate the form Data
      let {data,error} = await apiCallToSignUpUser("submit");
      if(data){
        router.push(ROUTES.LOGIN);
        setStep("add-details");
      }else{
        if(error){
          const errorMsg =  error.general || error.msg || "Something Went Wrong";
          if(errorMsg.includes("Name is required")){
            setErrors({ name: errorMsg });
          }else if(errorMsg.includes("Address")){
            setErrors({ address: errorMsg });
          }else if(errorMsg.includes("country code") || errorMsg.includes("Mobile")){
            setErrors({ mobileNo: errorMsg });
          }else if(errorMsg.includes("email")){
            setErrors({ email: errorMsg });
          }
          else{

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

  const uploadProfileImage = async(file:File) : Promise<void> =>{
    setLoading(true)
     try {
      let payload = {}
      let url = API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PIC
      let validData = buildInputData(formData.emailOrMobile)
      let error = {}

      if(validData.email){
        payload = {
          "email": validData.email || "",
          "file": formData.profilePicture 
        } 
      }else{
        payload = {
          "mobile": validData.mobile || "",
          "phone_country_code": validData.phone_country_code || "",
          "file": formData.profilePicture 
        }  
      }

      const response : ProfilePhotoApi  = await apiPost(url,payload)
      if (response?.error?.message) {
        setErrors({
          profilePicture: response.error.message,
        });
        return;
      }
    } catch (error:any) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "select-profile":
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "center"
              }}
            >
              Welcome To CoudPouss!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "center",
                lineHeight: "140%",
                mb: "2.5rem",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => handleProfileSelect("elderly_user")}
              sx={{
                bgcolor: "#214C65",
                color: "white",
                py: 1.5,
                mb: 2,
                textTransform: "none",
                fontWeight:700,
                fontSize: "1.1875rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Sign up as Elder
            </Button>
            <Box sx={{ textAlign: "center", my: 2,display:"flex",alignItems:"center" }}>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.3)", border: "1px solid #F2F3F3" }} />
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  color: "#818285",
                  mx:4
                }}
              >
                OR
              </Typography>
              <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.3)", border: "1px solid #F2F3F3" }} />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => handleProfileSelect("professional")}
              sx={{
                borderColor: "primary.dark",
                color: "primary.dark",
                py: 1.5,
                fontWeight:700,
                fontSize: "1.1875rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#25608A",
                  bgcolor: "rgba(47, 107, 142, 0.04)",
                },
              }}
            >
              Sign up as Professional
            </Button>
          </Box>
        );

      case "enter-contact":
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "center"
              }}
            >
              Welcome To CoudPouss!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "center",
                lineHeight: "140%",
                mb: "2.5rem",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Typography sx={{
              fontWeight: 500,
              fontSize: "1.0625rem",
              lineHeight: "1.25rem",
              color: "#424242",
              mb: "0.5rem"
            }}>
              Email / Mobile No
            </Typography>
            <TextField
              sx={{
                m: 0,
                mb: 3,
              }}
              fullWidth
              name="emailOrMobile"
              placeholder="Enter Email/ Mobile No"
              value={formData.emailOrMobile}
              onChange={handleChange}
              error={!!errors.emailOrMobile}
              margin="normal"
            />
             {errors.emailOrMobile && (
              <Typography color="error" variant="body2" sx={{ mb: 2, fontSize:"1.125rem", textAlign: "center",fontWeight:400 }}>
                {errors.emailOrMobile}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleContinue}
              sx={{
                bgcolor: "primary.dark",
                color: "white",
                py: 1.5,
                textTransform: "none",
                fontWeight:700,
                fontSize: "1.1875rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Continue
            </Button>
          </Box>
        );

      case "verify-otp":
        return (
          <Box>
            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "center"
              }}
            >
              Welcome To CoudPouss!
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "center",
                lineHeight: "140%",
                mb: "2.5rem",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>


            <Typography sx={{
              fontWeight: 400,
              fontSize: "16px",
              textAlign: "center",
              lineHeight: "140%",
              mb: "1.25rem",
              color: "secondary.neutralWhiteDark",
            }}>
              To continue Please enter the 4 Digit OTP sent to your Email or Phone Number.
            </Typography>
            <Typography

              sx={{
                fontSize: "18px",
                fontWeight: "500",
                lineHeight: "100%",
                color: "#555555",
                mb: 2
              }}
            >
              Code
            </Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between", mb: 2 }}>
              {formData.otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  error={!!errors.otp}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", width: "5rem",borderColor:errors.otp ? "red" : "" },
                  }}
                  sx={{
                    borderColor:errors.otp ? "red" : "",
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      height: 60,
                      borderColor: errors.otp ? "red" : "",
                      width: "5.03125rem"
                    },
                  }}
                />
              ))}
            </Box>
            {errors.otp && (
              <Typography color="error" variant="body2" sx={{ mb: 2, fontSize:"1.125rem", textAlign: "center",fontWeight:400 }}>
                {errors.otp}
              </Typography>
            )}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                apiCallToSignUpUser("resendOTP");   
              }}
              sx={{
                display: "block",
                textAlign: "center",
                mb: 3,
                fontSize: "1.25rem",
                lineHeight: "1.5rem",
                fontWeight: 600,
                color: "primary.normal",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
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
                bgcolor: "primary.dark",
                color: "white",
                py: 1.5,
                textTransform: "none",
                fontWeight:700,
                fontSize: "1.1875rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Verify OTP
            </Button>
          </Box>
        );

      case "create-password":
        return (
          <Box>
            <Typography

              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "center"


              }}
            >
              CoudPouss
            </Typography>
            <Typography

              sx={{
                fontWeight: 400,
                fontSize: "1rem",
                textAlign: "center",
                lineHeight: "140%",
                mb: "2.5rem",
                color: "secondary.neutralWhiteDark",
              }}
            >
              Empowering seniors with easy access to trusted help, care, and companionship whenever needed.
            </Typography>

            <Typography
              sx={{
                fontWeight: `700`,
                fontSize: `1.5rem`,
                color: `primary.normal`,
                mb: "0.75rem",
                lineHeight: "1.75rem",
                textAlign: "center"


              }}>
              Create a strong password
            </Typography>
            <Typography

              sx={{
                fontWeight: 500,
                fontSize: "17px",
                lineHeight: "20px",
                color: "#6D6D6D",
                mb: "8px"
              }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              sx={{
                m: 0,
                mb: 2
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ?   <VisibilityOutlined /> : <VisibilityOffOutlined />}
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
            <Typography
              sx={{
                mt:"8px",
                fontWeight: 500,
                fontSize: "17px",
                lineHeight: "20px",
                color: "#6D6D6D",
                mb: "8px"
              }}
            >
              Confirm Password
            </Typography>
            <TextField
              sx={{
                m: 0,
                mb: "14px"
              }}
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              error={!!errors.confirmPassword}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ?  <VisibilityOutlined /> :  <VisibilityOffOutlined />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmPassword && (
              <Typography color="error" variant="body2" sx={{ mb: 6, fontSize:"1rem", textAlign: "center",fontWeight:400 }}>
                {errors.confirmPassword}
              </Typography>
            )}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              onClick={handleContinue}
              sx={{
                bgcolor: "primary.dark",
                color: "white",
                py: 1.5,
                textTransform: "none",
                fontWeight:700,
                fontSize: "1.1875rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              Next
            </Button>
          </Box>
        );

      case "add-details":
        return (
          <Box component="form" onSubmit={handleSubmit}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                // bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
              }}
            >
              <Image
                alt='appLogo'
                width={140}
                height={140}
                src={"/icons/appLogo.png"}
              />
              <Typography
                sx={{
                  fontWeight: `700`,
                  fontSize: `1.5rem`,
                  marginLeft:"6px",
                  color: `primary.normal`,
                  mb: "0.75rem",
                  lineHeight: "1.75rem",
                  textAlign: "center"
                }}
              >
                CoudPouss
              </Typography>
            </Box>
            
            <Typography gutterBottom sx={{ mb: 1, mt:2, fontSize: "24px", fontWeight: 700, color: "#424242", lineHeight: "28px" }}>
              Add Personal Details
            </Typography>
            <Typography sx={{ mb: 3, color: "#6D6D6D", lineHeight: "20px", fontSize: "18px" }}>
              Enter profile details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
                  overflow: "hidden",
                  // border: "3px solid",
                  borderColor: "primary.dark",
                }}
              >
                {
                  formData.profilePicturePreview ? (
                    <img
                      src={formData.profilePicturePreview}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography variant="h4" sx={{ color: "primary.dark",fontSize:"1.125rem", fontWeight:400 }}>
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
                  cursor:"pointer",
                  color: "primary.normal",
                  textDecoration: "none",
                  lineHeight: "140%",
                  fontSize: "1rem",
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
                onChange={async(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Create preview URL so you can display the image visually
                    const previewURL = URL.createObjectURL(file);

                    // Update UI instantly
                    setFormData((prev) => ({
                      ...prev,
                      profilePicture: file,
                      profilePicturePreview: previewURL,
                    }));

                    // Call API to upload image
                    await uploadProfileImage(file);
                  }
                }}
              />
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px"
                  }}
                >
                  Name
                </Typography>
                <TextField
                  fullWidth
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  sx={{
                    m: 0
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px"
                  }}
                >
                  Mobile No.
                </Typography>
                <TextField
                  fullWidth
                  name="mobileNo"
                  placeholder="Enter Mobile No."
                  value={formData.mobileNo}
                  onChange={handleChange}
                  error={!!errors.mobileNo}
                  helperText={errors.mobileNo}
                  margin="normal" sx={{
                    m: 0
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px"
                  }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  sx={{
                    m: 0
                  }}
                />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: "17px",
                    lineHeight: "20px",
                    color: "#6D6D6D",
                    mb: "8px"
                  }}
                >
                  Address
                </Typography>
                <TextField
                  fullWidth
                  name="address"
                  placeholder="Enter Address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  margin="normal"
                  multiline
                  rows={3}
                  sx={{
                    m: 0
                  }}
                />
              </Box>
            </Box>
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
                bgcolor: "primary.dark",
                color: "white",
                py: 1.5,
                mt:"40px",
                textTransform: "none",
                fontWeight:700,
                fontSize: "1.1875rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Box>
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
      {/* Header Bar */}
      {/* {step !== "select-profile" && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bgcolor: "#374151",
            color: "white",
            py: 1.5,
            px: 3,
            zIndex: 1000,
            display: { xs: "none", md: "block" },
          }}
        >
          <Typography variant="body1" fontWeight="500">
            {step === "enter-contact" && "01_Select Profile"}
            {step === "verify-otp" && "02_Enter Contact"}
            {step === "create-password" && "03_Verify OTP"}
            {step === "add-details" && "04_Create Password"}
          </Typography>
        </Box>
      )} */}

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
              objectFit: 'cover',
              objectPosition: 'top',
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
          padding: 4,
          overflowY: "auto",
          pt: step !== "select-profile" ? { xs: 4, md: 10 } : 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              width: "100%",
            }}
          >
            {/* Logo Section */}
            {
              step != "add-details" && 
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
                      margin: '0 auto 16px',
                    }}
                  >
                    <Image
                      alt='appLogo'
                      width={140}
                      height={140}
                      src={"/icons/appLogo.png"}
                    />
                  </Box>

                </Box>
            }

            {/* Step Content */}
            {renderStepContent()}

            {/* Login Link */}
            {
              (step == "select-profile" || step == "enter-contact") && 
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Typography sx={{
                    color: 'secondary.naturalGray',
                    fontSize: "18px",
                    lineHeight: "20px"
                  }}>
                    Already have an account?{" "}
                    <Link
                      href={ROUTES.LOGIN}
                      sx={{
                        fontFamily: "Lato, sans-serif",
                        fontWeight: 600,
                        fontSize: "1.25rem", // 20px -> 20 / 16 = 1.25rem
                        lineHeight: "1.5rem", // 24px -> 24 / 16 = 1.5rem
                        letterSpacing: "0em",
                        textAlign: "center",
                        color: "#2C6587", // or primary.normal if defined in theme
                        textDecorationLine: "underline",
                        textDecorationThickness: "0.08em", // 8% of font-size
                        textUnderlineOffset: "0.03em", // 3% of font-size
                        textDecorationSkipInk: "auto", // skip-ink effect
                        display: "inline-block", // ensures text-align works if needed
                      }}
                    >
                      Log In
                    </Link>
                  </Typography>
                </Box>
            }
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
