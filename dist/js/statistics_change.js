
var CurrPage=1;
var PageSize=10;

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
// getPublishCouponList(StartDate,new Date(EndDate).format('yyyy-MM-dd'));
});
/*
 * 功能：导出事件
 * 创建人：liql
 * 创建时间：2015-10-9
 */
$("#exportChange").click(function(){
	ExportExcelData();
});
/*
   * 功能：按钮点击事件
   * 创建人：liql
   * 创建时间：2015-9-24
   */
$('.btn.btn-primary.btn-sm').click(function(){
	DateSet();
	Get_CouponAcceptList(1);
	IsCreatePage=false;
});
/*
   * 功能：兑券数据统计接口
   * 创建人：liql
   * 创建时间：2015-9-24
*/
function Get_CouponAcceptList(page)
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getCouponAcceptList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
		
	var myjsonStr=setJson(null,"channelId",$("#coupon_select").val());//$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr=setJson(myjsonStr,"page",page);
	myjsonStr=setJson(myjsonStr,"rows",PageSize);
	jsonParam.jsonStr=myjsonStr;
	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_CouponAcceptData);
};
/*
   * 功能：兑券数据统计接口回调函数
   * 创建人：liql
   * 创建时间：2015-9-24
*/
var flagLoad = true;
function callback_CouponAcceptData(data)
{
	console.log(data);
	if(data==undefined)
	{
		return;
	}
	if(data.rspCode !="0")
	{
		alert(data.rspDesc);
		return;
	}
	$('#CouponAcceptList').html("");
	var template=$('#CouponAcceptListTemplate').html();
	Mustache.parse(template);
	
	var rendered=Mustache.render(template,data);
	$('#CouponAcceptList').append(rendered);

	
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
		        Get_CouponAcceptList(p);
	        }
	    });
	}
	setTimeout(function () { Get_ChatCouponAcceptList(); }, 100);
};
/*
   * 功能：兑券数据统计接口图形表数据获取
   * 创建人：liql
   * 创建时间：2015-9-24
   */
function Get_ChatCouponAcceptList()
{
	var url=baseUrl;
	var jsonParam={
		"marked":"getCouponAcceptList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
	
	var myjsonStr=setJson(null,"channelId",$("#coupon_select").val());//$("#coupon_select").val()
	myjsonStr=setJson(myjsonStr,"startDate",StartDate);
	myjsonStr=setJson(myjsonStr,"endDate",new Date(EndDate).format('yyyy-MM-dd'));
	myjsonStr=setJson(myjsonStr,"page",1);
	myjsonStr=setJson(myjsonStr,"rows",10000);
	jsonParam.jsonStr=myjsonStr;
	console.log(jsonParam);
	jQuery.axjsonp(url,jsonParam,callback_chartCouponAcceptList);
};
/*
   * 功能：兑券数据统计接口图形表回调函数
   * 创建人：liql
   * 创建时间：2015-9-24
   */
 var template;
function callback_chartCouponAcceptList(data)
{
	$("#totalExchangePrice").html(data.totalExchangePrice);//承兑金额汇总
	$("#totalExchangeCoupons").html(data.totalExchangeCoupons);//兑券量汇总

	var charData=[];//图表量
    template=new Array();
	template.push([]);
	template.push([]);

	$.each(data.CouponAcceptList,function(MainIndex,MainEntry){
		template[0].push([MainIndex,MainEntry.exchangePrice]);//承兑金额
		template[1].push([MainIndex,MainEntry.exchangeCoupons]);//兑券量
	});
	
//	GetYmax(data.CouponAcceptList);
//	alert('x');
	var strRgba="";
	for (i = 0; i < 2; i++)
	{
		switch(i){ 
			case 0: 
				strRgba="rgba(30,144,255,0.5)";
				break;
			case 1: 
				strRgba="rgba(0,0,255, 0.5)";
				break; 
			default: 
				strRgba="rgba(244, 169, 162,0.5)";
				break; 
		} 
		charData.push({lines:{fillColor:strRgba.toString()},data:template[i]});
	}
	DrawChart(charData);
};
/*
 * 功能:获取Y轴最大值
 * 创建人：liql
 * 创建时间：2015-10-10
 */

/*
   * 功能：绘制图表函数
   */
function DrawChart(displayData)
{
	//获取y轴最大值
    var len = template[0].length; 
	var yMax = 0;

	for (var i = 0; i < len; i++)
	{

      if(parseFloat(yMax) < parseFloat(template[0][i][1]))
      {
      	yMax=template[0][i][1];

      }
      if(parseFloat(template[1][i][1]) > parseFloat(yMax))
	  {
	    yMax=template[1][i][1];
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
                ticks: yTicks,// [[0,"0"],10000, 20000, 40000, 80000, 120000, 150000],
                min: 0,
                max: yMax //150000
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
		"marked":"getCouponAcceptList",
		"code":"10002",
		"version":"1.0",
		"jsonStr":{}
	};
		
	var myjsonStr = setJson(null,"channelId",$("#coupon_select").val());//$("#coupon_select").val()
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

