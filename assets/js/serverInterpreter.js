(function() {

socket = io('http://pc.enumm.me:10101');
    
socket.on('hello', function (data) {
    console.log('Server says: ' + data.msg);
});

socket.on('user_login_responce', function (data) {
    if(data.success){
        socket.emit('user_authenticated',  {uuid: data.uuid});
        loginScreen.msgLoggedIn();
    }
    else{
        loginScreen.msgLogginFailed(data.message);
    }
});

socket.on('user_register_responce', function (data) {
    registerScreen.msgRegisterResponce(data.message);  
});

socket.on('game_starting', function (data) {
    menuScreen.msgStartGame(data);  
});

socket.on('game_ended', function (data) {
    hideGameInstance();
    showMenu(); 
});

socket.on('message', function (data) {
    instanceData = data;
});

}());