$(function(){
	
	//获取用户信息  放到页面上
	var shopid=$.cookie('shopId');
	
	var jsonPrama = {
			"marked": "getShopRegInfo",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
	var myjsonStr = setJson(null, "shopid", shopid); //商户ID
	jsonPrama.jsonStr = myjsonStr;
	
	var url=baseUrl;
	
	jQuery.axjsonp(url, jsonPrama, callback_GetBussInfo);
	
	function callback_GetBussInfo(data){
		
		
		/*
		 * 省市下拉框部分的代码 Start  显示下拉框及点击事件
		 */
		
		var levelId;
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
		
			if(levelId==1){
				jQuery.axjsonp(url,jsonParam,callback_getRegionCode);
			}else{
				jQuery.axjsonp(url,jsonParam,callback_getRegionCode2);
			}
			
		};
		function callback_getRegionCode(viewdata){
			//插入32个省的名称
			var template="{{#LocationIDs}}<li locationID={{LocationID}}><a href='javascript:;'>{{name}}</a></li>{{/LocationIDs}}";
			var rendered=Mustache.render(template,viewdata);
			$("#BusInfProSel").html("");
			$("#BusInfProSel").append(rendered);
			
			//省份的选择部分点击时候  1.最上面变 2.第二个城市部分跟着变
			$("#BusInfProSel>li").click(function(){
				$("#BusInfProSel").siblings("button").eq(0).html($(this).children().eq(0).html())
				$("#BusInfProSel").siblings("button").eq(0).attr("locationID",$(this).attr("locationID"));
				
				
				var num=viewdata.LocationIDs.length;
				var locationID;
				for(var i=0;i<num;i++)
				{
					if(this.children[0].innerHTML==viewdata.LocationIDs[i].name)
					{
						locationID=viewdata.LocationIDs[i].LocationID;
					}
				}
				getRegionCode(2,locationID);
			})
			/*$("#BusInfCitySel>li").click(function(){
				$("#BusInfCitySel").siblings("button").eq(0).html($(this).children().eq(0).html());
			})*/
			
		};
		
		function callback_getRegionCode2(viewdata){
			var template="{{#LocationIDs}}<li locationID={{LocationID}}><a href='javascript:;'>{{name}}</a></li>{{/LocationIDs}}";
			var rendered=Mustache.render(template,viewdata);
			$("#BusInfCitySel").html("");
			$("#BusInfCitySel").append(rendered);
			
			$("#BusInfCitySel").siblings("button").eq(0).html(viewdata.LocationIDs[0].name);
			
			$("#BusInfCitySel>li").click(function(){
				$("#BusInfCitySel").siblings("button").eq(0).html($(this).children().eq(0).html());
				$("#BusInfCitySel").siblings("button").eq(0).attr("locationID",$(this).attr("locationID"));
			})
		}
		
		getRegionCode(1,0);	
		
		/*
		 * 省市下拉框部分的代码 End
		 */
		
		/*
		 行业下拉框的点击事件
		 * */
		$("#BusInfIndSel>li").click(function(){
			//$("#BusInfIndSel").siblings("button").eq(0).html($(this).html());
			$("#BusInfIndSel").siblings("button").eq(0).html($(this).children().eq(0).html());
		})
		
//		data={
//			    "rspCode": "000",
//			    "shops": [
//			        {
//			            "provice": "省份",
//			            "photo_url": "http://imgsize.ph.126.net/?enlarge=true&imgurl=http://img1.ph.126.net/mXy9a4bRknjuNkwDet7Cmg==/2890185060882818305.png_75x75x1x95.png",
//			            "tel": "13201021111",
//			            "cityID": "123",
//			            "companyName": "公司名称",
//			            "password": "111111",
//			            "contractStatus": "1",
//			            "city": "城市 ",
//			            "shopid": "ff8080814e33a7d6014e33e0645e0006",
//			            "email": "",
//			            "address": "地址",
//			            "name": "",
//			            "proviceID": "123",
//			            "industry": "1"
//			        }
//			    ],
//			    "rspDesc": "成功"
//		};
		if(data.rspCode=="000")
		{
			if(data.shops[0].contractStatus==1)
			{
				$("#sunhy-signStatus input").val("已签约");
			}else{
				$("#sunhy-signStatus input").val("未签约");
			}
			//$("div.col-xs-10>img").attr("src",data.shops[0].photo_url);
			$("#sunhy-contactPhone").get(0).children[0].value=data.shops[0].tel;//用户手机号
			$("#sunhy-cmnyName").get(0).children[0].value=data.shops[0].companyName;//公司名称
			$("#sunhy-busName").get(0).children[0].value=data.shops[0].shopShortName;//商户简称
			$("#sunhy-contactor").get(0).children[0].value=data.shops[0].name;	//联系人姓名
 			$("#BusInfProSel").siblings("button").eq(0).html(data.shops[0].provice);		//省份
 			$("#BusInfProSel").siblings("button").eq(0).attr("locationID",data.shops[0].proviceID);//省份ID
			$("#BusInfCitySel").siblings("button").eq(0).html(data.shops[0].city);		//城市
			$("#BusInfCitySel").siblings("button").eq(0).attr("locationID",data.shops[0].cityID);//城市ID
			$("#BusInfIndSel").siblings("button").eq(0).html(data.shops[0].industry);//行业
			$("#sunhy-address").val(data.shops[0].address);		//地址
			$("#sunhy-contactEmail").get(0).children[0].value=data.shops[0].email;//
			
			$("#BusInfCitySel").html("");
		}else{
			alert(data.rspDesc);
		}
		
	}		
		
		
		
	
	
	//修改完成点击提交
	$("#BusInfoBtn").click(function(){
		var url=baseUrl;
		var jsonPrama=getBusinissInfo();
		//alert(JSON.stringify(jsonPrama));
		jQuery.axjsonp(url, jsonPrama, callback_BusiInfoChange);
		
	})
	
	function callback_BusiInfoChange(data) {
			//console.log(data);
			//if()		//判断后台是否通过
			if(data.rspCode==000)
			{
				alert("修改成功");
				var jsonPrama = {
						"marked": "getShopRegInfo",
						"code": "10002",
						"version": "1.0",
						"jsonStr": {}
					};
				var myjsonStr = setJson(null, "shopid", shopid); //商户ID
				jsonPrama.jsonStr = myjsonStr;
				jQuery.axjsonp(url, jsonPrama, callback_GetBussInfo);
				
			}else{
				alert(data.rspDesc);
			}
	}
	
	function getBusinissInfo(){
	//获取表单内容 start
		var contractStatus=$("#sunhy-signStatus input").val();
		var cmpyName=$("#sunhy-cmnyName").get(0).children[0].value;//公司名称
		var busName=$("#sunhy-busName").get(0).children[0].value; //商户名称
		var industryName=$("#sunhy-industry").html();			//行业
		var province=$("#BusInfProSel").siblings("button").eq(0).html();			//省份  直接用selectedIndex？？
		var provinceID=$("#BusInfProSel").siblings("button").eq(0).attr("locationID");
		var city=$("#BusInfCitySel").siblings("button").eq(0).html();
		var cityID=$("#BusInfCitySel").siblings("button").eq(0).attr("locationID");
		var industry=$("#BusInfIndSel").siblings("button").eq(0).html();
		var address=$("#sunhy-address").val();					//住址
		var contactor=$("#sunhy-contactor").get(0).children[0].value;//联系人
		var contactPhone=$("#sunhy-contactPhone").get(0).children[0].value;//联系电话
		var contactEmail=$("#sunhy-contactEmail").get(0).children[0].value;//邮件
		var selfIntro=$("#sunhy-selfIntro").get(0).children[0].value;//
		//获取表单内容 End
		
		//拼装json
		var jsonPrama = {
			"marked": "modShopRegInfo",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		var myjsonStr = setJson(null, "tel", contactPhone); 
		myjsonStr = setJson(myjsonStr, "shopid", $.cookie('shopId'));
		myjsonStr = setJson(myjsonStr, "userid", $.cookie('userid'));
		myjsonStr = setJson(myjsonStr, "companyName", cmpyName);
		myjsonStr = setJson(myjsonStr, "name", contactor);
		myjsonStr = setJson(myjsonStr, "provice", province);
		myjsonStr = setJson(myjsonStr, "proviceID", provinceID);
		myjsonStr = setJson(myjsonStr, "city", city);
		myjsonStr = setJson(myjsonStr, "cityID", cityID);
		myjsonStr = setJson(myjsonStr, "address", address);
		myjsonStr = setJson(myjsonStr, "contractStatus", contractStatus);
		myjsonStr = setJson(myjsonStr, "email", contactEmail);
		myjsonStr = setJson(myjsonStr, "shopIntroduction", selfIntro);
		myjsonStr = setJson(myjsonStr, "industry", industry);
		myjsonStr = setJson(myjsonStr, "photo_url", "test");
		jsonPrama.jsonStr= myjsonStr;
		
		//var aaaaa=JSON.stringify(jsonPrama);
		return jsonPrama;
	}
})

