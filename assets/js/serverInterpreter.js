//# sourceURL=serverInterpreter.js
(function() {
socket = io('http://pc.enumm.me:10101');
//socket = io('http://127.0.0.1:3003');
    
socket.on('hello', function (data) {
    console.log('Server says: ' + data.msg);
});

socket.on('user_login_response', function (data) {
    if(data.success){
        socket.emit('user_authenticated',  {uuid: data.uuid});
        mainPanel.msgLoggedIn();
    }
    else{
        mainPanel.msgLoginFailed(data.message);
    }
});

socket.on('user_register_response', function (data) {
    mainPanel.msgRegisterResponse(data.message); 
    if(data.loginData && (data.loginData.loginType == "Google" || data.loginData.loginType == "Facebook"))
    {
    	assets.sendMSG('user_login', {name: data.loginData.name, pass: data.loginData.pass});	
    }
});

socket.on('set_user_data', function (data) {
    var userStatistics = data.statistics;
    var userUsername = data.username;
    var statsString;

    if(typeof(userStatistics.wins) != "undefined" 
    && typeof(userStatistics.ranked_wins) != "undefined" 
    && typeof(userStatistics.rank) != "undefined" 
    && typeof(userStatistics.losses) != "undefined")
    {
        statsString = "Hello:" + userUsername + "\n"
                    + "Wins: " + userStatistics.wins + "\n"
                    + "Ranked Wins: " + userStatistics.ranked_wins + "\n"
                    + "Your rank is: " + translateRank(userStatistics.rank);
    }else{
        statsString = "Hello:" + userUsername + "\n"
                    + "User DB entry outdated, ineligible for stats\n"
                    + "Missing db fields:\n";
        if(typeof(userStatistics.wins) == "undefined"){
            statsString += "statistics.wins\n";
        }
        if(typeof(userStatistics.ranked_wins) == "undefined"){
            statsString += "statistics.ranked_wins\n";   
        }
        if(typeof(userStatistics.rank) == "undefined"){
            statsString += "statistics.rank\n";
        }
        if(typeof(userStatistics.losses) == "undefined"){
            statsString += "statistics.losses\n";
        };
        statsString += "Please remove the following fields:\n"
        if(typeof(userStatistics.win) != "undefined"){
            statsString += "statistics.win\n";
        }
        if(typeof(userStatistics.loss) != "undefined"){
            statsString += "statistics.loss\n";
        };
    }

    var lblStats = new createjs.Text(statsString, "20px Arial", "#fff");
    lblStats.x = 200+250;
    lblStats.y = 250;

    menuScreen.addChild(lblStats);
});

socket.on('game_starting', function (data) {
    menuScreen.msgStartGame(data);  
});

socket.on('game_ended', function (data) {
    hideGameInstance();
    showMenu(); 
});

socket.on('matchmaking_canceled', function (data) {
    console.log('matchmaking canceled');
});

socket.on('message', function (data, oData) {
    instanceData = data;
    opponentData = oData;
});

}());