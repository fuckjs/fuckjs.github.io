$(function(){
	var type=0;
	var shopid=$.cookie("shopId");
	var usertype=$.cookie("userType")?$.cookie("userType"):0;
	
	
	//活动门店列表
	function Get_PubCouList(pageCurrent){
		var jsonPrama = {
			"marked": "shopList",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		var myjsonStr = setJson(null, "shopid", shopid); //商户ID
		myjsonStr = setJson(myjsonStr, "userType", usertype);//商户类型
		myjsonStr = setJson(myjsonStr, "page", pageCurrent);//当前页
		myjsonStr = setJson(myjsonStr, "rows", "10");//每页显示记录条数
	
		jsonPrama.jsonStr = myjsonStr;
		
		var url=baseUrl;
		
		jQuery.axjsonp(url, jsonPrama, callback_ShopTable);
	}
	Get_PubCouList(1);
	function callback_ShopTable(viewdata){
		$("#PubShopTable").html("");
//		{
//		    "total": 1,
//		    "rspCode": "000",
//		    "page": 0,
//		    "rspDesc": "成功",
//		    "list": [
//		        {
//		            "address": "地址",
//		            "wangDianID": "ff8080814e33a7d6014e33e0645e0006",
//		            "wangDianShortName": "梅泰诺科技北京分公司"
//		        }
//		    ],
//		    "rows": 10
//		}
		var template="{{#list}}<tr name={{wangDianID}}>"+
		"<td><input type='checkbox'  name='num' class='flat-red'></td>"+
                    "<td>{{wangDianShortName}}</td>"+
                    "<td>{{address}}</td>"+
                    "</tr>{{/list}}";
        Mustache.parse(template);
        var rendered=Mustache.render(template,viewdata);
        $("#PubShopTable").append(rendered);
	}
	
	
	
	
	//上方的下拉框对应的行内变化
	$("select.form-control").change(function(){
		switch(this.value){
			case "代金券（可设置为“满*元 减*元”）":
			$("ul.guize").children().css("display","none");
			$("ul.guize").children().eq(0).css("display","block");
			type=0;
			break;
			case "折扣券（可设置为“满*元 享受*折”）":
			$("ul.guize").children().css("display","none");
			$("ul.guize").children().eq(1).css("display","block");
			type=2;
			break;
			case "单品特价券(可设置为“原价*元 特价*元”)":
			$("ul.guize").children().css("display","none");
			$("ul.guize").children().eq(2).css("display","block");
			type=3;
			break;
			case "单品买赠券(可设置为“买*件 赠*件”)":
			$("ul.guize").children().css("display","none");
			$("ul.guize").children().eq(3).css("display","block");
			type=4;
			break;		
			default :
			$("ul.guize").children().css("display","none");
			$("ul.guize").children().eq(0).css("display","block");
			type=0;
		}
	})
	
	
	//点击提交按钮拼接json
	$("#PublishSubmit").click(function(){
		
		var jsonPrama={
			"marked":"pubCouponInfo",
			"code": "10002",
			"version": "1.0",
			"jsonStr":{}
		}
		
		var myjsonStr = setJson(null, "shopId","ff8080814e33a7d6014e33e0645e0006");
		myjsonStr = setJson(myjsonStr, "type",type);
		myjsonStr = setJson(myjsonStr, "ticketName",$("#focusedInput").val());
		myjsonStr = setJson(myjsonStr, "ticketName_FU",$("#disabledInput").val());
		myjsonStr = setJson(myjsonStr, "ticketDescribe",$("#editor1").val());
		myjsonStr = setJson(myjsonStr, "remark",$("#editor1").val());
		myjsonStr = setJson(myjsonStr, "startDate",PubtimeFormat($("#reservation1").val()));
		myjsonStr = setJson(myjsonStr, "endDate",PubtimeFormat($("#reservation2").val()));
		myjsonStr = setJson(myjsonStr, "deductibleamount","");
		myjsonStr = setJson(myjsonStr, "price","");
		myjsonStr = setJson(myjsonStr, "discount","");
		myjsonStr = setJson(myjsonStr, "buyNum","");
		myjsonStr = setJson(myjsonStr, "giveNum","");
		myjsonStr = setJson(myjsonStr, "oldPrice","");
		myjsonStr = setJson(myjsonStr, "sellPrice","");
		
		//时间格式化
		function PubtimeFormat(date){
			var arr=date.split("/");
			var arr2=[];
			arr2.push(arr[2]);
			arr2.push(arr[0]);
			arr2.push(arr[1]);
			date=arr2.join("-")
			return date;
		}
		
		//不同的优惠券对应不同的json字段
		switch($("#PubCouType").val()){
			case "代金券（可设置为“满*元 减*元”）":
			myjsonStr = setJson(myjsonStr, "price",$("ul.guize input").eq(0).val());
			myjsonStr = setJson(myjsonStr, "deductibleamount",$("ul.guize input").eq(1).val());
			break;
			case "折扣券（可设置为“满*元 享受*折”）":
			myjsonStr = setJson(myjsonStr, "price",$("ul.guize input").eq(2).val());
			myjsonStr = setJson(myjsonStr, "discount",$("ul.guize input").eq(3).val());
			break;
			case "单品特价券(可设置为“原价*元 特价*元”)":
			myjsonStr = setJson(myjsonStr, "oldPrice",$("ul.guize input").eq(4).val());
			myjsonStr = setJson(myjsonStr, "sellPrice",$("ul.guize input").eq(5).val());
			break;
			case "单品买赠券(可设置为“买*件 赠*件”)":
			myjsonStr = setJson(myjsonStr, "buyNum",$("ul.guize input").eq(6).val());
			myjsonStr = setJson(myjsonStr, "giveNum",$("ul.guize input").eq(7).val());
			break;
		}

		//发布渠道相关
		var num=$("#PubChannel-list div[aria-checked='true']").length
		var arr=[];
		for(var i=0;i<num;i++)
		{
			var PubChannelName=$("#PubChannel-list div[aria-checked='true']").eq(i).next().html();
			var json={};
			json["sendNumber"]="0";
			switch(PubChannelName)
			{
				case "微信公众平台":json["PubChannelName"]=5;
				break;
			}
			json["sendNumber"]=$("div.help-block input").eq(i).val();
			arr.push(json);
		}
		myjsonStr = setJson(myjsonStr,"plaform",arr);
		//myjsonStr = setJson(myjsonStr, "shops", [{"wangDianID":$}]);
		
		//活动门店相关
		var arr2=[];
		var num2=$("#PubShopTable").children().length;
		for(var i=0;i<num2;i++)
		{
			var json2={};
			json2["wangDianID"]=$("#PubShopTable>tr").eq(i).attr("name");
			arr2.push(json2);
		}
		myjsonStr= setJson(myjsonStr,"shops",arr2);
		
		jsonPrama.jsonStr=myjsonStr
		//console.log(myjsonStr);
		
		//改变右侧成型的优惠券
		console.log(myjsonStr);
		changePubRight(myjsonStr);
	    
	    var url=baseUrl;
	    
	    jQuery.axjsonp(url, jsonPrama , callBack_Publish);
	    console.log(JSON.stringify(jsonPrama));
	    
	    //改变右侧成型的优惠券
	    function changePubRight(myjsonStr){
			$("#PubChanContentHead").html("");
			var template='<h1><img src="./dist/img/user2-160x160.jpg" alt="222"><span>小肥羊</span></h1>'+
	        '<div>'+
	            '<h4>{{ticketName}}</h4>'+
	            '<h5>{{ticketName_FU}}</h5>'+
	            '<h5>有效期：{{startDate}}——{{endDate}}</h5>'+
	        '</div>';
	        Mustache.parse(template);  
		    var rendered = Mustache.render(template,jQuery.parseJSON(myjsonStr));
		    $("#PubChanContentHead").append(rendered);
		
			$("#PubChanContentCont").html("");
			var template='<div class="con_YH">'+
	                            '<h1>优惠详情：</h1>'+
	                            '<div>'+
	                                '<p>{{ticketDescribe}}</p>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div class="con_YH">'+
	                            '<h1>使用须知：</h1>'+
	                            '<div>'
	                                '<p>1.每个用户最多领取3张</p>'+
	                                '<p>2.蛋笔消费最多使用3张</p>'+
	                            '</div>'+
	                        '</div>'+
	                        '<div class="con_KF">'
	                            '<p>客服<span>4001687788</span></p>'
	                        '</div>';
	        Mustache.parse(template); 
		    var rendered = Mustache.render(template,jQuery.parseJSON(myjsonStr)); 
		    $("#PubChanContentCont").append(rendered);
		}
	})
	
	function callBack_Publish(viewdata){
		alert(viewdata.rspDesc);
	}
})
