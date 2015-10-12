
var CurrPage=1;
var PageSize=10;

var IsCreatePage=false;
var IsCreatePageBusiness=false;
var StartDate=new Date();
var EndDate=new Date();
var businessDate;
/*
 * 功能：获取时间
 * 创建人：liql
 * 创建时间：2015-9-24
 */
function DateSet()
{
	var now=new Date(); 
	var years = now.getFullYear();
	var months = now.getMonth()+1;
	var days = now.getDate();
	
	switch($("#selectDate").val())//日期
	{
		case "过去7天":
			EndDate=years+"-"+months+"-"+days;
		    StartDate=addDate(EndDate,-7);
		  break;
		case "过去30天":
			EndDate=years+"-"+months+"-"+days;
		    StartDate=addDate(EndDate,-30);
		break;
		case "过去90天":
			EndDate=years+"-"+months+"-"+days;
		    StartDate=addDate(EndDate,-90);	
		  break;
		default:
		  break;
	}
	$('.data_time.text-red').html(new Date(StartDate).format('yyyy-MM-dd')+'至'+new Date(EndDate).format('yyyy-MM-dd'));
};
/*
 * 功能：接受日期回调函数
 * 创建人：liql
 * 创建时间：2015-9-25
 */
function SelectDateData(strDate,endDate)
{
	StartDate=strDate;
	EndDate=endDate;

};
/*
   * 功能：下拉框值改变触发事件
   * 创建人：liql
   * 创建时间：2015-9-24
   */
$("#selectDate").change(function(){
   DateSet();
    if($(this).val()=="自定义"){
            $("#customer").data("daterangepicker").show();
        }
// getPublishCouponList(StartDate,new Date(EndDate).format('yyyy-MM-dd'));
});
/*
 * 功能：支付导出
 * 创建人：liql
 * 创建时间：2015-10-9
 */
$("#exportPay").click(function(){
	ExportExcelData();
});
/*
 * 功能：交易流水导出
 * 创建人：liql
 * 创建时间：2015-10-9
 */
$("#exportBusiness").click(function(){
	ExportExcelDataBusiness(businessDate);
});
/*
 * 功能：按钮点击事件
 * 创建人：liql
 * 创建时间：2015-9-24
 */
$('.btn.btn-primary.btn-sm').click(function(){
	DateSet();
	Get_CouponPayList(1);
	IsCreatePage=false;
});

/*
 * 功能：获取支付数据统计接口
 * 创建人：liql
 * 创建时间：2015-9-24
 */
function Get_CouponPayList(page)
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getCouponPayList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};

	
	var myjsonStr=setJson(null,"channelId",$("#coupon_select").val());//渠道$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr=setJson(myjsonStr,"page",page);
	myjsonStr=setJson(myjsonStr,"rows",PageSize);
	jsonParam.jsonStr=myjsonStr;

//	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_CouponPayData);
};

/*
 * 功能：支付统计接口回调函数
 * 创建人：liql
 * 创建时间：2015-9-24
 */
var flagLoad = true;
function callback_CouponPayData(data)
{
	console.log(data);
	if(data==undefined)
	{
		return;
	}
	if(data.rspCode!="0")
	{
		alert(data.rspDesc);
		return;
	}
	
	$("#CouponPayList").html("");
	var template=$("#CouponPayListTemplate").html();
	Mustache.parse(template);

	var rendered=Mustache.render(template,data);
	$("#CouponPayList").append(rendered);
	
	$('.btn-primary').click(function(){
		
		if($('.information_pop').css("display") == 'none' )
	    {
	       var date=$(this).parent().parent().find("td:eq(0)").text();
	       if(date!="")
	       {
	       		$("#business-text").html(date.substr(0,4)+"-"+date.substr(4,2)+"-"+date.substr(6,2));
		        $('.information_pop').show();
                businessDate=date;
		        Get_DayBusinessList(1,date);
	            IsCreatePageBusiness=false;
	       }

	    }
	    else 
	    {
		   $('.information_pop').hide();
	    }
	});
	
	flagLoad=true;
	if(!IsCreatePage)
	{
		IsCreatePage=true;
		$(".tcdPageCode1").createPage({
			pageCount: Math.ceil(  data.total/ PageSize),
			current:CurrPage,
			backFn:function(p){
				Get_CouponPayList(p);
			}
		});
	}
	setTimeout(function(){Get_ChatCouponPayList();},100);
};

/*
 * 功能：支付接口图表
 * 创建人：liql
 * 创建时间：2015-9-24
 */
function Get_ChatCouponPayList()
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getCouponPayList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
		
	var myjsonStr=setJson(null,"channelId",$("#coupon_select").val());//渠道$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr=setJson(myjsonStr,"page",1);
	myjsonStr=setJson(myjsonStr,"rows",10000);
	jsonParam.jsonStr=myjsonStr;

//	console.log(jsonParam);

	jQuery.axjsonp(url,jsonParam,callback_ChatCouponPayList);
};

/*
 * 功能：支付接口图表回调函数
 * 创建人：liql
 * 创建时间：2015-9-24
 */
var tempData;
function callback_ChatCouponPayList(data)
{
	//页面总值赋值
	$("#allDealNumber").html(data.allDealMoney);//累计交易笔数
	$("#allDealMoney").html(data.allDealMoney);//交易金额

	
	var chatdata=[];
    tempData=new Array();
	tempData.push([]);
	tempData.push([]);
	
	$.each(data.CouponPayList,function(MainIndex,MainEntry){
		tempData[0].push([MainIndex,MainEntry.channelDealMoney]);
		tempData[1].push([MainIndex,MainEntry.channelDealNumber]);
	});
	
	var strRgba="";
	for (i = 0; i < 2; i++)
	{
		switch(i){ 
			case 0: 
				strRgba="rgba(50, 187, 157,0.5)";
				break;
			case 1: 
				strRgba="rgba(72, 166, 217, 0.5)";
				break; 
			default: 
				strRgba="rgba(244, 169, 162,0.5)";
				break; 
		} 
		chatdata.push({lines:{fillColor:strRgba.toString()},data:tempData[i]});
	}
	DrawChart(chatdata);
};

/*
   * 功能：绘制图表函数
   */
function DrawChart(displayData)
{
	//获取y轴最大值
    var len = tempData[0].length; 
	var yMax = 0;

	for (var i = 0; i < len; i++)
	{

      if(parseFloat(yMax) < parseFloat(tempData[0][i][1]))
      {
      	yMax=tempData[0][i][1];
      }
      if(parseFloat(tempData[1][i][1]) > parseFloat(yMax))
	  {
	    yMax=tempData[1][i][1];
	  }
    }

	var buchang=Math.ceil(yMax/10);
	var yTicks=new Array([0,"0"]);
	for(var i = 1; i < 10; i++)
	{
		yTicks.push([i*buchang]);
		//yTicks=yTicks+i*buchang+",";
	}
	yTicks.push([10*buchang]);
	//yTicks=yTicks+10*buchang+"]";
	yMax=10*buchang;
	
	 $("#Tooltip").remove();
	<!-- 绘制图表-->
	//+-----------------------------------------
	//| X轴坐标格式化开始
	var sDate=new Date(StartDate);
	var eDate=new Date(addDate(EndDate,1));
	var xData = [];

	var i=0;
	while(sDate.getFullYear()!=eDate.getFullYear()||sDate.getMonth()!=eDate.getMonth()||sDate.getDate()!=eDate.getDate())
	{
		xData.push([i, sDate.getMonth()+1+"月"+sDate.getDate()+"日".toString()]);
		sDate=new Date(addDate(sDate,1));
		i++;

//		if(i==7)break;
	}
	
	//| X轴坐标格式化结束
	//+-----------------------------------------
	
    $.plot(
        //绑定容器
        $("#placeholder"),
		displayData,
        //设置统一样式
        {
            // 自定义数据系列
            series: {
                //共有属性：点、线、柱状图的显示方式
                lines : {
                    // 是否显示
                    show: true,
                    // 线宽度
                    lineWidth: 1,
                    // 是否填充
                    fill: true,
                    // 填充色，如rgba(255, 255, 255, 0.8)
					// fillColor: "rgba(72, 166, 217, 0.1)"
                },
                //阴影大小
                shadowSize: 0
            },
            //线颜色
            colors: ["#32bb9d", "#48a6d9", "#f9dea3","#f4a9a2"],
            //坐标标记x轴
            xaxis: {
                ticks: xData,//[[1,"day1"],[2,"day2"],[3,"day3"],[4,"day4"],[5,"day5"],[6,"day6"],[7,"day7"]],
                min: 0,
                max: xData.length-1
            },
            //坐标标记y轴
            yaxis: {
                ticks: yTicks,// [[0,"0"], 2000, 4000, 6000, 8000, 10000],
                min: 0,
                max: yMax
            },
            grid: {
                // 是否显示格子
                show: true,
                // 数据的线是否绘制在网格线下
                aboveData: false,
                // 边框宽度
                borderWidth: 1,
                // 边框颜色
                borderColor:"white",
                // 网格线颜色
                tickColor:"#e8e8e8",
                // 监听鼠标点击，会生成plotclick事件
                clickable: true,
                // 监听鼠标移动，会生成plothover事件
                hoverable: true,
                // 鼠标附近元素高亮显示
                autoHighlight: true,
                mouseActiveRadius: 10
            }
        }
    );
     $('#placeholder').unbind("plothover");
     var previousPoint = null;
    //绑定鼠标在图表上的事件
    $("#placeholder").bind("plothover", function (event, pos, item) {
			if (item) {
				$(this).css("cursor","pointer");
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $("#Tooltip").remove();
                    showTooltip(item.pageX, item.pageY,
                                "数据 : "+item.datapoint[1]);
                }
            }
            else {
                $("#Tooltip").remove();
                previousPoint = null;            
            }

    });
	
};

/*
   * 功能：获取日交易流水接口
   * 创建人：liql
   * 创建时间：2015-9-24
   */
function Get_DayBusinessList(page,transDate)
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getDayBusinessList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};

	var myjsonStr=setJson(null,"channelId",$("#coupon_select").val());//渠道$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"transDate",transDate);
	myjsonStr=setJson(myjsonStr,"page",page);
	myjsonStr=setJson(myjsonStr,"rows",PageSize);
	jsonParam.jsonStr=myjsonStr;

//	console.log(jsonParam);

	jQuery.axjsonp(url,jsonParam,callback_DayBusinessData);
};

/*
   * 功能：获取日交易流水接口回调函数
   * 创建人：liql
   * 创建时间：2015-9-24
   */
var flagLoad1 = true;
function callback_DayBusinessData(data)
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
	$("#DayBusinessList").html("");
	var template=$("#DayBusinessListTemplate").html();
	Mustache.parse(template);
	
	var rendered=Mustache.render(template,data);
	$("#DayBusinessList").append(rendered);
	flagLoad1=true;
	if(!IsCreatePageBusiness)
	{
		IsCreatePageBusiness=true;
		$(".tcdPageCode").createPage({
			pageCount: Math.ceil(  data.total/ PageSize),
			current:CurrPage,
			backFn:function(p){
				Get_DayBusinessList(p);
			}
		});
	}

};

//将查询结果导出为Excel文件 支付
function ExportExcelData() {
	//组织请求参数
//	var url = baseUrl+"getDealBaiduListExcel?";
    var url="http://192.168.16.67:8080/MitenoWeb/download.action?";
	if(selectValue=="" || selectValue==undefined)
    {
    	selectValue="";
    }
    var jsonParam={
		"marked":"getCouponPayList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	
	var myjsonStr = setJson(null,"channelId",$("#coupon_select").val());//渠道$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr = setJson(myjsonStr, "page", 1);//当前页码
	myjsonStr = setJson(myjsonStr, "rows", 10000);//每页显示记录条数
    jsonParam.jsonStr=myjsonStr;
		
//	var tempObj = jQuery.parseJSON(myjsonStr);
	var temp = $.param(jsonParam);
	//temp.replace("\/&\g","#");
	console.log(url+temp);
	window.open(url+temp,"导出Excel文件","",false);
};

//将查询结果导出为Excel文件 流水交易
function ExportExcelDataBusiness(transDate) {
	//组织请求参数
//	var url = baseUrl+"getDealBaiduListExcel?";
    var url="http://192.168.16.67:8080/MitenoWeb/download.action?";
	if(selectValue=="" || selectValue==undefined)
    {
    	selectValue="";
    }
    var jsonParam={
		"marked":"getDayBusinessList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
//	alert(transDate);
	var myjsonStr = setJson(null,"channelId",$("#coupon_select").val());//渠道$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"transDate",transDate);
	
	myjsonStr = setJson(myjsonStr, "startDate", StartDate);//统计开始日期
	myjsonStr = setJson(myjsonStr, "endDate", new Date(EndDate).format('yyyy-MM-dd'));//统计结束日期
	myjsonStr = setJson(myjsonStr, "page", 1);//当前页码
	myjsonStr = setJson(myjsonStr, "rows", 10000);//每页显示记录条数
	jsonParam.jsonStr=myjsonStr;
		
//	var tempObj = jQuery.parseJSON(myjsonStr);
	var temp = $.param(jsonParam);
	//temp.replace("\/&\g","#");
	console.log(url+temp);
	window.open(url+temp,"导出Excel文件","",false);
};

