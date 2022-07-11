import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import { BigNumber } from 'ethers';

task("accounts" , "Print the list of accounts with their balance" , async(taskArgs , hre) => {
  const accounts  = await hre.ethers.getSigners()

  for(const account of accounts){
    const address = await account.getAddress();
    let balance : string | BigNumber = await account.getBalance();
    balance   = hre.ethers.utils.formatEther(balance);
    console.log(address , ":" , balance);
  }
})

const config: HardhatUserConfig = {
  solidity: '0.8.9',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    ropsten : {
      url : "https://ropsten.infura.io/v3/1582cf6ef03a4b6aba1ee2081e4e63d6",
      accounts : ["c40656fc764ad0dadaef75308e3619e0c7c6812923f8d436fdcc630513cd42d3"]
    }
  },
}

export default config
