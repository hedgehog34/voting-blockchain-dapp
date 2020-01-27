const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
const abi = JSON.parse('[{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"x","type":"bytes32"}],"name":"bytes32ToString","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"contractOwner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"type":"constructor"}]');

const { Contract, getAccounts } = web3.eth;
const { asciiToHex, hexToAscii, } = web3.utils;

// TODO: to use this method for account retrieval
const getAccount = index => getAccounts().then(result => result[index]);

// In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
const address = '0x28f673c06a3bc7119259af2c89a3ae96f400b3b5';

const contractInstance = new Contract(abi, address);
const candidates = { "Bill": "candidate-1", "Tom": "candidate-2", "Janice": "candidate-3" };

let account;

function voteForCandidate() {
  const candidateName = $("#candidate").val();
  const hexCandidateName = asciiToHex(candidateName);

  contractInstance.methods
    .voteForCandidate(hexCandidateName)
    .send({ from: account })
    .then(receipt => {
      console.log(receipt);

      const div_id = candidates[candidateName];

      contractInstance.methods
        .totalVotesFor(hexCandidateName)
        .call({ from: account })
        .then(result => {
          $("#" + div_id).html(result);
      });
    });
}

$(document).ready(function() {
  const candidateNames = Object.keys(candidates);
  
  web3.eth.getAccounts().then(result => {
    account = result[0];
  });

  for (var i = 0; i < candidateNames.length; i++) {
    const candidateName = candidateNames[i];

    contractInstance.methods
      .votesReceived(asciiToHex(candidateName))
      .call({ from: account })
      .then((result) => {
        $("#" + candidates[candidateName]).html(result);
    });
  }
});
