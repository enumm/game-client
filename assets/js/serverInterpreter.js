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
});

socket.on('game_starting', function (data) {
    menuScreen.msgStartGame(data);  
});

socket.on('game_ended', function (data) {
    hideGameInstance();
    showMenu(); 
});

socket.on('message', function (data, oData) {
    instanceData = data;
    opponentData = oData;
});

}());