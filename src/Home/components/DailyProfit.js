import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

const CardWrapper = styled("div")(({ theme }) => ({
  maxWidth: 400,
  margin: "100px auto 24px auto",
  padding: "29px",
  background: theme.palette.primary.main,
  borderRadius: "5px",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
}));

export default function DailyProfit() {
  const { t, i18n } = useTranslation();

  return (
    <CardWrapper>
        <Typography variant="h5" textAlign="center" color="black">
          {t("Juicy 8% Daily Earnings!")}
        </Typography>
    </CardWrapper>
  );
}
