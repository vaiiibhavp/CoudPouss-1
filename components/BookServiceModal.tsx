"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  LinearProgress,
  Button,
  Radio,
  RadioProps,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Card,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { apiGet, apiPost, apiPostFormData } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";

interface BookServiceModalProps {
  open: boolean;
  onClose: () => void;
}


interface CreateRequestPayload {
  is_professional: boolean;
  category_id: string;
  sub_category_id: number | null;
  description: string;
  description_files: [];
  validation_amount:  number;
  platform_fees: number;
  tax: number;
  chosen_datetime: string;
  task_status: string;
}

// Custom bullet radio icons to match the provided design
const UncheckedBullet = () => (
  <Box
    sx={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      border: "2px solid #C5D3DC",
      bgcolor: "#FFFFFF",
      boxShadow: "0px 4px 10px rgba(44, 101, 135, 0.12)",
    }}
  />
);

const CheckedBullet = () => (
  <Box
    sx={{
      width: 18,
      height: 18,
      borderRadius: "50%",
      bgcolor: "#2C6587",
      boxShadow: "0px 4px 12px rgba(44, 101, 135, 0.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#FFFFFF",
      }}
    />
  </Box>
);

const BulletRadio = (props: RadioProps) => {
  return (
    <Radio
      {...props}
      disableRipple
      icon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #C5D3DC",
            bgcolor: "#FFFFFF",
            boxShadow: "0px 4px 10px rgba(44, 101, 135, 0.12)",
          }}
        />
      }
      checkedIcon={
        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#2C6587",
            boxShadow: "0px 4px 12px rgba(44, 101, 135, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#FFFFFF",
            }}
          />
        </Box>
      }
      sx={{
        p: 0.5,
        "&:hover": { backgroundColor: "transparent" },
      }}
    />
  );
};

// Helper function to clone SVG and modify fill colors
const cloneElementWithColor = (
  element: React.ReactElement,
  isSelected: boolean,
): React.ReactElement => {
  const primaryNormal = "#2C6587";

  if (!isSelected) {
    // Return original element when not selected
    return element;
  }

  // When selected, replace all fill colors with primary.normal
  const cloneWithFill = (child: any, index?: number): any => {
    if (!child || typeof child !== "object") return child;

    if (Array.isArray(child)) {
      return child.map((item, idx) => cloneWithFill(item, idx));
    }

    // Clone element and modify fill if it exists
    const newProps: any = { ...child.props };

    // Preserve or add key
    if (index !== undefined && !newProps.key) {
      newProps.key = `cloned-${index}`;
    } else if (child.key) {
      newProps.key = child.key;
    }

    // Replace fill color if it's not 'none' or 'white'
    if (
      newProps.fill &&
      newProps.fill !== "none" &&
      newProps.fill !== "white" &&
      newProps.fill !== "#FFFFFF" &&
      newProps.fill !== "#ffffff"
    ) {
      newProps.fill = primaryNormal;
    }

    // Recursively process children
    if (child.props && child.props.children) {
      if (Array.isArray(child.props.children)) {
        newProps.children = child.props.children.map((c: any, idx: number) =>
          React.isValidElement(c) ? cloneWithFill(c, idx) : c,
        );
      } else if (React.isValidElement(child.props.children)) {
        newProps.children = cloneWithFill(child.props.children);
      } else if (child.props.children) {
        newProps.children = React.Children.map(
          child.props.children,
          (c: any, idx: number) =>
            React.isValidElement(c) ? cloneWithFill(c, idx) : c,
        );
      }
    }

    return React.cloneElement(child, newProps);
  };

  return cloneWithFill(element) as React.ReactElement;
};

// SVG Icon Components
const CategoryIcon = ({
  category,
  isSelected,
}: {
  category: string;
  isSelected: boolean;
}) => {
  const icons: { [key: string]: React.ReactElement } = {
    diy: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3544)">
          <path
            d="M15.333 18.4911C15.0584 18.2165 14.6132 18.2165 14.3386 18.4911C14.064 18.7657 14.064 19.2109 14.3386 19.4855L14.8358 19.9827L12.0184 22.8C11.7439 23.0746 11.7439 23.5198 12.0184 23.7944C12.293 24.069 12.7382 24.069 13.0128 23.7944L15.8302 20.977L16.3274 21.4742C16.602 21.7488 17.0471 21.7488 17.3217 21.4742C17.5963 21.1996 17.5963 20.7545 17.3217 20.4799L15.333 18.4911Z"
            fill="#2C6587"
          />
          <path
            d="M23.7942 20.4798L21.8054 18.4911C21.5308 18.2165 21.0856 18.2165 20.811 18.4911C20.5364 18.7657 20.5364 19.2109 20.811 19.4855L21.3082 19.9826L18.4909 22.8C18.2163 23.0746 18.2163 23.5198 18.4909 23.7944C18.7655 24.0689 19.2106 24.0689 19.4852 23.7944L22.3026 20.977L22.7998 21.4742C23.0744 21.7488 23.5196 21.7488 23.7942 21.4742C24.0687 21.1996 24.0687 20.7544 23.7942 20.4798Z"
            fill="#2C6587"
          />
          <path
            d="M11.8541 6.86529L14.8373 9.84837C15.1119 10.123 15.557 10.123 15.8316 9.84837L19.8091 5.87088C20.0837 5.59629 20.0837 5.15112 19.8091 4.87652L16.826 1.89345C16.5514 1.61885 16.1062 1.61885 15.8316 1.89345L11.8541 5.87093C11.5795 6.14548 11.5795 6.59069 11.8541 6.86529Z"
            fill="#2C6587"
          />
          <path
            d="M11.1912 4.54463L14.4638 1.27209C12.7601 -0.0190309 10.4921 -0.364734 8.45645 0.407438C7.9794 0.588375 7.84782 1.20127 8.20862 1.56202L11.1912 4.54463Z"
            fill="#2C6587"
          />
          <path
            d="M21.3006 13.3282L23.2893 11.3395C24.1118 10.5171 24.1118 9.17882 23.2893 8.35635L22.9579 8.0249C22.6833 7.7503 22.2381 7.7503 21.9635 8.0249L21.6321 8.35635L20.472 7.19629L17.1575 10.5109L18.3175 11.6709L17.9861 12.0023C17.7115 12.2769 17.7115 12.7221 17.9861 12.9967L18.3175 13.3281C19.14 14.1507 20.4781 14.1506 21.3006 13.3282Z"
            fill="#2C6587"
          />
          <path
            d="M10.1948 9.18555L11.189 8.19133L13.5089 10.5112L12.5147 11.5054L10.1948 9.18555Z"
            fill="#2C6587"
          />
          <path
            d="M0.480516 18.9017C-0.160172 19.5424 -0.160172 20.5812 0.480516 21.2219C1.1212 21.8626 2.16 21.8626 2.80069 21.2219L11.5228 12.4999L9.20259 10.1797L0.480516 18.9017Z"
            fill="#2C6587"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3544">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    gardening: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3561)">
          <path
            d="M9.18872 0C8.80041 0 8.4856 0.314812 8.4856 0.703125V9.65625C8.4856 9.78548 8.38046 9.89062 8.25122 9.89062H6.37622V0.703125C6.37622 0.314812 6.06141 0 5.6731 0C5.28478 0 4.96997 0.314812 4.96997 0.703125V9.89062H3.09497C2.96574 9.89062 2.8606 9.78548 2.8606 9.65625V0.703125C2.8606 0.314812 2.54578 0 2.15747 0C1.76916 0 1.45435 0.314812 1.45435 0.703125V9.65625C1.45435 10.5609 2.19033 11.2969 3.09497 11.2969H4.96997V12.75H4.26685C3.87853 12.75 3.56372 13.0648 3.56372 13.4531V20.271C3.54853 20.3368 2.76089 21.5149 3.588 22.8432C4.54744 24.3841 6.79317 24.3872 7.75425 22.8425C8.56575 21.5381 7.7887 20.3179 7.77778 20.2708V13.4531C7.77778 13.0648 7.46297 12.75 7.07466 12.75H6.37627V11.2969H8.25127C9.15591 11.2969 9.89189 10.5609 9.89189 9.65625V0.703125C9.89185 0.314812 9.57703 0 9.18872 0Z"
            fill="#C1C1C1"
          />
          <path
            d="M18.0186 0.122819C17.7798 -0.0405403 17.4654 -0.0409622 17.2262 0.121694C14.3948 2.0468 12.7043 5.24026 12.7043 8.66424V12.4746C12.7043 13.3793 13.4403 14.1152 14.345 14.1152H16.9231V9.18901C16.9231 8.80069 17.2379 8.48588 17.6262 8.48588C18.0145 8.48588 18.3293 8.80069 18.3293 9.18901V14.1153H20.9051C21.8097 14.1153 22.5457 13.3793 22.5457 12.4747V8.66902C22.5457 5.24185 20.8528 2.04671 18.0186 0.122819Z"
            fill="#C1C1C1"
          />
          <path
            d="M16.9232 15.5625H16.2177C15.8293 15.5625 15.5145 15.8773 15.5145 16.2656V20.2744C15.4993 20.3408 14.7136 21.5179 15.5405 22.8447C16.5017 24.3868 18.7461 24.3841 19.7048 22.8426C20.5144 21.5408 19.739 20.3184 19.7286 20.2736V16.2656C19.7286 15.8773 19.4138 15.5625 19.0255 15.5625H18.3294V14.1152H16.9232V15.5625Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3561">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    moving: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3574)">
          <path
            d="M10.5938 9.89062H13.4062C13.7943 9.89062 14.1094 9.5755 14.1094 9.1875C14.1094 8.7995 13.7943 8.48438 13.4062 8.48438H10.5938C10.2057 8.48438 9.89062 8.7995 9.89062 9.1875C9.89062 9.5755 10.2057 9.89062 10.5938 9.89062Z"
            fill="#C1C1C1"
          />
          <path
            d="M23.6732 4.26562L21.0695 0.31311C20.9389 0.117371 20.7194 0 20.4844 0H3.56256C3.32764 0 3.10809 0.117371 2.97754 0.31311L0.326904 4.26562H23.6732Z"
            fill="#C1C1C1"
          />
          <path
            d="M0.703125 24H23.2969C23.6854 24 24 23.6854 24 23.2969V5.67188H0V23.2969C0 23.6854 0.314575 24 0.703125 24ZM10.5938 7.07812H13.4062C14.5693 7.07812 15.5156 8.02441 15.5156 9.1875C15.5156 10.3506 14.5693 11.2969 13.4062 11.2969H10.5938C9.43066 11.2969 8.48438 10.3506 8.48438 9.1875C8.48438 8.02441 9.43066 7.07812 10.5938 7.07812ZM8.27838 16.7628C8.00372 17.0374 7.55878 17.0374 7.28412 16.7628C7.00946 16.4881 7.00946 16.0432 7.28412 15.7685L8.69037 14.3622C8.96503 14.0876 9.40997 14.0876 9.68463 14.3622L11.0909 15.7685C11.3655 16.0432 11.3655 16.4881 11.0909 16.7628C10.8162 17.0374 10.3713 17.0374 10.0966 16.7628L9.89062 16.5568V19.7812H14.1094V16.5568L13.9034 16.7628C13.6287 17.0374 13.1838 17.0374 12.9091 16.7628C12.6345 16.4881 12.6345 16.0432 12.9091 15.7685L14.3154 14.3622C14.59 14.0876 15.035 14.0876 15.3096 14.3622L16.7159 15.7685C16.9905 16.0432 16.9905 16.4881 16.7159 16.7628C16.4412 17.0374 15.9963 17.0374 15.7216 16.7628L15.5156 16.5568V19.7812H16.2188C16.6073 19.7812 16.9219 20.0958 16.9219 20.4844C16.9219 20.8729 16.6073 21.1875 16.2188 21.1875H7.78125C7.3927 21.1875 7.07812 20.8729 7.07812 20.4844C7.07812 20.0958 7.3927 19.7812 7.78125 19.7812H8.48438V16.5568L8.27838 16.7628Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3574">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    housekeeping: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3586)">
          <path
            d="M17.6484 2.91211C18.0368 2.91211 18.3516 2.59731 18.3516 2.20898C18.3516 1.82066 18.0368 1.50586 17.6484 1.50586C17.2601 1.50586 16.9453 1.82066 16.9453 2.20898C16.9453 2.59731 17.2601 2.91211 17.6484 2.91211Z"
            fill="#C1C1C1"
          />
          <path
            d="M20.6611 4.41895C21.0495 4.41895 21.3643 4.10415 21.3643 3.71582C21.3643 3.3275 21.0495 3.0127 20.6611 3.0127C20.2728 3.0127 19.958 3.3275 19.958 3.71582C19.958 4.10415 20.2728 4.41895 20.6611 4.41895Z"
            fill="#C1C1C1"
          />
          <path
            d="M20.6611 1.40625C21.0495 1.40625 21.3643 1.09145 21.3643 0.703125C21.3643 0.3148 21.0495 0 20.6611 0C20.2728 0 19.958 0.3148 19.958 0.703125C19.958 1.09145 20.2728 1.40625 20.6611 1.40625Z"
            fill="#C1C1C1"
          />
          <path
            d="M12.4873 12.623C11.4122 11.5426 10.8204 10.109 10.8204 8.58455V7.21191C10.5975 7.29048 10.3606 7.33159 10.1173 7.33159H6.40164V7.94818V7.94851C5.2345 9.16665 4.31538 10.5741 3.66817 12.1366C2.98328 13.7901 2.63599 15.5359 2.63599 17.3257V21.7909C2.63599 22.9979 3.61099 24.0003 4.84535 24.0003H12.3766C13.5863 24.0003 14.586 23.0227 14.586 21.7909V17.6755C14.586 15.7709 13.8442 13.9801 12.4974 12.6329C12.4941 12.6296 12.4907 12.6263 12.4873 12.623ZM8.611 20.9879C7.18511 20.9879 6.02505 19.8278 6.02505 18.4019C6.02505 17.6822 6.35345 16.6066 7.02897 15.1137C7.50546 14.0607 7.975 13.204 7.99474 13.168C8.11825 12.9432 8.35445 12.8035 8.61096 12.8035C8.8675 12.8035 9.10366 12.9432 9.22717 13.168C9.24691 13.204 9.71645 14.0607 10.1929 15.1137C10.8685 16.6066 11.1969 17.6822 11.1969 18.4019C11.197 19.8279 10.0369 20.9879 8.611 20.9879Z"
            fill="#C1C1C1"
          />
          <path
            d="M7.4314 18.4018C7.4314 19.0522 7.96061 19.5815 8.6111 19.5815C9.26158 19.5815 9.7908 19.0522 9.7908 18.4018C9.7908 17.7156 9.20008 16.2689 8.6111 15.0469C8.02211 16.2689 7.4314 17.7156 7.4314 18.4018Z"
            fill="#C1C1C1"
          />
          <path
            d="M14.6361 0H13.733V3.71564C13.733 3.95892 13.6918 4.19587 13.6133 4.41877H14.6361C15.0244 4.41877 15.3392 4.10395 15.3392 3.71564V0.703125C15.3392 0.314812 15.0245 0 14.6361 0Z"
            fill="#C1C1C1"
          />
          <path
            d="M12.8591 5.46289L11.8647 6.45725L14.1388 8.7313C14.4133 9.00584 14.8586 9.00594 15.1332 8.7313C15.4078 8.4567 15.4078 8.01153 15.1332 7.73694L12.8591 5.46289Z"
            fill="#C1C1C1"
          />
          <path
            d="M4.09229 5.925H10.1173C10.3038 5.925 10.4826 5.85094 10.6145 5.71908L12.1208 4.2128C12.2526 4.08094 12.3267 3.90211 12.3267 3.71564V0H8.61029C5.72194 0 3.38916 2.33756 3.38916 5.22113V5.22188C3.38916 5.61019 3.70393 5.925 4.09229 5.925Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3586">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    childcare: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3604)">
          <path
            d="M0.703335 16.4691C1.86257 16.4691 2.74038 16.1472 3.39041 15.674L3.99374 12.6573C4.212 11.567 4.71005 10.5884 5.40347 9.79102H4.8373C2.70706 9.79102 0.863002 11.3079 0.45248 13.3976C0.222134 14.5684 0.0133936 15.6304 0.0133936 15.6304C-0.0719335 16.0649 0.261318 16.4691 0.703335 16.4691Z"
            fill="#C1C1C1"
          />
          <path
            d="M4.17554 18.9188C4.90814 19.4119 5.68982 19.8316 6.51562 20.1738C6.96936 20.3617 7.43023 20.5226 7.89697 20.6587C7.92279 20.5538 7.94916 20.4465 7.97607 20.3372C8.37158 18.726 9.89007 17.0793 12.1637 17.1346C12.1655 17.1348 12.1674 17.1348 12.1692 17.1348C13.9633 17.1804 15.5237 18.4264 15.9646 20.1663L16.0902 20.6623C16.5613 20.5257 17.0268 20.3633 17.4846 20.1738C18.4184 19.7869 19.2956 19.3008 20.1094 18.7214L18.3263 8.02368L18.6577 8.35492C19.5577 9.25506 21.0128 9.25341 21.9113 8.35492C22.8083 7.45788 22.8083 5.99835 21.9113 5.10113L20.2344 3.42425V0.703125C20.2344 0.314758 19.9197 0 19.5313 0H18.7275C15.0059 0 12.0002 3.01282 12.0002 6.72729V9.03753H10.1243C7.82263 9.03753 5.8244 10.6756 5.37268 12.9327L4.17554 18.9188Z"
            fill="#C1C1C1"
          />
          <path
            d="M23.7942 18.2811C23.5196 18.0066 23.0745 18.0066 22.7998 18.2811C21.4254 19.6554 19.8183 20.7294 18.0228 21.4731C16.2274 22.2169 14.3315 22.5939 12.3881 22.5939H11.6122C9.66876 22.5939 7.77307 22.2169 5.97754 21.4731C4.18219 20.7294 2.57489 19.6554 1.20068 18.2811C0.926025 18.0066 0.480896 18.0066 0.206238 18.2811C-0.0684204 18.5557 -0.0684204 19.0008 0.206238 19.2755C1.71173 20.7812 3.47247 21.9576 5.43939 22.7724C7.40631 23.5871 9.48327 24.0002 11.6122 24.0002H12.3881C14.5172 24.0002 16.594 23.5871 18.5609 22.7723C20.5278 21.9576 22.2886 20.781 23.7942 19.2755C24.0687 19.0008 24.0687 18.5557 23.7942 18.2811Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3604">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    pets: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_5440_3616)">
          <path
            d="M23.2726 4.82469C22.7208 4.15555 21.9407 3.74842 21.0762 3.67835L20.378 3.62173C20.3505 3.28227 20.3214 2.92351 20.3214 2.92356C20.2513 2.05904 19.8442 1.279 19.1751 0.727191C18.5059 0.175381 17.6629 -0.0757943 16.8006 0.0199363C16.0413 0.104286 15.3373 0.459482 14.8183 1.02005C14.2993 1.58062 13.9993 2.30988 13.9735 3.07339L13.8995 5.26934L5.26936 13.8997L3.07341 13.9737C2.30986 13.9994 1.58064 14.2994 1.02002 14.8185C0.459501 15.3375 0.104305 16.0415 0.0199556 16.8008C-0.0758218 17.6628 0.175307 18.5061 0.727163 19.1752C1.27902 19.8444 2.05906 20.2515 2.92353 20.3216L3.62175 20.3782C3.64929 20.7177 3.67833 21.0764 3.67833 21.0765C3.74844 21.941 4.15557 22.721 4.82475 23.2728C5.40063 23.7478 6.1055 24 6.84034 24C6.9593 24 7.07906 23.9933 7.19919 23.98C7.95848 23.8956 8.6625 23.5404 9.18152 22.9799C9.70055 22.4193 10.0006 21.6901 10.0263 20.9265L10.1003 18.7306L18.7305 10.1003L20.9265 10.0263C21.69 10.0005 22.4192 9.70048 22.9798 9.1815C23.5404 8.66248 23.8956 7.9585 23.9799 7.19922C24.0756 6.33713 23.8245 5.49386 23.2726 4.82469Z"
            fill="#C1C1C1"
          />
        </g>
        <defs>
          <clipPath id="clip0_5440_3616">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    it: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.703125 18.3281H17.6719C18.0605 18.3281 18.375 18.0136 18.375 17.625V4.96875C18.375 4.58011 18.0605 4.26562 17.6719 4.26562H0.703125C0.314484 4.26562 0 4.58011 0 4.96875V17.625C0 18.0136 0.314484 18.3281 0.703125 18.3281Z"
          fill="#C1C1C1"
        />
        <path
          d="M7.07812 19.7344V20.4375C7.07812 20.8254 6.76294 21.1406 6.375 21.1406H4.96875C4.58011 21.1406 4.26562 21.4551 4.26562 21.8438C4.26562 22.2324 4.58011 22.5469 4.96875 22.5469H13.4531C13.8418 22.5469 14.1562 22.2324 14.1562 21.8438C14.1562 21.4551 13.8418 21.1406 13.4531 21.1406H12C11.6121 21.1406 11.2969 20.8254 11.2969 20.4375V19.7344H7.07812Z"
          fill="#C1C1C1"
        />
        <path
          d="M23.2969 1.45312H16.2656C15.877 1.45312 15.5625 1.76761 15.5625 2.15625V2.85938H17.6719C18.835 2.85938 19.7812 3.80559 19.7812 4.96875V17.625C19.7812 18.7882 18.835 19.7344 17.6719 19.7344H15.5625V21.8438C15.5625 22.2324 15.877 22.5469 16.2656 22.5469H23.2969C23.6855 22.5469 24 22.2324 24 21.8438V2.15625C24 1.76761 23.6855 1.45312 23.2969 1.45312ZM21.8906 19.0312C21.5023 19.0312 21.1875 18.7164 21.1875 18.3281C21.1875 17.9397 21.5023 17.625 21.8906 17.625C22.2789 17.625 22.5938 17.9397 22.5938 18.3281C22.5938 18.7164 22.2789 19.0312 21.8906 19.0312ZM21.8906 16.2188C21.5023 16.2188 21.1875 15.9039 21.1875 15.5156C21.1875 15.1272 21.5023 14.8125 21.8906 14.8125C22.2789 14.8125 22.5938 15.1272 22.5938 15.5156C22.5938 15.9039 22.2789 16.2188 21.8906 16.2188Z"
          fill="#C1C1C1"
        />
      </svg>
    ),
    homecare: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.601562 23.2956C0.601562 23.6842 0.916562 23.9997 1.30469 23.9997H3.5275C3.89697 23.9931 4.17648 23.7373 4.22547 23.3825V15.8916L0.601562 15.8933V23.2956Z"
          fill="#C1C1C1"
        />
        <path
          d="M10.3731 11.1209C10.6374 10.3446 10.2174 9.48766 9.44212 9.22249L6.96141 8.39875C6.40734 7.50888 5.85375 6.61952 5.29969 5.72964C4.78125 4.91486 4.27828 4.22308 3.33938 4.01988C3.14391 3.97718 2.92922 3.95603 2.69156 3.95932C1.19625 3.97947 0 5.21055 0 6.70774V13.7829C0 14.1712 0.314812 14.486 0.703125 14.486H4.77422C5.16234 14.486 5.47734 14.1711 5.47734 13.782V12.5979C5.19019 12.4979 4.98384 12.44 4.67016 12.2116C4.38562 12.0013 4.21031 11.7653 4.11094 11.6066C4.11094 11.6066 2.39859 8.85119 1.92844 8.09416C1.72453 7.76608 1.82578 7.32822 2.15344 7.12403C2.48063 6.91989 2.91797 7.02171 3.12187 7.34932C3.12187 7.34932 4.64906 9.80768 5.30391 10.8618C5.34033 10.9237 5.41838 11.0124 5.47734 11.058C6.64359 11.4438 7.31072 11.6672 8.47697 12.053C9.25228 12.3182 10.1082 11.8972 10.3731 11.1209Z"
          fill="#C1C1C1"
        />
        <path
          d="M3.33948 3.9945C4.43364 3.99431 5.33387 3.09286 5.33401 1.99748C5.33415 0.901922 4.43383 0.000187502 3.33948 1.82736e-09C2.24495 -4.68732e-05 1.34434 0.901734 1.34448 1.99748C1.34462 3.09305 2.24514 3.99455 3.33948 3.9945Z"
          fill="#C1C1C1"
        />
        <path
          d="M23.0407 21.3048L21.3227 16.5291C21.0246 15.7041 20.2423 15.1548 19.3652 15.1548L19.0062 15.1543H18.7732C19.0024 15.496 19.1988 15.8593 19.3615 16.2413C19.7088 17.0565 19.8851 17.9195 19.8851 18.8059C19.8851 19.427 19.7983 20.0368 19.6273 20.6265L20.2366 22.2999C20.5099 23.0691 21.3673 23.4774 22.1365 23.2041C22.9052 22.9313 23.3135 22.074 23.0407 21.3048Z"
          fill="#C1C1C1"
        />
        <path
          d="M13.121 12.2074C13.1022 12.0583 13.0952 11.9201 13.0947 11.7958V10.5916C13.0947 10.203 13.4092 9.88849 13.7978 9.88849C14.186 9.88849 14.501 10.203 14.501 10.5916V11.7958C14.501 11.9833 14.5296 12.1643 14.583 12.3349C15.0156 12.4226 15.4385 12.5538 15.8496 12.7291C16.6624 13.0755 17.3955 13.5776 18.0133 14.2169H19.1749C19.8667 14.2169 20.4278 13.6558 20.4278 12.9635C20.4278 12.6176 20.2877 12.3044 20.0608 12.0776C19.8339 11.8507 19.5208 11.7105 19.1749 11.7105H16.7749V10.9582C16.7744 10.7416 16.7514 9.60349 15.8331 8.68474C15.223 8.07429 14.5171 7.8604 14.0578 7.78479C15.1376 7.76506 16.0075 6.88413 16.0075 5.79917C16.0075 4.70182 15.1178 3.8126 14.0209 3.8126C12.9405 3.80131 12.0239 4.71996 12.0339 5.79917C12.0252 6.73624 12.7154 7.55191 13.6046 7.74317C12.7331 7.74471 11.9441 8.09257 11.3725 8.65802C10.7997 9.22474 10.4458 10.0099 10.4458 10.8836V12.8533C10.5358 12.8097 10.6277 12.7685 10.72 12.7291C11.485 12.4033 12.2917 12.228 13.121 12.2074Z"
          fill="#C1C1C1"
        />
        <path
          d="M13.2846 16.8887C12.2276 16.8887 11.3674 17.7488 11.3674 18.8063C11.3674 19.8634 12.2276 20.7235 13.2846 20.7235C14.3421 20.7235 15.2023 19.8634 15.2023 18.8063C15.2023 17.7488 14.3421 16.8887 13.2846 16.8887Z"
          fill="#C1C1C1"
        />
        <path
          d="M13.285 13.6123C10.4355 13.6123 8.09082 15.957 8.09082 18.8065C8.09082 21.6556 10.4355 24.0003 13.285 24.0003C16.1341 24.0003 18.4788 21.6556 18.4788 18.8065C18.4788 15.957 16.1341 13.6123 13.285 13.6123ZM13.2846 22.13C11.4522 22.13 9.96113 20.6389 9.96113 18.8065C9.96113 16.9737 11.4522 15.4826 13.2846 15.4826C15.1174 15.4826 16.6085 16.9737 16.6085 18.8065C16.6085 20.6389 15.1174 22.13 13.2846 22.13Z"
          fill="#C1C1C1"
        />
      </svg>
    ),
  };

  const icon = icons[category] || icons.diy;
  return cloneElementWithColor(icon, isSelected);
};

const steps = [
  { id: 1, title: "Select Your Service Provider", progress: 15 },
  { id: 2, title: "Select A Category", progress: 20 },
  { id: 3, title: "Describe About Service", progress: 70 },
  { id: 4, title: "Valuation of Job", progress: 80 },
  { id: 5, title: "Preview", progress: 100 },
];

// Categories and services will be fetched from API

export default function BookServiceModal({
  open,
  onClose,
}: BookServiceModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceProvider, setServiceProvider] = useState("professional");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [serviceDescription, setServiceDescription] = useState("");
  const [valuation, setValuation] = useState("");
  const [selectedDate, setSelectedDate] = useState("16");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedTime, setSelectedTime] = useState({
    hour: "10",
    minute: "00",
    period: "AM",
  });
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [descriptionFiles, setDescriptionFiles] = useState<File[]>([]);
  const [barterPhotoFiles, setBarterPhotoFiles] = useState<File[]>([]);
  const [descriptionFilePreviews, setDescriptionFilePreviews] = useState<
    (string | null)[]
  >([]);
  const [barterPhotoFilePreviews, setBarterPhotoFilePreviews] = useState<
    (string | null)[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [apiCategories, setApiCategories] = useState<
    Array<{
      id: string;
      category_name: string;
      category_logo: string;
    }>
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<
    Array<{
      id: string;
      subcategory_name: string;
      image: string | null;
    }>
  >([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await apiGet<{
        message: string;
        data: Array<{
          id: string;
          category_name: string;
          category_logo: string;
        }>;
        success: boolean;
        status_code: number;
      }>(API_ENDPOINTS.HOME.ALL_CATEGORIES);

      if (response.success && response.data?.data) {
        setApiCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch subcategories for selected category
  const fetchSubcategories = useCallback(async (catId: string) => {
    setSubcategoriesLoading(true);
    try {
      const endpoint = `${API_ENDPOINTS.HOME.HOME}/${catId}`;
      const response = await apiGet<{
        message: string;
        data: {
          Banner: {
            url: string | null;
            category_name: string;
            file_name: string | null;
            file_type: string | null;
          };
          subcategories: Array<{
            id: string;
            subcategory_name: string;
            image: string | null;
          }>;
        };
        success: boolean;
        status_code: number;
      }>(endpoint);

      if (response.success && response.data?.data) {
        setSubcategories(response.data.data.subcategories || []);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open, fetchCategories]);

  // Reset all form state to initial values
  const resetForm = useCallback(() => {
    // Clean up preview URLs using functional setState to access current values
    setDescriptionFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return [];
    });
    setBarterPhotoFilePreviews((prev) => {
      prev.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      return [];
    });

    setCurrentStep(1);
    setServiceProvider("professional");
    setSelectedCategory("");
    setSelectedService(null);
    setServiceDescription("");
    setValuation("");
    setSelectedDate("16");
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setSelectedTime({ hour: "10", minute: "00", period: "AM" });
    setProductName("");
    setQuantity(1);
    setShowSuccess(false);
    setDescriptionFiles([]);
    setBarterPhotoFiles([]);
    setCategoryId("");
    setSubCategoryId("");
    setSubcategories([]);
  }, []);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

  // Recreate preview URLs if files exist but previews are missing
  useEffect(() => {
    if (descriptionFiles.length === 0) {
      // Clean up all previews if no files
      setDescriptionFilePreviews((prev) => {
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
        return [];
      });
      return;
    }

    setDescriptionFilePreviews((prev) => {
      // Ensure array length matches files array
      const newPreviews: (string | null)[] = new Array(
        descriptionFiles.length,
      ).fill(null);
      let hasChanges = false;

      // Copy existing valid previews and create new ones if needed
      descriptionFiles.forEach((file, index) => {
        if (file && file.type.startsWith("image/")) {
          // Always create new preview URL from the file object
          // File objects persist across step changes, so we can always recreate the blob URL
          const existingPreview = prev[index];

          // Clean up old preview if it exists
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
          }

          // Create new preview URL from the file
          const previewURL = URL.createObjectURL(file);
          newPreviews[index] = previewURL;
          hasChanges = true;
        } else {
          // Clear preview if file doesn't exist or is not an image
          const existingPreview = prev[index];
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
            hasChanges = true;
          }
          newPreviews[index] = null;
        }
      });

      // Clean up previews for indices that no longer have files
      prev.forEach((preview, index) => {
        if (preview && index >= descriptionFiles.length) {
          URL.revokeObjectURL(preview);
          hasChanges = true;
        }
      });

      return hasChanges ? newPreviews : prev;
    });
  }, [descriptionFiles, currentStep]);

  useEffect(() => {
    if (barterPhotoFiles.length === 0) {
      // Clean up all previews if no files
      setBarterPhotoFilePreviews((prev) => {
        prev.forEach((preview) => {
          if (preview) URL.revokeObjectURL(preview);
        });
        return [];
      });
      return;
    }

    setBarterPhotoFilePreviews((prev) => {
      // Ensure array length matches files array
      const newPreviews: (string | null)[] = new Array(
        barterPhotoFiles.length,
      ).fill(null);
      let hasChanges = false;

      // Copy existing valid previews and create new ones if needed
      barterPhotoFiles.forEach((file, index) => {
        if (file && file.type.startsWith("image/")) {
          // Always create new preview URL from the file object
          // File objects persist across step changes, so we can always recreate the blob URL
          const existingPreview = prev[index];

          // Clean up old preview if it exists
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
          }

          // Create new preview URL from the file
          const previewURL = URL.createObjectURL(file);
          newPreviews[index] = previewURL;
          hasChanges = true;
        } else {
          // Clear preview if file doesn't exist or is not an image
          const existingPreview = prev[index];
          if (existingPreview) {
            URL.revokeObjectURL(existingPreview);
            hasChanges = true;
          }
          newPreviews[index] = null;
        }
      });

      // Clean up previews for indices that no longer have files
      prev.forEach((preview, index) => {
        if (preview && index >= barterPhotoFiles.length) {
          URL.revokeObjectURL(preview);
          hasChanges = true;
        }
      });

      return hasChanges ? newPreviews : prev;
    });
  }, [barterPhotoFiles, currentStep]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      descriptionFilePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      barterPhotoFilePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [descriptionFilePreviews, barterPhotoFilePreviews]);

  // Auto-close success modal after 2 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        resetForm();
        onClose();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose, resetForm]);

  // Calculate progress based on current step and total steps
  const getProgress = () => {
    if (serviceProvider === "non-professional") {
      // Non-professional has 6 steps total
      const totalSteps = 6;
      return Math.round((currentStep / totalSteps) * 100);
    } else {
      // Professional has 5 steps total
      const totalSteps = 5;
      return Math.round((currentStep / totalSteps) * 100);
    }
  };

  const progress = getProgress();

  const handleNext = () => {
    const maxStep = serviceProvider === "non-professional" ? 6 : 5;
    if (currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Upload a single file and return storage key
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiPostFormData<{ storage_key: string }>(
        API_ENDPOINTS.SERVICE_REQUEST.UPLOAD_FILE,
        formData,
      );

      if (response.success && response.data?.storage_key) {
        return response.data.storage_key;
      }
      return null;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };
  
  // Reset form
 

  // Upload multiple files and return array of storage keys
  const uploadFiles = async (
    files: File[],
  ): Promise<Array<{ storage_key: string }>> => {
    const uploadPromises = files.map((file) => uploadFile(file));
    const storageKeys = await Promise.all(uploadPromises);
    return storageKeys
      .filter((key): key is string => key !== null)
      .map((key) => ({ storage_key: key }));
  };

  // Format datetime for API (ISO 8601 format)
  const formatDateTime = (): string => {
    const date = new Date(
      currentYear,
      currentMonth,
      parseInt(selectedDate),
      selectedTime.period === "AM"
        ? parseInt(selectedTime.hour) === 12
          ? 0
          : parseInt(selectedTime.hour)
        : parseInt(selectedTime.hour) === 12
          ? 12
          : parseInt(selectedTime.hour) + 12,
      parseInt(selectedTime.minute),
    );
    return date.toISOString();
  };

  const handleSubmit = async () => {
    if (!categoryId || !subCategoryId) {
      alert("Please select a category and service");
      return;
    }

    // Validate valuation for professional services
    if (
      serviceProvider === "professional" &&
      (!valuation || valuation.trim() === "")
    ) {
      alert("Please enter a valuation amount");
      return;
    }

    setUploading(true);
    try {
      // Upload description files first
      const descriptionFileKeys = await uploadFiles(descriptionFiles);

      // Upload barter photo files if non-professional
      let barterPhotoKeys: Array<{ storage_key: string }> = [];
      if (
        serviceProvider === "non-professional" &&
        barterPhotoFiles.length > 0
      ) {
        barterPhotoKeys = await uploadFiles(barterPhotoFiles);
      }

      // Build request body
      const isProfessional = serviceProvider === "professional";
      const chosenDateTime = formatDateTime();

      const requestBody: any = {
        is_professional: isProfessional,
        category_id: categoryId,
        sub_category_id: subCategoryId,
        description: serviceDescription,
        description_files: descriptionFileKeys,
        chosen_datetime: chosenDateTime,
      };

      if (isProfessional) {
        // Professional service request
        const validationAmount = parseFloat(valuation.replace(",", ""));
        const platformFees = validationAmount * 0.032; // 3.2% platform fee
        const tax = validationAmount * 0.072; // 7.2% tax

        requestBody.validation_amount = validationAmount;
        requestBody.platform_fees = parseFloat(platformFees.toFixed(2));
        requestBody.tax = parseFloat(tax.toFixed(2));
        requestBody.task_status = "open";
      } else {
        // Non-professional service request (barter)
        if (productName && barterPhotoKeys.length > 0) {
          requestBody.barter_product = {
            product_name: productName,
            quantity: quantity,
            barter_photo_files: barterPhotoKeys,
          };
        }
      }

      // Create service request
      const response = await apiPost(
        API_ENDPOINTS.SERVICE_REQUEST.CREATE,
        requestBody,
      );

      if (response.success) {
        setShowSuccess(true);
      } else {
        alert(response.error?.message || "Failed to create service request");
      }
    } catch (error) {
      console.error("Error creating service request:", error);
      alert("An error occurred while creating the service request");
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = apiCategories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);
      setCategoryId(categoryId);
      setSelectedService(null);
      setSubCategoryId("");
      setSubcategories([]);
      // Fetch subcategories for selected category
      fetchSubcategories(categoryId);
    }
  };

  const handleServiceSelect = (subcategoryId: string) => {
    const subcategory = subcategories.find((s) => s.id === subcategoryId);
    if (subcategory) {
      setSelectedService(subcategoryId);
      setSubCategoryId(subcategoryId);
    }
  };

  const handleDescriptionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for images
      let previewURL: string | null = null;
      if (file.type.startsWith("image/")) {
        previewURL = URL.createObjectURL(file);
      }

      setDescriptionFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setDescriptionFilePreviews((prev) => {
        const newPreviews = [...prev];
        // Clean up old preview URL if it exists
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = previewURL;
        return newPreviews;
      });
    }
  };

  const handleBarterPhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL for images
      let previewURL: string | null = null;
      if (file.type.startsWith("image/")) {
        previewURL = URL.createObjectURL(file);
      }

      setBarterPhotoFiles((prev) => {
        const newFiles = [...prev];
        newFiles[index] = file;
        return newFiles;
      });

      setBarterPhotoFilePreviews((prev) => {
        const newPreviews = [...prev];
        // Clean up old preview URL if it exists
        if (newPreviews[index]) {
          URL.revokeObjectURL(newPreviews[index]!);
        }
        newPreviews[index] = previewURL;
        return newPreviews;
      });
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[month];
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[0].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              To get started, please select a category. This will ensure we
              match you with the most suitable professional for your
              requirements.
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                sx={{ gap: 2 }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "0.75rem",
                    border: "0.0625rem solid",
                    borderColor:
                      serviceProvider === "professional"
                        ? "#2F6B8E"
                        : "grey.300",
                    bgcolor:
                      serviceProvider === "professional"
                        ? "rgba(47, 107, 142, 0.05)"
                        : "white",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setServiceProvider("professional")}
                >
                  <FormControlLabel
                    value="professional"
                    control={<BulletRadio />}
                    label="Professional"
                    labelPlacement="start"
                    sx={{
                      m: 0,
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#2C6587",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    p: 2,
                    border: "0.0625rem solid",
                    borderRadius: "0.75rem",
                    borderColor:
                      serviceProvider === "non-professional"
                        ? "#2F6B8E"
                        : "grey.300",
                    bgcolor:
                      serviceProvider === "non-professional"
                        ? "rgba(47, 107, 142, 0.05)"
                        : "white",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#2F6B8E",
                    },
                  }}
                  onClick={() => setServiceProvider("non-professional")}
                >
                  <FormControlLabel
                    value="non-professional"
                    control={<BulletRadio />}
                    label="Non-professional"
                    labelPlacement="start"
                    sx={{
                      fontSize: "1.125rem",
                      fontWeight: 500,
                      color: "#2C6587",
                      m: 0,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[1].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              Please pick a category to begin. This will help us connect you
              with the right professional for your needs.
            </Typography>
            <Typography
              fontWeight="700"
              sx={{
                mb: 1,
                lineHeight: "1.125rem",
                fontSize: "1rem",
                color: "#2C6587",
              }}
            >
              Select a category
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                displayEmpty
                IconComponent={KeyboardArrowDownIcon}
                disabled={categoriesLoading}
                renderValue={(selected) => {
                  if (categoriesLoading) {
                    return (
                      <Typography color="text.secondary">
                        Loading categories...
                      </Typography>
                    );
                  }
                  const cat = apiCategories.find((c) => c.id === selected);
                  if (!cat)
                    return (
                      <Typography color="text.secondary">
                        Select a category
                      </Typography>
                    );
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {cat.category_logo ? (
                        <Image
                          src={cat.category_logo}
                          alt={cat.category_name}
                          width={24}
                          height={24}
                          style={{ objectFit: "contain" }}
                        />
                      ) : (
                        <CategoryIcon
                          category={cat.category_name.toLowerCase()}
                          isSelected={true}
                        />
                      )}
                      <Typography
                        sx={{
                          color: "#2C6587",
                        }}
                      >
                        {cat.category_name}
                      </Typography>
                    </Box>
                  );
                }}
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  PaperProps: {
                    elevation: 3,
                    sx: {
                      maxHeight: 180,
                      overflowY: "auto",
                      mt: 1,
                    },
                  },
                }}
                sx={{
                  mb: 2,
                  "& .MuiSelect-select": {
                    color: "#2C6587 !important",
                  },
                  "& .MuiInputBase-input": {
                    color: "#2C6587 !important",
                  },
                  "& .MuiSelect-icon": {
                    fontSize: "2rem",
                    color: "#818285",
                    right: "16px",
                    width: "2.2rem",
                    height: "2rem",
                  },
                }}
              >
                {categoriesLoading ? (
                  <MenuItem disabled>
                    <Typography color="text.secondary">
                      Loading categories...
                    </Typography>
                  </MenuItem>
                ) : apiCategories.length === 0 ? (
                  <MenuItem disabled>
                    <Typography color="text.secondary">
                      No categories available
                    </Typography>
                  </MenuItem>
                ) : (
                  apiCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <MenuItem
                        key={cat.id}
                        value={cat.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: 400,
                          fontSize: "1rem",
                          lineHeight: "140%",
                          letterSpacing: "0%",
                          color: isSelected ? "primary.normal" : "text.primary",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {cat.category_logo ? (
                            <Image
                              src={cat.category_logo}
                              alt={cat.category_name}
                              width={24}
                              height={24}
                              style={{ objectFit: "contain" }}
                            />
                          ) : (
                            <CategoryIcon
                              category={cat.category_name.toLowerCase()}
                              isSelected={isSelected}
                            />
                          )}
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: "1rem",
                              lineHeight: "140%",
                              letterSpacing: "0%",
                              color: isSelected
                                ? "primary.normal"
                                : "text.primary",
                            }}
                          >
                            {cat.category_name}
                          </Typography>
                        </Box>
                        <Radio checked={isSelected} />
                      </MenuItem>
                    );
                  })
                )}
              </Select>
            </FormControl>

            {selectedCategory && (
              <Box sx={{ mt: 3 }}>
                {subcategoriesLoading ? (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary">
                      Loading services...
                    </Typography>
                  </Box>
                ) : subcategories.length === 0 ? (
                  selectedCategory && (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography color="text.secondary">
                        No services available for this category
                      </Typography>
                    </Box>
                  )
                ) : (
                  subcategories.map((subcategory) => {
                    const isServiceSelected =
                      selectedService === subcategory.id;
                    return (
                      <Card
                        key={subcategory.id}
                        sx={{
                          p: 2,
                          mb: 2,
                          cursor: "pointer",
                          bgcolor: "#F2F2F2",
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#E8E8E8",
                          },
                        }}
                        onClick={() => handleServiceSelect(subcategory.id)}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              overflow: "hidden",
                              position: "relative",
                              bgcolor: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {subcategory.image ? (
                              <Image
                                src={subcategory.image}
                                alt={subcategory.subcategory_name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <Typography
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {subcategory.subcategory_name.charAt(0)}
                              </Typography>
                            )}
                          </Box>
                          <Typography
                            variant="body1"
                            fontWeight="500"
                            sx={{
                              flex: 1,
                              color: isServiceSelected
                                ? "primary.normal"
                                : "#939393",
                            }}
                          >
                            {subcategory.subcategory_name}
                          </Typography>
                          <Radio
                            checked={isServiceSelected}
                            sx={{
                              color: isServiceSelected
                                ? "primary.normal"
                                : "#939393",
                              "&.Mui-checked": {
                                color: "primary.normal",
                              },
                            }}
                          />
                        </Box>
                      </Card>
                    );
                  })
                )}
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[2].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              Great job! You&apos;ve selected your service. Now, please describe
              what you need so the professional can understand your request
              better.
            </Typography>

            {selectedCategory && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    color: "#424242",
                    lineHeight: "20px",
                    fontSize: "1.125rem",
                    mb: "0.5rem",
                  }}
                >
                  Select a category
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Select
                    sx={{
                      "& .MuiSelect-select": {
                        color: "#2C6587 !important",
                      },
                      "& .MuiInputBase-input": {
                        color: "#2C6587 !important",
                      },
                      "&.Mui-disabled": {
                        "& .MuiSelect-select": {
                          color: "#2C6587 !important",
                          WebkitTextFillColor: "#2C6587",
                        },
                      },
                    }}
                    value={selectedCategory}
                    disabled
                  >
                    <MenuItem value={selectedCategory}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {(() => {
                          const cat = apiCategories.find(
                            (c) => c.id === selectedCategory,
                          );
                          if (cat?.category_logo) {
                            return (
                              <Image
                                src={cat.category_logo}
                                alt={cat.category_name}
                                width={24}
                                height={24}
                                style={{ objectFit: "contain" }}
                              />
                            );
                          }
                          return cat ? (
                            <CategoryIcon
                              category={cat.category_name.toLowerCase()}
                              isSelected={true}
                            />
                          ) : null;
                        })()}
                        {
                          apiCategories.find((c) => c.id === selectedCategory)
                            ?.category_name
                        }
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                {selectedService && (
                  <Card
                    sx={{
                      p: 2,
                      mb: 2,
                      border: "none",
                      bgcolor: "#F2F2F2",
                      borderRadius: "0.75rem",
                      boxShadow: "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: 1,
                          overflow: "hidden",
                          position: "relative",
                          bgcolor: "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {(() => {
                          const subcat = subcategories.find(
                            (s) => s.id === selectedService,
                          );
                          if (subcat?.image) {
                            return (
                              <Image
                                src={subcat.image}
                                alt={subcat.subcategory_name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            );
                          }
                          return (
                            <Typography
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.875rem",
                              }}
                            >
                              {subcat?.subcategory_name.charAt(0) || "?"}
                            </Typography>
                          );
                        })()}
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight="500"
                        sx={{ color: "primary.normal" }}
                      >
                        {
                          subcategories.find((s) => s.id === selectedService)
                            ?.subcategory_name
                        }
                      </Typography>
                    </Box>
                  </Card>
                )}
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Enter Service description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter description here..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.400",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2F6B8E",
                    },
                  },
                }}
              />
            </Box>

            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Upload Photos of a Job
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {[0, 1].map((index) => (
                <Box
                  key={index}
                  component="label"
                  htmlFor={`description-file-${index}`}
                  sx={{
                    width: "100%",
                    height: "9rem",
                    border: "0.125rem dashed",
                    borderColor: descriptionFiles[index]
                      ? "#2F6B8E"
                      : "#D1D5DB",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    bgcolor: "#FFFFFF",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#9CA3AF",
                    },
                  }}
                >
                  <input
                    id={`description-file-${index}`}
                    type="file"
                    hidden
                    accept="image/*,video/*,.pdf"
                    onChange={(e) => handleDescriptionFileChange(e, index)}
                  />
                  {descriptionFiles[index] ? (
                    descriptionFilePreviews[index] &&
                    descriptionFiles[index].type.startsWith("image/") ? (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      >
                        <Image
                          src={descriptionFilePreviews[index]!}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            left: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: 1,
                            p: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="white"
                            sx={{ fontSize: "0.75rem", textAlign: "center" }}
                          >
                            {descriptionFiles[index].name.length > 20
                              ? `${descriptionFiles[index].name.substring(
                                  0,
                                  20,
                                )}...`
                              : descriptionFiles[index].name}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="file uploaded"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.75rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#2F6B8E",
                            textAlign: "center",
                            px: 1,
                          }}
                        >
                          {descriptionFiles[index].name.length > 20
                            ? `${descriptionFiles[index].name.substring(
                                0,
                                20,
                              )}...`
                            : descriptionFiles[index].name}
                        </Typography>
                      </>
                    )
                  ) : (
                    <>
                      <Box sx={{ position: "relative", mb: 0.5 }}>
                        <Image
                          src="/icons/folder-upload-line.png"
                          alt="cloud upload"
                          width={24}
                          height={24}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.75rem",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#818285",
                        }}
                      >
                        upload from device
                      </Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                fontSize: "1rem",
                lineHeight: "150%",
                letterSpacing: "0%",
                color: "#939393",
              }}
            >
              Please upload photos of the job so the worker can understand the
              task better. <br /> (You can also upload a video)
            </Typography>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography
              sx={{
                color: "primary.normal",
                fontSize: "1.25rem",
                lineHeight: "2rem",
                fontWeight: 500,
              }}
            >
              {steps[3].title}
            </Typography>
            <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
              {serviceProvider === "professional"
                ? "Great, you're almost done. Please add the job valuation."
                : "Great, you're almost done. Please choose the date and time for your service."}
            </Typography>

            {serviceProvider === "professional" && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    mb: 1,
                    fontSize: "1.125rem",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#555555",
                  }}
                >
                  Enter Valuation
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter amount"
                  value={valuation ? `€ ${valuation}` : "€ "}
                  onChange={(e) => {
                    let value = e.target.value
                      .replace("€ ", "")
                      .replace(",", "");

                    // Only allow numbers and a single decimal point
                    value = value.replace(/[^0-9.]/g, "");

                    // Prevent multiple decimal points
                    const parts = value.split(".");
                    if (parts.length > 2) {
                      value = parts[0] + "." + parts.slice(1).join("");
                    }

                    setValuation(value);
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "grey.300",
                      },
                      "&:hover fieldset": {
                        borderColor: "grey.400",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2F6B8E",
                      },
                    },
                  }}
                />
              </Box>
            )}

            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Choose Date
            </Typography>
            <Box sx={{ mb: 3 }}>
              {/* Month/Year Navigation Box */}
              <Box
                sx={{
                  bgcolor: "#FBFBFB",
                  border: "none",
                  borderRadius: "1.125rem",
                  pt: "0.375rem",
                  pb: "0.375rem",
                  px: 2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IconButton size="small" onClick={handlePreviousMonth}>
                    <ArrowBackIosIcon fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "primary.normal",
                    }}
                  >
                    {getMonthName(currentMonth)} {currentYear}
                  </Typography>
                  <IconButton size="small" onClick={handleNextMonth}>
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Dates Grid Box */}
              <Box
                sx={{
                  bgcolor: "#FBFBFB",
                  border: "none",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <Box
                        key={day}
                        sx={{
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "auto",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            lineHeight: "1.125rem",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "primary.normal",
                          }}
                        >
                          {day}
                        </Typography>
                      </Box>
                    ),
                  )}
                  {/* Empty cells for days before the 1st of the month */}
                  {Array.from(
                    { length: getFirstDayOfMonth(currentMonth, currentYear) },
                    (_, i) => (
                      <Box key={`empty-${i}`} sx={{ width: 32, height: 32 }} />
                    ),
                  )}
                  {/* Days of the month */}
                  {Array.from(
                    { length: getDaysInMonth(currentMonth, currentYear) },
                    (_, i) => {
                      const day = i + 1;
                      const dayString = day.toString();
                      const isSelected = selectedDate === dayString;
                      return (
                        <Box
                          key={day}
                          onClick={() => setSelectedDate(dayString)}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            margin: "auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            bgcolor: isSelected ? "#2F6B8E" : "transparent",
                            color: isSelected ? "white" : "text.primary",
                            "&:hover": {
                              bgcolor: isSelected ? "#2F6B8E" : "grey.100",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "0.875rem",
                              lineHeight: "1.125rem",
                              color: isSelected ? "white" : "#323232",
                            }}
                          >
                            {day}
                          </Typography>
                        </Box>
                      );
                    },
                  )}
                </Box>
              </Box>
            </Box>

            {/* Divider */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 3,
              }}
            >
              <Box
                sx={{
                  width: "80%",
                  height: "0.0625rem",
                  bgcolor: "grey.300",
                }}
              />
            </Box>

            <Typography
              sx={{
                mb: 1,
                fontSize: "1.125rem",
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#555555",
              }}
            >
              Choose Time
            </Typography>
            <Box
              sx={{
                border: "none",
                borderRadius: 2,
                p: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2.625rem",
                bgcolor: "#FBFBFB",
                boxShadow: "none",
              }}
            >
              {/* Hour Input */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <Box
                  onClick={() => {
                    const hour = parseInt(selectedTime.hour);
                    if (hour > 1)
                      setSelectedTime({
                        ...selectedTime,
                        hour: (hour - 1).toString(),
                      });
                  }}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey.400",
                    "&:hover": { color: "grey.600" },
                  }}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 0L0 8H12L6 0Z" fill="currentColor" />
                  </svg>
                </Box>
                <TextField
                  value={selectedTime.hour}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value === "") {
                      setSelectedTime({
                        ...selectedTime,
                        hour: "",
                      });
                    } else {
                      // Limit to 2 digits
                      value = value.slice(0, 2);
                      const numValue = parseInt(value);
                      if (numValue >= 1 && numValue <= 12) {
                        setSelectedTime({
                          ...selectedTime,
                          hour: value,
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      isNaN(parseInt(value)) ||
                      parseInt(value) < 1
                    ) {
                      setSelectedTime({ ...selectedTime, hour: "1" });
                    } else {
                      const numValue = parseInt(value);
                      if (numValue > 12) {
                        setSelectedTime({ ...selectedTime, hour: "12" });
                      } else {
                        setSelectedTime({
                          ...selectedTime,
                          hour: numValue.toString(),
                        });
                      }
                    }
                  }}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      lineHeight: "1.75rem",
                      letterSpacing: "0%",
                      fontWeight: 500,
                      color: "primary.normal",
                      padding: 0,
                    },
                  }}
                  sx={{
                    width: "3rem",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                    "& input": {
                      fontSize: "1.5rem",
                      lineHeight: "1.75rem",
                      letterSpacing: "0%",
                      fontWeight: 500,
                      color: "primary.normal",
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                />
                <Box
                  onClick={() => {
                    const hour = parseInt(selectedTime.hour);
                    if (hour < 12)
                      setSelectedTime({
                        ...selectedTime,
                        hour: (hour + 1).toString(),
                      });
                  }}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey.400",
                    "&:hover": { color: "grey.600" },
                  }}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8L0 0H12L6 8Z" fill="currentColor" />
                  </svg>
                </Box>
              </Box>

              <Typography sx={{ fontSize: "1.25rem", color: "text.primary" }}>
                :
              </Typography>

              {/* Minute Input */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <Box
                  onClick={() => {
                    const minute = parseInt(selectedTime.minute);
                    if (minute > 0)
                      setSelectedTime({
                        ...selectedTime,
                        minute: (minute - 1).toString().padStart(2, "0"),
                      });
                  }}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey.400",
                    "&:hover": { color: "grey.600" },
                  }}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 0L0 8H12L6 0Z" fill="currentColor" />
                  </svg>
                </Box>
                <TextField
                  value={selectedTime.minute}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    if (value === "") {
                      setSelectedTime({
                        ...selectedTime,
                        minute: "",
                      });
                    } else {
                      // Limit to 2 digits
                      value = value.slice(0, 2);
                      const numValue = parseInt(value);
                      if (numValue >= 0 && numValue <= 59) {
                        setSelectedTime({
                          ...selectedTime,
                          minute: value,
                        });
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      isNaN(parseInt(value)) ||
                      parseInt(value) < 0
                    ) {
                      setSelectedTime({ ...selectedTime, minute: "00" });
                    } else {
                      const numValue = parseInt(value);
                      if (numValue > 59) {
                        setSelectedTime({ ...selectedTime, minute: "59" });
                      } else {
                        setSelectedTime({
                          ...selectedTime,
                          minute: numValue.toString().padStart(2, "0"),
                        });
                      }
                    }
                  }}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      fontSize: "1.5rem",
                      lineHeight: "1.75rem",
                      letterSpacing: "0%",
                      fontWeight: 500,
                      color: "primary.normal",
                      padding: 0,
                    },
                  }}
                  sx={{
                    width: "3rem",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                      "&:hover fieldset": {
                        border: "none",
                      },
                      "&.Mui-focused fieldset": {
                        border: "none",
                      },
                    },
                    "& input": {
                      fontSize: "1.5rem",
                      lineHeight: "1.75rem",
                      letterSpacing: "0%",
                      fontWeight: 500,
                      color: "primary.normal",
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                />
                <Box
                  onClick={() => {
                    const minute = parseInt(selectedTime.minute);
                    if (minute < 59)
                      setSelectedTime({
                        ...selectedTime,
                        minute: (minute + 1).toString().padStart(2, "0"),
                      });
                  }}
                  sx={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "grey.400",
                    "&:hover": { color: "grey.600" },
                  }}
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8L0 0H12L6 8Z" fill="currentColor" />
                  </svg>
                </Box>
              </Box>

              {/* AM/PM Selector */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "2.438rem",
                  ml: 2,
                  alignItems: "center",
                }}
              >
                <Typography
                  onClick={() =>
                    setSelectedTime({ ...selectedTime, period: "AM" })
                  }
                  sx={{
                    fontSize: "1.5rem",
                    lineHeight: "1.75rem",
                    letterSpacing: "0%",
                    fontWeight: 500,
                    color:
                      selectedTime.period === "AM"
                        ? "primary.normal"
                        : "#D5D5D5",
                    cursor: "pointer",
                    "&:hover": {
                      color:
                        selectedTime.period === "AM"
                          ? "primary.normal"
                          : "#D5D5D5",
                    },
                  }}
                >
                  AM
                </Typography>
                <Typography
                  onClick={() =>
                    setSelectedTime({ ...selectedTime, period: "PM" })
                  }
                  sx={{
                    fontSize: "1.5rem",
                    lineHeight: "1.75rem",
                    letterSpacing: "0%",
                    fontWeight: 500,
                    color:
                      selectedTime.period === "PM"
                        ? "primary.normal"
                        : "#D5D5D5",
                    cursor: "pointer",
                    "&:hover": {
                      color:
                        selectedTime.period === "PM"
                          ? "primary.normal"
                          : "#D5D5D5",
                    },
                  }}
                >
                  PM
                </Typography>
              </Box>
            </Box>
          </Box>
        );

      case 5:
        // Show Barter Product Details if non-professional
        if (serviceProvider === "non-professional") {
          return (
            <Box>
              <Typography
                sx={{
                  color: "primary.normal",
                  fontSize: "1.25rem",
                  lineHeight: "2rem",
                  fontWeight: 500,
                }}
              >
                Barter Product Details
              </Typography>
              <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
                Add details of the product or thing you want to offer in
                exchange for the service.
              </Typography>

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Add Product Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor: "grey.400",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2F6B8E",
                    },
                  },
                }}
              />

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Quantity
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 2,
                  width: "100%",
                  mb: 3,
                }}
              >
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setQuantity(1);
                      return;
                    }
                    const numValue = Number(value);
                    if (!isNaN(numValue) && numValue >= 1) {
                      // Get the number of digits (excluding decimal point)
                      const digitCount = Math.floor(numValue).toString().length;
                      // Allow values with 7-8 digits, or values less than 7 digits (for typing)
                      if (digitCount <= 8) {
                        const clampedValue = Math.max(
                          1,
                          Math.min(99999999, Math.floor(numValue)),
                        );
                        setQuantity(clampedValue);
                      }
                      // If more than 8 digits, don't update (keep current value)
                    }
                  }}
                  onBlur={(e) => {
                    // Enforce max limit of 8 digits when field loses focus
                    if (quantity > 99999999) {
                      setQuantity(99999999);
                    }
                  }}
                  inputProps={{
                    type: "number",
                    min: 1,
                    max: 99999999,
                    style: {
                      MozAppearance: "textfield",
                    },
                  }}
                  sx={{
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                          <IconButton
                            sx={{
                              "&:hover": {
                                bgcolor: "transparent",
                              },
                            }}
                            size="large"
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                          >
                            <Typography
                              sx={{ fontSize: "2rem", color: "#343330" }}
                              variant="body1"
                            >
                              -
                            </Typography>
                          </IconButton>
                          <IconButton
                            sx={{
                              "&:hover": {
                                bgcolor: "transparent",
                              },
                            }}
                            size="large"
                            onClick={() =>
                              setQuantity(Math.min(99999999, quantity + 1))
                            }
                          >
                            <Typography
                              sx={{ fontSize: "2rem", color: "#343330" }}
                              variant="body1"
                            >
                              +
                            </Typography>
                          </IconButton>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mb: 1,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                }}
              >
                Upload Photos of Product
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                {[0, 1].map((index) => (
                  <Box
                    key={index}
                    component="label"
                    htmlFor={`barter-photo-${index}`}
                    sx={{
                      width: "100%",
                      height: "9rem",
                      border: "0.125rem dashed",
                      borderColor: barterPhotoFiles[index]
                        ? "#2F6B8E"
                        : "#D1D5DB",
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      bgcolor: "#FFFFFF",
                      position: "relative",
                      "&:hover": {
                        borderColor: "#9CA3AF",
                      },
                    }}
                  >
                    <input
                      id={`barter-photo-${index}`}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => handleBarterPhotoChange(e, index)}
                    />
                    {barterPhotoFiles[index] ? (
                      barterPhotoFilePreviews[index] ? (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                          }}
                        >
                          <Image
                            src={barterPhotoFilePreviews[index]!}
                            alt="Preview"
                            fill
                            style={{ objectFit: "cover", borderRadius: "8px" }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 8,
                              left: 8,
                              right: 8,
                              bgcolor: "rgba(0,0,0,0.6)",
                              borderRadius: 1,
                              p: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="white"
                              sx={{ fontSize: "0.75rem", textAlign: "center" }}
                            >
                              {barterPhotoFiles[index].name.length > 20
                                ? `${barterPhotoFiles[index].name.substring(
                                    0,
                                    20,
                                  )}...`
                                : barterPhotoFiles[index].name}
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <>
                          <Box sx={{ position: "relative", mb: 0.5 }}>
                            <Image
                              src="/icons/folder-upload-line.png"
                              alt="file uploaded"
                              width={24}
                              height={24}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 300,
                              fontSize: "0.75rem",
                              lineHeight: "100%",
                              letterSpacing: "0%",
                              color: "#2F6B8E",
                              textAlign: "center",
                              px: 1,
                            }}
                          >
                            {barterPhotoFiles[index].name.length > 20
                              ? `${barterPhotoFiles[index].name.substring(
                                  0,
                                  20,
                                )}...`
                              : barterPhotoFiles[index].name}
                          </Typography>
                        </>
                      )
                    ) : (
                      <>
                        <Box sx={{ position: "relative", mb: 0.5 }}>
                          <Image
                            src="/icons/folder-upload-line.png"
                            alt="cloud upload"
                            width={24}
                            height={24}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#818285",
                          }}
                        >
                          upload from device
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          );
        }
        // For professional, show Preview at step 5
        return renderPreviewStep();
      case 6:
        // Preview step for non-professional (after Barter)
        return renderPreviewStep();
      default:
        return null;
    }
  };

  const renderPreviewStep = () => {
    return (
      <Box>
        <Typography sx={{ mb: 3, color: "#939393", lineHeight: "150%" }}>
          Well done! You&apos;ve completed all the steps. Please review the
          preview and edit any details if needed.
        </Typography>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.5rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#2C6587",
            fontWeight: 600,
          }}
        >
          {apiCategories.find((c) => c.id === selectedCategory)?.category_name}{" "}
          Service
        </Typography>
        <Box
          sx={{
            backgroundColor: "#EAF0F3",
            position: "relative",
            width: "100%",
            height: 230, // total height of the container
            borderRadius: 2,
            overflow: "hidden",
            mb: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: "1 1 0%", // takes remaining space
              position: "relative",
              width: "100%",
              height: "80%",
              overflow: "hidden",
            }}
          >
            <Image
              src={
                subcategories.find((s) => s.id === selectedService)?.image ||
                "/image/service-image-5.png"
              }
              alt="Service Preview"
              width={800} // intrinsic width
              height={600} // intrinsic height
              style={{
                width: "100%", // full width
                height: "auto", // maintain aspect ratio
                borderRadius: "22px",
                objectFit: "cover", // crop to fill container
                objectPosition: "top", // crop starting from top
              }}
            />
          </Box>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
            }}
          >
            <Typography
              variant="body1"
              color="#2C6587"
              fontWeight="600"
              fontSize="1.25rem"
              noWrap
            >
              {
                subcategories.find((s) => s.id === selectedService)
                  ?.subcategory_name
              }
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.125rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#555555",
            fontWeight: 600,
          }}
        >
          Job Details
        </Typography>
        <Card
          sx={{
            p: 2,
            mb: 3,
            bgcolor: "#FBFBFB",
            borderRadius: 2,
            boxShadow: "none",
            border: "none",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            {serviceProvider == "non-professional" && productName != "" ? (
              <>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "#989898",
                      mb: 0.5,
                    }}
                  >
                    Product
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    {productName}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "0.0625rem",
                    bgcolor: "grey.300",
                    my: 0.5,
                  }}
                />
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "#989898",
                      mb: 0.5,
                    }}
                  >
                    Quantity
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    {quantity}
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "#989898",
                      mb: 0.5,
                    }}
                  >
                    Valuation
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "1.125rem",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      color: "primary.normal",
                      fontWeight: 500,
                    }}
                  >
                    €{valuation}
                  </Typography>
                </Box>
              </>
            )}
            <Box
              sx={{
                width: "0.0625rem",
                bgcolor: "grey.300",
                my: 0.5,
              }}
            />
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "#989898",
                  mb: 0.5,
                }}
              >
                Job Date
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "primary.normal",
                  fontWeight: 500,
                }}
              >
                {selectedDate} {getMonthName(currentMonth).substring(0, 3)}
              </Typography>
            </Box>
            <Box
              sx={{
                width: "0.0625rem",
                bgcolor: "grey.300",
                my: 0.5,
              }}
            />
            <Box sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "#989898",
                  mb: 0.5,
                }}
              >
                Job Time
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.125rem",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "primary.normal",
                  fontWeight: 500,
                }}
              >
                {selectedTime.hour}:{selectedTime.minute} {selectedTime.period}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Typography
          sx={{
            mb: 2,
            fontSize: "1.125rem",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: "#555555",
            fontWeight: 600,
          }}
        >
          Service description
        </Typography>
        <Box
          sx={{
            mb: 3,
            border: "0.0625rem solid",
            borderColor: "#D5D5D5",
            borderRadius: "0.75rem",
            p: 2,
            bgcolor: "#FFFFFF",
            minHeight: "120px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              lineHeight: "150%",
              letterSpacing: "0%",
              color: "#424242",
              whiteSpace: "pre-wrap",
            }}
          >
            {serviceDescription || "No description provided"}
          </Typography>
        </Box>

        {serviceProvider == "non-professional" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 3,
              width: "100%",
            }}
          >
            {/* Job Photos Section */}
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                  fontWeight: 600,
                }}
              >
                Job photos
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                {descriptionFiles.length > 0 ? (
                  descriptionFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        height: "10.438rem",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        position: "relative",
                        border: "none",
                      }}
                    >
                      {file.type.startsWith("image/") &&
                      descriptionFilePreviews[index] ? (
                        <Image
                          src={descriptionFilePreviews[index]}
                          alt={`Job photo ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "text.secondary", py: 2 }}>
                    No photos uploaded
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Product Images Section */}
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  mb: 2,
                  fontSize: "1.125rem",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#555555",
                  fontWeight: 600,
                }}
              >
                Product Images
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: { xs: "wrap", md: "nowrap" },
                }}
              >
                {barterPhotoFiles.length > 0 ? (
                  barterPhotoFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: "100%",
                        height: "10.438rem",
                        borderRadius: "0.75rem",
                        overflow: "hidden",
                        position: "relative",
                        border: "none",
                      }}
                    >
                      {file.type.startsWith("image/") &&
                      barterPhotoFilePreviews[index] ? (
                        <Image
                          src={barterPhotoFilePreviews[index]}
                          alt={`Product photo ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "text.secondary",
                              fontSize: "0.875rem",
                            }}
                          >
                            {file.name}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "text.secondary", py: 2 }}>
                    No product photos uploaded
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {descriptionFiles.length > 0 ? (
              descriptionFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    width: "calc(50% - 0.5rem)",
                    minWidth: "200px",
                    height: "10.438rem",
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                    position: "relative",
                    border: "none",
                  }}
                >
                  {file.type.startsWith("image/") &&
                  descriptionFilePreviews[index] ? (
                    <Image
                      src={descriptionFilePreviews[index]}
                      alt={`Job photo ${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "grey.100",
                      }}
                    >
                      <Typography
                        sx={{ color: "text.secondary", fontSize: "0.875rem" }}
                      >
                        {file.name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "text.secondary", py: 2 }}>
                No photos uploaded
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Dialog
        open={open && !showSuccess}
        onClose={() => {
          resetForm();
          onClose();
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
            maxWidth: "42.438rem",
          },
        }}
      >
        <DialogContent
          sx={{
            p: "2.5rem",
            position: "relative",
            overflowY: "auto",
            maxHeight: "calc(90vh - 64px)",
            // Hide scrollbar but keep scrolling functionality
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari, Edge
            },
            msOverflowStyle: "none", // IE and Edge
          }}
        >
          {(serviceProvider == "non-professional" && currentStep != 6) ||
          (serviceProvider != "non-professional" && currentStep != 5) ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: "2rem",
              }}
            >
              <Typography
                sx={{
                  // mb: "2rem",
                  color: "primary.normal",
                  lineHeight: "1.5rem",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                Create A Service Request
              </Typography>
              <Box
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                sx={{
                  pr: 0,
                  cursor: "pointer",
                }}
              >
                <CloseIcon />
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "left",
                justifyContent: "space-between",
                mb: "2rem",
              }}
            >
              <Typography
                sx={{
                  color: "primary.normal",
                  fontSize: "1.5rem",
                  lineHeight: "2rem",
                  fontWeight: 700,
                }}
              >
                Preview
              </Typography>
              <Box
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                sx={{
                  pr: 0,
                  cursor: "pointer",
                }}
              >
                <CloseIcon />
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.200",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#2F6B8E",
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  ml: 2,
                  minWidth: 50,
                  textAlign: "right",
                  color: "#2F6B8E",
                }}
              >
                {progress}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ minHeight: 400, mb: 4 }}>{renderStepContent()}</Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: currentStep === 1 ? "center" : "space-between",
              gap: 2,
            }}
          >
            {currentStep === 1 ? null : (serviceProvider ==
                "non-professional" &&
                currentStep != 6) ||
              (serviceProvider != "non-professional" && currentStep != 5) ? (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{
                  borderColor: "#2F6B8E",
                  color: "#2F6B8E",
                  textTransform: "none",
                  pt: "0.625rem",
                  pr: "3.75rem",
                  pb: "0.625rem",
                  pl: "3.75rem",
                }}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={() => setCurrentStep(1)}
                sx={{
                  borderColor: "#2F6B8E",
                  color: "#2F6B8E",
                  textTransform: "none",
                  pt: "0.625rem",
                  pr: "3.75rem",
                  pb: "0.625rem",
                  pl: "3.75rem",
                }}
              >
                Edit
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                uploading ||
                (currentStep === 1 && !serviceProvider) ||
                (currentStep === 2 &&
                  (!selectedCategory || !selectedService)) ||
                (currentStep === 3 &&
                  (!serviceDescription || descriptionFiles.length === 0)) ||
                (currentStep === 4 &&
                  serviceProvider === "professional" &&
                  (!valuation || valuation.trim() === "")) ||
                (currentStep === 5 &&
                  serviceProvider === "non-professional" &&
                  (!productName || barterPhotoFiles.length === 0))
              }
              sx={{
                bgcolor: "#214C65",
                textTransform: "none",
                pt: "0.625rem",
                pr: "3.75rem",
                pb: "0.625rem",
                pl: "3.75rem",
                "&:hover": {
                  bgcolor: "#25608A",
                },
              }}
            >
              {uploading
                ? "Submitting..."
                : currentStep ===
                    (serviceProvider === "non-professional" ? 6 : 5)
                  ? "Submit"
                  : "Next"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          resetForm();
          onClose();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            textAlign: "center",
            p: 4,
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            <Box
            // sx={{
            //   width: 200,
            //   height: 200,
            //   position: "relative",
            //   mb: 2,
            // }}
            >
              <Image
                src="/icons/thankyou.png"
                alt="Thank You"
                width={372}
                height={332}
              />
            </Box>
            <Typography
              sx={{
                mb: 1,
                color: "#939393",
                fontSize: "1.125rem",
                lineHeight: "1.75rem",
                fontWeight: 600,
              }}
            >
              Great job! Your request is now submitted successfully.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
