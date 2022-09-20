import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Connect from "./Connect";
import Grid from "@mui/material/Grid";

import { Link } from 'react-router-dom'
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi"
import { useAuthContext } from "../../providers/AuthProvider";

const Wrapper = styled("div")(({ theme }) => ({
  // position: "fixed",
  // zIndex: "40",
  // left: 0,
  // top: 0,
  // right: 0,
  // background: "white",
  // boxShadow: 'rgba(33, 35, 38, 0.1) 0px 10px 10px -10px',
  marginTop: "70px",
  [theme.breakpoints.down("md")]: {
    h5: {
      fontSize: 20,
      margin: 0,
    },
  },
}));

const AdvPanel = styled("div")(({ theme }) => ({
  background: theme.palette.purple.main,
  textAlign: 'center',
  color: 'white',
  padding: '10px 0 10px 0'
}));

const Item = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0 20px 0',
  textAlign: 'center',
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

const ItemConnect = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: '20px 0 20px 0',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  [theme.breakpoints.down("md")]: {
    padding: '10px 0',
    display: 'none'
  },
}));

export default function Header() {
  const [mobile, setMobile] = useState(false);
  const { address, loading, connect, disconnect } = useAuthContext();
  
  return (
    <Wrapper>
      <Grid container spacing={2}>
        <Grid item xs={9} sm={6} md={3}>
          <Item>
            <Typography variant="h5" textAlign="center" color='#f3ba2f'>
            </Typography>
          </Item>
        </Grid>
        <Grid className="header_menu" item xs={0} sm={0} md={6}>
        </Grid>
        <Grid item xs={3} sm={6} md={3} sx={{alignSelf:"center"}}>
          <ItemConnect>
            <Connect />
          </ItemConnect>
          <div
            className="mobile_btn"
            style={{fontSize:"50px"}}
            onClick={() => {
              address ? disconnect() : connect();
            }}
          >
            <GiHamburgerMenu/>
           </div>
        </Grid>
      </Grid>
    </Wrapper>
  );
}
