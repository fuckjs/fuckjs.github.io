$(function(){
	var IsCreatePage=false;
	var shopid=$.cookie("shopId");
	//开始结束日期的初始化
	var oDateorgStart=new Date();
	var oDateorgEnd=new Date();
	oDateorgEnd.setDate(oDateorgStart.getDate()-7);
	
	var strDate=toDub(oDateorgStart.getFullYear())+'-'+toDub((oDateorgStart.getMonth()+1))+'-'+toDub(oDateorgStart.getDate());
	var endDate=toDub(oDateorgEnd.getFullYear())+'-'+toDub((oDateorgEnd.getMonth()+1))+'-'+toDub(oDateorgEnd.getDate());

	
	//daterangepicker必须放到里面来   因为他有回调函数  回调函数又需要改变一个变量的值  如果daterangepicker放到外面则这个变量必须为全局变量 污染
	$('#RangeDate').daterangepicker(
        {
             //startDate: moment().startOf('day'),
            //endDate: moment(),
            //minDate: '01/01/2012',	//最小时间
            maxDate : moment(), //最大时间
            dateLimit : {
                days : 30
            }, //起止时间的最大间隔
            showDropdowns : true,
            showWeekNumbers : false, //是否显示第几周
            timePicker : false, //是否显示小时和分钟
            timePickerIncrement : 60, //时间的增量，单位为分钟
            timePicker12Hour : false, //是否使用12小时制来显示时间
            opens : 'right', //日期选择框的弹出位置
            buttonClasses : [ 'btn btn-default'],
            applyClass : 'btn-small btn-primary blue',
            cancelClass : 'btn-small',
            format : 'YYYY-MM-DD', //控件中from和to 显示的日期格式(YYYY-MM-DD HH:mm:ss)
            separator : ' to ',
            locale : {
                applyLabel : '确定',
                cancelLabel : '取消',
                fromLabel : '起始时间',
                toLabel : '结束时间',
                customRangeLabel : '自定义',
                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月',
                    '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                firstDay : 1
            }
        }, function(start, end, label) {//格式化日期显示框
            $('.data_time').text(start.format('YYYY-MM-DD') + ' 至 ' + end.format('YYYY-MM-DD'));
        	SelectedRangeDate(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
        }
	);

	//确定查询的开始和结束日期  起始日期存到strDate中 结束日期存到endDate中
	$("#PubCouselectDate").change(function(){
		if($(this).children('option:selected').val()=="自定义")
		{
			$("#RangeDate").data("daterangepicker").show();
		}else {
			var nowDate=new Date();
			var pastDate=new Date();
			if($(this).children('option:selected').val()=="过去7天")
			{
				pastDate.setDate(nowDate.getDate()-7);
			}else if($(this).children('option:selected').val()=="过去30天")
			{
				pastDate.setDate(nowDate.getDate()-30);
			}else{
				pastDate.setDate(nowDate.getDate()-90);
			}
			strDate=toDub(nowDate.getFullYear())+'-'+toDub((nowDate.getMonth()+1))+'-'+toDub(nowDate.getDate());
			endDate=toDub(pastDate.getFullYear())+'-'+toDub((pastDate.getMonth()+1))+'-'+toDub(pastDate.getDate());
			$(".data_time.text-red").html(endDate+'至'+strDate);
		}	
	})
	
	$("#sunhy-PubCponCondSel").change(function(){
		$(".data_time.text-red").next().html($(this).val());
	})

	function toDub(n){
		if(n<10)
		{return "0"+n}
		else{
			return n
		}	
	}
	
	//自定义的时候的日期 直接传参传回 赋值给strDate和endDate
	function SelectedRangeDate(str,end)
	{
		strDate=toDub(str);
		endDate=toDub(end);
	}
	
	//点击查询时拼接字符串
	$("#PublishedCoupon-search").click(function(){
 		Get_PubCouList(1);
	})
	
	//拼接到json并发送
	function Get_PubCouList(pageCurrent) {
		
		var jsonPrama = {
			"marked": "getPublishCouponList",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		
		var state=$(".data_time.text-red").next().html();
		var stateNum=0;
		switch(state)
		{
			case "所有状态":stateNum=0;
			break;
			case "待审核":stateNum=1;
			break;
			case "领券中":stateNum=2;
			break;
			case "审核驳回":stateNum=3;
			break;
			case "活动结束":stateNum=4;
			break;
			case "过期":stateNum=5;
			break;
		}
		
		var myjsonStr = setJson(null, "startDate",endDate);
		myjsonStr = setJson(myjsonStr, "endDate",strDate);
		myjsonStr = setJson(myjsonStr, "state",stateNum);
		myjsonStr = setJson(myjsonStr, "page",pageCurrent);
		myjsonStr = setJson(myjsonStr, "rows","10");
		myjsonStr = setJson(myjsonStr, "shopId",shopid);
		myjsonStr = setJson(myjsonStr, "userType", "0")
		/*var myjsonStr = setJson(null, "startDate", "2015-09-01"); //开始时间
			myjsonStr = setJson(myjsonStr, "endDate", "2015-09-30");//结束时间
			myjsonStr = setJson(myjsonStr, "state", "0");//卡券状态
			myjsonStr = setJson(myjsonStr, "page", "1");//当前页
			myjsonStr = setJson(myjsonStr, "rows", "10");//每页显示记录条数
			myjsonStr = setJson(myjsonStr, "shopId", "ff8080814e33a7d6014e33e0645e0006");//商户ID
			myjsonStr = setJson(myjsonStr, "userType", "0");//商户类型*/
			jsonPrama.jsonStr = myjsonStr;

		var url=baseUrl;

		jQuery.axjsonp(url,jsonPrama, callBack_Get_PubCouList);
		/*var viewdata='';
		callBack_Get_PubCouList(viewdata)*/
	}
	
	//加载下方的表格
	function callBack_Get_PubCouList(viewdata)
	{
		/*
		 {
		    "total": 15,
		    "rspCode": "000",
		    "page": 0,
		    "rspDesc": "成功",
		    "PublishCouponList": [
		        {
		            "ticketTypeID": "402890cb5017c942015017caac920007",
		            "ticketName": "满 1 元减 1 元代金券",
		            "applyDate": "2015-09-29"
		        },
		        {
		            "ticketTypeID": "402890cb50178e15015017aed3dd004a",
		            "ticketName": "满 1 元减 1 元代金券",
		            "applyDate": "2015-09-29"
		        },
		        {
		            "ticketTypeID": "402890cb50178e150150179b69e40020",
		            "ticketName": "满 1 元减 1 元代金券",
		            "applyDate": "2015-09-29"
		        },
		        {
		            "ticketTypeID": "402890cb50178e1501501792cf39000b",
		            "ticketName": "满 1 元减 1 元代金券",
		            "applyDate": "2015-09-29"
		        },
		        {
		            "ticketTypeID": "402890cb50178e1501501790783d0002",
		            "ticketName": "满 1 元减 1 元代金券",
		            "applyDate": "2015-09-29"
		        }
		    ],
		    "rows": "10"
		}
		 * */
		//console.log(viewdata);
		$('#PubCouList').html("");//下方表格区域
		var template = "{{#PublishCouponList}}"
            +"<tr>"
                    +"<td>{{ticketName}}</td>"
                    +"<td>{{applyDate}}</td>"
                    +"<td>{{ticketState}}</td>"
                    +"<td><button class='btn btn-primary btn-sm' name={{ticketTypeID}}>查看</button></td>"
            +"</tr>"
        +"{{/PublishCouponList}}";
	    Mustache.parse(template);
	    var rendered = Mustache.render(template, viewdata);
	    //alert(rendered);
		$('#PubCouList').append(rendered);
	    
	    $('#PubCouList button').click(function(){
			$('#sunhy_box_default').css("display","block");
			var jsonPrama = {
				"marked": "getPublishCouponInfo",
				"code": "10002",
				"version": "1.0",
				"jsonStr": {}
			};
			var myjsonStr = setJson(null, "couponId",$(this).attr("name"));
			jsonPrama.jsonStr=myjsonStr;
			var url=baseUrl;

			jQuery.axjsonp(url, jsonPrama, callBack_PubCouList1);
		})
	    
	    if(!IsCreatePage)
		{
			IsCreatePage=true;	
			//插件
			$(".tcdPageCode").createPage({
		        pageCount:Math.ceil( viewdata.total/ viewdata.rows),//viewdata.TotalNum
		        current:viewdata.page,
		        backFn:function(p){
		        	//CurrPage=p;
			        //单击回调方法，p是当前页码
			        //alert(1);
			        Get_PubCouList(p);
		        }
	    	});
	    }
	}
	
	
	function callBack_PubCouList1(viewdata){
//			var viewdata={
//			ticketTypeID:123456,
//			ticketName:"没名儿生煎买50送10",
//			ticketShortName:"85折代金券-sun",
//			startDate:"2015-08-30",
//			endDate:"2015-09-30",
//			type:"代金券",
//			discount:0.5,
//			amountofline:"100元",
//			deductibleamount:"10",
//			remark:"每天晚餐时间",
//			ticketDescribe:"Fusce dapibus, tellus ac cursus commodo,",
//			ticketState:'abcc',
//			platform:[
//				{
//					platformName:"微信公众平台1",
//					platformState:"[被驳回1]",
//					result:"审核通过后将在【都能省】卡券商城及【商户自有公众号】中发放1",
//					sendNum:"500 张"
//				},{
//					platformName:"微信公众平台2",
//					platformState:"[被驳回2]",
//					result:"审核通过后将在【都能省】卡券商城及【商户自有公众号】中发放1",
//					sendNum:"1000 张"
//				}
//			],
//			shops:[
//				{
//					shopName:"没名儿生煎(东升科技店)",
//					address:"北京市 北京市 朝阳区武圣东里甲51号"
//				},{
//					shopName:"没名儿生煎(东升科技店)1",
//					address:"北京市 北京市 朝阳区武圣东里甲52号"
//				},{
//					shopName:"没名儿生煎(东升科技店)2",
//					address:"北京市 北京市 朝阳区武圣东里甲52号"
//				}
//			],
//			page:1,
//			rows:23,
//			rspCode:"-100",
//			rspDesc:"网络连接异常"
//			};




//		{
//		    "platform": [
//		        {
//		            "platformState": 1,
//		            "platformName": "5",
//		            "sendNum": "1000"
//		        }
//		    ],
//		    "startDate": "2015-09-06 00:09:00",
//		    "rspCode": "000",
//		    "ticketTypeID": "402890cb5017c942015017caac920007",
//		    "remark": "",
//		    "ticketName": "满 1 元减 1 元代金券",
//		    "rspDesc": "成功",
//		    "amountofline": "0",
//		    "endDate": "2015-10-06 00:10:00",
//		    "type": "0",
//		    "ticketState": 0,
//		    "getway": "0",
//		    "discount": "0",
//		    "shops": [
//		        {
//		            "address": "地址",
//		            "shopName": "梅泰诺科技北京分公司"
//		        }
//		    ],
//		    "rackRate": 0,
//		    "deductibleamount": "1"
//		}
		$("#sunhy_box_default h3").children().eq(2).html(viewdata.ticketShortName);
		
		$("#tab_1").html("");//把原来的优惠券信息清掉
		var template ="<dl class='dl-horizontal'><dt>优惠券名称：</dt>"+
	      "<dd>{{ticketName}}</dd>"+
	      "<dt>兑券日期：</dt>"+
	      "<dd>{{startDate}}——{{endDate}}</dd>"+
	      "<dt>卡券类型：</dt>"+
	      "<dd><span class='text-yellow'>{{type}}</span>折扣比例：{{discount}}最低消费：{{amountofline}}</dd>"+
	      "<dt>使用条件：</dt>"+
	      "<dd>{{remark}}</dd>"+
	      "<dt>优惠详情：</dt>"+
	      "<dd>{{ticketDescribe}}</dd></dl>";
	      
	    Mustache.parse(template);
	    var rendered = Mustache.render(template, viewdata);
	    $("#tab_1").append(rendered);
	    
	    
	    //第二个选项卡的
	    $("#tab_2").html("");//把原来的优惠券信息清掉
	    var template="{{#platform}}"+
	    '<div class="callout callout-success">'+
          '<p class="margin" style="float: right;">发放数量：{{sendNum}}</p>'+
          '<h4>{{platformName}}</h4>'+
          '<p>{{result}}</p>'+
          '<p>当前状态：{{platformState}}<span >券面优惠金额过大，与实际不符</span></p>'+
        '</div>'+
        '{{/platform}}';
        Mustache.parse(template);
	    var rendered = Mustache.render(template, viewdata);
	    $("#tab_2").append(rendered);
	    
		//第三个选项卡的
		$("#tab_3").html("");
		var template="<table class='table table-striped'>"+
			"<tr>"+
		        "<th>门店简称</th>"+
		        "<th>所在位置</th>"+
	        "</tr>"+
	        "{{#shops}}"+
	        "<tr>"+
	            "<td>{{shopName}}</td>"+
	            "<td>{{address}}</td>"+
	        "<tr>"+
			"{{/shops}}"+
			"</table>";
		Mustache.parse(template);
	    var rendered = Mustache.render(template, viewdata);
	    $("#tab_3").append(rendered);
		
	};
})
