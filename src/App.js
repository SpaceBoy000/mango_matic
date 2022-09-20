import Box from "@mui/material/Box";
import { BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import Home from "./Home";
import Layout from "./Layout";
import { Suspense } from "react";
import "./i18n";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="loading">
        <Box>
          <Layout>
            <Routes>
              {/* <Route exact path="/" element={ <Navigate to="/miner"/> }/> */}
              <Route exact path="/" element={ <Home /> }/>
            </Routes>
          </Layout>
        </Box>
      </Suspense>
    </BrowserRouter >
  );
}

export default App;
