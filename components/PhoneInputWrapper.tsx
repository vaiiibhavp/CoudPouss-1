"use client";

import React, { useEffect } from "react";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";
import "react-international-phone/style.css";
import { Box } from "@mui/material";

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string): boolean => {
  if (!phone) return false;
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

interface PhoneInputWrapperProps {
  value: string;
  onChange: (phone: string, country?: any) => void;
  setShowPhoneError?: (isValid: boolean) => void;
  error?: boolean;
  placeholder?: string;
  defaultCountry?: string;
  preferredCountries?: string[];
  className?: string;
  [key: string]: any;
}

export default function PhoneInputWrapper({
  value,
  onChange,
  setShowPhoneError,
  error = false,
  placeholder = "Enter Mobile No.",
  defaultCountry = "us",
  preferredCountries = ["in", "us"],
  className = "",
  ...props
}: PhoneInputWrapperProps) {
  const isValid = isPhoneValid(value);

  useEffect(() => {
    if (setShowPhoneError) {
      setShowPhoneError(isValid);
    }
  }, [isValid, setShowPhoneError]);

  return (
    <PhoneInput
      {...props}
      preferredCountries={preferredCountries}
      value={value}
      onChange={onChange}
      defaultCountry={defaultCountry}
      placeholder={placeholder}
      inputStyle={{
        flex: 1,
        padding: "16.5px 14px",
        fontSize: "1rem",
        fontFamily: "inherit",
        border: error ? "1px solid #EF5350" : "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "12px",
        outline: "none",
        backgroundColor: "transparent",
        color: "rgba(0, 0, 0, 0.87)",
        height: "56px",
        boxSizing: "border-box",
        margin: 0,

        marginLeft: "10px",
      }}
      countrySelectorStyleProps={{
        buttonClassName: "bg-transparent !border-none",
        style: {
          padding: "16.5px 14px",
          border: error ? "1px solid #EF5350" : "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "12px",
          outline: "none",
          backgroundColor: "transparent",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
        },

        dropdownStyleProps: {
          className:
            "bg-popover text-popover-foreground border rounded-md shadow-md max-h-60 overflow-y-auto",
          listItemClassName:
            "px-2 py-1.5 text-sm cursor-pointer hover:bg-accent flex gap-2 items-center",
          preferredListDividerClassName: "my-1 border-t",
        },
      }}
    />
  );
}
