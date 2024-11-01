// name: mcswap.js
// author: @SolDapper
// license: MIT https://github.com/SolDapper/mcswap-js/blob/main/LICENSE
'use strict';
import { PublicKey, Keypair, Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, ComputeBudgetProgram, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import * as solanaAccountCompression from "@solana/spl-account-compression";
import BufferLayout from "@solana/buffer-layout";
import * as splToken from "@solana/spl-token";
import bs58 from 'bs58';
import BN from "bn.js";
const publicKey=(property="publicKey")=>{return BufferLayout.blob(32,property);}
const uint64=(property="uint64")=>{return BufferLayout.blob(8,property);}
class mcswap {
    constructor(){
        this.NAME = "McSwap Javascript SDK";
        this.PRIORITY = "Low";
        this.TREASURY = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu";
        this.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        this.BUBBLEGUM_PROGRAM_ID = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
        this.CORE_PROGRAM_ID = "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
        this.CNFT_STATIC_ALT = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
        this.SPL_STATIC_ALT = "DnDkh579fNnBFUwLDeQWgfW6ukLMyt8DgLaVDVwecxmj";
        this.NFT_STATIC_ALT = "BT4AUPXSxvbDrzSt3LLkE3Jd5s8R3fBSxJuyicyEMYH3";
        this.PNFT_STATIC_ALT = "F33TuQuCtiSpTjsCv4h51E2q48Wt5tyr469Lxb4Mgazu";
        this.MCSWAP_CNFT_PROGRAM = "6RUcK9T1hYAZGBxN82ERVDUi4vLAX4hN1zAyy3cU5jav";
        this.MCSWAP_NFT_PROGRAM = "AyJBbGQzUQSvhivZnHMDCCk6eSLupkeBh4fvMAD8T4Xx";
        this.MCSWAP_PNFT_PROGRAM = "2bY36scRMEUJHJToVGjJ2uY8PdSrRPr73siNwGbv1ZNT";
        this.MCSWAP_CORE_PROGRAM = "EYMc51BuTRTfc5XCYqSWW92risZvMP217N2VYaTdFMHh";
        this.MCSWAP_SPL_PROGRAM = "AAyM7XH9w7ApeSuEat8AwUW1AA7dBuj2vXv7SuUGpNUp";
        this.PIKL_MINT_ADDR = "AVm6WLmMuzdedAMjpXLYmSGjLLPPjjVWNuR6JJhJLWn3";
        this.SPL_ATA_PROGRAM_ID = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        this.MPL_RULES_PROGRAM_ID = "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg";
        this.MPL_RULES_ACCT = "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9";
        this.PROGRAM_STATE_CNFT = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            BufferLayout.u8("dev_percentage"),
            publicKey("dev_treasury"),
            publicKey("mcdegens_treasury"),
        ]);
        this.PROGRAM_STATE_NFT = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            BufferLayout.u8("dev_percentage"),
            publicKey("dev_treasury"),
            publicKey("mcdegens_treasury"),
        ]);
        this.PROGRAM_STATE_SPL = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            publicKey("pickle_mint"),
            uint64("fee_chips"),
            BufferLayout.u8("dev_percentage"),
            publicKey("dev_treasury"),
            publicKey("mcdegens_treasury"),
        ]);
        this.PROGRAM_STATE_PNFT = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            BufferLayout.u8("dev_percentage"),
            publicKey("dev_treasury"),
            publicKey("mcdegens_treasury"),
        ]);
        this.PROGRAM_STATE_CORE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            BufferLayout.u8("dev_percentage"),
            publicKey("dev_treasury"),
            publicKey("mcdegens_treasury"),
        ]);
        this.SWAP_CNFT_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"), 
            publicKey("initializer"),
            publicKey("delegate"),
            publicKey("asset_id"),
            publicKey("merkle_tree"),
            publicKey("root"),
            publicKey("data_hash"),
            publicKey("creator_hash"),
            uint64("nonce"),
            publicKey("swap_asset_id"),
            publicKey("swap_merkle_tree"),
            publicKey("swap_root"),
            publicKey("swap_data_hash"),
            publicKey("swap_creator_hash"),
            uint64("swap_nonce"),
            publicKey("swap_leaf_owner"),
            publicKey("swap_delegate"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
        ]);
        this.SWAP_NFT_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_mint"),
            publicKey("temp_mint_account"),
            publicKey("taker"),
            publicKey("swap_mint"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
        ]);
        this.SWAP_SPL_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            publicKey("initializer"),
            publicKey("token1_mint"),
            uint64("token1_amount"),
            publicKey("temp_token1_account"),
            publicKey("token2_mint"),
            uint64("token2_amount"),
            publicKey("temp_token2_account"),
            publicKey("taker"),
            publicKey("token3_mint"),
            uint64("token3_amount"),
            publicKey("token4_mint"),
            uint64("token4_amount"),
        ]);
        this.SWAP_PNFT_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_mint"),
            publicKey("taker"),
            publicKey("swap_mint"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
        ]);
        this.SWAP_CORE_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_asset"),
            publicKey("taker"),
            publicKey("swap_asset"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
        ]);
    }
    async fetch(_data_){
    try{
        const _result_={}
        if(typeof _data_.standard=="undefined"){_result_.status="error";_result_.message="requires standard parameter";return;}
        let PROGRAM;
        let STATE;
        let NAME;
        const connection=new Connection(_data_.rpc,"confirmed");
        if(_data_.standard=="spl"){
            PROGRAM = this.MCSWAP_SPL_PROGRAM;
            STATE = this.SWAP_SPL_STATE;
            NAME = "swap-state";
            if(typeof _data_.seller=="undefined"||_data_.seller==""||typeof _data_.buyer=="undefined"||_data_.buyer==""){
                _result_.status="error";
                _result_.message="seller and buyer required";
                return _result_;
            }
            const STATE_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME),new PublicKey(_data_.seller).toBytes(),new PublicKey(_data_.buyer).toBytes()],new PublicKey(PROGRAM));
            const SWAP_STATE=await connection.getAccountInfo(new PublicKey(STATE_PDA[0]));
            const encoded=SWAP_STATE.data;
            const decoded=STATE.decode(encoded);
            _result_.seller=(new PublicKey(decoded.initializer)).toString();
            _result_.buyer=(new PublicKey(decoded.taker)).toString();
            _result_.token1Mint=(new PublicKey(decoded.token1_mint)).toString();
            _result_.token2Mint=(new PublicKey(decoded.token2_mint)).toString();
            _result_.token3Mint=(new PublicKey(decoded.token3_mint)).toString();
            _result_.token4Mint=(new PublicKey(decoded.token4_mint)).toString();
            _result_.token1Amount=new BN(decoded.token1_amount, 10, "le");
            _result_.token2Amount=new BN(decoded.token2_amount, 10, "le");
            _result_.token3Amount=new BN(decoded.token3_amount, 10, "le");
            _result_.token4Amount=new BN(decoded.token4_amount, 10, "le");
            _result_.token1Amount=parseInt(_result_.token1Amount);
            _result_.token2Amount=parseInt(_result_.token2Amount);
            _result_.token3Amount=parseInt(_result_.token3Amount);
            _result_.token4Amount=parseInt(_result_.token4Amount);
            if(typeof _data_.display!="undefined"&&_data_.display===true){
                const token1Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token1Amount,"mint":_result_.token1Mint,"display":_data_.display});
                const token2Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token2Amount,"mint":_result_.token2Mint,"display":_data_.display});
                const token3Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token3Amount,"mint":_result_.token3Mint,"display":_data_.display});
                const token4Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token4Amount,"mint":_result_.token4Mint,"display":_data_.display});
                _result_.token1Amount=token1Amount.data;
                _result_.token2Amount=token2Amount.data;
                _result_.token3Amount=token3Amount.data;
                _result_.token4Amount=token4Amount.data;
                _result_.token1Symbol=token1Amount.symbol;
                _result_.token2Symbol=token2Amount.symbol;
                _result_.token3Symbol=token3Amount.symbol;
                _result_.token4Symbol=token4Amount.symbol;
                _result_.token1Decimals=token1Amount.decimals;
                _result_.token2Decimals=token2Amount.decimals;
                _result_.token3Decimals=token3Amount.decimals;
                _result_.token4Decimals=token4Amount.decimals;
            }
            return _result_;
        }
        else{
            if(_data_.standard=="nft"){
                PROGRAM = this.MCSWAP_NFT_PROGRAM;
                STATE = this.SWAP_NFT_STATE;
                NAME = "swap-state";
            }
            else if(_data_.standard=="cnft"){
                PROGRAM = this.MCSWAP_CNFT_PROGRAM;
                STATE = this.SWAP_CNFT_STATE;
                NAME = "cNFT-swap";
            }
            else if(_data_.standard=="pnft"){
                PROGRAM = this.MCSWAP_PNFT_PROGRAM;
                STATE = this.SWAP_PNFT_STATE;
                NAME = "swap-state";
            }
            else if(_data_.standard=="core"){
                PROGRAM = this.MCSWAP_CORE_PROGRAM;
                STATE = this.SWAP_CORE_STATE;
                NAME = "swap-state";
            }
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111"}
            const STATE_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(PROGRAM));
            const SWAP_STATE=await connection.getAccountInfo(STATE_PDA[0]).catch(function(){});
            const encoded=SWAP_STATE.data;
            const decoded=STATE.decode(encoded);
            if(_data_.standard=="core"){
                _result_.sellerMint=new PublicKey(decoded.initializer_asset).toString();
                _result_.buyerMint=new PublicKey(decoded.swap_asset).toString();
            }
            else if(_data_.standard=="cnft"){
                _result_.sellerMint=new PublicKey(decoded.asset_id).toString();
                _result_.buyerMint=new PublicKey(decoded.swap_asset_id).toString();
            }
            else{
                _result_.sellerMint=new PublicKey(decoded.initializer_mint).toString();
                _result_.buyerMint=new PublicKey(decoded.swap_mint).toString();
            }
            if(_data_.standard=="cnft"){
                _result_.buyer=new PublicKey(decoded.swap_leaf_owner).toString();
            }
            else{
                _result_.buyer=new PublicKey(decoded.taker).toString();
            }
            _result_.seller=new PublicKey(decoded.initializer).toString();
            _result_.lamports=parseInt(new BN(decoded.swap_lamports,10,"le"));
            _result_.tokenMint=new PublicKey(decoded.swap_token_mint).toString();
            _result_.units=parseInt(new BN(decoded.swap_tokens,10,"le"));
            if(typeof _data_.display!="undefined"&&_data_.display===true){
                const lamports=await this.convert({"rpc":_data_.rpc,"amount":_result_.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                const units=await this.convert({"rpc":_data_.rpc,"amount":_result_.units,"mint":_result_.tokenMint,"display":_data_.display});
                _result_.lamports=lamports.data;
                _result_.units=units.data;
                _result_.symbol=units.symbol;
                _result_.decimals=units.decimals;
            }
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async splCreate(_data_){
    try{
        if(typeof _data_.convert!="undefined"&&_data_.convert===true){
            if(typeof _data_.token1Amount!="undefined"&&_data_.token1Amount>0){
                const amount_1 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token1Amount,"mint":_data_.token1Mint});
                _data_.token1Amount = parseInt(amount_1.data);
            }
            if(typeof _data_.token2Amount!="undefined"&&_data_.token2Amount>0){
                const amount_2 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token2Amount,"mint":_data_.token2Mint});
                _data_.token2Amount = parseInt(amount_2.data);
            }
            if(typeof _data_.token3Amount!="undefined"&&_data_.token3Amount>0){
                const amount_3 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token3Amount,"mint":_data_.token3Mint});
                _data_.token3Amount = parseInt(amount_3.data);
            }
            if(typeof _data_.token4Amount!="undefined"&&_data_.token4Amount>0){
                const amount_4 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token4Amount,"mint":_data_.token4Mint});
                _data_.token4Amount = parseInt(amount_4.data);
            }
        } 
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const _response_ = {};

        if(_data_.seller==_data_.buyer){
            const _error_ = {}
            _error_.status="error";
            _error_.message="buyer seller wallet conflict";
            return _error_;
        }

        const connection = new Connection(_data_.rpc, "confirmed");
        const seller = new PublicKey(_data_.seller);
        const buyer = new PublicKey(_data_.buyer);

        let meta_data;
        let response;
        let token1Mint = "11111111111111111111111111111111";
        let token2Mint = "11111111111111111111111111111111";
        let token3Mint = "11111111111111111111111111111111";
        let token4Mint = "11111111111111111111111111111111";
        let token1Amount = 0;
        let token2Amount = 0;
        let token3Amount = 0;
        let token4Amount = 0;

        token1Mint = _data_.token1Mint;
        token1Amount = _data_.token1Amount;

        if(typeof _data_.token2Mint!="undefined" && _data_.token2Mint!=false){
            token2Mint=_data_.token2Mint;
            token2Amount=_data_.token2Amount;
        }

        token3Mint = _data_.token3Mint;
        token3Amount = _data_.token3Amount;

        if(typeof _data_.token4Mint!="undefined" && _data_.token4Mint!=false){
            token4Mint=_data_.token4Mint;
            token4Amount=_data_.token4Amount;
        }

        let is_22_1 = false;
        let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token1Mint}})});
        meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions!="undefined"){
            SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
            is_22_1 = true;
        }

        let is_22_2 = false;
        let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
        if(token2Mint!="11111111111111111111111111111111"){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token2Mint}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions!="undefined"){
                SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
                is_22_2 = true;
            }
        }

        let is_22_3 = false;
        let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
        if(token3Mint!="11111111111111111111111111111111"){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token3Mint}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions!="undefined"){
                SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
                is_22_3 = true;
            }
        }

        let is_22_4 = false;
        let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
        if(token4Mint!="11111111111111111111111111111111"){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token4Mint}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
                is_22_4 = true;
            }
        }

        const tokenSwapProgramId = new PublicKey(this.MCSWAP_SPL_PROGRAM);
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],tokenSwapProgramId);
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        });     

        let pickleMint = null;
        let feeChips = null;
        let devTreasury = null;
        let mcDegensTreasury = null;
        // let temp_rent = null;
        if (programState != null) {
          const encodedProgramStateData = programState.data;
          const decodedProgramStateData = this.PROGRAM_STATE_SPL.decode(encodedProgramStateData);
          pickleMint = new PublicKey(decodedProgramStateData.pickle_mint);
          feeChips = new BN(decodedProgramStateData.fee_chips, 10, "le");
          devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
          mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        } 
        else {
          const _error_ = {}
          _error_.status="error";
          _error_.message="Program State Not Initialized!";
          return _error_;
        }

        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],tokenSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),seller.toBytes(),buyer.toBytes()],tokenSwapProgramId);

        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0]);
        if(swapState!=null){
            const _error_ = {}
            _error_.status="error";
            _error_.message="pending contract for these two parties already exist";
            return _error_;
        }

        const providerPickleATA = await splToken.getAssociatedTokenAddress(new PublicKey(pickleMint),seller,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);

        // token 1 ***************************************************************************
        let extensionTypes_1 = [];
        const tempToken1Account = new Keypair();
        let transferFeeBasisPoints_1 = null;
        let providerToken1ATA = null;
        if (token1Amount > 0) {
          providerToken1ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token1Mint),seller,false,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          const mintAccountInfo_1 = await splToken.getMint(connection,new PublicKey(token1Mint),"confirmed",SPL_PROGRAM_1);
          if(is_22_1===true){
            extensionTypes_1 = splToken.getExtensionTypes(mintAccountInfo_1.tlvData);
            if(extensionTypes_1.includes(1)){
              let extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig,mintAccountInfo_1.tlvData);    
              const data_1 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
              transferFeeBasisPoints_1 = data_1.newerTransferFee.transferFeeBasisPoints;
            }
          }
        }
        // token 1 ***************************************************************************

        // token 2 ***************************************************************************
        let extensionTypes_2 = [];
        const tempToken2Account = new Keypair();
        let transferFeeBasisPoints_2 = null;
        let providerToken2ATA = new PublicKey("11111111111111111111111111111111");
        if (token2Amount > 0) {
          providerToken2ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token2Mint),seller,false,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          const mintAccountInfo_2 = await splToken.getMint(connection,new PublicKey(token2Mint),"confirmed",SPL_PROGRAM_2);
          if(is_22_2===true){
            extensionTypes_2 = splToken.getExtensionTypes(mintAccountInfo_2.tlvData);
            if(extensionTypes_2.includes(1)){
              let extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig,mintAccountInfo_2.tlvData);    
              const data_2 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
              transferFeeBasisPoints_2 = data_2.newerTransferFee.transferFeeBasisPoints;
            }
          }
        }
        // token 2 ***************************************************************************

        let accountInfo = null;

        // token 3 ***************************************************************************
        let createToken3ATA = null;
        let createToken3ATAIx = null;
        let token3ATA = null;
        if (token3Mint != "11111111111111111111111111111111") {
          token3ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token3Mint),seller,false,SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          accountInfo = await connection.getAccountInfo(token3ATA);
          if (accountInfo == null) {
            createToken3ATA = true;
            createToken3ATAIx = splToken.createAssociatedTokenAccountInstruction(seller,token3ATA,seller,new PublicKey(token3Mint),SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          } else {
            createToken3ATA = false;
          }
        }
        // token 3 ***************************************************************************

        // token 4 ***************************************************************************
        let createToken4ATA = false;
        let createToken4ATAIx = null;
        let token4ATA = null;
        accountInfo = null;
        if (token4Amount > 0) {
          token4ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token4Mint),seller,false,SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          accountInfo = await connection.getAccountInfo(token4ATA);
          if (accountInfo == null) {
            createToken4ATA = true;
            createToken4ATAIx = splToken.createAssociatedTokenAccountInstruction(seller,token4ATA,seller,new PublicKey(token4Mint),SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
          } else {
            createToken4ATA = false;
          }
        }
        // token 4 ***************************************************************************

        // data ******************************************************************************
        let totalSize = 1 + 32 + 8 + 8 + 32 + 8 + 32 + 8;    
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 0; // 0 = token_swap InitializeSwap instruction
        let arr;
        let byte;
        let byteArray;
        let index;
        let takerb58 = bs58.decode(buyer.toString());
        arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }
        // data ******************************************************************************
        
        // token 1 ***************************************************************************
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        let token1;
        if(extensionTypes_1.includes(1)){
          token1 = token1Amount - (token1Amount * (transferFeeBasisPoints_1 / 100 / 100));
          for ( index = 0; index < byteArray.length; index ++ ) {
            byte = token1 & 0xff;
            byteArray [ index ] = byte;
            token1 = (token1 - byte) / 256 ;
          }
        }
        else{
          token1 = token1Amount;
          for (index = 0; index < byteArray.length; index++) {
            byte = token1 & 0xff;
            byteArray[index] = byte;
            token1 = (token1 - byte) / 256;
          }
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }        
        // token 1 ***************************************************************************

        // token 2 ***************************************************************************
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        let token2;
        if(extensionTypes_2.includes(1)){
          token2 = token2Amount - (token2Amount * (transferFeeBasisPoints_2 / 100 / 100));
          for ( index = 0; index < byteArray.length; index ++ ) {
            byte = token2 & 0xff;
            byteArray [ index ] = byte;
            token2 = (token2 - byte) / 256 ;
          }
        }
        else{
          token2 = token2Amount;
          for (index = 0; index < byteArray.length; index++) {
            byte = token2 & 0xff;
            byteArray[index] = byte;
            token2 = (token2 - byte) / 256;
          }
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }
        // token 2 ***************************************************************************

        // token 3 ***************************************************************************
        let token3Mintb58 = bs58.decode(token3Mint);
        arr = Array.prototype.slice.call(Buffer.from(token3Mintb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (index = 0; index < byteArray.length; index++) {
          byte = token3Amount & 0xff;
          byteArray[index] = byte;
          token3Amount = (token3Amount - byte) / 256;
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }
        // token 3 ***************************************************************************

        // token 4 ***************************************************************************
        let token4Mintb58 = bs58.decode(token4Mint.toString());
        arr = Array.prototype.slice.call(Buffer.from(token4Mintb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (index = 0; index < byteArray.length; index++) {
          byte = token4Amount & 0xff;
          byteArray[index] = byte;
          token4Amount = (token4Amount - byte) / 256;
        }
        for (let i = 0; i < byteArray.length; i++) {
          uarray[counter++] = byteArray[i];
        }
        // token 4 ***************************************************************************

        // keys ******************************************************************************
        let keys = [
          { pubkey: seller, isSigner: true, isWritable: true }, // 0
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: new PublicKey(token1Mint), isSigner: false, isWritable: true }, // 4        
          { pubkey: tempToken1Account.publicKey, isSigner: true, isWritable: true }, // 5
          { pubkey: providerToken1ATA, isSigner: false, isWritable: true }, // 6 
          { pubkey: new PublicKey(token2Mint), isSigner: false, isWritable: true }, // 7
          { pubkey: tempToken2Account.publicKey, isSigner: true, isWritable: true }, // 8
          { pubkey: providerToken2ATA, isSigner: false, isWritable: true }, // 9 
          { pubkey: providerPickleATA, isSigner: false, isWritable: true }, // 10
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 11
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
          { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 14
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 15
        ];
        let initializeSwapIx = new TransactionInstruction({programId:tokenSwapProgramId,data:Buffer.from(uarray),keys:keys});
        // keys ******************************************************************************

        // lookup table **********************************************************************
        const lookupTable = new PublicKey(this.SPL_STATIC_ALT); // mainnet    
        const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
        if (!lookupTableAccount) {
          const _error_ = {}
          _error_.status="error";
          _error_.message="Could not fetch ALT!";
          return _error_;
        }
        // lookup table **********************************************************************        

        // instructions array ****************************************************************
        let instructions = null;
        if (token2Amount > 0) {
          if(createToken3ATA==true && createToken3ATA==true){instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];} 
          else if(createToken3ATA==true){instructions=[createToken3ATAIx,initializeSwapIx];} 
          else if(createToken4ATA==true){instructions=[createToken4ATAIx,initializeSwapIx];} 
          else{instructions=[initializeSwapIx];}
        } 
        else {
          if(createToken3ATA==true && createToken4ATA==true){instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];} 
          else if(createToken3ATA==true){instructions=[createToken3ATAIx,initializeSwapIx];} 
          else if(createToken4ATA==true){instructions=[createToken4ATAIx,initializeSwapIx];} 
          else {instructions=[initializeSwapIx]}
        }
        // instructions array ****************************************************************

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = [lookupTableAccount];  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;  
        return await this.tx(_tx_);
        // build transaction

    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async splExecute(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const _response_ = {};
        const connection = new Connection(_data_.rpc, "confirmed");
        const user_a_key = new PublicKey(_data_.seller);
        const user_b_key = new PublicKey(_data_.buyer);
        // programState
        let pickleMint = null;
        let feeChips = null;
        let devTreasury = null;
        let mcDegensTreasury = null;
        let programState = null;
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")], new PublicKey(this.MCSWAP_SPL_PROGRAM));
        programState = await connection.getAccountInfo(programStatePDA[0]);
        if (programState != null) {
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.PROGRAM_STATE_SPL.decode(encodedProgramStateData);
            pickleMint = new PublicKey(decodedProgramStateData.pickle_mint);
            feeChips = new BN(decodedProgramStateData.fee_chips, 10, "le");
            devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        } 
        else {
            _response_.status="error";
            _response_.message="Program State Not Initialized";
            return _response_;
        }
        // programState
        // swapVaultPDA
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.MCSWAP_SPL_PROGRAM));
        // swapVaultPDA
        // swapState
        const SPL_STATE_PDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),user_a_key.toBytes(),user_b_key.toBytes()],new PublicKey(this.MCSWAP_SPL_PROGRAM));
        let swapState=null;
        swapState = await connection.getAccountInfo(SPL_STATE_PDA[0]);
        let initializer = null;
        let token1Mint = null;
        let token1Amount = null;
        let tempToken1Account = null;
        let token2Mint = null;
        let token2Amount = null;
        let tempToken2Account = null;
        let taker = null
        let token3Mint = null;
        let token3Amount = null;
        let token4Mint = null;
        let token4Amount = null;
        if(swapState==null){
            const _error_ = {}
            _error_.status="error";
            _error_.message="only the buyer can execute.. dummy";
            return _error_;
        }
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_SPL_STATE.decode(encodedSwapStateData);
        initializer = new PublicKey(decodedSwapStateData.initializer);
        token1Mint = new PublicKey(decodedSwapStateData.token1_mint);
        token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le");
        tempToken1Account = new PublicKey(decodedSwapStateData.temp_token1_account);
        token2Mint = new PublicKey(decodedSwapStateData.token2_mint);
        token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le");
        tempToken2Account = new PublicKey(decodedSwapStateData.temp_token2_account);
        taker = new PublicKey(decodedSwapStateData.taker);
        token3Mint = new PublicKey(decodedSwapStateData.token3_mint);
        token3Amount = new BN(decodedSwapStateData.token3_amount, 10, "le");
        token4Mint = new PublicKey(decodedSwapStateData.token4_mint);
        token4Amount = new BN(decodedSwapStateData.token4_amount, 10, "le");
        token1Amount = parseInt(token1Amount);
        token2Amount = parseInt(token2Amount);
        token3Amount = parseInt(token3Amount);
        token4Amount = parseInt(token4Amount);
        // swapState
        // rent
        let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
        // rent
        // providerPickleATA
        let providerPickleATA = await splToken.getAssociatedTokenAddress(new PublicKey(this.PIKL_MINT_ADDR),user_b_key,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        // providerPickleATA
        // providerToken3ATA
        let createTempToken3AccountIx = null;
        let initTempToken3AccountIx = null;
        let transferToken3Ix = null;
        let meta_data;
        let response;
        let spl_symbol;
        let spl_decimals;
        let spl_amount;
        // token 3 **************************************************************
        let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
        if(token3Amount > 0){
        if(token3Mint.toString() == "11111111111111111111111111111111"){
        }
        else{
            response = await fetch(_data_.rpc, {method: 'POST',headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token3Mint.toString()}})
            });
            meta_data = await response.json();
            spl_symbol = meta_data.result.token_info.symbol;
            spl_decimals = parseInt(meta_data.result.token_info.decimals);
            spl_amount = parseInt(token3Amount);
            if(typeof meta_data.result.mint_extensions != "undefined"){
            SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            else{
            }
        }
        }
        let providerToken3ATA = providerPickleATA;
        if (token3Mint.toString() != "11111111111111111111111111111111") {
        providerToken3ATA = await splToken.getAssociatedTokenAddress(
            token3Mint,
            user_b_key,
            false,
            SPL_PROGRAM_3,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        }
        // token 3 **************************************************************
        // token 4 **************************************************************
        let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
        if(token4Amount > 0){
        response = await fetch(_data_.rpc, {method: 'POST',headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token4Mint.toString()}})
        });
        meta_data = await response.json();
        spl_symbol = meta_data.result.token_info.symbol;
        spl_decimals = parseInt(meta_data.result.token_info.decimals);
        spl_amount = parseInt(token4Amount);
        if(typeof meta_data.result.mint_extensions != "undefined"){
            SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        }
        let providerToken4ATA = providerToken3ATA;
        if (token4Mint.toString() != "11111111111111111111111111111111") {
        providerToken4ATA = await splToken.getAssociatedTokenAddress(
            token4Mint,
            user_b_key,
            false,
            SPL_PROGRAM_4,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        }
        // token 4 **************************************************************
        // token 1 **************************************************************
        let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
        if(token1Amount > 0){
        response = await fetch(_data_.rpc, {method: 'POST',headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token1Mint.toString()}})
        });
        meta_data = await response.json();
        spl_symbol = meta_data.result.token_info.symbol;
        spl_decimals = parseInt(meta_data.result.token_info.decimals);
        spl_amount = parseInt(token1Amount);
        if(typeof meta_data.result.mint_extensions != "undefined"){
            SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        }
        let createToken1ATA = null;
        let createToken1ATAIx = null;
        let token1ATA = await splToken.getAssociatedTokenAddress(
        token1Mint,
        user_b_key,
        false,
        SPL_PROGRAM_1,
        splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        let account_1 = null;
        account_1 = await connection.getAccountInfo(token1ATA).catch(function(error){});
        if (account_1 == null) {
        createToken1ATA = true;
        createToken1ATAIx = splToken.createAssociatedTokenAccountInstruction(
            user_b_key,
            token1ATA,
            user_b_key,
            token1Mint,
            SPL_PROGRAM_1,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,)
        }
        else{
        createToken1ATA = false;
        }
        // token 1 **************************************************************
        // token 2 **************************************************************
        let token2ATA = initializer;
        let createToken2ATA = null;
        let createToken2ATAIx = null;
        let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
        if(token2Amount > 0){
        response = await fetch(_data_.rpc, {method: 'POST',headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token2Mint.toString()}})
        });
        meta_data = await response.json();
        spl_symbol = meta_data.result.token_info.symbol;
        spl_decimals = parseInt(meta_data.result.token_info.decimals);
        spl_amount = parseInt(token2Amount);
        if(typeof meta_data.result.mint_extensions != "undefined"){
            SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        token2ATA = await splToken.getAssociatedTokenAddress(
            token2Mint,
            user_b_key,
            false,
            SPL_PROGRAM_2,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        let account_2 = null;
        account_2 = await connection.getAccountInfo(token2ATA).catch(function(error){});
        if (account_2 == null) {
            createToken2ATA = true;
            createToken2ATAIx = splToken.createAssociatedTokenAccountInstruction(
            user_b_key,
            token2ATA,
            user_b_key,
            token2Mint,
            SPL_PROGRAM_2,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,)
        }
        else{
            createToken2ATA = false;
        }
        }
        // token 2 **************************************************************
        // token 3 **************************************************************
        let token3ATA = initializer;
        if (token3Mint.toString() != "11111111111111111111111111111111") {
        token3ATA = await splToken.getAssociatedTokenAddress(
            token3Mint,
            initializer,
            false,
            SPL_PROGRAM_3,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
        );
        }
        // token 3 **************************************************************
        // token 4 **************************************************************
        let token4ATA = token3ATA;
        if (parseInt(token4Amount.toString()) > 0) {
        token4ATA = await splToken.getAssociatedTokenAddress(
            token4Mint,
            initializer,
            false,
            SPL_PROGRAM_4,
            splToken.ASSOCIATED_TOKEN_PROGRAM_ID, );
        }
        // token 4 **************************************************************
        let totalSize = 1;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 1; // 1 = swap instruction
        let keys = [
        { pubkey: user_b_key, isSigner: true, isWritable: true }, // 0
        { pubkey: initializer, isSigner: false, isWritable: true }, // 1
        { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
        { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 3
        { pubkey: SPL_STATE_PDA[0], isSigner: false, isWritable: true }, // 4
        { pubkey: tempToken1Account, isSigner: false, isWritable: true }, // 5
        { pubkey: tempToken2Account, isSigner: false, isWritable: true }, // 6
        { pubkey: providerToken3ATA, isSigner: false, isWritable: true }, // 7
        { pubkey: providerToken4ATA, isSigner: false, isWritable: true }, // 8
        { pubkey: token1ATA, isSigner: false, isWritable: true }, // 9
        { pubkey: token2ATA, isSigner: false, isWritable: true }, // 10
        { pubkey: token3ATA, isSigner: false, isWritable: true }, // 11
        { pubkey: token4ATA, isSigner: false, isWritable: true }, // 12
        { pubkey: token1Mint, isSigner: false, isWritable: true }, // 13 
        { pubkey: token2Mint, isSigner: false, isWritable: true }, // 14 
        { pubkey: token3Mint, isSigner: false, isWritable: true }, // 15 
        { pubkey: token4Mint, isSigner: false, isWritable: true }, // 16 
        { pubkey: providerPickleATA, isSigner: false, isWritable: true }, // 17
        { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 18
        { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 19 
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 20
        { pubkey: devTreasury, isSigner: false, isWritable: true }, // 21
        { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 22
        ];
        const swapTokensIx = new TransactionInstruction({programId:new PublicKey(this.MCSWAP_SPL_PROGRAM),data:Buffer.from(uarray),keys:keys});
        // static alt
        const lookupTable = new PublicKey(this.SPL_STATIC_ALT);
        let lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
        if (!lookupTableAccount) {
            _response_.status="error";
            _response_.message="Could not fetch static ALT!";
            return _response_;
        }
        // static alt
        // instructions
        let instructions = [];
        if (createToken1ATA == true && createToken2ATA) {
            instructions = [createToken1ATAIx,createToken2ATAIx,swapTokensIx];
        } 
        else if (createToken1ATA) {
            instructions = [createToken1ATAIx,swapTokensIx];
        } 
        else if (createToken2ATA) {
            instructions = [createToken2ATAIx,swapTokensIx];
        } 
        else {
            instructions = [swapTokensIx];
        }
        // instructions

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = user_b_key.toString();               
        _tx_.instructions = instructions;   
        _tx_.signers = false;               
        _tx_.table = [lookupTableAccount];  
        _tx_.tolerance = 1.2;               
        _tx_.priority = _data_.priority;  
        return await this.tx(_tx_); 
        // build transaction

    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async splCancel(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        let connection = new Connection(_data_.rpc, "confirmed");
        const user_a_key = new PublicKey(_data_.seller);
        const user_b_key = new PublicKey(_data_.buyer);
        const tokenSwapProgramId = new PublicKey(this.MCSWAP_SPL_PROGRAM);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], tokenSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"), user_a_key.toBytes(), user_b_key.toBytes()], tokenSwapProgramId);
        let swapState = null;
        swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){
            _response_.status="error";
            _response_.message="Contract Not Found!";
            return _response_;
        });

        if(swapState==null){
            const _error_ = {}
            _error_.status="error";
            _error_.message="only the seller can cancel.. dummy";
            return _error_;
        }

        let response = null;
        let meta_data = null;
        let spl_symbol = null;
        let spl_decimals = null;
        let spl_amount = null;

        let token1Mint = null;
        let token2Mint = null;
        let tempToken1Account = null;
        let tempToken2Account = null;
        let token1Amount = 0;
        let token2Amount = 0;
        
        let encodedSwapStateData = swapState.data;
        let decodedSwapStateData = this.SWAP_SPL_STATE.decode(encodedSwapStateData);
        token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le").toString();
        token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le").toString();
        token1Mint = new PublicKey(decodedSwapStateData.token1_mint);
        tempToken1Account = new PublicKey(decodedSwapStateData.temp_token1_account);
        token2Mint = new PublicKey(decodedSwapStateData.token2_mint);
        tempToken2Account = new PublicKey(decodedSwapStateData.temp_token2_account);

        let token1ATA;
        let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
        if(token1Amount > 0){
            response = await fetch(_data_.rpc, {method: 'POST',headers: {"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token1Mint.toString()}})});
            meta_data = await response.json();
            spl_symbol = meta_data.result.token_info.symbol;
            spl_decimals = parseInt(meta_data.result.token_info.decimals);
            spl_amount = parseInt(token1Amount);
            if(typeof meta_data.result.mint_extensions != "undefined"){
                SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            token1ATA = await splToken.getAssociatedTokenAddress(token1Mint,user_a_key,false,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        }
    
        let token2ATA = token1ATA;
        let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
        if(token2Amount > 0){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token2Mint.toString()}})});
            meta_data = await response.json();
            spl_symbol = meta_data.result.token_info.symbol;
            spl_decimals = parseInt(meta_data.result.token_info.decimals);
            spl_amount = parseInt(token2Amount);
            if(typeof meta_data.result.mint_extensions != "undefined"){
                SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            token2ATA = await splToken.getAssociatedTokenAddress(token2Mint,user_a_key,false,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        }
        
        const totalSize = 1 + 32;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 2; // 2 = token_swap ReverseSwap instruction
        const takerb58 = bs58.decode(user_b_key.toString());
        let arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
        for (let i = 0; i < arr.length; i++) {
          uarray[counter++] = arr[i];
        }
        const keys = [
          { pubkey: user_a_key, isSigner: true, isWritable: true }, // 0
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 1
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: token1Mint, isSigner: false, isWritable: true }, // 3
          { pubkey: tempToken1Account, isSigner: false, isWritable: true }, // 4
          { pubkey: token2Mint, isSigner: false, isWritable: true }, // 5
          { pubkey: tempToken2Account, isSigner: false, isWritable: true }, // 6
          { pubkey: token1ATA, isSigner: false, isWritable: true }, // 7
          { pubkey: token2ATA, isSigner: false, isWritable: true }, // 8
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 9
          { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 10
        ];
        const reverseSwapIx = new TransactionInstruction({programId:tokenSwapProgramId,data:Buffer.from(uarray),keys:keys});
        const instructions = [reverseSwapIx];

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = user_a_key.toString();        
        _tx_.instructions = instructions;
        _tx_.signers = false;               
        _tx_.table = false;  
        _tx_.tolerance = 1.2;               
        _tx_.priority = _data_.priority;    
        return await this.tx(_tx_);
        // build transaction

    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async splReceived(_data_){
    try{
        const _result_ = {}
        let connection = new Connection(_data_.rpc, "confirmed");
        const _wallet_ = new PublicKey(_data_.wallet);
        const wallet = _wallet_.toString();
        const SPL_ProgramId = new PublicKey(this.MCSWAP_SPL_PROGRAM);
        let SPL_RECEIVED = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:185,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              const decodedData = this.SWAP_SPL_STATE.decode(resultState.data);
              const acct = account.pubkey.toString();
              record.acct = acct;
              const initializer = new PublicKey(decodedData.initializer);
              record.seller = initializer.toString();
              const taker = new PublicKey(decodedData.taker);
              record.buyer = taker.toString();
              const utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.token_1_mint = new PublicKey(decodedData.token1_mint).toString();
              record.token_2_mint = new PublicKey(decodedData.token2_mint).toString();
              record.token_3_mint = new PublicKey(decodedData.token3_mint).toString();
              record.token_4_mint = new PublicKey(decodedData.token4_mint).toString();
              record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
              record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
              record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
              record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
              if(typeof _data_.display!="undefined"&&_data_.display===true){
                const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                record.token_1_amount = token_1_amount.data;
                record.token_2_amount = token_2_amount.data;
                record.token_3_amount = token_3_amount.data;
                record.token_4_amount = token_4_amount.data;
              }
              SPL_RECEIVED.push(record);
            }
            if(i == (accounts.length - 1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=SPL_RECEIVED;
                return _result_;
            } 
        }}
        else{
          _result_.status="ok";
          _result_.message="no contracts found";
          _result_.data=SPL_RECEIVED;
          return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async splSent(_data_){
    try{
        const _result_ = {}
        let connection = new Connection(_data_.rpc, "confirmed");
        const _wallet_ = new PublicKey(_data_.wallet);
        const wallet = _wallet_.toString();
        const SPL_ProgramId = new PublicKey(this.MCSWAP_SPL_PROGRAM);
        let SPL_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:9,bytes:wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
              const decodedData = this.SWAP_SPL_STATE.decode(resultState.data);
              const acct = account.pubkey.toString();
              record.acct = acct;
              const initializer = new PublicKey(decodedData.initializer);
              record.seller = initializer.toString();
              const taker = new PublicKey(decodedData.taker);
              record.buyer = taker.toString();
              const utime = new BN(decodedData.utime, 10, "le");
              record.utime = parseInt(utime.toString());
              record.token_1_mint = new PublicKey(decodedData.token1_mint).toString();
              record.token_2_mint = new PublicKey(decodedData.token2_mint).toString();
              record.token_3_mint = new PublicKey(decodedData.token3_mint).toString();
              record.token_4_mint = new PublicKey(decodedData.token4_mint).toString();
              record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
              record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
              record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
              record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
              if(typeof _data_.display!="undefined"&&_data_.display===true){
                const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                record.token_1_amount = token_1_amount.data;
                record.token_2_amount = token_2_amount.data;
                record.token_3_amount = token_3_amount.data;
                record.token_4_amount = token_4_amount.data;
              }
              SPL_SENT.push(record);
            }
            if(i == (accounts.length - 1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=SPL_SENT;
                return _result_;
            } 
        }}
        else{
          _result_.status="ok";
          _result_.message="no contracts found";
          _result_.data=SPL_SENT;
          return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async nftCreate(_data_){
    try{
        if(typeof _data_.convert!="undefined"&&_data_.convert===true){
            if(typeof _data_.lamports!="undefined"&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"11111111111111111111111111111111"});
                _data_.lamports = amount_a.data;
            }
            if(typeof _data_.units!="undefined"&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }
        }
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        let connection = new Connection(_data_.rpc, "confirmed");
        let isSwap = true;
        const mint = _data_.sellerMint;
        let swapMint = "11111111111111111111111111111111";
        if(typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}else{isSwap=false;}
        let taker = _data_.buyer;
        let swapLamports = 0;
        if(typeof _data_.lamports!="undefined" && _data_.lamports>0){swapLamports=parseInt(_data_.lamports);}
        let swapTokens = 0;
        let swapTokenMint = new PublicKey("11111111111111111111111111111111");
        if(typeof _data_.units!="undefined" && _data_.units>0){swapTokens=parseInt(_data_.units);swapTokenMint=new PublicKey(_data_.tokenMint);}
        const NFTSwapProgramId = new PublicKey(this.MCSWAP_NFT_PROGRAM);
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],NFTSwapProgramId);
        let programState = null;
        programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
        let devTreasury = null;
        let mcDegensTreasury = null;
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_NFT.decode(encodedProgramStateData);
        const usageFee = parseInt(new BN(decodedProgramStateData.fee_lamports, 10, "le").toString());
        devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new PublicKey(mint).toBytes(), new PublicKey(swapMint).toBytes()],NFTSwapProgramId);
        
        let response = null;
        let meta_data = null;

        let PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":mint}})});
        meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions != "undefined"){
            PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        // swapVaultATA
        const swapVaultATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);        
        const createSwapVaultATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapVaultATA,
        swapVaultPDA[0],new PublicKey(mint),PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        // swapVaultATA
        // providerMintATA
        const providerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        // providerMintATA

        let PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapMint}})});
        meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions != "undefined"){
            PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        // swapMintATA
        let createSwapMintATA = false;
        let swapMintATA = null;
        let createSwapMintATAIx = null;        
        if (swapMint != "11111111111111111111111111111111") {
          swapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.seller),false,PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          let response_a = null;
          response_a = await connection.getAccountInfo(swapMintATA).catch(function(){});
          if (response_a == null) {
            createSwapMintATA = true;
            createSwapMintATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapMintATA,
            new PublicKey(_data_.seller),new PublicKey(swapMint),PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
          }
        }
        // swapMintATA

        // swapTokenMint
        let createSwapTokenATA = false;
        let swapTokenATA = null;
        let createSwapTokenATAIx = null;        
        if(swapTokenMint.toString() != "11111111111111111111111111111111"){
            let PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            let response_b = null;
            response_b = await connection.getAccountInfo(swapTokenATA).catch(function(error){});
            if (response_b == null) {
                createSwapTokenATA = true;
                createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),swapTokenMint,PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
        }
        // swapTokenMint

        const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8; // HERE
        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0; // 0 = nft_swap InitializeSwap instruction
        if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}

        let arr;
        let takerb58 = bs58.decode(taker);
        arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
        for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}

        let swapMintb58 = bs58.decode(swapMint);
        arr = Array.prototype.slice.call(Buffer.from(swapMintb58), 0);
        for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}
        
        let byte;
        let byteArray;
        let index;
        
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for(index = 0; index < byteArray.length; index ++ ){byte=swapLamports & 0xff;byteArray[index]=byte;swapLamports=(swapLamports-byte)/256;}
        for(let i = 0; i < byteArray.length; i++) {uarray[counter++]=byteArray[i];}

        let swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
        arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58),0);
        for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}

        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for(index = 0; index < byteArray.length; index ++ ){byte=swapTokens & 0xff;byteArray[index]=byte;swapTokens=(swapTokens-byte)/256;}
        for(let i = 0; i < byteArray.length; i++){uarray[counter++]=byteArray[i];}

        const initializeSwapIx = new TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [
            { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
            { pubkey: swapVaultATA, isSigner: false, isWritable: true }, // 2
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
            { pubkey: new PublicKey(mint), isSigner: false, isWritable: true }, // 5
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 6
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
            { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 9
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 10
          ]
        });

        const lookupTableAccount = await connection.getAddressLookupTable(new PublicKey(this.NFT_STATIC_ALT)).then((res) => res.value);

        let instructions = null;
        if (isSwap == true) {
          if (createSwapMintATA == true && createSwapTokenATA == true) {
            instructions = [
              createSwapVaultATAIx,
              createSwapMintATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          } 
          else if (createSwapMintATA == true) {
            instructions = [
              createSwapVaultATAIx,
              createSwapMintATAIx,
              initializeSwapIx
            ];
          }
          else if (createSwapTokenATA == true) {
            instructions = [
              createSwapVaultATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          } 
          else {
            instructions = [
              createSwapVaultATAIx,
              initializeSwapIx
            ];
          }
        } 
        else {
          if (createSwapTokenATA == true) {
            instructions = [
              createSwapVaultATAIx,
              createSwapTokenATAIx,
              initializeSwapIx
            ];
          }
          else {
            instructions = [
              createSwapVaultATAIx,
              initializeSwapIx
            ];
          }
        }

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = [lookupTableAccount];  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;
        return await this.tx(_tx_);
        // build transaction

    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async nftExecute(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc,"confirmed");
        const mint = _data_.sellerMint;
        let swapMint = "11111111111111111111111111111111";
        if(typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
        let response;
        let meta_data;
        const NFTSwapProgramId = new PublicKey(this.MCSWAP_NFT_PROGRAM);
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],NFTSwapProgramId);
        const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error) {});        
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_NFT.decode(encodedProgramStateData);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le").toString();
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],NFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
        let isSwap = true;
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_NFT_STATE.decode(encodedSwapStateData);
        if(new BN(decodedSwapStateData.is_swap, 10, "le")==0){isSwap=false}
        const initializer = new PublicKey(decodedSwapStateData.initializer);
        const initializerMint = new PublicKey(decodedSwapStateData.initializer_mint);
        const tempMintAccount = new PublicKey(decodedSwapStateData.temp_mint_account);
        const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
        const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
        const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");

        //////////////////////////////////////////////////////////////////
        // alice mint
        let ASSET_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":initializerMint.toString()}})});
        meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions != "undefined"){
            ASSET_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
        }
        let createInitializerMintATA = false;
        let createInitializerMintATAIx = null;
        const initializerMintATA = await splToken.getAssociatedTokenAddress(initializerMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        let ataACCT = null;
        ataACCT = await connection.getAccountInfo(initializerMintATA).catch(function(error){});
        if(ataACCT==null){
          createInitializerMintATA = true;
          createInitializerMintATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.buyer),initializerMintATA,new PublicKey(_data_.buyer),initializerMint,ASSET_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        }
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // bob mint
        let providerSwapMintATA = new PublicKey("11111111111111111111111111111111");
        let initializerSwapMintATA = new PublicKey("11111111111111111111111111111111");
        let ASSET_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
        if(swapMint != "11111111111111111111111111111111") {  
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapMint}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                ASSET_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            providerSwapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.buyer),false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);   
            initializerSwapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),initializer,false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        }
        const providerMintATA = await splToken.getAssociatedTokenAddress(initializerMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        //////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////
        // token
        let ASSET_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
        let providerTokenATA = new PublicKey("11111111111111111111111111111111");
        let initializerTokenATA = new PublicKey("11111111111111111111111111111111");
        if(swapTokenMint != "11111111111111111111111111111111"){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                ASSET_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,ASSET_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        }
        //////////////////////////////////////////////////////////////////

        const totalSize = 1;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1;        
        const keys = [
          { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
          { pubkey: initializer, isSigner: false, isWritable: true }, // 1
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 4
          { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 5
          { pubkey: initializerMintATA, isSigner: false, isWritable: true }, // 6
          { pubkey: new PublicKey(mint), isSigner: false, isWritable: true }, // 7
          { pubkey: providerSwapMintATA, isSigner: false, isWritable: true }, // 8
          { pubkey: initializerSwapMintATA, isSigner: false, isWritable: true }, // 9
          { pubkey: new PublicKey(swapMint), isSigner: false, isWritable: true }, // 10
          { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 11
          { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 12
          { pubkey: swapTokenMint, isSigner: false, isWritable: true }, // 13
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 14
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 15
          { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 16
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 17
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 18
        ];
        const swapNFTsIx = new TransactionInstruction({programId:NFTSwapProgramId,data:Buffer.from(uarray),keys:keys});
        const lookupTable = new PublicKey(this.NFT_STATIC_ALT);  
        const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
        let instructions;
        if(createInitializerMintATA == true){instructions=[createInitializerMintATAIx,swapNFTsIx];} 
        else{instructions=[swapNFTsIx];}
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.buyer;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = [lookupTableAccount];  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority; 
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async nftCancel(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc,"confirmed");
        const assetId = _data_.sellerMint;
        let swapMint = "11111111111111111111111111111111";
        if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
        const NFTSwapProgramId = new PublicKey(this.MCSWAP_NFT_PROGRAM);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(assetId).toBytes(),new PublicKey(swapMint).toBytes()],NFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_NFT_STATE.decode(encodedSwapStateData);
        const tempMintAccount = new PublicKey(decodedSwapStateData.temp_mint_account);
        let response;
        let meta_data;
        let ASSET_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
        meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions != "undefined"){
            ASSET_PROGRAM_ID = splToken.TOKEN_2022_PROGRAM_ID;
        }
        const initializerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(assetId),new PublicKey(_data_.seller),false,ASSET_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
        const totalSize = 1;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 2; // 2 = nft_swap ReverseSwap instruction
        const reverseSwapIx = new TransactionInstruction({
          programId: NFTSwapProgramId,
          data: Buffer.from(uarray),
          keys: [
            { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 1
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
            { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 3
            { pubkey: initializerMintATA, isSigner: false, isWritable: true }, // 4
            { pubkey: new PublicKey(assetId), isSigner: false, isWritable: true }, // 6
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
            { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
          ]
        });
        const instructions = [reverseSwapIx];
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority; 
        return await this.tx(_tx_);
        // build transaction
    }catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async nftReceived(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.MCSWAP_NFT_PROGRAM);
        const _result_ = {}
        let NFT_RECEIVED = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:218,},{memcmp:{offset:106,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_NFT_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                const taker = new PublicKey(decodedData.taker).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const temp_mint_account = new PublicKey(decodedData.temp_mint_account).toString();
                const swap_mint = new PublicKey(decodedData.swap_mint).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                NFT_RECEIVED.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=NFT_RECEIVED;
                return _result_;
            }
        }}
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=NFT_RECEIVED;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async nftSent(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.MCSWAP_NFT_PROGRAM);
        const _result_ = {}
        let NFT_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:218,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_NFT_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                const taker = new PublicKey(decodedData.taker).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const temp_mint_account = new PublicKey(decodedData.temp_mint_account).toString();
                const swap_mint = new PublicKey(decodedData.swap_mint).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                NFT_SENT.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=NFT_SENT;
                return _result_;
            }
        }}
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=NFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftCreate(_data_){
    try{
        const max_proofs = 18;
        if(typeof _data_.convert!="undefined"&&_data_.convert===true){
            if(typeof _data_.lamports!="undefined"&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"11111111111111111111111111111111"});
                _data_.lamports = amount_a.data;
            }
            if(typeof _data_.units!="undefined"&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }
        }
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc, "confirmed");
        let assetId = _data_.sellerMint;
        let swapAssetId = "11111111111111111111111111111111";
        if(typeof _data_.buyerMint!="undefined"){swapAssetId=_data_.buyerMint;}
        let taker = _data_.buyer;
        let swapLamports = 0;
        if(typeof _data_.lamports!="undefined"&&_data_.lamports>0){swapLamports=_data_.lamports;}
        let swapTokens = 0;
        let swapTokenMint = new PublicKey("11111111111111111111111111111111");
        if(typeof _data_.tokenMint!="undefined"){swapTokenMint=new PublicKey(_data_.tokenMint);swapTokens=_data_.units;}
        let isSwap=true;
        if(swapAssetId=="11111111111111111111111111111111"){isSwap=false;}
        const cNFTSwapProgramId = new PublicKey(this.MCSWAP_CNFT_PROGRAM);
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);
        const programState = await connection.getAccountInfo(programStatePDA[0]);  
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_CNFT.decode(encodedProgramStateData);
        const feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le");
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const delegate = new PublicKey(_data_.seller);
        let response;
        let getAsset;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
        getAsset = await response.json();
        let getAssetProof;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
        getAssetProof = await response.json();
        let treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id));  
        let treeAuthorityPDA = treeAccount.getAuthority();
        let canopyDepth = treeAccount.getCanopyDepth();
        let proof = [];
        proof = getAssetProof.result.proof.slice(0,getAssetProof.result.proof.length-(!!canopyDepth ? canopyDepth:0)).map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
        let swapAssetOwner = taker;
        let swapDelegate = taker;
        let swapDatahash = "11111111111111111111111111111111";
        let swapCreatorhash = "11111111111111111111111111111111";
        let swapLeafId = 0;
        let swapTreeId  = "11111111111111111111111111111111";
        let swapRoot  = "11111111111111111111111111111111";
        let swapProof = []; 
        let getSwapAsset;
        let getSwapAssetProof;
        if (isSwap === true) {
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapAssetId}})});
            getSwapAsset = await response.json();
            swapAssetOwner = getSwapAsset.result.ownership.owner;
            if(getSwapAsset.result.ownership.delegated==true){swapDelegate=getSwapAsset.result.ownership.delegate;}
            swapDatahash = getSwapAsset.result.compression.data_hash;
            swapCreatorhash = getSwapAsset.result.compression.creator_hash;
            swapLeafId = getSwapAsset.result.compression.leaf_id;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":swapAssetId}})});
            getSwapAssetProof = await response.json();
            swapTreeId =  getSwapAssetProof.result.tree_id;
            let swapProofTotal = getSwapAssetProof.result.proof;
            swapRoot = getSwapAssetProof.result.root;
            const swapTreeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getSwapAssetProof.result.tree_id));
            const swapCanopyDepth = swapTreeAccount.getCanopyDepth();
            swapProof = getSwapAssetProof.result.proof.slice(0,getSwapAssetProof.result.proof.length-(!!swapCanopyDepth ? swapCanopyDepth:0)).map((node)=>({pubkey: new PublicKey(node),isWritable:false,isSigner:false,}));
        }
        if((proof.length+swapProof.length)>max_proofs){
            const _error_ = {}
            _error_.status="error";
            _error_.message="combined proofs ("+(proof.length+swapProof.length)+") can not excede ("+max_proofs+")";
            return _error_;
        }
        else{
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),new PublicKey(assetId).toBytes(),new PublicKey(swapAssetId).toBytes()],cNFTSwapProgramId);        
            let tokenATA = null;
            let createTokenATA = null;
            let createTokenATAIx = null;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){
                let CNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                let getAsset = await response.json();
                if(typeof getAsset.result.mint_extensions!="undefined"){CNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
                tokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,CNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                response = null;
                response = await connection.getAccountInfo(tokenATA);
                if(response==null){
                    createTokenATA = true;
                    createTokenATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),tokenATA,new PublicKey(_data_.seller),swapTokenMint,CNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                }
                else{createTokenATA=false;}
            }
            let totalSize = 1 + 1 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 32 + 32 + 32 + 32 + 8 + 1 + 8 + 32 + 8;        
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 0; // 0 = cnft_swap InitializeSwap instruction        
            if(isSwap===true){uarray[counter++]=1;}else{uarray[counter++]=0;}        
            let arr;
            let byte;
            let index;
            let byteArray;
            const assetIdb58 = bs58.decode(assetId);
            arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}        
            const rootb58 = bs58.decode(getAssetProof.result.root);
            arr = Array.prototype.slice.call(Buffer.from(rootb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}        
            const datahashb58 = bs58.decode(getAsset.result.compression.data_hash);
            arr = Array.prototype.slice.call(Buffer.from(datahashb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const creatorhashb58 = bs58.decode(getAsset.result.compression.creator_hash);
            arr = Array.prototype.slice.call(Buffer.from(creatorhashb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (index = 0; index < byteArray.length; index ++ ) {
                byte = getAsset.result.compression.leaf_id & 0xff;
                byteArray [ index ] = byte;
                getAsset.result.compression.leaf_id = (getAsset.result.compression.leaf_id - byte) / 256 ;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const swapAssetIdb58 = bs58.decode(swapAssetId);
            arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapTreeId58 = bs58.decode(swapTreeId);
            arr = Array.prototype.slice.call(Buffer.from(swapTreeId58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapAssetRootb58 = bs58.decode(swapRoot);
            arr = Array.prototype.slice.call(Buffer.from(swapAssetRootb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapAssetDatahashb58 = bs58.decode(swapDatahash); 
            arr = Array.prototype.slice.call(Buffer.from(swapAssetDatahashb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapAssetCreatorhashb58 = bs58.decode(swapCreatorhash); 
            arr = Array.prototype.slice.call(Buffer.from(swapAssetCreatorhashb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapAssetOwnerb58 = bs58.decode(swapAssetOwner); 
            arr = Array.prototype.slice.call(Buffer.from(swapAssetOwnerb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapDelegateb58 = bs58.decode(swapDelegate); 
            arr = Array.prototype.slice.call(Buffer.from(swapDelegateb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(index=0;index<byteArray.length;index ++){
                byte = swapLeafId & 0xff;
                byteArray [ index ] = byte;
                swapLeafId = (swapLeafId - byte) / 256 ;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            uarray[counter++]=proof.length;
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(index=0;index<byteArray.length;index++){
                byte = swapLamports & 0xff;
                byteArray [ index ] = byte;
                swapLamports = (swapLamports - byte) / 256 ;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
            arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(index=0;index<byteArray.length;index++){
                byte = swapTokens & 0xff;
                byteArray [ index ] = byte;
                swapTokens = (swapTokens - byte) / 256 ;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            let keys = [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 3
                { pubkey: new PublicKey(getAssetProof.result.tree_id), isSigner: false, isWritable: true }, // 4
                { pubkey: delegate, isSigner: false, isWritable: true }, // 5
                { pubkey: new PublicKey(this.BUBBLEGUM_PROGRAM_ID), isSigner: false, isWritable: false }, // 6
                { pubkey: solanaAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 7
                { pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 9
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 10
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 11
                { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 12
            ];
            for(let i=0;i<proof.length;i++){keys.push(proof[i]);}
            const initializeSwapIx = new TransactionInstruction({programId:cNFTSwapProgramId,data:Buffer.from(uarray),keys:keys});
            const msLookupTable = new PublicKey(this.CNFT_STATIC_ALT);     
            const lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res)=>res.value);            
            let instructions;
            if(createTokenATA===true){instructions=[createTokenATAIx,initializeSwapIx];} 
            else{instructions=[initializeSwapIx];}
            // build transaction
            const _tx_ = {};
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.fees = false;   
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.fees = true;   
            }
            if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;           
            _tx_.instructions = instructions;   
            _tx_.signers = false;                
            _tx_.table = [lookupTableAccount];  
            _tx_.tolerance = 1.2;                     
            _tx_.priority = _data_.priority;         
            return await this.tx(_tx_);
            // build transaction
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftCancel(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc, "confirmed");
        const assetId = _data_.sellerMint;
        let swapMint = "11111111111111111111111111111111";
        if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
        const cNFTSwapProgramId = new PublicKey(this.MCSWAP_CNFT_PROGRAM);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),new PublicKey(assetId).toBytes(),new PublicKey(swapMint).toBytes()],cNFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]);
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_CNFT_STATE.decode(encodedSwapStateData);
        let response;
        let getAsset;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
        getAsset = await response.json();
        let getAssetProof;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
        getAssetProof = await response.json();
        const treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id),);
        const treeAuthorityPDA = treeAccount.getAuthority();
        const canopyDepth = treeAccount.getCanopyDepth();
        const proof = getAssetProof.result.proof.slice(0, getAssetProof.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
        .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);
        let totalSize = 1 + 32 + 32 + 1;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;
        uarray[counter++] = 2;
        let arr = false;
        let assetIdb58 = bs58.decode(assetId);
        arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        let swapAssetIdb58 = bs58.decode(swapMint);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        uarray[counter++] = proof.length;
        let keys = [
          {
            pubkey: new PublicKey(_data_.seller),
            isSigner: true,
            isWritable: true
          }, // 0
          {
            pubkey: swapVaultPDA[0],
            isSigner: false,
            isWritable: true
          }, // 1
          {
            pubkey: swapStatePDA[0],
            isSigner: false,
            isWritable: true
          }, // 2
          {
            pubkey: treeAuthorityPDA,
            isSigner: false,
            isWritable: false
          }, // 3
          {
            pubkey: new PublicKey(getAssetProof.result.tree_id),
            isSigner: false,
            isWritable: true
          }, // 4
          {
            pubkey: new PublicKey(this.BUBBLEGUM_PROGRAM_ID),
            isSigner: false,
            isWritable: false
          }, // 5
          {
            pubkey: solanaAccountCompression.PROGRAM_ID,
            isSigner: false,
            isWritable: false
          }, // 6
          {
            pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID,
            isSigner: false,
            isWritable: false
          }, // 7
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: false
          }, // 8
        ];
        for(let i=0;i<proof.length;i++){keys.push(proof[i]);}
        const reverseSwapIx = new TransactionInstruction({programId:cNFTSwapProgramId,data:Buffer.from(uarray),keys:keys});
        const instructions = [reverseSwapIx];
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;      
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftExecute(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc,"confirmed");
        const assetId = _data_.sellerMint;
        let swapAssetId = "11111111111111111111111111111111";
        if(typeof _data_.buyerMint!="undefined"){swapAssetId=_data_.buyerMint;}   
        const cNFTSwapProgramId = new PublicKey(this.MCSWAP_CNFT_PROGRAM); 
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-program-state")],cNFTSwapProgramId);
        const programState = await connection.getAccountInfo(programStatePDA[0]);  
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_CNFT.decode(encodedProgramStateData);
        const feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le");
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);       
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-swap"),new PublicKey(assetId).toBytes(),new PublicKey(swapAssetId).toBytes()],cNFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]);        
        let isSwap = true;      
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_CNFT_STATE.decode(encodedSwapStateData);
        if(new BN(decodedSwapStateData.is_swap,10,"le")==0){isSwap=false;}
        const swapInitializer = new PublicKey(decodedSwapStateData.initializer);
        const swapLeafOwner = new PublicKey(decodedSwapStateData.swap_leaf_owner);
        const swapDelegate = new PublicKey(decodedSwapStateData.swap_delegate);
        const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
        const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
        const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        let response;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
        const getAsset = await response.json();
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
        const getAssetProof = await response.json();
        const treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id),);  
        const treeAuthorityPDA = treeAccount.getAuthority();
        const canopyDepth = treeAccount.getCanopyDepth();
        const proof = getAssetProof.result.proof.slice(0,getAssetProof.result.proof.length-(!!canopyDepth ? canopyDepth : 0))
        .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
        let swapDatahash = "11111111111111111111111111111111";
        let swapCreatorhash = "11111111111111111111111111111111";
        let swapLeafId = 0;
        let swapTreeId = "11111111111111111111111111111111";
        let swapRoot = "11111111111111111111111111111111";
        let swapTreeAuthorityPDA = new PublicKey("11111111111111111111111111111111");
        let swapProof = null;        
        if(isSwap===true){
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapAssetId}})});
            const getSwapAsset = await response.json();
            swapDatahash = getSwapAsset.result.compression.data_hash;
            swapCreatorhash = getSwapAsset.result.compression.creator_hash;
            swapLeafId = getSwapAsset.result.compression.leaf_id;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":swapAssetId}})});
            const getSwapAssetProof = await response.json();
            swapTreeId = getSwapAssetProof.result.tree_id;
            swapRoot = getSwapAssetProof.result.root;
            const swapTreeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getSwapAssetProof.result.tree_id),);
            swapTreeAuthorityPDA = swapTreeAccount.getAuthority();
            const swapCanopyDepth = swapTreeAccount.getCanopyDepth();
            swapProof = getSwapAssetProof.result.proof
            .slice(0, getSwapAssetProof.result.proof.length-(!!swapCanopyDepth ? swapCanopyDepth : 0))
            .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));        
        }
        if(swapProof==null){swapProof=[];}
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("cNFT-vault")],cNFTSwapProgramId);    
        let TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
        let meta_data = await response.json();
        if(typeof meta_data.result.mint_extensions!="undefined"){TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
        const initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,swapInitializer,false,TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const totalSize = 1 + 32 + 32 + 1 + 1;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 1; // 1 = cnft_swap SwapcNFTs instruction
        let arr;
        let assetIdb58 = bs58.decode(assetId);
        arr = Array.prototype.slice.call(Buffer.from(assetIdb58),0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        let swapAssetIdb58 = bs58.decode(swapAssetId);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58),0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        uarray[counter++] = proof.length;
        if(isSwap==true){uarray[counter++]=swapProof.length;}else{uarray[counter++]=0;}
        let keys = [
          { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
          { pubkey: new PublicKey(swapInitializer), isSigner: false, isWritable: true }, // 1
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
          { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 4
          { pubkey: new PublicKey(getAssetProof.result.tree_id), isSigner: false, isWritable: true }, // 5
          { pubkey: swapTreeAuthorityPDA, isSigner: false, isWritable: false }, // 6
          { pubkey: new PublicKey(swapTreeId), isSigner: false, isWritable: true }, // 7 
          { pubkey: new PublicKey(swapDelegate), isSigner: false, isWritable: true }, // 8
          { pubkey: new PublicKey(swapTokenMint), isSigner: false, isWritable: true }, // 9
          { pubkey: new PublicKey(this.BUBBLEGUM_PROGRAM_ID), isSigner: false, isWritable: false }, // 10
          { pubkey: solanaAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 11
          { pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 13
          { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 14
          { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 15
          { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 16
          { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 17
          { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 18
          { pubkey: devTreasury, isSigner: false, isWritable: true }, // 19
          { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 20
        ];
        for(let i=0;i<proof.length;i++){keys.push(proof[i]);}    
        if(isSwap===true){for(let i=0;i<swapProof.length;i++){keys.push(swapProof[i]);}}
        const swapcNFTsIx = new TransactionInstruction({programId:cNFTSwapProgramId,data:Buffer.from(uarray),keys:keys,});
        const msLookupTable = new PublicKey(this.CNFT_STATIC_ALT);
        const lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res)=>res.value);
        const instructions = [swapcNFTsIx];
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.buyer;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = [lookupTableAccount];  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;         
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftReceived(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.MCSWAP_CNFT_PROGRAM);
        const _result_ = {}
        let CNFT_RECEIVED = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:522,},{memcmp:{offset:410,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_CNFT_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.asset_id).toString();
                const taker = new PublicKey(decodedData.swap_leaf_owner).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const swap_mint = new PublicKey(decodedData.swap_asset_id).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                CNFT_RECEIVED.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CNFT_RECEIVED;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=NFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftSent(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.MCSWAP_CNFT_PROGRAM);
        const _result_ = {}
        let CNFT_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:522,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_CNFT_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.asset_id).toString();
                const taker = new PublicKey(decodedData.swap_leaf_owner).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const swap_mint = new PublicKey(decodedData.swap_asset_id).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                CNFT_SENT.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CNFT_SENT;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=CNFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async pnftCreate(_data_){
        try{
            if(typeof _data_.convert!="undefined"&&_data_.convert===true){
                if(typeof _data_.lamports!="undefined"&&_data_.lamports>0){
                    let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"11111111111111111111111111111111"});
                    _data_.lamports = amount_a.data;
                }
                if(typeof _data_.units!="undefined"&&_data_.units>0){
                    let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                    _data_.units = amount_b.data;
                }
            }
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            const connection = new Connection(_data_.rpc,"confirmed");
            let isSwap = true;
            const mint = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}else{isSwap=false;}
            let swapLamports = 0;
            if(typeof _data_.lamports!="undefined" && _data_.lamports>0){swapLamports=parseInt(_data_.lamports);}
            let swapTokens = 0;
            let swapTokenMint = new PublicKey("11111111111111111111111111111111");
            if(typeof _data_.units!="undefined" && _data_.units>0){swapTokens=parseInt(_data_.units);swapTokenMint=new PublicKey(_data_.tokenMint);}
            const pNFTSwapProgramId = new PublicKey(this.MCSWAP_PNFT_PROGRAM);
            const splATAProgramId = new PublicKey(this.SPL_ATA_PROGRAM_ID);
            const mplAuthRulesProgramId = new PublicKey(this.MPL_RULES_PROGRAM_ID);
            const mplAuthRulesAccount = new PublicKey(this.MPL_RULES_ACCT);        
            const mplProgramid = new PublicKey(this.METADATA_PROGRAM_ID);
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],pNFTSwapProgramId);
            const programState = await connection.getAccountInfo(programStatePDA[0]);
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.PROGRAM_STATE_PNFT.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],pNFTSwapProgramId);
            const providerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes()],mplProgramid);
            const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("edition")],mplProgramid);
            const tokenDestinationATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(providerMintATA).toBytes()],mplProgramid);
            const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(tokenDestinationATA).toBytes()],mplProgramid);
            let createSwapMintATA = false;
            let createSwapMintATAIx = null;        
            let swapMintATA = null;
            let takerMintInfo = null;        
            if(swapMint!="11111111111111111111111111111111"){
              swapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
              takerMintInfo = await connection.getAccountInfo(swapMintATA).catch(function(){});
              if(takerMintInfo==null){createSwapMintATA=true;createSwapMintATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapMintATA,new PublicKey(_data_.seller),new PublicKey(swapMint),splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID)} 
              else{createSwapMintATA=false;}
            }        
            let PNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            let createSwapTokenATA = false;
            let createSwapTokenATAIx = null;
            let swapTokenATA = null;
            let swapTokenInfo = null;
            let response = null;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                let getAsset = await response.json();
                if(typeof getAsset.result.mint_extensions!="undefined"){PNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
                swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                swapTokenInfo = await connection.getAccountInfo(swapTokenATA).catch(function(){});        
                if(swapTokenInfo==null){createSwapTokenATA=true;createSwapTokenATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),swapTokenMint,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);}
                else{createSwapTokenATA=false;}
            }
            const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 0;
            if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}
            let arr;
            let byteArray;
            const takerb58 = bs58.decode(_data_.buyer);
            arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const takerMintb58 = bs58.decode(swapMint);
            arr = Array.prototype.slice.call(Buffer.from(takerMintb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray=[0,0,0,0,0,0,0,0];
            for(let index=0;index<byteArray.length;index++) {
                let byte = swapLamports & 0xff;
                byteArray [index] = byte;
                swapLamports=(swapLamports-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
            arr=Array.prototype.slice.call(Buffer.from(swapTokenMintb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray=[0,0,0,0,0,0,0,0];
            for(let index=0;index<byteArray.length;index++){
                let byte = swapTokens & 0xff;
                byteArray [index] = byte;
                swapTokens=(swapTokens-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const initializeSwapIx = new TransactionInstruction({
            programId: pNFTSwapProgramId,
            data:Buffer.from(uarray),
            keys: [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(mint), isSigner: false, isWritable: false }, // 5
                { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 6
                { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 7
                { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 8
                { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 9
                { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 10
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 11
                { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 12
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
                { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 14
                { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 15
                { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 16
                { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 17
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 18
                { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 19
            ]
            });
            let instructions = null;
            if(createSwapMintATA===true&&createSwapTokenATA===true){
              instructions=[createSwapMintATAIx,createSwapTokenATAIx,initializeSwapIx];
            } 
            else if(createSwapMintATA===true){
              instructions=[createSwapMintATAIx,initializeSwapIx];
            } 
            else if ( createSwapTokenATA === true) {
              instructions=[createSwapTokenATAIx,initializeSwapIx];
            } 
            else {
              instructions=[initializeSwapIx];
            }
            // build transaction
            const _tx_ = {};
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.fees = false;   
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.fees = true;   
            }
            if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;           
            _tx_.instructions = instructions;   
            _tx_.signers = false;                
            _tx_.table = false;
            _tx_.tolerance = 1.2;                     
            _tx_.priority = _data_.priority;         
            return await this.tx(_tx_);
            // build transaction
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftCancel(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc, "confirmed");
        let swapMint = "11111111111111111111111111111111";
        if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
        const mint = _data_.sellerMint;
        const pNFTSwapProgramId = new PublicKey(this.MCSWAP_PNFT_PROGRAM);
        const splATAProgramId = new PublicKey(this.SPL_ATA_PROGRAM_ID);
        const mplAuthRulesProgramId = new PublicKey(this.MPL_RULES_PROGRAM_ID);
        const mplAuthRulesAccount = new PublicKey(this.MPL_RULES_ACCT);
        const mplProgramid = new PublicKey(this.METADATA_PROGRAM_ID);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],pNFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_PNFT_STATE.decode(encodedSwapStateData);
        const vaultMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes()],mplProgramid);
        const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("edition")],mplProgramid);
        const tokenDestinationATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),new PublicKey(mplProgramid).toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(vaultMintATA).toBytes()],mplProgramid);
        const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),new PublicKey(mplProgramid).toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(tokenDestinationATA).toBytes()],mplProgramid,);
        const totalSize = 1 + 32;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 2; // 2 = ReverseSwap Instruction
        const swapMintb58 = bs58.decode(swapMint);
        const arr = Array.prototype.slice.call(Buffer.from(swapMintb58),0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        const reverseSwapIx = new TransactionInstruction({programId:pNFTSwapProgramId,data: Buffer.from(uarray),
            keys: [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: vaultMintATA, isSigner: false, isWritable: true }, // 3
                { pubkey: new PublicKey(mint), isSigner: false, isWritable: false }, // 4
                { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 5
                { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 6
                { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 7
                { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 8
                { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 9
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 10
                { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 11
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
                { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 13
                { pubkey: new PublicKey(mplProgramid), isSigner: false, isWritable: false }, // 14
                { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 15
                { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 16
            ]
        });
        const instructions = [reverseSwapIx];
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;}               
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async pnftExecute(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc,"confirmed");
        const sellerMint = _data_.sellerMint;
        let buyerMint = "11111111111111111111111111111111";
        if(typeof _data_.buyerMint!="undefined"){buyerMint=_data_.buyerMint;}
        const pNFTSwapProgramId = new PublicKey(this.MCSWAP_PNFT_PROGRAM);
        const splATAProgramId = new PublicKey(this.SPL_ATA_PROGRAM_ID);
        const mplAuthRulesProgramId = new PublicKey(this.MPL_RULES_PROGRAM_ID);
        const mplAuthRulesAccount = new PublicKey(this.MPL_RULES_ACCT);
        const mplProgramid = new PublicKey(this.METADATA_PROGRAM_ID);
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],pNFTSwapProgramId);
        const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){}); 
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_PNFT.decode(encodedProgramStateData);
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],pNFTSwapProgramId);
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(sellerMint).toBytes(),new PublicKey(buyerMint).toBytes()],pNFTSwapProgramId);
        const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});        
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_PNFT_STATE.decode(encodedSwapStateData);
        const initializer = new PublicKey(decodedSwapStateData.initializer);
        const initializerTokenMint = new PublicKey(decodedSwapStateData.initializer_mint);
        const takerTokenMint = new PublicKey(decodedSwapStateData.swap_mint);
        const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
        const vaultTokenMintATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes()],mplProgramid);
        const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
        const tokenDestinationATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,new PublicKey(_data_.buyer),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        let createTokenDestinationATA = false;
        let createTokenDestinationATAIx = null;
        const DestinationResp=await connection.getAccountInfo(tokenDestinationATA)
        if(DestinationResp==null){createTokenDestinationATA=true;createTokenDestinationATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.buyer),tokenDestinationATA,new PublicKey(_data_.buyer),initializerTokenMint,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);}
        else{createTokenDestinationATA=false;}
        const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("token_record"),vaultTokenMintATA.toBytes()],mplProgramid);
        const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("token_record"),tokenDestinationATA.toBytes()],mplProgramid);
        const takerTokenMintATA = await splToken.getAssociatedTokenAddress(takerTokenMint,new PublicKey(_data_.buyer),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const takerTokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes()],mplProgramid);
        const takerTokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
        const takerTokenDestinationATA = await splToken.getAssociatedTokenAddress(takerTokenMint,initializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const takerTokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("token_record"),takerTokenMintATA.toBytes()],mplProgramid,);
        const takerTokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("token_record"),takerTokenDestinationATA.toBytes()],mplProgramid);
        let PNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        let response;
        if(swapTokenMint.toString()!="11111111111111111111111111111111"){  
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
            let getAsset = await response.json();
            if(typeof getAsset.result.mint_extensions!="undefined"){PNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
        }
        const swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const initializerSwapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const totalSize = 1;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1; // 1 = SwapNFTs Instruction
        const keys = [
            { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
            { pubkey: initializer, isSigner: false, isWritable: true }, // 1
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
            { pubkey: vaultTokenMintATA, isSigner: false, isWritable: true }, // 5
            { pubkey: initializerTokenMint, isSigner: false, isWritable: false }, // 6
            { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 7
            { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 8
            { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 9
            { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 10
            { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 11
            { pubkey: takerTokenMintATA, isSigner: false, isWritable: true }, // 12
            { pubkey: takerTokenMint, isSigner: false, isWritable: false }, // 13
            { pubkey: takerTokenMetadataPDA[0], isSigner: false, isWritable: true }, // 14
            { pubkey: takerTokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 15
            { pubkey: takerTokenDestinationATA, isSigner: false, isWritable: true }, // 16
            { pubkey: takerTokenRecordPDA[0], isSigner: false, isWritable: true }, // 17
            { pubkey: takerTokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 18
            { pubkey: swapTokenATA, isSigner: false, isWritable: true }, // 19
            { pubkey: swapTokenMint, isSigner: false, isWritable: true }, // 20
            { pubkey: initializerSwapTokenATA, isSigner: false, isWritable: true }, // 21            
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 21
            { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 23
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 24
            { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 25
            { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 26
            { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 27
            { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 28
            { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 29
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 30
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 31
        ];
        const swapPNFTsIx = new TransactionInstruction({programId:pNFTSwapProgramId,data:Buffer.from(uarray),keys:keys});
        const lookupTable = new PublicKey(this.PNFT_STATIC_ALT);
        const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
        let instructions = null;
        if(createTokenDestinationATA==true){instructions=[createTokenDestinationATAIx,swapPNFTsIx];}else{instructions=[swapPNFTsIx];}
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;}               
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.buyer;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = [lookupTableAccount];
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async pnftReceived(_data_){
        try{
            const connection = new Connection(_data_.rpc,"confirmed");
            const PNFT_ProgramId = new PublicKey(this.MCSWAP_PNFT_PROGRAM);
            const _result_ = {}
            let PNFT_RECEIVED = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:74,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.SWAP_PNFT_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                    const taker = new PublicKey(decodedData.taker).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const swap_mint = new PublicKey(decodedData.swap_mint).toString();
                    const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                        const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                        const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                        record.lamports = lamports.data;
                        record.units = units.data;
                    }
                    PNFT_RECEIVED.push(record);
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=PNFT_RECEIVED;
                    return _result_;
                }
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=PNFT_RECEIVED;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftSent(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const PNFT_ProgramId = new PublicKey(this.MCSWAP_PNFT_PROGRAM);
        const _result_ = {}
        let PNFT_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_PNFT_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                const taker = new PublicKey(decodedData.taker).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const swap_mint = new PublicKey(decodedData.swap_mint).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                PNFT_SENT.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=PNFT_SENT;
                return _result_;
            }
        }}
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=PNFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async coreCreate(_data_){
    try{
        if(typeof _data_.convert!="undefined"&&_data_.convert===true){
            if(typeof _data_.lamports!="undefined"&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"11111111111111111111111111111111"});
                _data_.lamports = amount_a.data;
            }
            if(typeof _data_.units!="undefined"&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }
        }
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc, "confirmed");
        let isSwap = true;
        if(typeof _data_.buyerMint=="undefined"){_data_.buyerMint="11111111111111111111111111111111";isSwap=false;}
        if(typeof _data_.tokenMint=="undefined"){_data_.tokenMint="11111111111111111111111111111111";}
        if(typeof _data_.lamports=="undefined"){_data_.lamports=0;}
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){});
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_CORE.decode(encodedProgramStateData);
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        let assetCollection = new PublicKey("11111111111111111111111111111111");
        let response = null;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
        const getAsset = await response.json();
        if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
        assetCollection = getAsset.result.grouping[0].group_value;}
        let createSwapTokenATA = false; 
        let createSwapTokenATAIx = null;
        let CORE_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        if(_data_.tokenMint!="11111111111111111111111111111111"){  
            const resp = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"1A","method":"getAsset","params":{"id":_data_.tokenMint}})});
            const getAss = await resp.json();
            if(typeof getAss.result.mint_extensions!="undefined"){CORE_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
            const swapTokenATA = await splToken.getAssociatedTokenAddress(new PublicKey(_data_.tokenMint),new PublicKey(_data_.seller),false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            let tokenAccount = null;
            tokenAccount=await connection.getAccountInfo(swapTokenATA).catch(function(){});
            if(tokenAccount==null){
                createSwapTokenATA=true;
                createSwapTokenATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),new PublicKey(_data_.tokenMint),CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID)
            }
        }
        const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8;
        let uarray = new Uint8Array(totalSize);
        let counter = 0;    
        uarray[counter++] = 0;
        if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}
        let takerb58 = bs58.decode(_data_.buyer);
        let arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        let swapAssetb58 = bs58.decode(_data_.buyerMint);
        arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        let swapLamports = _data_.lamports;
        for(let index=0;index<byteArray.length;index++){
            let byte=swapLamports & 0xff;
            byteArray [index]=byte;
            swapLamports=(swapLamports-byte)/256;
        }
        for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
        let swapTokenMintb58 = bs58.decode(_data_.tokenMint);
        arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
        for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
        byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        let swapTokens = _data_.units;
        for(let index=0;index<byteArray.length;index++){
            let byte=swapTokens & 0xff;
            byteArray [index]=byte;
            swapTokens=(swapTokens-byte)/256;
        }
        for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
        const keys = [
            { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 4
            { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 5
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 6
            { pubkey: new PublicKey(this.CORE_PROGRAM_ID), isSigner: false, isWritable: false }, // 7
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 8
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 9
        ];
        const initializeSwapIx = new TransactionInstruction({programId:new PublicKey(this.MCSWAP_CORE_PROGRAM),data:Buffer.from(uarray),keys:keys});
        let instructions;
        if(createSwapTokenATA==true){instructions=[createSwapTokenATAIx,initializeSwapIx];}else{instructions=[initializeSwapIx];}
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority;         
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async coreCancel(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc, "confirmed");
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        let assetCollection = new PublicKey("11111111111111111111111111111111");
        let response = null;
        response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
        const getAsset = await response.json();
        if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
        assetCollection = getAsset.result.grouping[0].group_value;}
        const totalSize = 1 + 32;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 2;
        const swapAssetb58 = bs58.decode(_data_.buyerMint);
        const arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
        for(let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
        const keys = [
          { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
          { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
          { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
          { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 3
          { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 4
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 5
          { pubkey: new PublicKey(this.CORE_PROGRAM_ID), isSigner: false, isWritable: false }, // 6
        ];
        const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.MCSWAP_CORE_PROGRAM),data:Buffer.from(uarray),keys:keys});
        const instructions = [reverseSwapIx];
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.seller;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority; 
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async coreExecute(_data_){
    try{
        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const connection = new Connection(_data_.rpc,"confirmed");
        if(typeof _data_.buyerMint=="undefined"){_data_.buyerMint="11111111111111111111111111111111";}
        const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
        const encodedProgramStateData = programState.data;
        const decodedProgramStateData = this.PROGRAM_STATE_CORE.decode(encodedProgramStateData);
        const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
        const mcDegensTreasury = new PublicKey(decodedProgramStateData.mcdegens_treasury);
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
        const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.MCSWAP_CORE_PROGRAM)); 
        const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
        let isSwap = true;
        const encodedSwapStateData = swapState.data;
        const decodedSwapStateData = this.SWAP_CORE_STATE.decode(encodedSwapStateData);
        if(new BN(decodedSwapStateData.is_swap, 10, "le") == 0){isSwap = false;}
        const initializer = new PublicKey(decodedSwapStateData.initializer);
        const initializerAsset = new PublicKey(decodedSwapStateData.initializer_asset);
        const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
        const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
        const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
        let assetCollection = new PublicKey("11111111111111111111111111111111");
        const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
        const getAsset = await response.json();
        if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
        assetCollection = getAsset.result.grouping[0].group_value;}
        let swapAssetCollection = new PublicKey("11111111111111111111111111111111");
        const resp = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.buyerMint}})});
        const getAss = await resp.json();
        if(typeof getAss.result.grouping!="undefined"&&typeof getAss.result.grouping[0]!="undefined"&&typeof getAss.result.grouping[0].group_value!="undefined"){
        swapAssetCollection = getAss.result.grouping[0].group_value;}
        let CORE_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
        if(swapTokenMint.toString()!="11111111111111111111111111111111"){  
            const resp_ = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"1A","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
            const getAss_ = await resp_.json();
            if(typeof getAss_.result.mint_extensions!="undefined"){CORE_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
        }
        const providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
        const totalSize = 1;
        let uarray = new Uint8Array(totalSize);    
        let counter = 0;    
        uarray[counter++] = 1;
        const keys = [
            { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
            { pubkey: initializer, isSigner: false, isWritable: true }, // 1
            { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
            { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
            { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
            { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 5
            { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 6
            { pubkey: new PublicKey(_data_.buyerMint), isSigner: false, isWritable: true }, // 7
            { pubkey: new PublicKey(swapAssetCollection), isSigner: false, isWritable: true }, // 8
            { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 9
            { pubkey: new PublicKey(swapTokenMint), isSigner: false, isWritable: true }, // 10  HERE
            { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 11
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 12
            { pubkey: new PublicKey(this.CORE_PROGRAM_ID), isSigner: false, isWritable: false }, // 13
            { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 14
            { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 15  HERE
            { pubkey: devTreasury, isSigner: false, isWritable: true }, // 16
            { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 17
        ];
        const swapNFTsIx = new TransactionInstruction({programId:new PublicKey(this.MCSWAP_CORE_PROGRAM),data:Buffer.from(uarray),keys:keys});
        const instructions = [swapNFTsIx];
        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.fees = true;   
        }
        if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
        _tx_.rpc = _data_.rpc;                     
        _tx_.account = _data_.buyer;           
        _tx_.instructions = instructions;   
        _tx_.signers = false;                
        _tx_.table = false;  
        _tx_.tolerance = 1.2;                     
        _tx_.priority = _data_.priority; 
        return await this.tx(_tx_);
        // build transaction
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async coreReceived(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const CORE_ProgramId = new PublicKey(this.MCSWAP_CORE_PROGRAM);
        const _result_ = {}
        let CORE_RECEIVED = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:74,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_CORE_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.initializer_asset).toString();
                const taker = new PublicKey(decodedData.taker).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const swap_mint = new PublicKey(decodedData.swap_asset).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                CORE_RECEIVED.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CORE_RECEIVED;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=NFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async coreSent(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const CORE_ProgramId = new PublicKey(this.MCSWAP_CORE_PROGRAM);
        const _result_ = {}
        let CORE_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:186,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.SWAP_CORE_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.initializer_asset).toString();
                const taker = new PublicKey(decodedData.taker).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const swap_mint = new PublicKey(decodedData.swap_asset).toString();
                const swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                const swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                const swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"11111111111111111111111111111111","display":_data_.display});
                    const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                    record.lamports = lamports.data;
                    record.units = units.data;
                }
                CORE_SENT.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CORE_SENT;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=CORE_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async convert(_data_){
    try{
        let decimals;
        let symbol;
        if(_data_.mint=="11111111111111111111111111111111"){
            decimals = 9;
            symbol = "SOL";
        }
        else{
            const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.mint}})});
            const meta_data = await response.json();
            decimals = meta_data.result.token_info.decimals;
            symbol = meta_data.result.token_info.symbol;
        }
        let amount = 0;
        let multiply = 1;
        for(let i = 0; i < decimals; i++){multiply = multiply * 10;}
        if(typeof _data_.display!="undefined"&&_data_.display===true){
            amount=(_data_.amount/multiply).toFixed(decimals);
        }
        else{amount=parseInt(_data_.amount*multiply);}
        const _response_={}
        _response_.status="ok";
        _response_.message="conversion successful";
        _response_.data=amount;
        _response_.symbol=symbol;
        _response_.decimals=decimals;
        return _response_;
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async send(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const signature = await connection.sendRawTransaction(_data_.tx.serialize(),{skipPreflight:true,maxRetries:0});
        return signature;
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async status(cluster,sig,max=10,int=4){
        return await new Promise(resolve => {
            let start = 1;
            let connection = null;
            connection = new Connection(cluster, "confirmed");
            let intervalID = setInterval(async()=>{
            let tx_status = null;
            tx_status = await connection.getSignatureStatuses([sig], {searchTransactionHistory: true,});
            if (tx_status == null || 
            typeof tx_status.value == "undefined" || 
            tx_status.value == null || 
            tx_status.value[0] == null || 
            typeof tx_status.value[0] == "undefined" || 
            typeof tx_status.value[0].confirmationStatus == "undefined"){} 
            else if(tx_status.value[0].confirmationStatus == "processed"){
                start = 1;
            }
            else if(tx_status.value[0].confirmationStatus == "confirmed"){
                start = 1;
            }
            else if (tx_status.value[0].confirmationStatus == "finalized"){
                if(tx_status.value[0].err != null){
                resolve('program error!');
                clearInterval(intervalID);
                }
                resolve('finalized');
                clearInterval(intervalID);
            }
            start++;
            if(start == max + 1){
                resolve((max * int)+' seconds max wait reached');
                clearInterval(intervalID);
            }
            },(int * 1000));
        });  
    }
    async ComputeLimit(cluster,opti_payer,opti_ix,opti_tolerance,blockhash,opti_tables=false){
        let connection = new Connection(cluster, 'confirmed');
        let opti_sim_limit = ComputeBudgetProgram.setComputeUnitLimit({units:1400000});
        let opti_fee_limit = ComputeBudgetProgram.setComputeUnitPrice({microLamports:10000});
        let re_ix = [];
        for (let o in opti_ix) {re_ix.push(opti_ix[o]);}
        opti_ix = re_ix;
        opti_ix.unshift(opti_sim_limit);
        opti_ix.unshift(opti_fee_limit);
        let opti_msg = null;
        if(opti_tables == false){
            opti_msg = new TransactionMessage({
            payerKey: opti_payer.publicKey,
            recentBlockhash: blockhash,
            instructions: opti_ix,
            }).compileToV0Message([]);
        }
        else{
            opti_msg = new TransactionMessage({
            payerKey: opti_payer.publicKey,
            recentBlockhash: blockhash,
            instructions: opti_ix,
            }).compileToV0Message(opti_tables);
        }
        let opti_tx = new VersionedTransaction(opti_msg);    
        let opti_cu_res = await connection.simulateTransaction(opti_tx,{replaceRecentBlockhash:true,sigVerify:false,});
        if(opti_cu_res.value.err != null){
            return {"status":"error","message":"simulation error","logs":opti_cu_res.value.logs}
        }
        let opti_consumed = opti_cu_res.value.unitsConsumed;
        let opti_cu_limit = Math.ceil(opti_consumed * opti_tolerance);
        return opti_cu_limit;
    }
    async FeeEstimate(cluster,payer,priority_level,instructions,blockhash,tables=false){
        let connection = new Connection(cluster,'confirmed',);
        let re_ix = [];
        for (let o in instructions) {re_ix.push(instructions[o]);}
        instructions = re_ix;
        let _msg = null;
        if(tables==false){
            _msg = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash,
            instructions: instructions,
            }).compileToV0Message([]);
        }
        else{
            _msg = new TransactionMessage({
            payerKey: payer.publicKey,
            recentBlockhash: blockhash,
            instructions: instructions,
            }).compileToV0Message(tables);
        }
        let tx = new VersionedTransaction(_msg);
        let response = await fetch(cluster, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getPriorityFeeEstimate",
            params: [
                {
                transaction: bs58.encode(tx.serialize()), // Pass the serialized transaction in Base58
                options: { priorityLevel: priority_level },
                },
            ],
            }),
        });
        let data = await response.json();
        data = parseInt(data.result.priorityFeeEstimate);
        if(data < 10000){data = 10000;}
        return data;
    }
    async tx(_data_){
    let _obj_={};let _rpc_;let _account_;let _instructions_;let _signers_;let _priority_;let _tolerance_;let _serialize_;let _encode_;let _table_;let _compute_;let _fees_;
    if(typeof _data_.rpc=="undefined"){_obj_.message="missing rpc";return _obj_;}else{_rpc_=_data_.rpc;}
    if(typeof _data_.account=="undefined"){_obj_.message="missing account";return _obj_;}else{_account_=_data_.account;}
    if(typeof _data_.instructions=="undefined"){_obj_.message="missing instructions";return _obj_;}else{_instructions_=_data_.instructions;}
    if(typeof _data_.signers=="undefined"){_signers_=false;}else{_signers_=_data_.signers;}
    if(typeof _data_.priority=="undefined"){_priority_="Medium";}else{_priority_=_data_.priority;}
    if(typeof _data_.tolerance=="undefined"){_tolerance_="1.1";}else{_tolerance_=_data_.tolerance;}
    if(typeof _data_.serialize=="undefined"){_serialize_=false;}else{_serialize_=_data_.serialize;}
    if(typeof _data_.encode=="undefined"){_encode_=false;}else{_encode_=_data_.encode;}
    if(typeof _data_.table=="undefined"){_table_=false;}else{_table_=_data_.table;}
    if(typeof _data_.compute=="undefined"){_compute_=true;}else{_compute_=_data_.compute;}
    if(typeof _data_.fees=="undefined"){_fees_=true;}else{_fees_=_data_.fees;}
    let _wallet_= new PublicKey(_account_);
    let connection = new Connection(_rpc_,"confirmed");
    let _blockhash_ = (await connection.getLatestBlockhash('confirmed')).blockhash;
    if(_priority_=="Extreme"){_priority_="VeryHigh";}
    let _payer_={publicKey:_wallet_}
    if(_compute_ != false){
        let _cu_ = null;
        _cu_= await this.ComputeLimit(_rpc_,_payer_,_instructions_,_tolerance_,_blockhash_,_table_);
        if(typeof _cu_.logs != "undefined"){
            _obj_.status="error";
            _cu_.message="there was an error when simulating the transaction";
            return _cu_;
        }
        else if(_cu_==null){
            _obj_.status="error";
            _obj_.message="there was an error when optimizing compute limit";
            return _obj_;
        }
        _instructions_.unshift(ComputeBudgetProgram.setComputeUnitLimit({units:_cu_}));
        }
        if(_fees_ != false){
            let get_priority = await this.FeeEstimate(_rpc_,_payer_,_priority_,_instructions_,_blockhash_,_table_);
            _instructions_.unshift(ComputeBudgetProgram.setComputeUnitPrice({microLamports:get_priority}));
        }
        let _message_=null;
        if(_table_!=false){
            _message_ = new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message(_table_);
        }
        else{
            _message_ = new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message([]);
        }
        let _tx_= new VersionedTransaction(_message_);
        if(_signers_!=false){
            _tx_.sign(_signers_);
        }
        if(_serialize_ === true){
            _tx_=_tx_.serialize();
        }
        if(_encode_ === true){
            _tx_= Buffer.from(_tx_).toString("base64");
        }
        if(_serialize_ == false || _encode_ == false){
            _obj_.status="ok";
            _obj_.message="success";
            _obj_.tx=_tx_;
        }
        else{
            _obj_.status="ok";
            _obj_.message="success";
            _obj_.transaction=_tx_;
        }
        return _obj_;
    }
    async fee(_data_){
        const connection=new Connection(_data_.rpc,"confirmed");
        if(_data_.standard=="spl"){
            const SPL_FEE_PROGRAM_PDA=PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.MCSWAP_SPL_PROGRAM));
            const SPL_FEE_PROGRAM_STATE=await connection.getAccountInfo(SPL_FEE_PROGRAM_PDA[0]).catch(function(){});
            const decodedData=this.PROGRAM_STATE_SPL.decode(SPL_FEE_PROGRAM_STATE.data);
            const chips = parseInt(new BN(decodedData.fee_chips,10,"le").toString());
            return "PIKL: "+Number.parseFloat(chips/1000000000).toFixed(9);
        }
        else{
            let PROGRAM;
            let STATE;
            let NAME;
            if(_data_.standard=="nft"){
                PROGRAM = this.MCSWAP_NFT_PROGRAM;
                STATE = this.PROGRAM_STATE_NFT;
                NAME = "program-state";
            }
            else if(_data_.standard=="cnft"){
                PROGRAM = this.MCSWAP_CNFT_PROGRAM;
                STATE = this.PROGRAM_STATE_CNFT;
                NAME = "cNFT-program-state";
            }
            else if(_data_.standard=="pnft"){
                PROGRAM = this.MCSWAP_PNFT_PROGRAM;
                STATE = this.PROGRAM_STATE_PNFT;
                NAME = "program-state";
            }
            else if(_data_.standard=="core"){
                PROGRAM = this.MCSWAP_CORE_PROGRAM;
                STATE = this.PROGRAM_STATE_CORE;
                NAME = "program-state";
            }
            const FEE_PROGRAM_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME)],new PublicKey(PROGRAM));
            const FEE_PROGRAM_STATE=await connection.getAccountInfo(FEE_PROGRAM_PDA[0]).catch(function(){});
            const decodedData=STATE.decode(FEE_PROGRAM_STATE.data);
            const lamports = parseInt(new BN(decodedData.fee_lamports,10,"le").toString());
            return "SOL: "+Number.parseFloat(lamports/1000000000).toFixed(9);
        }
    }
    async dummy(rpc,_wallet_=false){
        if(_wallet_===false){_wallet_="7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere";}
        const lamports = 100;
        const from = new PublicKey(_wallet_);
        const to = new PublicKey("GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu");
        const defaultIx = SystemProgram.transfer({fromPubkey:from,lamports:lamports,toPubkey:to});
        const _tx_ = {};
        _tx_.rpc = rpc;                
        _tx_.account = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere";
        _tx_.instructions = [defaultIx];   
        _tx_.signers = false;               
        _tx_.serialize = true;              
        _tx_.encode = true;                 
        _tx_.table = false;                 
        _tx_.tolerance = 1.2;                
        _tx_.compute = false;               
        _tx_.fees = false;                  
        return await this.tx(_tx_);
    }
}
const _mcswap_ = new mcswap();
export default _mcswap_;