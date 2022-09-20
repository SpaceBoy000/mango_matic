import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

const CardWrapper = styled("div")(({ theme }) => ({
  maxWidth: 400,
  margin: "0 auto",
  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  overflow: "hidden",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  borderRadius: "5px",
  // background: theme.palette.purple.main,
  background: "#8247e5",
  marginBottom: 24,
}));



export default function NutritionFacts() {
  const { t, i18n } = useTranslation();

  const nutritionFacts = [
    {
      label: t("Maximum Daily Return"),
      value: 8,
    },
    {
      label: t("APR"),
      value: "2,920",
    },
    {
      label: t("Dev Fee"),
      value: 8,
    },
  ];

  return (
    <CardWrapper>
      <CardContent>
        <Typography variant="h5" color="white" borderBottom="6px solid" paddingBottom={1}>
          {t("MangoMatic Details")}
        </Typography>
        <Box paddingTop={2}>
          {nutritionFacts.map((f) => (
            <Grid container key={f.label} justifyContent="space-between">
              <Typography variant="body1" gutterBottom >
                {f.label}
              </Typography>
              <Typography gutterBottom >{f.value}%</Typography>
            </Grid>
          ))}
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
