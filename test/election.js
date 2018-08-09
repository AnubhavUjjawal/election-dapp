var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts){
    var electionInstance;
    it("Initialises with two candidates", ()=>{
        return Election.deployed().then((instance)=>{
            return instance.candidatesCount();
        }).then((count)=>{
            assert.equal(count, 2);
        })
    })
    it("Initialises the candidates with correct values", ()=>{
        return Election.deployed().then((instance)=>{
            electionInstance = instance;
            return electionInstance.candidates(0);
        }).then((candidate)=>{
            assert.equal(candidate[0], 0, "is the correct id");
            assert.equal(candidate[1], "Garvit Kataria", "is the correct name");
            assert.equal(candidate[2], 0, "contains correct vote count");
            return electionInstance.candidates(1);
        }).then((candidate)=>{
            assert.equal(candidate[0], 1, "is the correct id");
            assert.equal(candidate[1], "Anurag Gupta", "is the correct name");
            assert.equal(candidate[2], 0, "contains correct vote count");
        });
    });
});