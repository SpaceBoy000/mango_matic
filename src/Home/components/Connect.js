import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { styled } from "@mui/system";

import { useAuthContext } from "../../providers/AuthProvider";
// import DropdownLanguage from "./DropdownLanguage";
import { useTranslation } from "react-i18next";

const ConnectButton = styled('button')(({ theme }) => ({
  "&:disabled": { background: 'rgba(0, 0, 0, 0.12)', color: 'rgb(150, 150, 150) !important' },
  borderRadius: "1.25rem",
  border: 'none',
  paddingLeft: "1.75rem",
  paddingRight: "1.75rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  fontSize: "1rem",
  lineHeight: "1.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  // background: theme.button.primary.main,
  background: "#f3ba2f",
  maxHeight: "40px",
  marginTop: "auto",
  marginBottom: "auto",
  color: theme.typography.allVariants.color,
  [theme.breakpoints.down("lg")]: {
    
  },
}));

const SmallScreenConnectButton = styled(Button)(({ theme }) => ({
  display: "none",
  marginTop: -24,
  marginBottom: 48,
  width: "95%",
  marginLeft: "auto",
  marginRight: "auto",
  borderRadius: 5,
  background: "linear-gradient(159deg, rgb(255, 244, 39) 0%, rgb(255, 61, 61) 84%, rgb(255, 61, 61) 100%)",
  boxShadow: "rgb(0 0 0 / 59%) 6px 6px 20px 6px",
  color: "white",
  [theme.breakpoints.down("lg")]: {
    display: "block",
  },
}));

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export default function Connect({ responsive = true }) {
  const { address, loading, connect, disconnect } = useAuthContext();
  const { t, i18n } = useTranslation();

  return responsive ? (
    <>
      <ConnectButton
        color="secondary"
        variant="contained"
        disabled={loading}
        onClick={() => (address ? disconnect() : connect())}
      >
        {address ? shorten(address) : t("Connect")}
      </ConnectButton>
      {/* <LanguageButton>
        <DropdownLanguage />
      </LanguageButton> */}
    </>
  ) : (
    <>
      <SmallScreenConnectButton
        color="secondary"
        variant="contained"
        disabled={loading}
        onClick={() => (address ? disconnect() : connect())}
      >
        {address ? t("Disconnect") : t("Connect")}
      </SmallScreenConnectButton>
      {/* <SmallScreenLanguageButton>
        <DropdownLanguage />
      </SmallScreenLanguageButton> */}
    </>
  );
}
