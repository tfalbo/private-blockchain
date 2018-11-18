/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

const ls = require('./levelSandbox.js');

/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor(){
    this.chain_db = new ls.LevelSandbox();
    this.addBlock(new Block("First block in the chain - Genesis block"));
  }

  // Add new block
  addBlock(newBlock){
    let self = this;
    let chain_length = self.getBlockHeight();
    
    // Block height
    newBlock.Height = chain_length + 1;

    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    
    // previous block hash
    if(chain_length > 0){
      newBlock.previousBlockHash = self.getBlock(chain_length-1).hash
    }
    
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    
    // Adding block object to chain
  	self.chain_db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
  }

  // Get block height
    getBlockHeight(){
      let self = this;
      return new Promise (function(resolve, reject) {
        self.chain_db.getLevelDBDataCount()
          .on('data', function(data){
            console.log('Height of Chain = ' + data);
            resolve(data);
          })
          .on('error', function (err) {
            console.log('Error in finding height of chain', err);
            reject(err);
          })
        });
    }

    // Get block value
    getBlock(blockHeight){
      let self = this;
      return new Promise (function(resolve, reject){
        self.chain_db.getLevelDBData(blockHeight)
        .on('data', function(data){
          block_data = JSON.parse(JSON.stringify(data)); 
          console.log('Block data = ' + block_data);
          resolve(block_data);
        })
        .on('error', function (err) {
          console.log('Error in finding value for block with height' + blockHeight, err);
          reject(err);
        })
      });      
    }

    // validate block
    validateBlock(blockHeight){
      let self = this;
      // get block object
      let block = self.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash === validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    validateChain(){
      let self = this;
      let errorLog = [];
      let chain_length = this.getBlockHeight();
      for (var i = 0; i < chain_length; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        block = self.getBlock(i);
        next_block = self.getBlock(i+i);
        let blockHash = block.hash;
        let previousHash = next_block.previousBlockHash;
        if (blockHash !== previousHash) {
          errorLog.push(i);
        }
      }
      if (errorLog.length>0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+ errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

let blockchain = new Blockchain();

for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
blockchain.validateChain();

let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.getBlock(inducedErrorBlocks[i]).data='induced chain error';
}

blockchain.validateChain();