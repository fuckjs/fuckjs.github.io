/*
 * 功能：初始化select标签
 * 创建人：liql
 * 创建时间：2015-10-9
 */
var selectElement;
var selectValue;
function initialize(selectE)
{
	selectElement=selectE;
};
/*
 * 功能：获取已开通发券信息
 * 创建人：liql
 * 创建时间：2015-10-9
 */
function getPublishCouponList(startDate,endDate)
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getPublishCouponList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	var myjsonStr=setJson(null,"shopId",$.cookie("shopId"));
	myjsonStr=setJson(myjsonStr,"startDate",startDate);
	myjsonStr=setJson(myjsonStr,"endDate",endDate);
	myjsonStr=setJson(myjsonStr,"state",0);
	myjsonStr=setJson(myjsonStr,"page",1);
	myjsonStr=setJson(myjsonStr,"rows",10000);
	myjsonStr=setJson(myjsonStr,"userType",$.cookie("userType"));
	
	jsonParam.jsonStr=myjsonStr;
	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_getPublishCoupon);
};

/*
 * 功能:获取已开通发券信息回调函数
 * 创建人：Liql
 * 创建时间：2015-10-9
 */
function callback_getPublishCoupon(data)
{
	console.log(data);
	if(data==undefined)
	{
		return;
	}
	if(data.rspCode!="000")
	{
		alert(data.rspDesc);
		return;
	}
    //清空option
	$(selectElement+" option").remove();
	//添加所有券
	$(selectElement).append("<option value='' selected='selected'>所有券</option>");
	//根据data添加option 
	$.each(data.PublishCouponList, function(mainIndex,MainEntry) {
		$(selectElement).append("<option value='"+MainEntry.ticketTypeID+"'>"+MainEntry.ticketName+"</option>");
	});
	element=selectElement;
	$(element).change(function(){
		selectValue=$(this).val();
	});
};

