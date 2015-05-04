//# sourceURL=friendScreen.js
(function() {

	var o = window.friendScreen = {};
	
	o.add = function(){
	assets.sendMSG('add_friend', {friendName : $('#addFriendUsername').val()});
	$('.addFriend').css('display','none');
    //registerScreen.getChildByName('registerBlock').htmlElement.style.display = "none";
	}

	o.destroy = function(){
    //registerScreen.getChildByName('registerBlock').htmlElement.style.display = "none";
	}

}());