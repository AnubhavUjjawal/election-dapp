pragma solidity ^0.4.2;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping (uint => Candidate) public candidates;
    uint public candidatesCount;

    constructor() public{
        addCandidate("Garvit Kataria");
        addCandidate("Anurag Gupta");
    }
    function addCandidate(string _name) private{
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }
}