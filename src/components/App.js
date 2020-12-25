import React, { Component } from 'react'
import Navbar from './Navbar'
import Main from './Main.js'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import EDTxToken from '../abis/EDTxToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Hey Bruv, Non-Ethereum browser detected.  You gotta consider getting MetaMask!')
    }
  }

  // Actually don't know why this can be loaded out of order with above
  async loadBlockchainData() {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    console.log(accounts) // <- prints array to console
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()
    console.log(networkId) // loads network id Metamask is using

    // Loading DaiToken contract
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
      console.log({ balance: daiTokenBalance })
    } else {
      window.alert('DaiToken contract not deployed to detected Network Bruv')
    }

    // Loading EDTxToken contract
    const eDTxTokenData = EDTxToken.networks[networkId]
    if (eDTxTokenData) {
      const eDTxToken = new web3.eth.Contract(EDTxToken.abi, eDTxTokenData.address)
      this.setState({ eDTxToken })
      let eDTxTokenBalance = await eDTxToken.methods.balanceOf(this.state.account).call()
      this.setState({ eDTxTokenBalance: eDTxTokenBalance.toString() })
      console.log({ balance: eDTxTokenBalance })
    } else {
      window.alert('EDTxToken contract not deployed to detected Network Bruv')
    }

    // Loading TokenFarm contract
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
      console.log({ stakingBalance: stakingBalance })
    } else {
      window.alert('TokenFarm contract not deployed to detected Network Bruv')
    }

    this.setState({ loading: false })
    console.log('Loading Complete 🤖')
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unStakeTokens = () => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      // Initializing values
      account: 'Pls install MetaMask',
      daiToken: {},
      eDTxToken: {},
      tokenFarm: {},
      // From User
      daiTokenBalance: '0',
      eDTxTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    if(this.state.loading) {
      content = <p id = "loader" className = "text-center">Loading Bro...</p>
    } else {
      content = <Main 
        daiTokenBalance = {this.state.daiTokenBalance}
        eDTxTokenBalance = {this.state.eDTxTokenBalance}
        stakingBalance = {this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unStakeTokens = {this.unStakeTokens}
      />
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
