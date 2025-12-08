"use client";

import React from "react";
import Image from "next/image";
import { Box, Container, Typography, IconButton } from "@mui/material";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "primary.main", color: "white" }}>
      <Box sx={{
        px: "7.5rem",
        py: "6.25rem"
      }}>
        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* Left Side - Logo and Brand */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
                overflow: "hidden",
              }}
            >
              <Image
                src="/icons/main-logo.png"
                alt="CoudPouss Logo"
                width={50}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </Box>
            <Typography sx={{ color: "white", fontWeight: 600, fontSize: "1.25rem", lineHeight: "2rem" }}>
              CoudPouss
            </Typography>
          </Box>

          {/* Right Side - Navigation Links */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 4 },
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Link
              href={ROUTES.HOME}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Typography sx={{
                fontWeight: 500,
                fontSize: "1.125rem"
              }} >
                Home
              </Typography>
            </Link>
            <Link
              href={ROUTES.HOME}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Typography sx={{
                fontWeight: 500,
                fontSize: "1.125rem"
              }} >
                Services
              </Typography>
            </Link>
            <Link
              href={ROUTES.HOME}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Typography sx={{
                fontWeight: 500,
                fontSize: "1.125rem"
              }} >
                Contact us
              </Typography>
            </Link>
            <Link
              href={ROUTES.HOME}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Typography sx={{
                fontWeight: 500,
                fontSize: "1.125rem"
              }} >
                Support
              </Typography>
            </Link>


            <Link
              href={ROUTES.HOME}
              style={{ color: "white", textDecoration: "none" }}
            >
              <Typography sx={{
                fontWeight: 500,
                fontSize: "1.125rem"
              }} >
                FAQ
              </Typography>
            </Link>

          </Box>
        </Box>

        {/* Divider Line */}
        <Box
          sx={{
            borderTop: "0.0625rem solid rgba(255,255,255,0.3)",
            mb: 4,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 0 },
          }}
        >
          {/* Left Side - Copyright */}
          <Typography sx={{
            color: "white",
            lineHeight: "2rem",
            fontSize: "1.125rem",

          }}>
            © 2025 Copyright by CoudPouss
          </Typography>

          {/* Right Side - Social Media Icons */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            {/* Facebook */}
            <IconButton
              sx={{
                width: 40,
                height: 40,
                border: "0.125rem solid",
                borderColor: "primary.normal",

              }}
            >
              <Image
                alt="facebook"
                width={11}
                height={18}
                src={"/icons/evaFacebookFill1.png"}
              />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                border: "0.125rem solid",
                borderColor: "primary.normal",

              }}
            >
              <Image
                alt="facebook"
                width={20}
                height={20}
                src={"/icons/Twitter.png"}
              />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                border: "0.125rem solid",
                borderColor: "primary.normal",

              }}
            >
              <Image
                alt="facebook"
                width={19}
                height={18}
                src={"/icons/linkdin.png"}
              />
            </IconButton>


          </Box>
        </Box>
      </Box>
    </Box>
  );
}

