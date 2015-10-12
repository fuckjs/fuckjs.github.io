$(function(){
	/*
	 * 
	 用一个假的data START
	
	var jsonPrama = {
			"marked": "getOpenChannelInfo",
			"jsonStr": {}
		};
	var myjsonStr = setJson(null, "shopid","dfsdfsd134263646611114");
	jsonPrama.jsonStr=myjsonStr;
	var jsonPramastr=JSON.parse(jsonPrama);
	//造一个假的data  END  jQuery.axjsonp
	
		 * */
		
	//jQuery.axjsonp(url,jsonPramastr,callBack_CouponChannel);
	
	
	
	
	//callBack_CouponChannel();
})

function callBack_CouponChannel()
{
	
	$("#sunhy-CouponChannel").html('<h5 class="text-red">※ 由梅泰诺运营人员开通</h5>');
	var data={
		'rspCode':000,
		'rspDesc':'',
		'ChannelList':[
				{platformID :123, platformName :'微信公众平台', weixinGZH :'没名生煎', platfrom_logo:'http://www.baidu.com'},
				{platformID :321, platformName :'微信公众平台', weixinGZH :'有名生煎', platfrom_logo:'http://www.baidu.com'}
				]
	}
	
	//alert($("#sunhy-CouponChannel").children().length)
	var num=data.ChannelList.length;
	for(var i=0;i<num;i++)
	{
		var str='';
		var strweixinGZH='';
		//alert(data.ChannelList[i]);
		if(data.ChannelList[i].weixinGZH)
		{
			strweixinGZH='<small>'+' 托管公众号 ：'+data.ChannelList[i].weixinGZH+'</small>';
		}
		str+='<div class="callout callout-success coupon_box">'+
                '<img src="./dist/img/user2-160x160.jpg" class="channel_logo">'+
                '<h4>'+data.ChannelList[i].platformName+strweixinGZH+'</h4>'+
                '<p>您的卡券审核通过后将在【都能省】卡券商城及【商户自有公众号】中发放</p>'+
              '</div>';
        $(str).appendTo("#sunhy-CouponChannel");
        
	}
	
}