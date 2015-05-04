//# sourceURL=friendScreen.js
(function() {

	var o = window.friendScreen = {};
	
	o.add = function(){
	assets.sendMSG('add_friend', {friendName : $('#addFriendUsername').val()});
	$('#addFriend').css('display','none');
	}

	o.showAddFriendInput = function(){
		$('#addFriend').css('display','block');
	}

	o.showFriendPanel = function(){
		assets.sendMSG('load_friends');
	}

	o.destroy = function(){
    //registerScreen.getChildByName('registerBlock').htmlElement.style.display = "none";
	}

}());