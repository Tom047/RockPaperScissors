// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    address public owner;
    uint256 public minimumBet = 100000000000000; //0.0001  tBNB (in Wei)
    uint256 public prizePool;
    
    enum Move { None, Rock, Paper, Scissors }
    enum Result { Win, Lose, Draw }
    event GameResult(address indexed player, Move playerMove, Move opponentMove, uint256 betAmount, Result result);
    
    struct Game {
        address player;
        Move playerMove;
        Move opponentMove;
        uint256 betAmount;
        Result result;
    }
    
    Game[] public gameRecords;

    constructor() payable {
        owner = msg.sender;
        prizePool = msg.value;
    }

    modifier hasPrizePoolEnough(uint256 value) {
        require(value*2 <= prizePool, "Sorry! There is not enough money in the prize pool!");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function setMinimumBet(uint256 _newMinimumBet) public onlyOwner {
        minimumBet = _newMinimumBet;
    }

    function randMod(uint256 _modulus) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % _modulus;
    }

    function play(Move _playerMove) public payable hasPrizePoolEnough(msg.value) {
        require(msg.value >= minimumBet, "Insufficient bet amount");
        require(_playerMove >= Move.Rock && _playerMove <= Move.Scissors, "Invalid move");

        uint256 playerBet = msg.value;
        Move opponentMove = Move(randMod(3) + 1);
        Result result;

        if (
            (_playerMove == Move.Rock && opponentMove == Move.Scissors) ||
            (_playerMove == Move.Paper && opponentMove == Move.Rock) ||
            (_playerMove == Move.Scissors && opponentMove == Move.Paper)
        ) {
            result = Result.Win;
        } else if (
            (_playerMove == Move.Rock && opponentMove == Move.Paper) ||
            (_playerMove == Move.Paper && opponentMove == Move.Scissors) ||
            (_playerMove == Move.Scissors && opponentMove == Move.Rock)
        ) {
            result = Result.Lose;
        } else {
            result = Result.Draw;
        }

        gameRecords.push(Game(msg.sender, _playerMove, opponentMove, playerBet, result));

        uint256 prizeReward = determinePrizeReward(result, playerBet);
        payable(msg.sender).transfer(prizeReward);
        prizePool = address(this).balance;

        emit GameResult(msg.sender, _playerMove, opponentMove, playerBet, result);
    }

    function determinePrizeReward(Result result, uint256 playerBet) internal pure returns (uint256) {
        uint256 prizeReward;
        
        if (result == Result.Win) {
            prizeReward = playerBet * 2;
        } else if (result == Result.Lose) {
            prizeReward = 0;
        } else {
            prizeReward = playerBet;
        }

        return prizeReward;
    }

    function getGameRecords() public view returns (Game[] memory) {
        return gameRecords;
    }
}