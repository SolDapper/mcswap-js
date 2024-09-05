// name: mcswap.js
// author: @SolDapper
// license: MIT https://github.com/McDegens-DAO/mcswap-js/blob/main/LICENSE
'use strict';
import { PublicKey, Keypair, Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, ComputeBudgetProgram, SystemProgram } from "@solana/web3.js";
import BufferLayout from "@solana/buffer-layout";
import * as splToken from "@solana/spl-token";
import bs58 from 'bs58';
import BN from "bn.js";
let publicKey=(property="publicKey")=>{return BufferLayout.blob(32,property);}
let uint64=(property="uint64")=>{return BufferLayout.blob(8,property);}
class mcswap {
    constructor() {
        this.NAME = "McSwap JS SDK";
        this.PRIORITY = "Low";
        this.TREASURY = "GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu";
        this.METADATA_PROGRAM_ID = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        this.BUBBLEGUM_PROGRAM_ID = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
        this.CNFT_STATIC_ALT = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
        this.SPL_STATIC_ALT = "DnDkh579fNnBFUwLDeQWgfW6ukLMyt8DgLaVDVwecxmj";
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
    async splCreate(_data_){
    try{

        if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
        const _response_ = {};
        const connection = new Connection(_data_.rpc, "confirmed");
        const seller = new PublicKey(_data_.seller);
        const buyer = new PublicKey(_data_.buyer);
        const multiply = 1;
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
        if(token3Mint!="11111111111111111111111111111111"){
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
            _error_.message="A pending contract for these two parties already exist!";
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
        //   console.log("token1LessFee ", Math.trunc(token1));
          for ( index = 0; index < byteArray.length; index ++ ) {
            byte = token1 & 0xff;
            byteArray [ index ] = byte;
            token1 = (token1 - byte) / 256 ;
          }
        }
        else{
          token1 = token1Amount;
        //   console.log("token1 ", Math.trunc(token1));
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
          console.log("token2LessFee ", Math.trunc(token2));
          for ( index = 0; index < byteArray.length; index ++ ) {
            byte = token2 & 0xff;
            byteArray [ index ] = byte;
            token2 = (token2 - byte) / 256 ;
          }
        }
        else{
          token2 = token2Amount;
        //   console.log("token2 ", Math.trunc(token2));
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
          if(createToken3ATA==true && createToken3ATA==true){console.log("1");instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];} 
          else if(createToken3ATA==true){console.log("2");instructions=[createToken3ATAIx,initializeSwapIx];} 
          else if(createToken4ATA==true){console.log("3");instructions=[createToken4ATAIx,initializeSwapIx];} 
          else{console.log("4");instructions=[initializeSwapIx];}
        } 
        else {
          if(createToken3ATA==true && createToken4ATA==true){console.log("5");instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];} 
          else if(createToken3ATA==true){console.log("6");instructions=[createToken3ATAIx,initializeSwapIx];} 
          else if(createToken4ATA==true){console.log("7");instructions=[createToken4ATAIx,initializeSwapIx];} 
          else {console.log("8");instructions=[initializeSwapIx]}
        }
        // instructions array ****************************************************************

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.compute = false;               
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.compute = true;               
            _tx_.fees = true;   
        }
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
        // console.log("Priority: "+_data_.priority);  
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
            console.log("programState - is_initialized: ", decodedProgramStateData.is_initialized);
            console.log("programState - pickle_mint: ", new PublicKey(decodedProgramStateData.pickle_mint).toString());
            console.log("programState - fee_chips: ", new BN(decodedProgramStateData.fee_chips, 10, "le").toString());
            console.log("programState - dev_percentage: ", new BN(decodedProgramStateData.dev_percentage, 10, "le").toString());
            console.log("programState - dev_treasury: ", new PublicKey(decodedProgramStateData.dev_treasury).toString());
            console.log("programState - mcdegens_treasury: ", new PublicKey(decodedProgramStateData.mcdegens_treasury).toString());
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
        const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")], new PublicKey(this.MCSWAP_SPL_PROGRAM));
        console.log("Swap Vault PDA: ", swapVaultPDA[0].toString());
        // swapVaultPDA
        // swapState
        const SPL_STATE_PDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"), user_a_key.toBytes(), user_b_key.toBytes()], new PublicKey(this.MCSWAP_SPL_PROGRAM));
        let swapState = null;
        swapState = await connection.getAccountInfo(SPL_STATE_PDA[0]).catch(function(){
            _response_.status="error";
            _response_.message="Contract Not Found!";
            return _response_;
        });
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
        console.log("token1Amount", token1Amount);
        console.log("token2Amount", token2Amount);
        console.log("token3Amount", token3Amount);
        console.log("token4Amount", token4Amount);
        // swapState
        // rent
        let rent = await connection.getMinimumBalanceForRentExemption(splToken.AccountLayout.span);
        console.log("rent", rent);
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
            console.log("Token 3 is SOL");
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
            console.log("Token 3 is using Token 2022");
            }
            else{
            console.log("Token 3 is using SPL Token");
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
        console.log("Token 3 Amount", parseInt(token3Amount.toString()));
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
            console.log("Token 4 is using Token 2022");
        }
        else{
            console.log("Token 4 is using SPL Token");
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
        console.log("Token 4 Amount", parseInt(token4Amount.toString()));
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
            console.log("Token 1 is using Token 2022");
        }
        else{
            console.log("Token 1 is using SPL Token");
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
        console.log("Token 1 Amount", parseInt(token1Amount.toString()));
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
            console.log("Token 2 is using Token 2022");
        }
        else{
            console.log("Token 2 is using SPL Token");
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
        console.log("Token 2 Amount", parseInt(token2Amount.toString()));
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
            console.log("ix set 1");
            instructions = [createToken1ATAIx,createToken2ATAIx,swapTokensIx];
        } 
        else if (createToken1ATA) {
            console.log("ix set 2");
            instructions = [createToken1ATAIx,swapTokensIx];
        } 
        else if (createToken2ATA) {
            console.log("ix set 3");
            instructions = [createToken2ATAIx,swapTokensIx];
        } 
        else {
            console.log("ix set 4");
            instructions = [swapTokensIx];
        }
        // instructions

        // build transaction
        const _tx_ = {};
        if(typeof _data_.blink!="undefined"&&_data_.blink===true){
            _tx_.serialize = true;              
            _tx_.encode = true; 
            _tx_.compute = false;               
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.compute = true;               
            _tx_.fees = true;   
        }
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
        console.log("Priority: "+_data_.priority);
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
        
        console.log("token1Amount", token1Amount);
        console.log("token1Mint", token1Mint.toString());
        console.log("token2Amount", token2Amount);
        console.log("token2Mint", token2Mint.toString());

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
                console.log("Token 1 is using Token 2022");
            }
            else{
                console.log("Token 1 is using SPL Token");
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
                console.log("Token 2 is using Token 2022");
            }
            else{
                console.log("Token 2 is using SPL Token");
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
            _tx_.compute = false;               
            _tx_.fees = false;   
        }
        else{
            _tx_.serialize = false;              
            _tx_.encode = false;
            _tx_.compute = true;               
            _tx_.fees = true;   
        }
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
              SPL_RECEIVED.push(record);
            }
            if(i == (accounts.length - 1)){
                _result_.status="ok";
                _result_.data=SPL_RECEIVED;
                return _result_;
            } 
        }}
        else{
          _result_.status="ok";
          _result_.data=SPL_RECEIVED;
          return _result_;
        }
    }
    async splSent(_data_){
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
              SPL_SENT.push(record);
            }
            if(i == (accounts.length - 1)){
                _result_.status="ok";
                _result_.data=SPL_SENT;
                return _result_;
            } 
        }}
        else{
          _result_.status="ok";
          _result_.data=SPL_SENT;
          return _result_;
        }
    }
    async nftCreate(_data_){


        


    }
    async nftExecute(_data_){

    }
    async nftCancel(_data_){

    }
    async nftReceived(_data_){

    }
    async nftSent(_data_){

    }
    async status(cluster,sig,max=10,int=4){
        return await new Promise(resolve => {
            let start = 1;
            let connection = null;
            connection = new Connection(cluster, "confirmed");
            let intervalID = setInterval(async()=>{
            let tx_status = null;
            tx_status = await connection.getSignatureStatuses([sig], {searchTransactionHistory: true,});
            console.log(start+": "+sig);
            if (tx_status != null && typeof tx_status.value != "undefined"){ 
                console.log(tx_status.value);
            }
            else{
                console.log("failed to get status...");
            }
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
        let opti_fee_limit = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({microLamports:10000});
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
    async FeeEstimate(cluster,payer,priorityLevel,instructions,blockhash,tables=false){
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
                options: { priorityLevel: priorityLevel },
                },
            ],
            }),
        });
        let data = await response.json();
        // console.log("estimate:", data);
        data = parseInt(data.result.priorityFeeEstimate);
        if(data < 10000){data = 10000;}
        // console.log("estimate set:", data);
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
            // console.log("using table");
            _message_ = new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message(_table_);
        }
        else{
            // console.log("not using table");
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
}
const _mcswap_ = new mcswap();
export default _mcswap_;