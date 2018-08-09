pragma solidity ^0.4.2;

contract Election{
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping (uint => Candidate) public candidates;
    mapping (address => bool) public voters;
    uint public candidatesCount;

    constructor() public{
        addCandidate("Garvit Kataria");
        addCandidate("Anurag Gupta");
    }
    function addCandidate(string _name) private{
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidatesCount++;
    }
    function vote(uint _candidateId) public{
        // has not already voted
        require(!voters[msg.sender], "You have already voted.");
        // has to be a valid candidate
        require(_candidateId >= 0 && _candidateId < candidatesCount, "Invalid candidate");
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount += 1;
    }
}