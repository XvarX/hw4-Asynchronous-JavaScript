//使用literal语法定义一个对象：XMLHttp
var XMLHttp = 
{
	//定义第一个属性，该属性用于缓存XMLHttpRequest对象的数组
	XMLHttpRequestPool: [],
	//对象的第一个方法，该方法用于返回一个XMLHttpRequest对象
	getInstance:function()
	{
		// 从XMLHttpRequest对象池中取出一个空闲的XMLHttpRequest
		for (var i = 0; i < this.XMLHttpRequestPool.length; i ++)
		{
			//如果XMLHttpReuqest的readyState为0，或者为4，
			//都表示当前的XMLHttpRequest对象为闲置的对象
			if (this.XMLHttpRequestPool[i].readyState == 0 || 
				this.XMLHttpRequestPool[i].readyState == 4)
			{
				return this.XMLHttpRequestPool[i];
			}
		}
		//如果没有空闲的，将再次创建一个新的XMLHttpRequest对象
		this.XMLHttpRequestPool[this.XMLHttpRequestPool.length] 
			= this.createXMLHttpRequest();
		//返回刚刚创建的XMLHttpRequest对象
		return this.XMLHttpRequestPool[this.XMLHttpRequestPool.length - 1];
	},
	//创建新的XMLHttpRequest对象
	createXMLHttpRequest:function()
	{
		//对于DOM 2 规范的浏览器
		var objXMLHttp = new XMLHttpRequest();
		return objXMLHttp;
	},
	//定义对象的第三个方法： 发送请求(方法[POST,GET], 地址, 数据, 回调函数)
	sendRequest: function (method, url, callback)
	{
		var objXMLHttp = this.getInstance();
		with(objXMLHttp)
		{
			try
			{
				//增加一个额外的randnum请求参数，用于防止IE缓存服务器响应
				if (url.indexOf("?") != -1)
				{
					url += "&randnum=" + Math.random();
				}
				else
				{
					url += "?randnum=" + Math.random();
				}
				//打开与服务器的连接
				open(method, url, true);
				send();	
				onreadystatechange = function ()
				{
					//当服务器的相应完成时，以及获得了正常的服务器响应
					if (objXMLHttp.readyState == 4 &&
						(objXMLHttp.status == 200 || 
							objXMLHttp.status == 304))
					{
						//当响应时机成熟时，调用回调函数处理响应
						callback(objXMLHttp.responseText);
					}
				}
			}
			catch(e)
			{
				alert(e);
			}
		}
	},
	abortALLRequest: function() {
        for (var i = 0; i < this.XMLHttpRequestPool.length; i ++) {
            this.XMLHttpRequestPool[i].abort();
        }   
    }
};
