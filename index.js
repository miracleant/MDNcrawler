var https=require('https');
var fs=require('fs');
var cheerio=require('cheerio');

//获取MDN的JavaScript的网址
var url='https://developer.mozilla.org/zh-CN/docs/Web/JavaScript';


//利用http,爬取MDN的html页面
https.get(url,function(res){
	var html= '';

	res.on('data',function(data){
		html+=data;
	})
//将MDN的页面保存，便于分析元素
//此处是我发现，在网页上有的类名，在html文件里面却没有
	res.on('end',function(){
		fs.writeFile('creawer.txt',html,function(err){
			if(err){
				console.log(err);
			}
		})
		//console.log(html);

		filterHtml(html);
	})
}).on('error',function(){
	console.log('somgthing error!');
})

//利用cheer处理html，提取自己想要的元素
function filterHtml(html){
	var quickUrl=[];
	var $=cheerio.load(html);
	var quickUrls=$('.quick-links').children('ol');

	var quicklinksOl=quickUrls.find('li');
		quicklinksOl.each(function(item){
				
				var title=$(this).children('a').text();
				var url=$(this).children('a').attr('href');
				quickUrl.push({
					title:title,
					url:'https://developer.mozilla.org'+url
				})
				

			/*var lis=$(this).children('ol').find('li');

				lis.each(function(item){
				var title=$(this).find('a').text();
				var url=$(this).find('a').attr('href');
				quickUrl.push({
					title:'+'+title,
					url:'https://developer.mozilla.org'+url
				})
			})*/
		})

		//数据格式化
		var str=''; 
		quickUrl.forEach(function(item){
			str+='['+item.title+']';
			str+='('+item.url+') \n\n';
		})

		//JSON格式写入
		/*fs.writeFile('result.txt',JSON.stringify(quickUrl),function(err){
			if(err){
				console.log(err);
			}
		})*/

		fs.writeFile('result.md',str);
}