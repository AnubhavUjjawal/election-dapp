App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 != 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }
    else{
      // specify default instance
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election){
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },

  render: function(){
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account){
      if(err == null){
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    // load contract data
    App.contracts.Election.deployed().then(function(instance){
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(count){
        var candidateResults = $("#candidatesResults");
        candidateResults.empty();

        var candidatesSelect = $("#candidatesSelect");
        candidatesSelect.empty();

        for(var i=0; i<count; i++){
          electionInstance.candidates(i).then(function(candidate){
            var id = candidate[0];
            var name = candidate[1];
            var votes = candidate[2];
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + votes + "</td></tr>";
            var candidateOption = "<option value=" + id + ">" + name + "</option>";
            candidatesSelect.append(candidateOption);
            candidateResults.append(candidateTemplate);
          }); 
        }
        return electionInstance.voters(App.account);
    }).then(function(hasVoted){
      if(hasVoted){
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function (error){
      console.warn(error);
    });

  },
  castVote: function(){
    var candidateId = $("#candidatesSelect").val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.vote(candidateId, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err){
      console.log(err);
    });
  },
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event);
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
