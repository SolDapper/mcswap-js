# mcswap-js
Javascript SDK for the McSwap OTC Protocol

Every OTC Contract has a "seller" and a "buyer"

A "seller" can not sell SOL, but can request it from the "buyer".

# Import SDK
(npm option coming soon)
```javascript
import mcswap from './mcswap.js';
const rpc = "your helius rpc endpoint";
const params = {"rpc":rpc}
```

# Special Params
```javascript
// false = you're expecting a normal signable transaction
// true = you're expecting base64 for a Blink
params.blink = true; // (omit||default = false)
// false = you're passing fractionalized units
// true = you're passing decimal values
params.convert = false; // (omit||default = false)
// Fee Priority Options = VeryHigh, High, Medium, Low, Min
params.priority = "Low"; // (omit||default = "Low")
```

# Non-Fungible Assets
Sell a Non-Fungible Asset for one or more of the following:

• A NFT of the same Standard

• A SPL or Token2022 Token

• SOL

```javascript
params.convert = true;
params.blink = true;
params.seller = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // required
params.sellerMint = "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi"; // required
params.buyer = "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"; // required
params.buyerMint = "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP"; // optional
params.lamports = 0.0001; // optional
params.tokenMint = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"; // optional
params.units = 1.0; // optional
const tx = await mcswap.coreCreate(params);
```

Example Response
```javascript
{
  status: 'ok',
  message: 'success',
  transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAFDGFbWFPwChAAIrtoWArBs6Se/MageZ+Cttqxq7jzQ0gTjQOnQpEIn0twCuI+PIRR9bpEjLSo/5gShDaaHNbr9Q12zXUl4xmWuJwDltYE/d68ZpfawHuqnnkh0LYbGHERAjzp0mdpvAgCG4...'
}
```

# Fungible Assets
Sell one or two Fungible Assets for one or two other Fungible Assets
```javascript
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

Example Response
```javascript
{
  status: 'ok',
  message: 'success',
  transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAFDGFbWFPwChAAIrtoWArBs6Se/MageZ+Cttqxq7jzQ0gTjQOnQpEIn0twCuI+PIRR9bpEjLSo/5gShDaaHNbr9Q12zXUl4xmWuJwDltYE/d68ZpfawHuqnnkh0LYbGHERAjzp0mdpvAgCG4...'
}
```