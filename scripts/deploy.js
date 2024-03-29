const ethers = require('ethers');
const solc = require('solc');
const fs = require('fs');
require("dotenv").config({ path: ".env" });

async function deploy(inputSources,contractFileName,contractName,argsArray)
 {
  const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_TESTNET_RPC_URL);
 

  const input = {
    language: 'Solidity',
    sources: {...inputSources},
    settings: {
      outputSelection: { '*': { '*': ['*'] } },
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  };
  
  var { contracts } = JSON.parse(solc.compile(JSON.stringify(input)))
  var cont = contracts[contractFileName][contractName];
   const bytecode = cont.evm.bytecode.object;

const abi = cont.abi
 // Use your wallet's private key to deploy the contract
  const privateKey = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY;
  const wallet = new ethers.Wallet(privateKey, provider)

  //Deploy the contract
  const factory = new ethers.ContractFactory(abi, bytecode, wallet)
  if (Array.isArray(argsArray) && argsArray.length > 0)
  {   
    const contract = await factory.deploy(...argsArray);
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
  }
  else
  {
    const contract = await factory.deploy();
    await contract.deployed();
    console.log(`Deployment successful! Contract Address: ${contract.address}`);
    }
  
  /*
    send the data in the following object with format 

   ({
    'contract1.sol': { content: contract1 },
    'contract2.sol': { content: contract2 },
    'contarct3.sol': { content: contract3 }
  }, name of the main contract file , Name of The main contract)

  */
  
}

deploy({
  'Token.sol': { content: fs.readFileSync('/home/axat/per/deployment-script/Contract-Deployment-Script/contracts/Token.sol', 'utf8') },
}, "Token.sol", "Token");