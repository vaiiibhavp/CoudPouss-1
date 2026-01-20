import { formatDate, formatTime } from "@/utils/utils";
import { Box, Typography } from "@mui/material";
import Image from "next/image";

export interface ServiceDetail {
  service_id: string;
  category_info: {
    category_id: string;
    category_name: {
      name: string;
      logo_url: string;
    };
  };
  subcategory_info: {
    sub_category_id: string;
    sub_category_name: {
      name: string;
      img_url: string;
    };
  };
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
  location: string;
}
interface ServiceDetailInfo {
  service?: ServiceDetail;
}
export const CancelServiceSuccess = ({ service }: ServiceDetailInfo) => {
  console.log("service", service);

  if (!service) return null;
  const { category_info, subcategory_info, date, location, service_id, time } =
    service;
  return (
    <Box
      width={"100%"}
      sx={{
        border: "1px solid #E6E6E6",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
      }}
    >
      <Typography
        fontWeight={600}
        fontSize={{ xs: 14, sm: 18 }}
        textAlign={"left"}
      >
        {subcategory_info.sub_category_name.name}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          bgcolor: "#EAF0F3",
          p: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
          borderRadius: {
            xs: "0.75rem",
            sm: "0.875rem",
            md: "1rem",
          },
          rowGap: { xs: "0.5rem", sm: "0.625rem", md: "0.75rem" },
          columnGap: { xs: 1.5, sm: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <Image
            src="/icons/Calendar.png"
            alt="Calendar"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
            sizes="(max-width: 600px) 18px, 24px"
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.8125rem",
                md: "0.875rem",
              },
              lineHeight: {
                xs: "1rem",
                sm: "1.0625rem",
                md: "1.125rem",
              },
              letterSpacing: "0%",
              color: "#2C6587",
              fontWeight: 400,
            }}
          >
            {formatDate(date)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <Image
            src="/icons/Clock.png"
            alt="Time"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
            sizes="(max-width: 600px) 18px, 24px"
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.8125rem",
                md: "0.875rem",
              },
              lineHeight: {
                xs: "1rem",
                sm: "1.0625rem",
                md: "1.125rem",
              },
              letterSpacing: "0%",
              color: "#2C6587",
              fontWeight: 400,
            }}
          >
            {formatTime(time)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
          }}
        >
          <Image
            src="/icons/fi_6374086.png"
            alt="Category"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
            sizes="(max-width: 600px) 18px, 24px"
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.8125rem",
                md: "0.875rem",
              },
              lineHeight: {
                xs: "1rem",
                sm: "1.0625rem",
                md: "1.125rem",
              },
              letterSpacing: "0%",
              color: "#2C6587",
              fontWeight: 400,
            }}
          >
            {category_info.category_name.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.75, sm: 1 },
            minWidth: 0,
          }}
        >
          <Image
            src="/icons/MapPin.png"
            alt="Location"
            width={20}
            height={20}
            style={{ width: "auto", height: "auto" }}
            sizes="(max-width: 600px) 18px, 24px"
          />
          <Typography
            sx={{
              fontSize: {
                xs: "0.75rem",
                sm: "0.8125rem",
                md: "0.875rem",
              },
              lineHeight: {
                xs: "1rem",
                sm: "1.0625rem",
                md: "1.125rem",
              },
              letterSpacing: "0%",
              color: "#2C6587",
              fontWeight: 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
            title={location} // tooltip on hover (desktop)
          >
            {location}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
