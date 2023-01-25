const ethers = require('ethers');
const solc = require('solc');
const fs = require('fs');
//const walletGen = require(walletGen.js)
require("dotenv").config({ path: ".env" });
(async (inputSources,contractFileName,contractName,argsArray) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_TESTNET_RPC_URL);
 // var contractSupply = fs.readFileSync(pathToContract);
//   const scContent = fs.readFileSync('/home/axat/per/wallet/Wallet-Node/contracts/SupplyChain.sol', 'utf8'); /* PATH TO CONTRACT */
// const mappingContent = fs.readFileSync('/home/axat/per/wallet/Wallet-Node/contracts/Mapping.sol', 'utf8'); /* PATH TO CONTRACT */
// const structContent = fs.readFileSync('/home/axat/per/wallet/Wallet-Node/contracts/Struct.sol', 'utf8'); /* PATH TO CONTRACT */
//   // contractSupply = contractSupply.toString();
  //console.log(contractSupply.toString());

  const input = {
    language: 'Solidity',
    sources: {...inputSources},
    settings: {
      //version :"0.8.0",
      outputSelection: { '*': { '*': ['*'] } },
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  };
  
  var { contracts } = JSON.parse(solc.compile(JSON.stringify(input)))
  //console.log(contracts);
  //console.log(contractName);
  var cont = contracts[contractFileName][contractName];
  //console.log(cont);
   const bytecode = cont.evm.bytecode.object;
 //  console.log(bytecode);
//   // console.log(bytecode);

const abi = cont.abi

 //console.log(abi);
//   //  const walletGen = ethers.Wallet.createRandom()
  
//   // Use your wallet's private key to deploy the contract
  const privateKey = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider)

  //Deploy the contract
  const factory = new ethers.ContractFactory(abi, bytecode, wallet)
  if (Array.isArray(argsArray) && argsArray.length > 0)
  {   
    //console.log(...argsArray);
    const contract = await factory.deploy(...argsArray);
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
  }
  else
  {
    //console.log("REACHED ;oskofk---------------------------------------------------------")
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    }
  
})({
    'Token.sol': { content: fs.readFileSync('/home/axat/per/deployment-script/Contract-Deployment-Script/contracts/Token.sol', 'utf8') },
    },"Token.sol","Token")