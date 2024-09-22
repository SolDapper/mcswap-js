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
```

# Fungible Assets
Sell a Fungible Asset
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
## Example Response
```javascript
{
  status: 'ok',
  message: 'success',
  transaction: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAFDGFbWFPwChAAIrtoWArBs6Se/MageZ+Cttqxq7jzQ0gTjQOnQpEIn0twCuI+PIRR9bpEjLSo/5gShDaaHNbr9Q12zXUl4xmWuJwDltYE/d68ZpfawHuqnnkh0LYbGHERAjzp0mdpvAgCG4...'
}
```












# Non-Fungible Assets
Sell a Non-Fungible Asset