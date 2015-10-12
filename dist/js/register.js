var privice;
var city;
/*
 * 功能：注册事件
 * 创建人：liql
 * 创建时间：2015-9-29
 */
$("#registerBtn").click(function(){
	ShopRegInfo();
});
/*
 * 功能：注册验证码
 * 创建人：liql
 * 创建时间：2015-9-29
 */
$("#getCodeRegister").click(function(){
	sendVerCode("sendVerCodeForReg");
});
/*
 * 功能：返回登陆事件
 * 创建人：liql
 * 创建时间：2015-9-29
 */
$("#backLogin").click(function(){
	location.href="login.html";
});
/*
 * 功能：省份选择事件
 * 创建人：liql
 * 创建时间：2015-9-29
 */
//$("#proviceid li a").click(function(){
//	alert('x');
////	privice=$(this).parent().text();
////	$("#btnProvice").text(privice);
//});
/*
 * 功能：城市选择事件
 * 创建人：liql
 * 创建时间：2015-9-29
 */
//$("#cityid li a ").click(function(){
//	city=$(this).parent().text();
//	$("#btnCity").text(city);
//});
/*
 * 功能：注册接口
 * 创建人：liql
 * 创建时间：2015-9-29
 */
function ShopRegInfo(){
	var url=baseUrl;
	var jsonParam={
		"marked":"ShopRegInfo",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	
	var myjsonStr=setJson(null,"tel",$("#phoneNumUser").val());
	myjsonStr=setJson(myjsonStr,"password",$("#setPassword").val());
	myjsonStr=setJson(myjsonStr,"companyName",$("#companyName").val());
	myjsonStr=setJson(myjsonStr,"name",$("#name").val());
	myjsonStr=setJson(myjsonStr,"provice",selectProviceName);
	myjsonStr=setJson(myjsonStr,"proviceID",selectProviceId);
	myjsonStr=setJson(myjsonStr,"city",selectCityName);
	myjsonStr=setJson(myjsonStr,"cityID",selectCityId);
	myjsonStr=setJson(myjsonStr,"address",$("#address").val());
	myjsonStr=setJson(myjsonStr,"verificationcode",$("#phoneCode").val());
	jsonParam.jsonStr=myjsonStr;
//	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_ShopRegInfoData);
};
/*
 * 功能：注册接口回调函数
 * 创建人：liql
 * 创建时间：2015-9-29
 */
function callback_ShopRegInfoData(data)
{
	console.log(data);
	if(data==undefined)
	{
		return;
	}
	if (data.rspCode != "000") {
		alert(data.rspDesc);
		return;
	}
	else 
	{
		alert(data.rspDesc);
	}
	
};
