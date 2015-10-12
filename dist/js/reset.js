
/*
   * 功能：重设密码事件
   * 创建人：liql
   * 创建时间：2015-9-25
   */
$("#resetPassword").click(function(){
	retrievePassword();
});
/*
 * 功能：获取验证码点击事件
 * 创建人：liql
 * 创建时间：2015-9-25
 */
$("#getCode").click(function(){
	sendVerCode("sendVerCode");
});

/*
   * 功能：获取验证码
   * 创建人：liql
   * 创建时间：2015-9-25
   */
function sendVerCode(marked)
{
	var url=baseUrl;
	var jsonParam={
		"marked":marked,
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};

	jsonParam.jsonStr=setJson(null,"username",$("#phoneNumUser").val());
//  console.log(jsonParam);
    
    jQuery.axjsonp(url,jsonParam,callback_sendVerCodeData);
};

/*
   * 功能：回调函数
   * 创建人：liql
   * 创建时间：2015-9-25
   */
function callback_sendVerCodeData(data)
{
	console.log(data);
	if(data.rspCode!="000")
	{
		alert(data.rspDesc);
		return;
	}
	else
	{
		
	}
};

/*
   * 功能：重设密码
   * 创建人：liql
   * 创建时间：2015-9-25
   */
function retrievePassword()
{
	var url=baseUrl;
	var jsonParam={
		"marked":"retrievePassword",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	
	var myjsonStr=setJson(null,"username",$("#phoneNumUser").val());
	myjsonStr=setJson(myjsonStr,"verificationcode",$("#verificationcode").val());
	myjsonStr=setJson(myjsonStr,"password",$("#setPassword").val());
	jsonParam.jsonStr=myjsonStr;
//	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_sendVerCodeData);
	
};
