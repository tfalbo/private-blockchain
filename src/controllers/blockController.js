const BlockchainClass = require('../models/blockchain.js');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blockchain = new BlockchainClass.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code
            this.blockchain.getBlock([req.params.index])
                .then(result => {
                    res.json(result)
                }).catch( () => {
                    res.statusCode = 404;
                    res.send('Error! Block not found!');
                });      
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here
            if(req.body.data){
                this.blockchain.addBlock(req.body).then(result => {
                    res.json(result);
                });
                res.statusCode = 200;
            } else {
                res.statusCode = 400;
                res.send('Error! Please send valid data')
            }
        });
    }
}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}

