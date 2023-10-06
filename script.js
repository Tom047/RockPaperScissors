function choice1() {
    var element = document.querySelector('.rock');
    element.classList.add('clicked');
    var element = document.querySelector('.paper');
    element.classList.remove('clicked');
    var element = document.querySelector('.scis');
    element.classList.remove('clicked');
}
function choice2() {
    var element = document.querySelector('.rock');
    element.classList.remove('clicked');
    var element = document.querySelector('.paper');
    element.classList.add('clicked');
    var element = document.querySelector('.scis');
    element.classList.remove('clicked');
}
function choice3() {
    var element = document.querySelector('.rock');
    element.classList.remove('clicked');
    var element = document.querySelector('.paper');
    element.classList.remove('clicked');
    var element = document.querySelector('.scis');
    element.classList.add('clicked');
}

// Set the contract address and ABI
const contractAddress = '0x4D83e37B9278A4BbCF4f5ec59b84A12688C09f00'; // Replace with your contract address
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissors.Move",
                "name": "playerMove",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissors.Move",
                "name": "opponentMove",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum RockPaperScissors.Result",
                "name": "result",
                "type": "uint8"
            }
        ],
        "name": "GameResult",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "enum RockPaperScissors.Move",
                "name": "_playerMove",
                "type": "uint8"
            }
        ],
        "name": "play",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newMinimumBet",
                "type": "uint256"
            }
        ],
        "name": "setMinimumBet",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "gameRecords",
        "outputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "internalType": "enum RockPaperScissors.Move",
                "name": "playerMove",
                "type": "uint8"
            },
            {
                "internalType": "enum RockPaperScissors.Move",
                "name": "opponentMove",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "betAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum RockPaperScissors.Result",
                "name": "result",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGameRecords",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    },
                    {
                        "internalType": "enum RockPaperScissors.Move",
                        "name": "playerMove",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum RockPaperScissors.Move",
                        "name": "opponentMove",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "betAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum RockPaperScissors.Result",
                        "name": "result",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct RockPaperScissors.Game[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "minimumBet",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "prizePool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

// Initialize web3 and contract when the script is loaded
const Web3 = require('web3');
web3 = new Web3(window.ethereum);
contract = new web3.eth.Contract(contractABI, contractAddress);

// Function to handle the Play button click event
async function play() {
    if (!web3) {
        alert('Web3 is not initialized.');
        return;
    }
    if (!contract) {
        alert('Contract is not initialized.');
        return;
    }

    const betAmount = document.getElementById('bet').value; // Get the bet amount from the input field
    const playerMove = getPlayerMove(); // Implement getPlayerMove to get the player's move (Rock, Paper, Scissors)

    // Make sure the player has selected a valid move
    if (!playerMove) {
        alert('Please select a valid move (Rock, Paper, or Scissors)');
        return;
    }

    // Check if MetaMask is installed and connected
    if (window.ethereum) {
        try {
            // Request access to the user's MetaMask account
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Send the transaction to the smart contract
            await contract.methods.play(playerMove).send({
                from: accounts[0], // Use the selected Ethereum address
                value: web3.utils.toWei(betAmount, 'ether'),
            });

            // Wait for the transaction to be mined (you can add loading animations here)
            alert('Transaction successful! Wait for the result.');

            // Retrieve the game result from the blockchain and display it in a popup
            const gameRecords = await contract.methods.getGameRecords().call();
            const result = gameRecords[gameRecords.length - 1].result;
            displayResult(result); // Implement displayResult to show the result in a popup

        } catch (error) {
            alert('Transaction failed. Please try again.');
            console.error(error);
        }
    } else {
        alert('MetaMask is not installed or not connected.');
    }
}

// Function to get the player's move
function getPlayerMove() {
    const rockButton = document.querySelector('.rock');
    const paperButton = document.querySelector('.paper');
    const scissorsButton = document.querySelector('.scis');

    if (rockButton.classList.contains('clicked')) {
        return 'Rock';
    } else if (paperButton.classList.contains('clicked')) {
        return 'Paper';
    } else if (scissorsButton.classList.contains('clicked')) {
        return 'Scissors';
    }

    return null; // Return null if no move is selected
}

// Function to display the game result in a popup
function displayResult(result) {
    let resultMessage = '';

    switch (result) {
        case 'Win':
            resultMessage = 'Congratulations! You won!';
            break;
        case 'Lose':
            resultMessage = 'Sorry, you lost.';
            break;
        case 'Draw':
            resultMessage = 'It\'s a draw.';
            break;
        default:
            resultMessage = 'Invalid result.';
    }

    // Create a popup element and display the result message
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<p>${resultMessage}</p>`;
    document.body.appendChild(popup);

    // Close the popup after a few seconds (you can customize the timing)
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000); // Close after 3 seconds (adjust as needed)
}

// Function to connect to MetaMask
async function connectToMetaMask() {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log(accounts[0]);
        } catch (err) {
            console.error(err.message);
        }
    } else {
        console.log("Please install MetaMask");
    }
}

// Call init when your page/app loads:
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Request access to the user's MetaMask account
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts[0]);
    } catch (err) {
        console.error(err.message);
    }

    // After web3 and contract are initialized, add event listener to Play button:
    document.getElementById('playButton').addEventListener('click', play);
});