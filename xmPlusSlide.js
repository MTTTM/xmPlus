/**
 * Created by Administrator on 2015/2/27.
 *
 */
(function($){
    $.fn.xmPlus=function(options)
    {
        $.fn.xmPlus.defaults={
            type:"slide",//可选menu和slide
            effect:"fade",
            titCeil:".hd ul",
            mainCeil:".bd ul",
            prevCeil:".prev",
            nextCeil:".next",
            pageState:".pageState",
            titOnClassName:"active",
            interTimer:null,//自动播放定时器，调用时候无需操作
            interTime:2500,//定时器间隔时间
            triggerTime:150,//鼠标经过延时执行时间
            delayTime:500,//动画执行时间
            autoPage:false,//是否自动添加头部可点击的列表，默认true
            defaultIndex:0,//默认第一个激活的索引，同时可通过修改了切换
            returnDefault:false,//是否返回默认被激活的元素,nav专用
            targetCeil:"",//nav||slideMen鼠标经过显示的下拉
            autoPlay:false,//是否自动播放，默认否
            trigger:"click",//默认事件
            defaultML:0,//永远不要操作，loop系列未执行复制前的main child 的长度
            vis:1,//可显示的个数,专用Loop系列
            scroll:1//每次滚动的个数


        };

        return $(this).each(function()
        {
            var opts= $.extend({}, $.fn.xmPlus.defaults,options);
            var plus=$(this);
            var effect=opts.effect;
            var  defaultIndex=opts.defaultIndex;
            var mainCeil=plus.find(opts.mainCeil);
            var titCeil=plus.find(opts.titCeil);
            var prevCeil=plus.find(opts.prevCeil);
            var nextCeil=plus.find(opts.nextCeil);
            var targetCeil=plus.find(opts.targetCeil);
            var autoPlay=opts.autoPlay;
            var interTimer=opts.interTimer;
            var interTime=opts.interTime;
            var trigger=opts.trigger;
            var triggerTime=opts.triggerTime;
            var delayTime=opts.delayTime;
            var defaultDirt=1;
            var  defaultML=opts.defaultML;
            var vis=opts.vis;
            var type=opts.type;
            var returnDefault=opts.returnDefault;
            var returnIndex=opts.defaultIndex;
            var pageState=plus.find(opts.pageState);
            var scroll=opts.scroll;
            var autoPage=opts.autoPage;
            var titOnClassName=opts.titOnClassName;
            init();
            function init()//初始化
            {
                defaultML=mainCeil.children().length;//保存LOOP还没有操作前的length
              //  returnIndex=defaultIndex;//保存首次激活元素的index，nav专用

                    if(vis<=defaultML&&type=="slide")
                    {
                        div();
                        createTab();//产生btn
                        evenTarget();//事件触发
                        tabClass();//切换class
                        toPlay();
                        prevNext();
                        pageStates();
                        if(autoPlay==true||autoPlay=="true"){ autoToPlay();}
                    }
                    else if(vis>defaultML&&type=="slide")
                    {
                        alert("报错，行数xmPlusSlide.js 76行 vis不能大于原始节点的长度")
                        console.log("报错，行数xmPlusSlide.js 77行 vis不能大于原始节点的长度")
                    }
                     else if(type=="menu")
                    {
                        if(effect=="slideMenu")
                        {
                            toPlay();
                        }
                        tabClass();
                        evenTarget();

                    }
            }
            function div()//布局
            {
                switch(effect)
                {
                    case "fade":
                    case "show":
                    case "top":
                        break;
                    case "left":
                        mainCeil.width(mainCeil.children().outerWidth(true)*mainCeil.children().length);
                        break;
                    case "leftLoop":
                       mainCeil.children().each(function(e)
                       {
                           if(mainCeil.children().eq(e).index()<defaultML-1)//获取除最后一个丢到列表尾部
                           {
                               mainCeil.children().eq(e).clone(true).addClass("clone").appendTo(mainCeil);
                           }
                           if(mainCeil.children().eq(e).index()==defaultML-1)//获取最后一个放到列表头部
                           {
                               mainCeil.children().eq(e).clone(true).addClass("clone").prependTo(mainCeil);
                           }
                       });
                        mainCeil.width(mainCeil.children().length*mainCeil.children().outerWidth(true));
                        mainCeil.css("left",-mainCeil.children().outerWidth(true));
                        break;
                    case "topLoop":
                        mainCeil.children().each(function(e)
                        {
                            if(mainCeil.children().eq(e).index()<defaultML-1)//获取除最后一个丢到列表尾部
                            {
                                mainCeil.children().eq(e).clone(true).addClass("clone").appendTo(mainCeil);
                            }
                            if(mainCeil.children().eq(e).index()==defaultML-1)//获取最后一个放到列表头部
                            {
                                mainCeil.children().eq(e).clone(true).addClass("clone").prependTo(mainCeil);
                            }
                        });
                      //  mainCeil.width(mainCeil.children().length*mainCeil.children().outerWidth(true));
                        mainCeil.css("top",-mainCeil.children().outerHeight(true));
                        break;
                    case "leftMarquee":
                        mainCeil.children().clone(true).addClass("clone").appendTo(mainCeil);
                        mainCeil.width(mainCeil.children().outerWidth(true)*mainCeil.children().length);
                        break;
                    case "topMarquee":
                        mainCeil.children().clone(true).addClass("clone").appendTo(mainCeil);
                        break;
                }
            }
            function createTab()
            {
                if(autoPage)
                {
                    if( effect=="leftLoop"||effect=="topLoop")
                    {
                        for(var v=0;v<defaultML;v++)
                        {
                            $("<li>"+(v+1)+"</li>").appendTo(titCeil);
                        }
                    }
                    else
                    {
                        for(var i=0;i<Math.ceil((defaultML-vis+1)/scroll);i++)
                        {
                            $("<li>"+(i+1)+"</li>").appendTo(titCeil);
                        }
                    }
                }

            }
            function evenTarget()  // 头部切换列表操作
            {
                var evenTimer;
                console.log(titCeil);
                if(type=="slide")
                {

                    titCeil.children().on(trigger,function()
                    {
                        defaultIndex=titCeil.children().index(this);

                        if(trigger=="mouseover"||trigger=="mouseenter")//如果是鼠标滑过的事件的时候，就执行延迟
                        {
                            evenTimer=setTimeout(toPlay,triggerTime);
                            toPlay();

                            titCeil.children().mouseleave(function()
                            {
                                clearTimeout(evenTimer);
                               // toPlay();
                            })
                        }
                        else
                        {
                            toPlay();
                        }
                    });
                }
                else if(type=="menu"&&effect=="navSlideDown"||type=="menu"&&effect=="navSlideFade")
                {

                        if(trigger=="mouseover"||trigger=="mouseenter")//如果是鼠标滑过的事件的时候，就执行延迟
                        {

                            titCeil.on(trigger,function(ev)
                            {

                                defaultIndex=titCeil.index(this);
                                trigger= ev.originalEvent.type;
                                evenTimer=setTimeout(toPlay,triggerTime);
                            });

                               titCeil.mouseleave(function(e)
                               {
                                  clearTimeout(evenTimer);
                                  trigger= e.originalEvent.type;
                                  toPlay();
                               })

                        }
                        else
                        {
                            titCeil.on(trigger,function(ev)
                            {
                               toPlay();
                               tabClass()
                            });
                        }

                }
                else if(type=="menu"&&effect=="slideMenu")
                {

                    if(trigger=="mouseover"||trigger=="mouseenter")//如果是鼠标滑过的事件的时候，就执行延迟
                    {

                        titCeil.on(trigger,function()
                        {
                            defaultIndex=titCeil.index(this);
                            evenTimer=setTimeout(toPlay,triggerTime);

                        });

                        titCeil.mouseleave(function()
                        {
                           clearTimeout(evenTimer);
                        })

                    }
                    else
                    {

                        titCeil.on(trigger,function()
                        {
                            defaultIndex=titCeil.index(this);
                           toPlay();
                        });
                    }

                }
            }
            function tabClass() //切换头部元素的class
            {
               // console.log(defaultIndex);
                if(type=="menu")
                {
                    console.log(defaultIndex);
                    titCeil.eq(defaultIndex).addClass(titOnClassName).siblings(titCeil).removeClass(titOnClassName);
                }
                else if(type=="slide")
                {

                    titCeil.children().eq(defaultIndex).addClass(titOnClassName).siblings().removeClass(titOnClassName);
                }

            }

            function prevNext()//prev  Next  按钮操作
            {
                switch (effect)
                {
                    case "leftMarquee":
                    case "topMarquee":
                        prevCeil.click(function()
                        {
                            defaultDirt=1;
                        });
                        nextCeil.click(function()
                        {
                            defaultDirt=-1;
                        });
                        break;
                    case "fade":
                    case "show":
                    case "left":
                    case "top":
                    case "leftLoop":
                    case "topLoop":
                        nextCeil.click(function()
                        {
                            if(!mainCeil.is(":animated")&&!mainCeil.children().is(":animated"))
                            {
                                defaultIndex++;
                                limit();//先限制
                                toPlay();//后执行
                                pageStates();
                            }

                        });
                        prevCeil.click(function()
                        {
                            if(!mainCeil.is(":animated")&&!mainCeil.children().is(":animated"))
                            {
                                defaultIndex--;
                                limit();//先限制
                                toPlay();//后执行
                                pageStates();

                            }

                        });
                        break;
                }
            }
            function autoToPlay()//自动播放
            {
                interTimer=setInterval(autoAdd,interTime);
                function autoAdd()
                {
                    defaultIndex++;
                    limit();
                    toPlay();
                    pageStates();
                }
                mainCeil.add(titCeil).add(prevCeil).add(nextCeil).mouseover(function(){clearInterval(interTimer)});
                mainCeil.add(titCeil).add(prevCeil).add(nextCeil).mouseout(function(){interTimer=setInterval(autoAdd,interTime);});
            }
            function pageStates()
            {
                console.log(titCeil.children().length);
                if(pageState)
                {
                    pageState.html((defaultIndex+1)+"/"+titCeil.children().length);
               }
            }
            function limit()//自动播放以及prevNext点击限制条件
            {
              switch (effect)
              {
                  case "fade":
                  case "show":
                  case "left":
                  case "top":
                      if(defaultIndex>titCeil.children().length-1)
                      {
                          defaultIndex=0;
                      }
                      else if(defaultIndex<0)
                      {
                          defaultIndex=titCeil.children().length-1;
                      }
                      break;
                  case "leftLoop"://暂时不放这里
                  case "topLoop"://暂时不放这里

                      break;
              }
                console.log(defaultIndex);
            }
            //运行效果
            function toPlay()
            {
                switch (effect)
                {
                    case "fade":
                        mainCeil.children().fadeOut();
                        mainCeil.children().eq(defaultIndex).fadeIn();
                        tabClass();
                        pageStates();
                        break;
                    case "show":
                        mainCeil.children().hide();
                        mainCeil.children().eq(defaultIndex).show();
                        tabClass();
                        pageStates();
                        break;
                    case "left":
                         mainCeil.animate({"left":-defaultIndex*mainCeil.children().outerWidth(true)*scroll},delayTime);
                        tabClass();
                        pageStates();
                        break;
                    case "top":
                        mainCeil.animate({"top":-defaultIndex*mainCeil.children().outerHeight(true)},delayTime);
                        tabClass();
                        pageStates();
                        break;
                    case "leftLoop":
                        mainCeil.stop().animate({"left":-(defaultIndex+1)*mainCeil.children().outerWidth(true)},400,function()//限制暂时放到这里，
                        {
                            if(defaultIndex<=-1)
                            {
                                defaultIndex=(mainCeil.children().length/2)-1;
                                mainCeil.css("left",-defaultML*mainCeil.children().outerWidth(true));
                            }
                            else if(defaultIndex>=(mainCeil.children().length/2)-1)
                            {
                                defaultIndex=-1;
                                mainCeil.css("left","0");
                            }
                        });
                        tabClass();
                        pageStates();
                        break;
                    case "topLoop":
                        mainCeil.stop().animate({"top":-(defaultIndex+1)*mainCeil.children().outerHeight(true)},400,function()//限制暂时放到这里，
                        {
                            if(defaultIndex<=-1)
                            {
                                defaultIndex=(mainCeil.children().length/2)-1;
                                mainCeil.css("top",-defaultML*mainCeil.children().outerHeight(true));
                            }
                            else if(defaultIndex>=(mainCeil.children().length/2)-1)
                            {
                                defaultIndex=-1;
                                mainCeil.css("top","0");
                            }
                        });
                        tabClass();
                        pageStates();
                        break;
                    case "leftMarquee":
                        var Timer1=setInterval(doMarquee1,50);
                    function doMarquee1()
                    {
                        if(mainCeil.position().left<-(mainCeil.outerWidth()/2))//如果大于一半 就拉回到0[不要使用等于]
                        {
                            mainCeil.css({"left":0});
                        }
                        else if(mainCeil.position().left>0)//如果大于0，就拉回一半[不要使用等于]
                        {
                            mainCeil.css({"left":-(mainCeil.outerWidth()/2)});
                        }
                        else
                        {
                            mainCeil.css({"left":mainCeil.position().left-=defaultDirt});
                        }

                    }
                        mainCeil.mouseover(function()
                        {
                            clearInterval(Timer1)
                        });
                        mainCeil.mouseout(function()
                        {
                            Timer1=setInterval(doMarquee1,50);
                        });
                        break;
                    case "topMarquee":
                        var Timer2=setInterval(doMarquee2,50);
                    function doMarquee2()
                    {
                        if(mainCeil.position().top<-(mainCeil.outerHeight()/2))//如果大于一半 就拉回到0[不要使用等于]
                        {
                            mainCeil.css({"top":0});
                        }
                        else if(mainCeil.position().top>0)//如果大于0，就拉回一半[不要使用等于]
                        {
                            mainCeil.css({"top":-(mainCeil.outerHeight()/2)});
                        }
                        else
                        {
                            mainCeil.css({"top":mainCeil.position().top-=defaultDirt});
                        }

                    }
                        mainCeil.mouseover(function()
                        {
                            clearInterval(Timer2)
                        });
                        mainCeil.mouseout(function()
                        {
                            Timer2=setInterval(doMarquee2,50);
                        });
                        break;
                    case "navSlideDown":
                       if(trigger=="mouseover"||trigger=="mouseenter")
                        {
                            tabClass();
                            pageStates()
                            titCeil.eq(defaultIndex).find(targetCeil).stop().slideDown();
                        }
                        else if(trigger=="mouseout"||trigger=="mouseleave")
                        {

                            titCeil.eq(defaultIndex).find(targetCeil).stop().slideUp();
                            if( returnDefault==true||returnDefault=="true")
                            {
                                plus.mouseleave(function()
                                {

                                    defaultIndex=returnIndex;
                                    console.log(defaultIndex);
                                    tabClass();
                                    pageStates();
                                });
                            }
                        }
                        break;
                    case "navSlideFade":
                        if(trigger=="mouseover"||trigger=="mouseenter")
                        {
                            tabClass();
                            pageStates();
                            titCeil.eq(defaultIndex).find(targetCeil).stop().fadeIn();
                        }
                        else if(trigger=="mouseout"||trigger=="mouseleave")
                        {

                            titCeil.eq(defaultIndex).find(targetCeil).stop().fadeOut();
                            if( returnDefault==true||returnDefault=="true")
                            {
                                plus.mouseleave(function()
                                {

                                    defaultIndex=returnIndex;
                                    console.log(defaultIndex);
                                    tabClass();
                                    pageStates();
                                });
                            }
                        }
                        break;
                    case "slideMenu":
                        tabClass();
                        pageStates();
                        targetCeil.eq(defaultIndex).slideDown().siblings("ul").slideUp();
                        break;
                }
            }

        })
    }
})(jQuery);

