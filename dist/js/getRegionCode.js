
var proviceElement;//省份标签
var cityElement;//城市标签
var proviceBtnElement;//省份按钮标签
var cityBtnElement;//城市按钮标签
var levelId;//级别1为省份，2为城市
var selectProviceName;//选择的省份名称
var selectProviceId;//选择的省份id
var selectCityName;//选择的城市名称
var selectCityId;//选择的城市id
/*
 * 初始化 省市的标签
 */
function initialize(proviceE,cityE,proviceBtnE,cityBtnE){
	proviceElement=proviceE;
	cityElement=cityE;
	proviceBtnElement=proviceBtnE;
	cityBtnElement=cityBtnE;
};
/*
 * 功能：窗体加载完毕事件
 * 创建人：liql
 * 创建时间：2015-10-8
 */
$(document).ready(function(){
	
	$(proviceElement+" li").remove();
	$(cityElement+" li").remove();
	//获取省
	getRegionCode(1,0);
});
/*
 * 功能：获取省市
 * 创建人：liql
 * 创建时间：2015-10-8
 */
function getRegionCode(level,locationId)
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getRegionCode",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	levelId=level;
	var myjsonStr=setJson(null,"level",level);
	myjsonStr=setJson(myjsonStr,"parentLocation",locationId);
	jsonParam.jsonStr=myjsonStr;
//	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_getRegionCode);
};

/*
 * 功能：获取省市回调函数
 * 创建人：liql
 * 创建时间：2015-10-8
 */
function callback_getRegionCode(data)
{
	if(data==undefined)
	{
		return;
	}
	if(data.rspCode!="000")
	{
		alert(data.rspDesc);
		return;
	}
	console.log(data);
	if(levelId==1)
	{
		AddProvice(data);
	}
	else if (levelId==2)
	{
		AddCity(data);
	}

};

/*
 * 功能：清空ul element 为省份标签id（#Provice）
 * 创建人：liql
 * 创建时间：2015-10-8
 */
function AddProvice(data)
{
	//清空ul element 为城市标签id（#Provice）
	$(proviceElement+" li").remove();

    //自动添加li
	$.each(data.LocationIDs, function(MainIndex,MainEntry){
		$(proviceElement).append("<li value="+MainEntry.LocationID+"><a href='#'>"+MainEntry.name+"</a></li>");
	});
	
	//li点击事件
	element=proviceElement+" li a";
   $(element).click(function(){
   	
    selectProviceName=$(this).parent().text();
	$(proviceBtnElement).text(selectProviceName);
	$(cityBtnElement).text('城市');//初始化城市
	
	selectProviceId=$(this).parent().attr('value');
//	console.log(selectProviceId);
//	
	//根据选择的省份，获取相对应的城市
	getRegionCode(2,selectProviceId);
    });
};

/*
 * 功能：清空ul element 为城市标签id（#City）
 * 创建人：liql
 * 创建时间：2015-10-8
 */
function AddCity(data)
{
	//清空ul （#city li）
	$(cityElement+" li").remove();

    //自动添加li
	$.each(data.LocationIDs, function(MainIndex,MainEntry){
		$(cityElement).append("<li value="+MainEntry.LocationID+"><a href='#'>"+MainEntry.name+"</a></li>");
	});
	
	//li点击事件
	element=cityElement+" li a";
   $(element).click(function(){
   	
    selectCityName=$(this).parent().text();
	$(cityBtnElement).text(selectCityName);
	
	selectCityId=$(this).parent().attr('value');
//	console.log(selectCityId);

    });
};


