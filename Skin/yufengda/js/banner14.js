/*xn_ba_js_14_banner*/
//自动播放与时间间隔
var xn_ba_js_14_autoPlay = true;
var xn_ba_js_14_interval = 5000;

/**
** 通过指定不同的数值变幻不同的效果
** xn_ba_js_14_effect = -1  原地透明渐变切换效果
** xn_ba_js_14_effect = 0  双按钮双效果切换效果
** xn_ba_js_14_effect = 1  全屏轮播
**/
var xn_ba_js_14_effect = -1;

/** 满屏播放(100%)或具体数值 **/
var bannerW = "100%";

var xn_ba_js_14_nextfunc;
var xn_ba_js_14_timer;


$(document).ready(function(){
	xn_ba_js_14_start();
	function banner_OnCreate()
	{
		$.ajax({url:"banner.txt",data:{key1:1,key2:2},success:initSuccess,error:initError,dataType:"text"});
	}
	
	function banner_reload()
	{
		window.location.reload(false);
	}
	
	
	function initSuccess(data)
	{
		$(".xn_ba_js_14_container").html(data);
		xn_ba_js_14_start();
		
	}
	
	function initError(XMLHttpRequest, textStatus, errorThrown)
	{
		alert("出现异常:"+[errorThrown,textStatus,errorThrown]);
	}
	
});

var xn_ba_js_14_start = function(){
	
	var maxLen = 0;
	var index = 0;
	var prev = 0;
	var imgW,imgH,sizeW,sizeH = 0;
	var running = false;

	maxLen = $(".xn_ba_js_14_element").length;
	imgW = $(".xn_ba_js_14_bigImg").find("img").eq(0).width();
	imgH = $(".xn_ba_js_14_bigImg").find("img").eq(0).height();

	//按钮相关
	var btnData = "";
	for(var i=0;i<maxLen;i++) btnData +='<li class="xn_ba_js_14_element_btn">';
	$(".xn_ba_js_14_btn").html(btnData);
	
	var btn = $(".xn_ba_js_14_btn").find("li").eq(0);
	var btnW = btn.width() + Math.round(btn.css("margin-left").replace(/[a-zA-Z]/g,""));
	$(".xn_ba_js_14_btn").css("width",maxLen * btnW);
	btn.attr("class","xn_ba_js_14_element_btn_on");
         
	$(".xn_ba_js_14_main").css("visibility","visible");
		$(".xn_ba_js_14_main").mouseover(function()
		{
			$(".xn_ba_js_14_arrow_left").stop().fadeTo(1000,0.4);
			$(".xn_ba_js_14_arrow_right").stop().fadeTo(1000,0.4);
		});
		
		$(".xn_ba_js_14_main").mouseout(function()
		{
			$(".xn_ba_js_14_arrow_left").stop().fadeTo(1000,0);
			$(".xn_ba_js_14_arrow_right").stop().fadeTo(1000,0);
		});
	
	for(var i = 0 ; i < maxLen ; i++){
		$(".xn_ba_js_14_element").eq(i).attr("id","ea_ba_no_b_" + i);
		var _pos = Math.round(imgW*(i-index)+sizeW/2-imgW/2);
		$(".xn_ba_js_14_element").eq(i).css({
			visibility:"hidden",
			opacity:0
		})
	}
	$(".xn_ba_js_14_element").eq(0).css({visibility:"visible",opacity:1}).animate({},{duration:400,easing:'linear'});
	onResize();
	$(window).resize(onResize);
	function onResize(){
		if(bannerW == "100%")
		{
			sizeW = $(window).width();
		}else
		{
			sizeW = parseInt(bannerW);
		}
		
		for(var i = 0 ; i < maxLen ; i++){
			var _pos = Math.round((sizeW-imgW)/2);
			$(".xn_ba_js_14_element").eq(i).css({
				left:_pos
			})
		}
	};
	
	$(".xn_ba_js_14_btn li").each(function(i){
		$(this).click(function(){
			toggleHandler(i);
		});
	});
	
	$(".xn_ba_js_14_arrow_left").click(function(){arrowOnClick(-1)});	
	$(".xn_ba_js_14_arrow_right").click(function(){arrowOnClick(1)});
	
	//添加计时器跳转
	timerRepeat();

	
	//点击按钮跳转相应页面
	function toggleHandler(target)
	{
		if(target == index)return;
		var dir = target > index ? 1 : -1;
		if(xn_ba_js_14_effect == 1)
		{
			//图片轮播效果
			if(dir==1)
			{
				for(var i=index+1;i<=target;i++)
				{
					index = i;
					nextPage();
				}
			}else if(dir == -1)
			{
				for(i=index-1;i>=target;i--)
				{
					index = i;
					prevPage();
				}
			}
		}else
		{
			//原地渐变切换效果
			var cur = index;
			if(dir==1)
			{
				cur++;
				if(cur >  maxLen-1)cur = 0;
			}else
			{
				cur--;
				if(cur < 0)cur = maxLen-1;
			}
			index = target;
			toggle();
		}
	}
	
	function skipHandler()
	{
		if(xn_ba_js_14_timer)
		{
			//重置
			clearInterval(xn_ba_js_14_timer);
			timerRepeat();
		}

		if ($(window.parent.bannerparam).length > 0) {
				//设置全局索引
		 	   window.parent.bannerparam.cur_ba_index = index;
		}
	
		var btn = $(".xn_ba_js_14_btn").find("li");
		btn.eq(prev).attr("class","xn_ba_js_14_element_btn");
		btn.eq(index).attr("class","xn_ba_js_14_element_btn_on");
		
		var indexPic = $(".xn_ba_js_14_element").eq(index);
		var prevPic = $(".xn_ba_js_14_element").eq(prev);
		indexPic.css("visibility","visible");
		indexPic.css({visibility:"visible",left:Math.round((sizeW-imgW)/2)});
	}

	//图片轮转,循环播放
	function timerRepeat()
	{
		if(!xn_ba_js_14_autoPlay)return;
		xn_ba_js_14_nextfunc = isPause;
		xn_ba_js_14_timer = setInterval("xn_ba_js_14_nextfunc()",xn_ba_js_14_interval);	
	}
	
	function isPause()
	{
		//每次跳转前检测判断值
		var isRun = true;
		if(typeof parent.runonce != 'undefined') {
			isRun = parent.runonce;
		}
		if(isRun)  {
			var cur = index;
			cur++;
			if(cur >  maxLen-1)cur = 0;
			toggleHandler(cur);
			return false;
		}else
		{
			return true;
			//暂停
		}
	}
	
	function toggle(){
	
		skipHandler();
		var indexPic = $(".xn_ba_js_14_element").eq(index);
		var prevPic = $(".xn_ba_js_14_element").eq(prev);
		indexPic.stop().css("opacity",0).animate({
			opacity:1
		},{
			duration:700,
			easing:'easeOutQuint',
			complete:function()
			{
				slideEnd(prevPic);
			}
		});
		
		//IE8 文字透明度无效
		indexPic.find(".xn_ba_js_14_zt").stop().animate({
			opacity:1
		},{
			duration:700
		});
		prevPic.find(".xn_ba_js_14_zt").stop().animate({
			opacity:0
		},{
			duration:700
		});
		
		
		prevPic.stop().animate({
			opacity:0
		},{
			duration:700,
			easing:'easeOutQuint'
		});
		prev = index;
	}
	
	function arrowOnClick(dir)
	{
		if(xn_ba_js_14_effect == 0 || xn_ba_js_14_effect == 1)
		{
			//图片轮播效果
			if(dir==1)
			{
				index++;
				if(index>=maxLen)index = 0;
				nextPage();
			}else if(dir == -1)
			{
				index--;
				if(index<0)index = maxLen - 1;
				prevPage();
			}
		}else
		{
			//原地渐变切换效果
			if(dir==1)
			{
				index++;
				if(index >  maxLen-1)index = 0;
			}else
			{
				index--;
				if(index < 0)index = maxLen-1;
			}
			toggle();
		}
	}
	
	function prevPage(){
		skipHandler();
		$(".xn_ba_js_14_element").eq(index).find(".xn_ba_js_14_zt").stop().css("opacity",1);
		
		for(var i = 0 ; i < maxLen ; i++){
			var _pos = Math.round(imgW*(i-index)+$(window).width()/2-imgW/2);
			var _opa = 1;
			if(_pos < -imgW){
				_pos += maxLen*imgW
			}else if(_pos > $(window).width()+imgW){
				_pos -= maxLen*imgW
			}
			$(".xn_ba_js_14_element").eq(i)
			.stop()
			.css({
				left:_pos-imgW
			})
			.animate({
				left:_pos,
				opacity:_opa
			},{
				duration:700 ,
				easing:'easeOutQuint',
				queue:false
			})
		}
		prev = index;
	}
	
	function nextPage()
	{
		skipHandler();
		$(".xn_ba_js_14_element").eq(index).find(".xn_ba_js_14_zt").stop().css("opacity",1);
		
		for(var i = 0 ; i < maxLen ; i++){
			var _pos = Math.round(imgW*(i-index)+sizeW/2-imgW/2);
			var _opa = 1;
			if(_pos > sizeW){
				_pos -= maxLen*imgW
			}else if(_pos < -imgW*2){
				_pos += maxLen*imgW
			}
			$(".xn_ba_js_14_element").eq(i)
			.stop()
			.css({
				left:_pos+imgW
			})
			.animate({
				left:_pos,
				opacity:_opa
			},{
				duration:700 ,
				easing:'easeOutQuint'
			})
		}
		prev = index;
	}
	
	function slideEnd(element)
	{
		var prevPic = $(".xn_ba_js_14_element").eq(prev);
		element.css("visibility","hidden");
		prev = index;
	}
}

/*-----
EASING

------*/
jQuery.extend( jQuery.easing,{
	def: 'easeOutQuint',
	swing: function (x, t, b, c, d) {
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}
});
/*end_xn_ba_js_14_banner*/