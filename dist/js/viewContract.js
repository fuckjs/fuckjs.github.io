$(function(){
	var shopid=$.cookie("shopId");
	var url=baseUrl;
	
	var jsonPrama = {
			"marked": "getContractInfo",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
	var myjsonStr = setJson(null, "shopid",shopid);
	jsonPrama.jsonStr=myjsonStr;
		
	jQuery.axjsonp(url,jsonPrama,callBack_viewContract);
	
})

function callBack_viewContract(data){
	/*{
    "rspCode": "000",
    "rspDesc": "成功",
    "contracts": [
        {
            "contractEndDate": 1469030400000,
            "contract_year_num": "1",
            "contractStartDate": 1437494400000,
            "contractNum": "MTN001",
            "yanQuanList": [],
            "qvDaoList": [],
            "signingDate": 1437494400000,
            "typeList": [],
            "zhiFuList": [],
            "yewuList": "优惠券"
        }
    ]
	}*/
	//alert(data.rspCode);
	if(data.rspCode=="000")
	{
		//合同信息 start
		var aContractList=$("#sunhy-contract-list dd");
	
		aContractList.eq(0).html(data.contracts[0].contractNum);
		aContractList.eq(1).html(data.contracts[0].signingDate);
		aContractList.eq(2).html(data.contracts[0].contractStartDate);
		aContractList.eq(3).html(data.contracts[0].contractEndDate);
		aContractList.eq(4).html(data.contracts[0].contract_year_num)
		aContractList.eq(5).html(data.contracts[0].yewuList);
		//合同信息 end
		
		//最后四个
		//viewContractQuan(data.contracts[0],"qvDaoList","#sunhy-qvDaoList");
		//viewContractQuan(data.contracts[0],"yanQuanList","#sunhy-yanQuanList");
		//viewContractQuan(data.contracts[0],"zhiFuList","#sunhy-zhiFuList");
		//viewContractQuan(data.contracts[0],"typeList","#sunhy-typeList");
	}else{
		alert(data.rspDesc);
	}
}


//封装的填充内容的函数
function viewContractQuan(data,datakey,boxid){
		var ListNum=data[datakey].length;	//一共有多少个
		var rowNum=Math.ceil(ListNum/4); //计算出有多少行
		var rowNum2=ListNum%4;	//计算出最后一行有多少个
	
		$(boxid).html('');
		var strContractList='';		//用来拼接的字符串
		
		for(var i=0;i<rowNum;i++)		//有多少行就加多少个class=row
		{
			var rowNum3;
			i<rowNum-1?rowNum3=4:rowNum3=rowNum2;	//除了最后一行，其他航都是4个
			for(var j=0;j<rowNum3;j++)
			{
				strContractList=strContractList+
						'<div class="col-xs-3">'+
	                		'<div class="form-group">'+
	                 		 	'<label>'+
	                     		 '<input type="checkbox" class="flat-red" disabled checked>'+
	                   		 		data[datakey][i*4+j]+
	                  		 	'</label>'+
	               			'</div>'+
	              		'</div>';
			}
			strContractList='<div class="row">'+strContractList+'</div>';
		}
		$(strContractList).appendTo(boxid);
		iCheckColor();
}









