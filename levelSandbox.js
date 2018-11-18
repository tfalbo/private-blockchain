/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Add data to levelDB with key/value pair
  addLevelDBData(key, value) {
    let self = this;
    return new Promise (function(resolve, reject){
      self.db.put(key, value, function(err) {
          if (err) {
            console.log('Block ' + key + ' submission failed', err);
            reject(err);
          } else {
            console.log('Block ' + key + ' submission successful:', JSON.stringify(value));
            resolve(value);
          }
        })
    })
  }

  // Get data from levelDB with key
  getLevelDBData(key){
    let self = this;
    return new Promise (function(resolve, reject){
      self.db.get(key, function(err, value) {
        if (err) {
          console.log('Not found!', err);
          reject(err);
        }
        else {
          console.log('Value = ' + value);
          resolve(value)
        }
      })
    })
  }

  // Add data to levelDB with value
  addDataToLevelDB(value) {
    let self = this;
    return new Promise (function(resolve, reject) {
      let i = 0;
      self.db.createReadStream().on('data', function(data) {
            i++;
          }).on('error', function(err) {
            console.log('Unable to read data stream!', err)
            reject(err);
          }).on('close', function() {
            console.log('Block #' + i);
            resolve(self.addLevelDBData(i, value));
          });
    });   
  }

  getBlocksCount() {
    let self = this;
    let counter = 0;
    
    // Add your code here
    return new Promise(function(resolve, reject){
        self.db.createReadStream()
        .on('data', function () {
            counter++;
        })
        .on('error', function (err) {
            reject(err)
        })
        .on('close', function () {
            console.log('This chain has ' + counter + ' blocks.');
            resolve(counter);
        });
    });

  }
}


/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

levelbox = new LevelSandbox();

(function theLoop (i) {
  setTimeout(function () {
    levelbox.addDataToLevelDB('Testing data');
    if (--i) theLoop(i);
  }, 100);
})(10);

levelbox.getBlocksCount();