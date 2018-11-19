/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

const ls = require('./levelSandbox.js');

const bl = require('./simpleBlock.js')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor(){
    this.chain_db = new ls.LevelSandbox();
    this.addBlock(new bl.Block("First block in the chain - Genesis block"));
  }

  // Add new block
  async addBlock(newBlock){
      let self = this;
      let chain_length = await self.getBlockHeight();
      
      // Block height
      newBlock.height = chain_length + 1;

      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);
      
      // previous block hash
      if(chain_length > 0){
        newBlock.previousBlockHash = await self.getBlock(chain_length-1).hash
      }
      
      // Block hash with SHA256 using newBlock and converting to a string
      newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
      
      // Adding block object to chain
      await self.chain_db.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
    }

    // Get block height
    async getBlockHeight(){
      let self = this;
      const height = await self.chain_db.getLevelDBDataCount();
      return height;
    }

    // Get block value
    async getBlock(blockHeight){
      let self = this;
      const block_data = await self.chain_db.getLevelDBData(blockHeight)
      return block_data 
    }

    // validate block
    async validateBlock(blockHeight){
      let self = this;
      // get block object
      let block = await self.getBlock(blockHeight);
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
    async validateChain(){
      let self = this;
      let errorLog = [];
      let chain_length = await this.getBlockHeight();
      for (var i = 0; i < chain_length; i++) {
        // validate block
        if (!this.validateBlock(i))errorLog.push(i);
        // compare blocks hash link
        block = await self.getBlock(i);
        next_block = await self.getBlock(i+i);
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