import * as React from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { MdQuestionAnswer } from 'react-icons/md';
import Close from "@mui/icons-material/Close";
import { Grid, IconButton, Typography } from "@mui/material";
import faqs from "../assets/faqs.json";


const CardWrapper = styled("div")({
  maxWidth: 400,
  margin: "0 auto",
});


const DevilButton = styled(Button)(({ theme }) => ({
  "&:disabled": { background: 'rgba(0, 0, 0, 0.12)' },
  borderRadius: 5,
  background: "linear-gradient(159deg, rgb(255, 244, 39) 0%, rgb(255, 61, 61) 84%, rgb(255, 61, 61) 100%)",
  color: "black",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  maxHeight: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 4,
  py: 6,
  borderRadius: 8,
  overflow: "auto",
};

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <CardWrapper>
      <DevilButton
        variant="contained"
        fullWidth
        style={{ marginTop: 12 }}
        onClick={handleOpen}
        startIcon={<MdQuestionAnswer />}
      >
        {t("FAQS")}
      </DevilButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="scrollbox">
          <Grid container spacing={2} direction="column" position="relative">
            {faqs.map((faq, index) => (
              <Grid item key={faq.q}>
                <Typography variant="h5" gutterBottom>
                  {index + 1}: {faq.q}
                </Typography>
                <Typography variant="body1">{faq.a}</Typography>
              </Grid>
            ))}
            <IconButton
              color="primary"
              style={{ position: "absolute", right: -25, top: -24 }}
              onClick={handleClose}
            >
              <Close />
            </IconButton>
          </Grid>
        </Box>
      </Modal>
    </CardWrapper>
  );
}
