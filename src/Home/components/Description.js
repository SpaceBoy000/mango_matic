import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { Toast } from "../../utils"
import { config } from "../../config";

const CardWrapper = styled("div")(({ theme }) => ({
  margin: "0 auto 24px auto",
  padding: "29px",
}));

const CardWrapper2 = styled(Card)(({ theme }) => ({
  // background: theme.palette.purple.main,
  background: "#f3ba2f",
  borderRadius: "0.5rem",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  padding: "12px",
  maxWidth: "540px",
  transition: '0.5s',
}));

const CardWrapper3 = styled(Card)(({ theme }) => ({
  // background: theme.palette.purple.main,
  background: "#f3ba2f",
  borderRadius: "0.5rem",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  padding: "12px",
  width: "1096px",
  transition: '0.5s',
}));

const CustomCardHeader = styled(Typography)(({ theme }) => ({
  marginBottom: '16px',
  // textDecoration: "underline",
  // textDecorationColor: "#0abcf9",
  textDecorationThickness: "2px",
  textUnderlinePosition: "under",
  color: theme.typography.allVariants.color,
  fontSize: '30px'
}))

const UnderlineTypography = styled(Typography)(({ theme }) => ({
  textDecoration: "underline",
  textDecorationColor: "#0abcf9",
  textDecorationThickness: "1px",
  textUnderlinePosition: "under",
  cursor: 'pointer'
}))



export default function Description({ address }) {
  const { t, i18n } = useTranslation();

  const link = `${window.origin}?ref=${address}`;

  const copyToClipboard = str => {
    navigator.clipboard.writeText(str);
    Toast.fire({
      icon: 'success',
      title: "Copied to clipboard!"
    });
  };

  return (
    <CardWrapper>
      <Grid item xs={12} sm={12} md={12}>
        <Grid
          container
          justifyContent="center"
          columns={12}
          spacing={2}
          sx={{
            textAlign: 'left',
          }}
        >
          <Grid item xs={12} sm={12} md={12}>
            <Grid
              container
              justifyContent="center"
              columns={12}
              spacing={2}
              sx={{
                textAlign: 'left',
              }}
            >
              <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'end' }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ display: 'flex', justifyContent: 'end' }}
                >
                  <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CardWrapper2>
                      <CustomCardHeader variant="body4">
                        {`How does it work?`}
                      </CustomCardHeader>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        The BlockMiner is a DAPP built on the BSC and part of the Gold Yuga Labs.
                        The goal of the game is to build your GOLDBALL faster than other players. 
                        In return, you'll earn more BNB. 
                        These golds allow you to get a daily yield of up to 3% of your golds' value.
                        The first 5,000 users will have access to NFT Freemint's whitelist of our Gold Yuga Labs.
                      </Typography>
                    </CardWrapper2>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'end' }}>
                    <CardWrapper2>
                      <CustomCardHeader variant="body4">
                        {`Verified Public Contract`}
                      </CustomCardHeader>
                      <Typography variant="body2" sx={{ mt: 2 }}>
                        <span>BlockMiner contract is visible to
                        anyone and it had been verified. Check
                        it on </span>
                        <a href={ config.scanLink } target="_blank" style={{color: 'white'}}>
                        {/* <a href={ "" } target="_blank" style={{color: 'white'}}> */}
                          BSC Scan
                        </a>
                        .
                      </Typography>
                    </CardWrapper2>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={6} sx={{ display: 'flex', justifyContent: 'start' }}>
                <CardWrapper2>
                  <CustomCardHeader variant="body4">
                    {`BlockMiner`}
                  </CustomCardHeader>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    BlockMiner is becoming the greatest community on BSC providing the highest sustainable returns possible.
                    To start generating $BNB you need to purchase "Gold" using $BNB. The more Golds you have, the more $BNB you generate. More Golds mean a higher personal TVL.
                    When you have Golds generating $BNB, you have to compound at least 6 times before claiming your $BNB. If you don't respect this rule, you will face a 50% penalty fee on your reward balance.
                    This penalty fee stays in the TVL and doesn't move from the contract and this feature is to ensure the longevity of the project.
                    Your Golds will generate 5% interest of your total TVL.
                    Your Golds will work for you indefinitely, and the more Golds you accumulate, the more $BNB you'll can.
                  </Typography>
                </CardWrapper2>
              </Grid>

            </Grid>
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CardWrapper3>
              <CustomCardHeader variant="body4">
                {`Referrals`}
              </CustomCardHeader>
              <Typography variant="body2" sx={{ mt: 2, paddingBottom: 2 }}>
                Earn 5% of the BNB used to buy Snows from anyone who uses your referral link:
              </Typography>
              <Box sx={{border:"solid 2px white", width:"fit-content", padding:"10px"}}>
                <Typography variant="body2" sx={{cursor:"pointer"}} onClick={() => copyToClipboard(link)}>
                  {
                    address ?
                      `${link} (Click to copy)`
                      : 'Please connect your wallet to see your referral link.'
                  }
                </Typography>
              </Box>
            </CardWrapper3>
          </Grid> */}
        </Grid>

      </Grid>

    </CardWrapper>
  );
}
