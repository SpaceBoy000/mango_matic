import { styled } from "@mui/system";

import Header from "./components/Header";
import BakeCard from "./components/BakeCard";
import NutritionFacts from "./components/NutritionFacts";
import ReferralLink from "./components/ReferralLink";
import { useAuthContext } from "../providers/AuthProvider";
import Footer from "./components/Footer";
import DailyProfit from "./components/DailyProfit";
import Social from "./components/Social";
import Description from "./components/Description";
import MiningTimer from "./components/MiningTimer";
import BackBrand from "./components/BackBrand";



const Wrapper = styled("div")(({ theme }) => ({
  // maxWidth: 400,
  margin: "0 auto",
  // display: "flex",
  // flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

export default function Home() {
  const { address } = useAuthContext();
  return (
    <Wrapper>
        <DailyProfit />
        <BakeCard />
        <NutritionFacts />
        <Social />
        <div style={{width:"100%", height:"100vh"}}></div>
    </Wrapper>
  );
}
