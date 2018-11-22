# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Technologies
This project was created using (Node.JS)[https://nodejs.org/en/] and its framework (Express)[https://expressjs.com].

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```

## Running

- Run app.js through Node. Application will run on port 8000.
```
node app.js
```
- Endpoints
 Insert block: 
 http://localhost:8000/post with data payload
 Retrieve block info
 http://localhost:8000/get/<block_id>

## Examples

### Posting a block

*Request:*
`$ curl --header "Content-Type: application/json"  \ --request POST   --data '{"data":"example"}'   http://localhost:8000/block`

*Response:*
```
{"data":"Lulu Lindo","height":4,"time":"1542865146","previousBlockHash":"0e53541d2a0784007a21648e581b14fad85ac866d2ca3e756ecc4945c94e53ee","hash":"306bd76ff88b5116e1998ba614229112d15b28259bff8791f8124d6dcb2f89d6"}
```

### Retrieving a block by index

*Request:*
`$ curl http://localhost:8000/block/4`

*Response:*
```
{"data":"Lulu Lindo","height":4,"time":"1542865146","previousBlockHash":"0e53541d2a0784007a21648e581b14fad85ac866d2ca3e756ecc4945c94e53ee","hash":"306bd76ff88b5116e1998ba614229112d15b28259bff8791f8124d6dcb2f89d6"}
```

## Testing

To test code:

1: Open a command prompt or shell terminal after install node.js.

2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```

