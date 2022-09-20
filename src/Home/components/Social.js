import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import auditLogo from "../../assets/audit.svg";
import contract from "../../assets/polygonscan.svg";

const CardWrapper = styled("div")(({ theme }) => ({
  maxWidth: 400,
  margin: "0 auto",
  transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  overflow: "hidden",
  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
  borderRadius: "5px",
  background: theme.palette.primary.main,
  marginBottom: 24,
}));

const SocialText = styled('span')(({ theme }) => ({
  color: 'black',// theme.typography.allVariants.color,
  marginTop: '3px',
  marginLeft: '5px',
}));


export default function Social() {
  const { t, i18n } = useTranslation();

  return (
    <CardWrapper>
      <CardContent>
        <Typography variant="h5" borderBottom="2px solid" color="black" sx={{display:"flex", justifyContent:"space-between"}}>
          <span>Links & Social Media</span>
          {/* <a href="https://www.encryptosecurity.com/AuditRecord?project=53#ETHSnowball" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <img src={auditLogo} alt="audit" width="120px"/>
          </a> */}
        </Typography>
        <Box paddingTop={2} sx={{ display: 'flex', justifyContent: 'space-around'}}>

          <a href="https://t.me/" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <i className='fa fa-telegram' style={{color: '#000', fontSize: '26px'}}></i>
            <SocialText>Telegram</SocialText>
          </a>
          <a href="https://twitter.com/" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <i className='fa fa-twitter' style={{color: '#000', fontSize: '26px'}}></i>
            <SocialText>Twitter</SocialText>
          </a>
          <a href="" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <i className='fa fa-book' style={{color: '#000', fontSize: '26px'}}></i>
            <SocialText>Docs</SocialText>
          </a>
        </Box>
        <Box paddingTop={2} sx={{ display: 'flex', justifyContent: 'space-around'}}>
          <a href="" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <span>
            <img className="u-sm-avatar" src={auditLogo} alt="Polygon" style={{width: '26px'}}></img>
            </span>
            <SocialText>Audit &nbsp;</SocialText>
          </a>
          <a href="" target="_blank" style={{color: 'inherit', textDecoration: 'inherit', display: 'flex', alignItems: 'center'}}>
            <span>
            <img className="u-sm-avatar" src={contract} alt="Polygon" style={{width: '26px'}}></img>
            </span>
            <SocialText>Contract &nbsp;</SocialText>
          </a>
        </Box>
      </CardContent>
    </CardWrapper>
  );
}
