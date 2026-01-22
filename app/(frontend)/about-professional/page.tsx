import {
  Box,
  Avatar,
  Typography,
  Divider,
  Rating,
  LinearProgress,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ratingBar = (label: string, value: number) => (
  <Box key={label} sx={{ mb: 1 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography fontSize={13}>{label}</Typography>
      <Typography fontSize={13}>{value}</Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value * 20}
      sx={{
        height: 6,
        borderRadius: 10,
        bgcolor: "#F1F5F9",
        "& .MuiLinearProgress-bar": {
          borderRadius: 10,
        },
      }}
    />
  </Box>
);

export default function ProfessionalDetails() {
  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: "28px",
        border: "1px solid #EAF5F4",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", gap: 2 ,p:1,alignItems:'center'}}>
        <IconButton sx={{ p: 0 }}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <Typography
          fontSize={{ xs: 16, sm: 20 }}
          fontWeight={600}
          color="#323232"
        >
          About professional
        </Typography>
      </Box>
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #EAF5F4",
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* Avatar + Name */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ width: { xs: 64, sm: 80 }, height: { xs: 64, sm: 80 } }}
            />

            <Box>
              <Typography fontWeight={600} fontSize={{ xs: 16, sm: 18 }}>
                Bessie Carter
              </Typography>
              <Typography fontSize={13} color="text.secondary">
                Professional User • Manchester, Kentucky
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Box
            sx={{
              ml: { md: "auto" },
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 120px)",
              },
              gap: 1.5,
              mt: { xs: 2, md: 0 },
            }}
          >
            {[
              { label: "Overall rating", value: "4.6" },
              { label: "Certified", value: "Yes" },
              { label: "Clients", value: "14" },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  border: "1px solid #BECFDA",
                  borderRadius: "6.68px",
                  p: "8px 12px",
                  textAlign: "center",
                }}
              >
                <Typography fontWeight={700} fontSize={16} color="#1D7885">
                  {item.value}
                </Typography>
                <Typography fontSize={12} color="#214C65">
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* INFO */}
      <Box
        sx={{
          borderRadius: "12px",
          border: "1px solid #EAF5F4",
          p: 2,
          display: "flex",
          gap: 2,
          flexDirection: "column",
        }}
      >
        {/* Bio */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#2C6587">
            Public Profile Details
          </Typography>

          <Typography color="#939393" fontSize={14} fontWeight={600} mt={1}>
            Bio
          </Typography>

          <Typography fontSize={14} fontWeight={600} color="text.secondary">
            With a passion for home improvement, I have dedicated over 8 years
            to perfecting my craft. My expertise spans plumbing, TV mounting,
            and precise installations. I pride myself on delivering quality
            service with attention to detail.
          </Typography>
        </Box>

        {/* Experience */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#939393">
            Experience & Specialization
          </Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>
            • TV mounting (walls, shelves, mirrors) • Plumbing installations &
            repairs • Smart home setups • Artwork and furniture mounting
          </Typography>
        </Box>
        {/* Achievements */}
        <Box sx={{}}>
          <Typography fontWeight={600} color="#939393">
            Achievements
          </Typography>
          <Typography fontSize={14} color="text.secondary" mt={1}>
            • TV mounting (walls, shelves, mirrors) • Plumbing installations &
            repairs • Smart home setups • Artwork and furniture mounting
          </Typography>
        </Box>
      </Box>

      {/* Images */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={500} mb={1} color="#2C6587">
          Images of Past Works
        </Typography>

        <Grid container spacing={2}>
          {[1, 2].map((i) => (
            <Grid item xs={6} key={i}>
              <Box
                sx={{
                  height: 255,
                  width: 385,
                  borderRadius: 2,
                  bgcolor: "#E5E7EB",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Ratings */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={600} mb={2} color="#2C6587">
          Customer Ratings
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap:2,alignItems:'end' }}>
              <Typography fontSize={32} fontWeight={600}>
                4.6
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Rating value={4.6} precision={0.1} readOnly />
                <Typography fontSize={12} color="text.secondary">
                  Based on 471 ratings
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            {ratingBar("Work quality", 4.9)}
            {ratingBar("Reliability", 4.9)}
            {ratingBar("Punctuality", 4.8)}
            {ratingBar("Solution", 5.0)}
            {ratingBar("Politeness", 4.5)}
          </Grid>
        </Grid>
      </Box>

      {/* Reviews */}
      <Box sx={{ borderRadius: "12px", border: "1px solid #EAF5F4", p: 2 }}>
        <Typography fontWeight={600} mb={2} color="#2C6587">
          Recent Works & Reviews
        </Typography>

        <Grid container spacing={2}>
          {["John Doe", "Jane Smith", "Michael Johnson"].map((name) => (
            <Grid item xs={12} md={4} key={name}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography fontWeight={600}>{name}</Typography>
                    <Rating value={5} size="small" readOnly />
                  </Box>
                  <Typography fontSize={13} color="text.secondary" mt={1}>
                    Excellent service, professional work, and on-time delivery.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
