(function($) {
	function Timeline(){
		this.leftLimit = 0;
		this.rightLimit = 0;
	}

	Timeline.prototype.reload = function(){
		$('.circle').remove();
		var timeline = this ;

		if($(window).width() > 767){
			timeline.leftLimit = 0;
			timeline.rightLimit = 0;
				
			timeline.$container.find('.item').each(function(){
				var $item = $(this);
				if(timeline.leftLimit > timeline.rightLimit){
					var newBottom = timeline.rightLimit + $item.outerHeight(true);
					if (newBottom < timeline.leftLimit + 20){
						newBottom = timeline.leftLimit + 20;
					}
					$item.removeClass('left').addClass('right');
					$item.stop(false, true).css({
						"top"		: (newBottom-$item.outerHeight(true)) + "px",
						"left"		: "52%"
					});
					timeline.rightLimit = newBottom;
				}
				else{
					var newBottom = timeline.leftLimit + $item.outerHeight(true);
					if (newBottom < timeline.rightLimit + 20){
						newBottom = timeline.rightLimit + 20;
					}
					$item.removeClass('right').addClass('left');
					$item.stop(false, true).css({
						"top"		: (newBottom-$item.outerHeight(true)) + "px",
						"left"		: "0"
					});
					timeline.leftLimit = newBottom;
				}
				var $circle = $('<span class="circle"></span>').appendTo(timeline.$innerContainer);
				$circle.css({
					'top' : (newBottom - $item.find('footer').outerHeight(true))
				});
			});
			timeline.$innerContainer.height(Math.max(timeline.leftLimit, timeline.rightLimit)+20);
			timeline.$container.find('.comments-container').css('height', 'auto');
			timeline.$container.find('.comments-container').each(function () {
	            var height = $(this).height();
	            $(this).data('height', height).css({
	                height: 0
	            });
	        });
		}
		else{
			timeline.$container.find('.item').stop(true, true).css({
				"top"		: "auto",
				"left"		: "auto"
			});
			var height = 0;
			timeline.$container.find('.item').each(function(){
				var $item = $(this);
				height+= $item.outerHeight(true);
			});
			timeline.$innerContainer.height(height);
		}
	};

	Timeline.prototype.init = function(params){
		var timeline = this;
		timeline.reload();
		timeline.reload();
		
		timeline.initEvents();
		if(params.infiniteScroll)
		{
			timeline.loading = false;
			timeline.iteration =  0;
			timeline.$container.find('.loadMore').click(function(){
				if(timeline.loading){
					return false;
				}
				timeline.loading = true;
				timeline.$container.find('.loadMore').toggleClass('loading');
				var data = params.data(timeline.iteration);
				$.ajax({
					url: params.url,
					data: data,
					success: function(res){
						if(res == ""){
							timeline.$container.find('.loadMore').removeClass('loading').find('p').html(params.doneText);
							timeline.loading = true;
							return;
						}
						timeline.$innerContainer.append(res);
						timeline.$container.find('.loadMore').toggleClass('loading');
						timeline.reload();
						timeline.reload();
						timeline.initEvents();
						timeline.loading = false;
						timeline.iteration =  1;
					},
					dataType: "html"

				});
			});
		}

		if(params.scrollForMore)
		{
			$(window).scroll(function(){
				var offset = timeline.$container.find('.loadMore').offset();
				if((offset.top-$(window).height() <= $(window).scrollTop()) && !timeline.loading)
				{
					timeline.$container.find('.loadMore').click()
				}
			});
		}
	};

	Timeline.prototype.initEvents = function(){
		var timeline = this;

		timeline.$container.find('.comments-container').each(function () {
	        if(!$(this).data('height')){
		        var height = $(this).height();
		        $(this).data('height', height).css({
		            height: 0
		        });
	    	}
	    });

		timeline.$container.find('.tags').find('.icon').unbind('click').toggle(function(){
			var height = $(this).parent().parent().find('.cover').height();
			$(this).parent().find('.tags-container').animate({
				height : height+'px'
			});
			return false;
		}, function(){
			$(this).parent().find('.tags-container').animate({
				height : 0
			});
			return false;
		});
	    timeline.$container.find('.comments-toggle').unbind('click').click(function () {
	        $parent = $(this).parent().parent();
	        if (!$parent.hasClass('shown')) {
	            $parent.addClass('shown');
	            $commentsContainer = $parent.find('.comments-container');
	            var current = parseInt($parent.css('marginBottom'));
	            $parent.css({
	                'marginBottom': current + $commentsContainer.data('height') + 'px'
	            });
				timeline.reload();
	            $commentsContainer.animate({
	                'height': $commentsContainer.data('height') + 'px'
	            }, 750);
	            $parent.animate({
	                'marginBottom': current + 'px'
	            }, 750, function(){
	});
	        } else {
	            $parent.removeClass('shown');
	            $commentsContainer = $parent.find('.comments-container');
	            $commentsContainer.animate({
	                'height': '0px'
	            }, 750, function () {
					timeline.reload();
	            });
	        }
	        return false;
	    });
	};

	$.fn.rTimeline = function(params) {
		var defaults = {
			theme : 'light',
			infiniteScroll : true,
			scrollForMore : true,
			url : '',
			doneText : "No more posts",
			data : function(iteration){
				return "";
			}
		}
	    params = $.extend( defaults, params);
	    this.each(function() {
			var $t = $(this);
			var timeline;
			timeline = new Timeline();

			$(document).ready(function () {
				timeline.$container = $t;
				$t.addClass(params.theme);
				timeline.$innerContainer = $t.find('.container');
			});

			$(window).load(function () {
				timeline.init(params);
			});

			$(window).resize(function(){
				timeline.reload();
			});
	            
	    });
		return this;
	};
})(jQuery);