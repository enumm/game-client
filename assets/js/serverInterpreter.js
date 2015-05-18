//# sourceURL=serverInterpreter.js
(function() {
    //socket = io('http://127.0.0.1:3003');
    socket = io('http://pc.enumm.me:10101');

    socket.on('connect_error', function(){
        gapi.auth.signOut();

        if(FB.getAccessToken()){
            FB.logout(function(response) {
            });
        }

        mainPanel.show();
        hideMenu();
        showDebug();
    });

    // maybe implement more events:  http://socket.io/docs/client-api/#io#emitter


    socket.on('hello', function (data) {
        console.log('Server says: ' + data.msg);
    });

    socket.on('user_login_response', function (data) {
        if(data.success){
            username = data.username;
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

    socket.on('show_user_data', function (data) {
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
        lblStats.x = 400+240+10;
        lblStats.y = 110;

        menuScreen.addChild(lblStats);
    });

    socket.on('get_user_friends_response', function (data){
        // var friends = '';
        // $.each(data, function(ind, el){
        //     friends += el.username + '</br>';
        // });

        userFriends = data;
        assets.sendMSG('get_online_user_list','');

        //$('#friendsArea').html(friends);
    });

    socket.on('online_users', function(data){
        var friends = '';

        for(var i  in userFriends){
            var online = false;

            for(var j in data){
                if(userFriends[i].username == data[j].username){
                    online = true;
                    break;
                }
            }

            friends += userFriends[i].username + '  <div style="width:13px;height:13px;display:inline-block;background-color:' + (online ? 'green' : 'grey') +'"></div></br>';
        }

        $('#friendsArea').html(friends);
    });

    socket.on('game_starting', function (data) {
        menuScreen.msgStartGame(data);  
    });

    socket.on('game_ended', function (data) {
        assets.gameEnded(data);
    });

    socket.on('matchmaking_canceled', function (data) {
        console.log('matchmaking canceled');
    });

    socket.on('message', function (data, oData) {
        //console.log('update from server');
        instanceData = data;
        opponentData = oData;
    });

    socket.on('chatMessage', function (data) {
        if(menuScreen){
            var chatArea = $('#chatArea');
            chatArea.append('<span><span style="color: ' + (username ==  data.user ? 'violet' : 'purple') + ';">' + data.user  +'</span>: ' + data.message +'</span></br>');
            chatArea.scrollTop(chatArea.prop('scrollHeight'))
        }
    });

    socket.on('usersConnected', function (data) {
        if(menuScreen){
            var userCount = $('#onlineUsers');
            userCount.html('Online: ' + data);
            assets.sendMSG('get_online_user_list','');
        }
    });

    socket.on('friend_add_responce',  function (data) {
        if(menuScreen){
            $('#msgFriendArea').text(data.msg);
            $('#msgFriendArea').css('color', (data.success ? 'green' : 'red'));
        }
    });

    socket.on('receiveKongo', function (data) {
        window.location.assign('http://www.matmartinez.net/nsfw/');
    });    

}());