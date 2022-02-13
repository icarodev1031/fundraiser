import React, {useState, useEffect} from "react"
import FactoryContract from "./contracts/FundraiserFactory.json"
import getWeb3 from "./utils/getWeb3"
import "./App.css"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import NewFundraiser from './NewFundraiser';
import Home from './Home'
import Web3 from 'web3'

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root:{
    flexGrow:1
  }
})
const App=()=>{
  const [state,setState] = useState({web3:null,accounts:null, contract:null});
  const [storageValue, setStorageValue] =useState(0);
  const classes = useStyles();

  useEffect(()=>{
    const init = async()=>{
      try{
        const web3 = await getWeb3();
        // const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FactoryContract.abi,
          deployedNetwork && deployedNetwork.address
        )
        console.log(deployedNetwork)
        console.log(accounts)
        setState({web3, accounts, contract:instance})
      }catch(error){
        alert(
          ` 12123Failed to load web3, accounts, or contract.
          Check console for details1.`
        )
        console.error(error);
      }
    }
    init();
  },[]);
  
  return (
    <Router>
        <AppBar position = "static" color="default">
          <Toolbar>
            <Typography varient="h6" color="inherit">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </Typography>
            <NavLink className="nav-link" to="/new/">New</NavLink>
          </Toolbar>
        </AppBar>
        <Route path="/" exact component={Home} />
        <Route path="/new/" component={NewFundraiser} />
    </Router>
  )
}

export default App;