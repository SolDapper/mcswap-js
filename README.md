# mcswap-js
Javascript SDK for the McSwap OTC Protocol

### OTC Trade Contract Functionality

Create, Cancel, Execute, Fetch Sent, Fetch Received

### Supported Standards

• SPL (+Token Extentions)

• NFT (+Token Extentions)

• pNFT (Default Rules)

• cNFT

• Core

# Install SDK
```javascript
npm i mcswap-js
```

# Import SDK
```javascript
import mcswap from 'mcswap-js';
```

# Params
```javascript
// create new params object
const params = {"rpc":"your helius rpc endpoint"} 
// false = you're expecting a normal signable transaction
// true = you're expecting base64 for a Blink
params.blink = false; // (omit||default = false)
// false = you're passing fractionalized units when creating
// true = you're passing decimal values when creating
params.convert = false; // (omit||default = false)
// Fee Priority Options = VeryHigh, High, Medium, Low, Min
params.priority = "Low"; // (omit||default = "Low")
```

# Simple NFT Sale
Selling a Core NFT for 1.0 SOL

Every OTC Contract has a "seller" and a "buyer"
```javascript
import mcswap from 'mcswap-js'; // import module
const params = {"rpc":"your helius rpc endpoint"} // create new params object
params.blink = false; // return signable tx
params.convert = true; // use decimals instead of fractional units
params.priority = "Medium"; // fee priority
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // seller wallet
params.sellerMint = "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"; // seller nft
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // buyer wallet
params.lamports = 1.0; // SOL - using decimals via convert
const tx = await mcswap.coreCreate(params); // build the tx
const signed = await provider.signTransaction(tx); // sign the tx
const signature = await mcswap.send(signed); // send the tx
const status = await mcswap.status(signature,10,2); // wait for finalization
if(status!="finalized"){console.log({"status":"error","message":status});return;}
console.log({"status":"ok","message":"contract created!"});
```

# Non-Fungible Assets
Sell a Non-Fungible Asset for one or more of the following:

• A NFT of the same Standard

• A SPL or Token2022 Token

• SOL

### Create Contract
```javascript
params.blink = true;
params.convert = true;
params.priority = "Medium";
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.sellerMint = "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"; // required
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required
params.buyerMint = "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP"; // optional
params.lamports = 0.0001; // optional
params.tokenMint = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"; // optional
params.units = 1.0; // optional
const tx = await mcswap.coreCreate(params);
```

### Cancel Contract (only the seller can cancel)
```javascript
params.blink = true;
params.priority = "Medium";
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.sellerMint = "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"; // required
params.buyerMint = "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP"; // omit if no nft was requested
const tx = await mcswap.coreCancel(params);
```

### Execute Contract (only the buyer can execute)
```javascript
params.blink = true;
params.priority = "Medium";
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required
params.sellerMint = "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"; // required
params.buyerMint = "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP"; // omit if no nft was requested
const tx = await mcswap.coreExecute(params);
```

### Fetch Sent Contracts
```javascript
params.wallet = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required seller wallet
params.display = true; // optional convert units to decimals in response
const coreSent = await mcswap.coreSent(params);
```

### Fetch Received Contracts
```javascript
params.wallet = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required buyer wallet
params.display = true; // optional convert units to decimals in response
const coreReceived = await mcswap.coreReceived(params);
```

# Fungible Assets
Sell one or two Fungible Assets for one or two other Fungible Assets

A "seller" can not sell SOL, but can request it from the "buyer"

### Create Contract
```javascript
params.blink = true;
params.convert = false;
params.priority = "Medium";
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.buyer = "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ"; // required
params.token1Mint = "CKfatsPMUf8SkiURsDXs7eK6GWb4Jsd6UDbs7twMCWxo"; // required
params.token1Amount = 1000; // required
params.token2Mint = "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3"; // optional/omit
params.token2Amount = 10000000000; // optional/omit
params.token3Mint = "11111111111111111111111111111111"; // required - if requesting SOL it must be in pos 3
params.token3Amount = 1000000; // required
params.token4Mint = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"; // optional/omit
params.token4Amount = 100000; // optional/omit
const tx = await mcswap.splCreate(params);
```

### Cancel Contract (only the seller can cancel)
```javascript
params.blink = true;
params.priority = "Medium";
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required
const tx = await mcswap.splCancel(params);
```

### Execute Contract (only the buyer can execute)
```javascript
params.blink = true;
params.priority = "Medium";
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required
const tx = await mcswap.splExecute(params);
```

### Fetch Sent Contracts
```javascript
params.wallet = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required seller wallet
params.display = true; // optional convert units to decimals in response
const splSent = await mcswap.splSent(params);
```

### Fetch Received Contracts
```javascript
params.wallet = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required buyer wallet
params.display = true; // optional convert units to decimals in response
const splReceived = await mcswap.splReceived(params);
```

# Fees
The following fetches the current protocol fees
```javascript
// Get PIKL fee for the McSwap SPL txs (Fungible)
params.standard = "spl";
console.log(await mcswap.fee(params));
// Get SOL fee for McSwap NFT txs (Non-Fungible)
params.standard = "nft";
console.log(await mcswap.fee(params));
params.standard = "cnft";
console.log(await mcswap.fee(params));
params.standard = "pnft";
console.log(await mcswap.fee(params));
params.standard = "core";
console.log(await mcswap.fee(params));
```