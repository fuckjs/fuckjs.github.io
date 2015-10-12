
/*
 * 功能：窗体加载
 * 创建人：liql
 * 创建时间：2015-9-28
 */
$(document).ready(function(){
//	$('.information_pop').hide();
	if($.cookie("userName") !=undefined)
	{
	  $("#phonenum").val($.cookie("userName"));
	}
	
    $("#updatePassword").click(function(){
       $('.box.box-default.information_pop').show();
    });

});
/*
   * 功能：修改密码事件
   * 创建人：Liql
   * 创建时间：2015-9-28
   */
//$("#updatePassword").click(function(){
//	$('.information_pop').show();
//});
/*
   * 功能：保存密码
   * 创建人：liql
   * 创建时间：2015-9-28
   */
$("#savePassword").click(function(){
	modifyPWD();	
});
/*
   * 功能：重置密码接口
   * 创建人：liql
   * 创建时间：2015-9-28
   */
function modifyPWD()
{
	var url=baseUrl;
	var jsonParam={
		"marked":"modifyPWD",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	
	var myjsonStr=setJson(null,"userName",$("#phonenum").val());
	myjsonStr=setJson(myjsonStr,"passWord",$("#oldPassword").val());
	myjsonStr=setJson(myjsonStr,"newPassWord",$("#newPassword").val());
	jsonParam.jsonStr=myjsonStr;
//	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_modifyPWDData);
};
/*
   * 功能：重置密码回调函数
   * 创建人：liql
   * 创建时间:2015-9-28
   */
function callback_modifyPWDData(data)
{
	console.log(data);
	if(data.rspCode!="000")
	{
		alert(data.rspDesc);
		return;
	}
	else 
	{
		alert(data.rspDesc);//重置成功
		//清空cookies
		clearCookies();
		location.href="././html/login.html";
	}
};

/*
   * 功能：清空cookie
   * 创建人：liql
   * 创建时间：2015-9-28
   */
function clearCookies(){
	    $.cookie("rembUser","false",{expires :-1,path:"/"});
		$.cookie("userName",'',{expires :-1,path:"/"});
		$.cookie("passWord",'',{expires :-1,path:"/"});
		$.cookie("shopId",'',{expires :-1,path:"/"});
		$.cookie("signing",'',{expires :-1,path:"/"});
		$.cookie("photo_url",'',{expires :-1,path:"/"});
		$.cookie("userType",'',{expires :-1,path:"/"});
		$.cookie("enable",'',{expires :-1,path:"/"});
		$.cookie("userid",'',{expires :-1,path:"/"});
	    $.cookie("id",'',{expires :-1,path:"/"});
		$.cookie("name",'',{expires :-1,path:"/"});
		$.cookie("shopNumber",'',{expires :-1,path:"/"});
		$.cookie("terminalNum",'',{expires :-1,path:"/"});
		$.cookie("wangDianNumber",'',{expires :-1,path:"/"});
};

