$(document).ready(function(){
	var IsCreatePage=false;
	var shopid=$.cookie("shopId");
	var usertype=$.cookie("userType");
	
	function Get_PubCouList(pageCurrent){
		var jsonPrama = {
			"marked": "shopList",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		var myjsonStr = setJson(null, "shopid", shopid); //商户ID
		myjsonStr = setJson(myjsonStr, "userType", usertype?usertype:"0");//商户类型
		myjsonStr = setJson(myjsonStr, "page", pageCurrent);//当前页
		myjsonStr = setJson(myjsonStr, "rows", "10");//每页显示记录条数
	
		jsonPrama.jsonStr = myjsonStr;
		
		var url=baseUrl;
		
		jQuery.axjsonp(url, jsonPrama, callback_ShopTable);
	}
	Get_PubCouList(1);
	
	
	function callback_ShopTable(viewdata){
//		{
//		    "rspCode": "000",
//		    "page": 0,
//		    "rspDesc": "成功",
//		    "list": [
//		        {
//		            "total": 1,
//		            "address": "地址",
//		            "wangDianID": "ff8080814e33a7d6014e33e0645e0006",
//		            "wangDianShortName": "梅泰诺科技北京分公司"
//		        }
//		    ],
//		    "rows": 10
//		}
		if(viewdata.rspCode=="000")
		{
			//门店列表
			$("#ShopTableList").html("");

			var template = "<tr><th>门店简称</th><th>所在位置</th><th>操作</th></tr>"
			+"{{#list}}"
	            +"<tr>"
	                    +"<td>{{wangDianShortName}}</td>"
	                    +"<td>{{address}}</td>"
	                    +"<td><button class='btn btn-primary btn-sm' name={{wangDianID}}>查看</button></td>"
	            +"</tr>"
	        +"{{/list}}";
		    Mustache.parse(template);
		    var rendered = Mustache.render(template,viewdata);
		    $("#ShopTableList").append(rendered);
		    
		    //分页插件
		    
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
		    
		    $("#ShopTableList button").click(function(){
				$('.box-default.box').css("display","block");
				var jsonPrama = {
					"marked": "shopInfo",
					"code": "10002",
					"version": "1.0",
					"jsonStr": {}
				};
				var myjsonStr = setJson(null, "wangDianID", $(this).attr("name")); //门店ID
				jsonPrama.jsonStr = myjsonStr;
				var url=baseUrl;
				jQuery.axjsonp(url, jsonPrama , callBack_shopInfo);
			})
		    
		    function callBack_shopInfo(viewdata){
//		    	{
//				    "time": "09:01:00--21:01:00",						1
//				    "shopNumber": "100100058120001",
//				    "rspCode": "000",
//				    "address": "地址",									1
//				    "customerServicePhone": "4006321008",
//				    "wangdianName": "梅泰诺科技北京分公司",				1
//				    "wangDianID": "ff8080814e33a7d6014e33e0645e0006",	1
//				    "name": "联系人姓名",								1
//				    "rspDesc": "成功",
//				    "poiID": "",									1
//				    "wangDianShortName": "梅泰诺科技北京分公司",
//				    "industry": "1",								1
//				    "terminalNums": [								1
//				        {
//				            "terminalNum": "01021111"
//				        },
//				        {
//				            "terminalNum": "20150627"
//				        },
//				        {
//				            "terminalNum": "10087616"
//				        }
//				    ]
//				}
		    	if(viewdata.rspCode=="000")
		    	{
		    		$("dl.dl-horizontal").html("");
		    	var template="<dt>门店名称：</dt>"+
                  "<dd>{{wangdianName}}</dd>"+
                  "<dt>商户编号：</dt>"+
                  "<dd>{{wangDianID}</dd>"+
                  "<dt>终端信息：</dt>"+
                  "<dd>{{terminalNums}}</dd>"+
                  "<dt>业态信息：</dt>"+
                  "<dd>{{industry}}</dd>"+
                  "<dt>门店位置：</dt>"+
                  "<dd>{{address}}</dd>"+
                  "<dt>客服电话：</dt>"+
                  "<dd>{{customerServicePhone}}</dd>"+
                  "<dt>营业时间：</dt>"+
                  "<dd>{{time}}</dd>"+
                  "<dt>联系人：</dt>"+
                  "<dd>{{name}}</dd>"+
                  "<dt>微信门店poi：</dt>"+
                  "<dd>{{poiID}}</dd>";
                  Mustache.parse(template);
				  var rendered = Mustache.render(template,viewdata);
				  $("dl.dl-horizontal").append(rendered);
		    	}else{
		    		alert(viewdata.rspDesc);
		    	}
		    	
		    }

		}else{
			alert(viewdata.rspDesc);
		}
	}
});
