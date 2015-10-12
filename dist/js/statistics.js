
var CurrPage=1;
var PageSize=5;

var IsCreatePage=false;
var StartDate=new Date();
var EndDate=new Date();

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
   getPublishCouponList(StartDate,new Date(EndDate).format('yyyy-MM-dd'));
});

/*
 * 功能：导出点击事件
 * 创建人：liql
 * 创建时间：2015-10-9
 */
$("#exportPublish").click(function(){
	ExportExcelData();
});
/*
 * 功能：查看按钮点击事件
 * 创建人：liql
 * 创建时间：2015-9-24
 */
$('.btn.btn-primary.btn-sm').click(function(){
	DateSet();
	Get_PutOutCouponList(1);
	IsCreatePage=false;
});
/*
 * 功能：发券数据统计接口
 * 创建人：liql
 * 创建时间：2015-9-23
 */
function Get_PutOutCouponList(page){

    var url=baseUrl;
	var jsonParam={
		"marked":"getPutOutCouponList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};

//	alert(selectValue);
    if(selectValue=="" || selectValue==undefined)
    {
    	selectValue="";
    }
	var myjsonStr = setJson(null, "channelId", $("#ticketSeciesName_select").val()); //渠道Id
	myjsonStr = setJson(myjsonStr, "ticketSeciesName", selectValue);//优惠券类型

	myjsonStr = setJson(myjsonStr, "startDate", StartDate);//统计开始日期
	myjsonStr = setJson(myjsonStr, "endDate", new Date(EndDate).format('yyyy-MM-dd'));//统计结束日期
	myjsonStr = setJson(myjsonStr, "page", page);//当前页码
	myjsonStr = setJson(myjsonStr, "rows", PageSize);//每页显示记录条数

	jsonParam.jsonStr=myjsonStr;
	console.log(jsonParam);

	jQuery.axjsonp(url,jsonParam,callback_PutOutCouponData);
   
};
/*
 * 功能：发券数据统计接口回调函数
 * 创建人：liql
 * 创建时间：2015-9-23
 */
var flagLoad = true;
function callback_PutOutCouponData(data){
	
	console.log(data);
	if(data==undefined)
	{
		return;
	}
	if (data.rspCode != "000") {
//		$('.fail').text(data.rspDesc);
		alert(data.rspDesc);
		return;
	}
	
	$('#dayTicketList').html("");
	var template=$('#PutOutCouponListTemplate').html();
	Mustache.parse(template);
    var rendered = Mustache.render(template, data);
    console.log(rendered);
	$('#dayTicketList').append(rendered);
	
	flagLoad=true;
	if(!IsCreatePage)
	{
	    IsCreatePage=true;	
		$(".tcdPageCode").createPage({
	        pageCount:Math.ceil( data.total/ PageSize),//viewdata.TotalNum
	        current:CurrPage,
	        backFn:function(p){
	        	//CurrPage=p;
		        //单击回调方法，p是当前页码
//		        alert(p);
//		        alert('x');
		        Get_PutOutCouponList(p);
	        }
	    });
	}
	setTimeout(function () { Get_chartCouponList(); }, 100);
};
/*
 * 功能：获取发券数据统计绘制图表数据
 * 创建人：liql
 * 创建时间：2015-9-24
 */
function Get_chartCouponList()
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getPutOutCouponList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};

	var myjsonStr=setJson(null,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr=setJson(myjsonStr,"channelId",$("#ticketSeciesName_select").val());//渠道id$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"ticketSeciesName","");//发券类型$("#ticketSeciesName_select").val()
	myjsonStr=setJson(myjsonStr,"page",1);
	myjsonStr=setJson(myjsonStr,"rows",10000);
	jsonParam.jsonStr = myjsonStr;
	
//	console.log(jsonParam);
	
	jQuery.axjsonp(url,jsonParam,callback_chartCouponList);
};

/*
 * 功能：绘制图表数据回调函数
 * 创建人：liql
 * 创建时间：2015-9-24
 */
var tempData1;
var tempData2;
function callback_chartCouponList(charData)
{
	//页面总值赋值
	$("#allSendCoupons").html(charData.allSendCoupons);//发放量
	$("#allTakeCoupons").html(charData.allTakeCoupons);//领用量
	$("#allExchangeCoupons").html(charData.allExchangeCoupons);//使用量
	$("#totalPrice").html(charData.totalPrice);//累计应收
	$("#factPrice").html(charData.factPrice);//累计实收
	$("#discountPrice").html(charData.discountPrice);//累计优惠
	
	var charData1=[];//总图表量1
	var charData2=[];//总图表量2
    tempData1=new Array();//量临时数组
	tempData1.push([]);
	tempData1.push([]);
	tempData1.push([]);
    tempData2=new Array();//金额临时数组
	tempData2.push([]);
	tempData2.push([]);
	tempData2.push([]);
	
	$.each(charData.dayTicketList, function(MainIndex,MainEntry){
		tempData1[0].push([MainIndex,MainEntry.sendCoupons]);//日发放量
		tempData1[1].push([MainIndex,MainEntry.takeCoupons]);//日领用量
		tempData1[2].push([MainIndex,MainEntry.exchangeCoupons]);//日使用量
		
		tempData2[0].push([MainIndex,MainEntry.dayTotalPrice]);//日累计账单金额
		tempData2[1].push([MainIndex,MainEntry.dayFactPrice]);//日累计实收金额
		tempData2[2].push([MainIndex,MainEntry.dayDiscountPrice]);//日累计优惠金额
	});
	var strRgba="";
	for (i = 0; i < 3; i++)
	{
		switch(i){ 
			case 0: 
				strRgba="rgba(30,144,255,0.5)";
				break;
			case 1: 
				strRgba="rgba(0,0,255, 0.5)";
				break; 
			case 2: 
				strRgba="rgba(199,21,133,0.5)"; 
				break; 
			default: 
				strRgba="rgba(0,128,128,0.5)";
				break; 
		} 
		charData1.push({lines:{fillColor:strRgba.toString()},data:tempData1[i]});
		charData2.push({lines:{fillColor:strRgba.toString()},data:tempData2[i]});
	}
	DrawChart(charData1);
	DrawChartPrice(charData2);
};


/*
 * 功能：绘制图表函数
 */
//绘制图表函数
function DrawChart(displayData)
{
	//获取y轴最大值
    var len = tempData1[0].length; 
	var yMax = 0;

	for (var i = 0; i < len; i++)
	{
      //console.log(tempData1[0][i][1]+"----"+tempData1[1][i][1]+"----"+tempData1[2][i][1]);
      if(parseFloat(yMax) < parseFloat(tempData1[0][i][1]))
      {
      	yMax=tempData1[0][i][1];
      }
      if(parseFloat(tempData1[1][i][1]) > parseFloat(yMax))
	  {
	    	yMax=tempData1[1][i][1];
	  }
	  if(parseFloat(tempData1[2][i][1]) > parseFloat(yMax))
	  {
	    	yMax=tempData1[2][i][1];
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
		//alert(sDate + "  "+eDate);
		xData.push([i, sDate.getMonth()+1+"月"+sDate.getDate()+"日".toString()]); 
		sDate=new Date(addDate(sDate,1));
		i++;
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
//                  fillColor: "rgba(72, 166, 217, 0.1)"
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

                ticks: yTicks,// [[0,"0"],10, 20, 40, 60, 80, 120],// yTicks,

                min: 0,

                max: yMax// 120 //yMax

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
                                xData[item.datapoint[0]][1]+" : "+item.datapoint[1]);
                }
            }
            else {
                 $("#Tooltip").remove();
                previousPoint = null;            
            }

    });
	
};
/*
 * 功能：绘制图表函数
 */
function DrawChartPrice(displayData)
{
	
	//获取y轴最大值
    var len = tempData2[0].length; 
	var yMax = 0;

	for (var i = 0; i < len; i++)
	{
      console.log(tempData2[0][i][1]+"----"+tempData2[1][i][1]+"----"+tempData2[2][i][1]);
      if(parseFloat(yMax) < parseFloat(tempData2[0][i][1]))
      {
      	yMax=tempData2[0][i][1];
      }
      if(parseFloat(tempData2[1][i][1]) > parseFloat(yMax))
	  {
	    	yMax=tempData2[1][i][1];
	  }
	  if(parseFloat(tempData2[2][i][1]) > parseFloat(yMax))
	  {
	    	yMax=tempData2[2][i][1];
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
		//alert(sDate + "  "+eDate);
		xData.push([i, sDate.getMonth()+1+"月"+sDate.getDate()+"日".toString()]); 
		sDate=new Date(addDate(sDate,1));
		i++;
	}
	//| X轴坐标格式化结束
	//+-----------------------------------------
	
    $.plot(
        //绑定容器
        $("#placeholderPrice"),
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
//                  fillColor: "rgba(72, 166, 217, 0.1)"
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
                ticks: yTicks,// [[0,"0"],10000, 20000, 40000, 80000, 120000, 150000],
                min: 0,
                max: yMax// 150000
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
    $('#placeholderPrice').unbind("plothover");
     var previousPoint = null;
    //绑定鼠标在图表上的事件
    $("#placeholderPrice").bind("plothover", function (event, pos, item) {
			if (item) {
				$(this).css("cursor","pointer");
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;
                    $("#Tooltip").remove();
                    showTooltip(item.pageX, item.pageY,
                                xData[item.datapoint[0]][1]+" : "+item.datapoint[1]);
                }
            }
            else {
                 $("#Tooltip").remove();
                previousPoint = null;            
            }

    });
};


//将查询结果导出为Excel文件
function ExportExcelData() {
	//组织请求参数
//	var url = baseUrl+"getDealBaiduListExcel?";
    var url="http://192.168.16.67:8080/MitenoWeb/download.action?";
	if(selectValue=="" || selectValue==undefined)
    {
    	selectValue="";
    }
    var jsonParam={
		"marked":"getPutOutCouponList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	var myjsonStr = setJson(null, "channelId", $("#ticketSeciesName_select").val()); //渠道Id
	myjsonStr = setJson(myjsonStr, "ticketSeciesName", selectValue);//优惠券类型
	
	myjsonStr = setJson(myjsonStr, "startDate", StartDate);//统计开始日期
	myjsonStr = setJson(myjsonStr, "endDate", new Date(EndDate).format('yyyy-MM-dd'));//统计结束日期
	myjsonStr = setJson(myjsonStr, "page", 1);//当前页码
	myjsonStr = setJson(myjsonStr, "rows", 10000);//每页显示记录条数
    jsonParam.jsonStr=myjsonStr;
    console.log(jsonParam);		
//	var tempObj = jQuery.parseJSON(jsonParam);
	var temp = $.param(jsonParam);
	//temp.replace("\/&\g","#");
	console.log(url+temp);
	window.open(url+temp,"导出Excel文件","",false);
};

