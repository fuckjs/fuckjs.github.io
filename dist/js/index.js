
$(document).ready(function(){

	if($.cookie("userName")==null || $.cookie("userName")==undefined)
	{
		location.href="./html/login.html";
	}
	else
	{
//		alert($.cookie("name"));
		
		$('.username').text($.cookie("name"));
		$('.num').text($.cookie("userName"));
		if($.cookie("signing")==0)
		{
			$("#signing").text('未签约');
		}
		else if($.cookie("signing")==1)
		{
			$("#signing").text('签约');
		}
	    switch($.cookie("userType"))
	    {
	    	case 0:
	    	  $("#userType").text('管理员');
	    	 break;
	    	case 1:
	    	  $("#userType").text('业务员');
	    	 break;
	    	case 2:
	    	  $("#userType").text('商户');
	    	 break;
	    	default:
	    	 break;
	    }
	}
});
 /*
 * 功能：index页面退出按钮
 * 创建人：liql
 * 创建时间：2015-9-29
 */
$("#exit").click(function(){

      clearCookies();
      location.href="html/login.html";
});

