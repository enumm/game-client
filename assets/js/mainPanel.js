(function() {

	var o = window.mainPanel = {};

	o.showLogin = function(){
		$('.messageAreaLogin').css('display','block');
	}

	o.hideLogin = function(){
		$('.messageAreaLogin').css('display','none');
	}

	o.showRegister = function(){
		$('.messageAreaRegister').css('display','block');
		var heigth = 360;
		$('#mainPanelContainer').css('height', heigth + 'px');
		$('#logo').css('top', -1*heigth/8 + '%');
	}

	o.hideRegister = function(){
		$('.messageAreaRegister').css('display','none');
		var heigth = 300;
		$('#mainPanelContainer').css('height', heigth + 'px');
		$('#logo').css('top', -1*heigth/8 + '%');
	}

	o.hide = function(){
		$('#mainPanelContainer').css('display','none');
	}

	o.show = function(){
		$('#mainPanelContainer').css('display','block');
	}

	o.submitRegister = function(){
		$('#messageAreaRegister').css('color', '#fff');
    	$('#messageAreaRegister').text('Registering'); 

        if($('#txtRegisterPassword').val() ==  $('#txtRegisterPassword2').val()){
            assets.sendMSG('user_register', {name: $('#txtRegisterUser').val(), pass: $('#txtRegisterPassword').val()});
        }else{
            $('#messageAreaRegister').css('color', '#f00');
            $('#messageAreaRegister').text('Password doesnt match'); 
        }
	}

	o.register = function(){
		mainPanel.hideLogin();
		mainPanel.showRegister();
	}

	o.login = function(){
		assets.sendMSG('user_login', {name: $('#txtUser').val(), pass: $('#txtPassword').val()});	
	}

	o.OnGoogle_Login = function (authResult) {
        if (authResult['access_token']) {
            gapi.client.load('oauth2', 'v2', function()
            {
                gapi.client.oauth2.userinfo.get().execute(function(userData)
                {
                	var name = userData.given_name + userData.id.substr(userData.id.length - 4);
					assets.sendMSG('user_register', {name: name, pass: userData.id, loginType: "Google"});
                });
            });
        }
    }

    o.OnFacebook_Login = function () {
    FB.api('/me', function(response) {
    	var name = response.first_name + response.id.substr(response.id.length - 4);
		assets.sendMSG('user_register', {name: name, pass: response.id, loginType: "Facebook"});
    });
  }

	o.back = function(){
		mainPanel.hideRegister();
		mainPanel.showLogin();
	}

	o.msgRegisterResponse = function(msg){
	    $('#messageAreaRegister').css('color', '#f00');
	    $('#messageAreaRegister').text(msg); 
	}

	o.msgLoggedIn = function(){
	    hideLogin(); //LEFT FOR DEBUG ONLY

	    mainPanel.hide();
	    showMenu();
	}

	o.msgLoginFailed = function(msg){
	    $('#messageAreaLogin').css('color', '#f00');
	    $('#messageAreaLogin').text(msg); 
	}

}());