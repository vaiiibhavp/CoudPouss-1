"use client";

import React, { useState, useRef, useEffect } from "react";
import { defaultCountries, parseCountry, FlagImage } from "react-international-phone";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
interface CountrySelectDropdownProps {
  value?: string; // Country code (e.g., "us", "in")
  onChange?: (countryCode: string, dialCode: string) => void;
  error?: boolean;
  defaultCountry?: string;
  preferredCountries?: string[];
  className?: string;
}

export default function CountrySelectDropdown({
  value,
  onChange,
  error = false,
  defaultCountry = "us",
  preferredCountries = ["in", "us"],
  className = "",
}: CountrySelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(value || defaultCountry);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse all countries and get their data
  const allCountries = defaultCountries.map((country) => parseCountry(country));
  
  // Get preferred countries first, then others
  const preferredCountriesData = allCountries.filter((country) => 
    preferredCountries.includes(country.iso2)
  );
  const otherCountries = allCountries.filter((country) => 
    !preferredCountries.includes(country.iso2)
  );
  const sortedCountries = [...preferredCountriesData, ...otherCountries];

  useEffect(() => {
    if (value) {
      setSelectedCountry(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    const countryData = allCountries.find((c) => c.iso2 === countryCode);
    const dialCode = countryData?.dialCode || "";
    onChange?.(countryCode, dialCode);
    setIsOpen(false);
  };

  const selectedCountryData = allCountries.find((c) => c.iso2 === selectedCountry);

  return (
    <Box
      ref={dropdownRef}
      sx={{
        position: "relative",
        width: "100%",
      }}
      className={className}
    >
      {/* Dropdown Button */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          padding: "16.5px 14px",
          border: error ? "1px solid #EF5350" : "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "12px",
          outline: "none",
          backgroundColor: "transparent",
          height: "56px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          boxSizing: "border-box",
          "&:hover": {
            borderColor: error ? "#EF5350" : "rgba(0, 0, 0, 0.87)",
          },
          "&:focus": {
            borderColor: error ? "#EF5350" : "rgba(0, 0, 0, 0.87)",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <FlagImage iso2={selectedCountry} size="20px" />
          {/* <Typography
            sx={{
              fontSize: "1rem",
              color: "rgba(0, 0, 0, 0.87)",
              fontWeight: 400,
              textTransform: "uppercase",
            }}
          >
            {selectedCountry.toUpperCase()}
          </Typography> */}
        </Box>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: "1rem",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease-in-out",
            color: "rgba(0, 0, 0, 0.54)",
          }}
        />
      </Box>

      {/* Dropdown Menu */}
      {isOpen && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0, 0, 0, 0.23)",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            maxHeight: "300px",
            overflowY: "auto",
            zIndex: 1000,
            minWidth: "300px",
          }}
        >
          {/* Preferred Countries Section */}
          {preferredCountries.length > 0 && (
            <>
              {preferredCountriesData.map((countryData) => {
                  return (
                    <Box
                      key={countryData.iso2}
                      onClick={() => handleCountrySelect(countryData.iso2)}
                      sx={{
                        padding: "8px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        backgroundColor:
                          selectedCountry === countryData.iso2 ? "rgba(0, 0, 0, 0.08)" : "transparent",
                        "&:hover": {
                          backgroundColor: selectedCountry === countryData.iso2 
                            ? "rgba(0, 0, 0, 0.08)" 
                            : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "60px" }}>
                        <FlagImage iso2={countryData.iso2} size="16px" />
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 400,
                            color: "rgba(0, 0, 0, 0.87)",
                            textTransform: "uppercase",
                          }}
                        >
                          {countryData.iso2}
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "rgba(0, 0, 0, 0.87)",
                          flex: 1,
                        }}
                      >
                        {countryData.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: 400,
                          color: "rgba(0, 0, 0, 0.87)",
                        }}
                      >
                        +{countryData.dialCode}
                      </Typography>
                    </Box>
                  );
                })}
              <Box
                sx={{
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.12)",
                  margin: "8px 0",
                }}
              />
            </>
          )}

          {/* All Countries List */}
          {otherCountries.map((countryData) => {
              return (
                <Box
                  key={countryData.iso2}
                  onClick={() => handleCountrySelect(countryData.iso2)}
                  sx={{
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCountry === countryData.iso2 ? "rgba(0, 0, 0, 0.08)" : "transparent",
                    "&:hover": {
                      backgroundColor: selectedCountry === countryData.iso2 
                        ? "rgba(0, 0, 0, 0.08)" 
                        : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "60px" }}>
                    <FlagImage iso2={countryData.iso2} size="16px" />
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        color: "rgba(0, 0, 0, 0.87)",
                        textTransform: "uppercase",
                      }}
                    >
                      {countryData.iso2}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      color: "rgba(0, 0, 0, 0.87)",
                      flex: 1,
                    }}
                  >
                    {countryData.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 400,
                      color: "rgba(0, 0, 0, 0.87)",
                    }}
                  >
                    +{countryData.dialCode}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
}

