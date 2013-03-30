/*
 * DC jQuery Social Stream
 * Copyright (c) 2012 Design Chemical
 * http://www.designchemical.com/blog/index.php/premium-jquery-plugins/jquery-social-stream-plugin/
 * Version 1.4.3 (18-11-2012)
 *
 */
 
(function($){

	SocialStreamObject = function(el, options) {
		this.create(el, options);
	};
	
	$.extend(SocialStreamObject.prototype, {
		
		version   : '1.4.3',
		
		create: function(el, options) {
		
			this.defaults = {
				feeds: {
					facebook: {
						id: '',
						intro: 'Posted to wall',
						out: 'intro,thumb,title,text,user,share',
						text: 'content',
						comments: 3,
						image_width: 6, //3 = 600 4 = 480 5 = 320 6 = 180
						icon: 'facebook.png'
					},
					twitter: {
						id: '',
						intro: 'Tweeted',
						search: 'Tweeted',
						out: 'intro,thumb,date,text,user,share',
						thumb: false,
						retweets: false,
						replies: false,
						images: '', // large w: 786 h: 346, thumb w: 150 h: 150, medium w: 600 h: 264, small w: 340 h 150
						icon: 'twitter.png'
					},
					google: {
						id: '',
						intro: 'Shared',
						out: 'intro,thumb,title,text,share',
						api_key: '',
						image_height: 75,
						image_width: 75,
						shares: true,
						icon: 'google.png'
					},
					youtube: {
						id: '',
						intro: 'Uploaded,Favorite,New Video',
						search: 'Search',
						out: 'intro,thumb,title,text,user,share',
						feed: 'uploads,favorites,newsubscriptionvideos',
						thumb: 'default',
						icon: 'youtube.png'
					},
					flickr: {
						id: '',
						intro: 'Uploaded',
						out: 'intro,thumb,title,text,share',
						lang: 'en-us',
						icon: 'flickr.png'
					},
					delicious: {
						id: '',
						intro: 'Bookmarked',
						out: 'intro,thumb,title,text,user,share',
						icon: 'delicious.png'
					},
					pinterest: {
						id: '',
						intro: 'Pinned',
						out: 'intro,thumb,title,text,user,share',
						icon: 'pinterest.png'
					},
					rss: {
						id: '',
						intro: 'Posted',
						out: 'intro,title,text,share',
						text: 'contentSnippet',
						icon: 'rss.png'
					},
					lastfm: {
						id: '',
						intro: 'Listened to,Loved,Replied',
						out: 'intro,thumb,title,text,user,share',
						feed: 'recenttracks,lovedtracks,replytracker',
						icon: 'lastfm.png'
					},
					dribbble: {
						id: '',
						intro: 'Posted shot,Liked',
						out: 'intro,thumb,title,text,user,share',
						feed: 'shots,likes',
						icon: 'dribbble.png'
					},
					vimeo: {
						id: '',
						intro: 'Liked,Video,Appeared In,Video,Album,Channel,Group',
						out: 'intro,thumb,title,text,user,share',
						feed: 'likes,videos,appears_in,all_videos,albums,channels,groups',
						thumb: 'medium',
						stats: true,
						icon: 'vimeo.png'
					},
					stumbleupon: {
						id: '',
						intro: 'Shared,Reviewed',
						out: 'intro,thumb,title,text,user,share',
						feed: 'favorites,reviews',
						icon: 'stumbleupon.png'
					},
					deviantart: {
						id: '',
						intro: 'Deviation',
						out: 'intro,thumb,title,text,user,share',
						icon: 'deviantart.png'
					},
					tumblr: {
						id: '',
						intro: 'Posted',
						out: 'intro,title,text,user,share',
						thumb: 100,
						video: 250,
						icon: 'tumblr.png'
					},
					instagram: {
						id: '',
					    intro: 'Posted',
						search: 'Search',
					    out: 'intro,thumb,text,user,share,meta',
						accessToken: '',
						redirectUrl: '',
						clientId: '',
						thumb: 'low_resolution',
					    comments: 3,
						likes: 8,
						icon: 'instagram.png'
					}
				},
				twitterId: '',
				days: 10,
				limit: 50,
				max: 'days',
				external: true,
				speed: 600,
				height: 550,
				wall: false,
				order: 'date',
				filter: true,
				controls: true,
				rotate: {
					direction: 'up',
					delay: 8000
				},
				cache: true,
				container: 'dcsns',
				cstream: 'stream',
				content: 'dcsns-content',
				iconPath: 'static/images/dcsns-dark/',
				imagePath: 'static/images/dcsns-dark/',
				debug: false
			};
			
			this.o = {}, this.timer_on = 0, this.id = 'dcsns-'+$(el).index(), this.timerId = '', this.o = $.extend(true,this.defaults,options), opt = this.o, $load = $('<div class="dcsns-loading">creating stream ...</div>');
			
			$(el).addClass(this.o.container).append('<div class="'+this.o.content+'"><ul class="'+this.o.cstream+'"></ul></div>');
			
			var $c = $('.'+this.o.content,el), $a = $('.'+this.o.cstream,el), $l = $('li',$a);

			if(opt.height > 0 && opt.wall == false){
				$c.css({height:opt.height+'px'});
			}

			if(this.o.filter == true || this.o.controls == true){
				var x = '<div class="dcsns-toolbar">';
				if(this.o.filter == true){
					x += '<ul id="dcsns-filter" class="option-set filter">';
					x += this.o.wall == true ? '<li><a href="#filter" data-group="dc-filter"  data-filter="*" class="selected link-all">all</a></li>' : '' ;
					var $f = $('.filter',el);
					$.each(opt.feeds, function(k,v){
						x += v.id != '' ? '<li class="active f-'+k+'"><a href="#filter" rel="'+k+'" data-group="dc-filter" data-filter=".dcsns-'+k+'"><img src="'+opt.imagePath+opt.feeds[k].icon+'" alt="" /></a></li>' : '' ;
					});
					x += '</ul>';
				}
				if(this.o.controls == true && opt.wall == false){
					var play = this.o.rotate.delay <= 0 ? '' : '<li><a href="#" class="play"></a></li>' ;
					x += '<div class="controls"><ul>'+play+'<li><a href="#" class="prev"></a></li><li><a href="#" class="next"></a></li></ul></div>';
				}
				x += '</div>';
				if(opt.wall == false){
					$(el).append(x);
				} else {
					$(el).before(x);
				}
			}
			
			if(this.o.wall == true){
				$('.dcsns-toolbar').append($load);
				this.createwall($a);
			} else {
				$c.append($load);
			}
			
			this.createstream(el,$a,0,opt.days);
			
			this.addevents(el,$a);
			
			if(this.o.rotate.delay > 0){
				this.rotate(el);
			}
			
			$load.remove();
		},
		
		createstream: function(obj,s,f1,f2){
			$.each(opt.feeds, function(k,v){
				if(opt.feeds[k].id != ''){
					var txt = [];
					$.each(opt.feeds[k].intro.split(','), function(i,v){
						v = $.trim(v);
						txt.push(v);
					});
					$.each(opt.feeds[k].id.split(','), function(i,v){
						v = $.trim(v);
						if(opt.feeds[k].feed && v.split('#').length < 2){
							if(k == 'youtube' && v.split('/').length > 1) {
								getFeed(k,v,opt.iconPath,opt.feeds[k],obj,opt,f1,f2,'posted','',i);
							} else {
								$.each(opt.feeds[k].feed.split(','), function(i,feed){
									getFeed(k,v,opt.iconPath,opt.feeds[k],obj,opt,f1,f2,txt[i],feed,i);
								});
							}
						} else {
							intro = v.split('#').length < 2 ? opt.feeds[k].intro : opt.feeds[k].search ;
							getFeed(k,v,opt.iconPath,opt.feeds[k],obj,opt,f1,f2,intro,'',i);
						}
					});
				}
			});
		},
		
		createwall: function(obj){
			obj.imagesLoaded( function(){
				obj.isotope({
					itemSelector : 'li.dcsns-li',
					getSortData : {
						postDate : function( $elem ){
							return parseInt($elem.attr('rel'),10);
						}
					},
					sortBy : 'postDate'
				});
			});
		},
		
		addevents: function(obj,$a){
			var self = this, speed = this.o.speed;
			var $container = $('.stream',obj), filters = {}
			$('.controls',obj).delegate('a','click',function(){
				var x = $(this).attr('class');
				switch(x)
				{
					case 'prev':
					self.pauseTimer();
					ticker($a,'prev',speed);
					break;
					case 'next':
					self.pauseTimer();
					ticker($a,'next',speed);
					break;
					case 'play':
					self.rotate(obj);
					$('.controls .play').removeClass('play').addClass('pause');
					break;
					case 'pause':
					self.pauseTimer();
					break;
				}
				return false;
			});
			$('.filter',obj).delegate('a','click',function(){
				if(opt.wall == false){
					var rel = $(this).attr('rel');
					if($(this).parent().hasClass('active')){
						$('.dcsns-'+rel,$a).slideUp().addClass('inactive');
						$(this).parent().animate({opacity: 0.3},400);
					} else {
						$('.dcsns-'+rel,$a).slideDown().removeClass('inactive');
						$(this).parent().animate({opacity: 1},400);
					}
					$(this).parent().toggleClass('active');
				}
				return false;
			});
			if(this.o.external){
				$a.delegate('a','click',function(){
					if(!$(this).parent().hasClass('section-share')){
						this.target = '_blank';
					}
				});
			}
		},
		rotate: function(a){
			var self = this, stream = $('.'+this.o.cstream,a), speed = this.o.speed, delay = this.o.rotate.delay, r = this.o.rotate.direction == 'up' ? 'prev' : 'next' ;
			this.timer_on = 1;
			$('.controls .play').removeClass('play').addClass('pause');
			this.timerId = setTimeout(function(){
				ticker(stream,r,speed);
				self.rotate(a);
			}, delay);
		},
		pauseTimer: function(){
			clearTimeout(this.timerId);
			this.timer_on = 0;
			$('.controls .pause').removeClass('pause').addClass('play');
		}
	});
	
	$.fn.dcSocialStream = function(options, callback){
		var d = {};
		this.each(function(){
			var s = $(this);
			d = s.data("socialtabs");
			if (!d){
				d = new SocialStreamObject(this, options, callback);
				s.data("socialtabs", d);
			}
		});
		return d;
	};
	
	function getFeed(type,id,path,o,obj,opt,f1,f2,intro,feed,fn){
	
		var stream = $('.stream',obj), list = [],d = '', px = 300, c = [],data, href, url, n = opt.limit, txt = [], src;
		frl = 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+n+'&callback=?&q=';
		
		switch (type) {
			
			case 'facebook':
			var cp = id.split('/');
			url = url = cp.length > 1 ? 'http://graph.facebook.com/'+cp[1]+'/photos?limit='+n : frl + encodeURIComponent('http://www.facebook.com/feeds/page.php?id='+id+'&format=rss20');
			break;
			
			case 'twitter':
			var cp = id.split('/'), cq = id.split('#'), replies = o.replies == true ? '&exclude_replies=false' : '&exclude_replies=true' ;
			var param = '&include_entities=true&include_rts='+o.retweets+replies+'&callback=?';
			url = cp.length > 1 ? 
			'https://api.twitter.com/1/lists/statuses.json?list_id='+cp[1]+'&per_page='+n+param : 
			'http://api.twitter.com/1/statuses/user_timeline.json?screen_name='+cp[0]+'&count='+n+param;
			if(cq.length > 1){
				var rts = o.retweets == false ? '+exclude:retweets' : '' ;
				url = 'http://search.twitter.com/search.json?q='+encodeURIComponent(cq[1])+rts+'&rpp='+n+'&include_entities=true&result_type=mixed';
			}
			break;
			
			case 'google': 
			n = n > 100 ? 100 : n ;
			href = 'https://plus.google.com/'+id;
			url = 'https://www.googleapis.com/plus/v1/people/'+id+'/activities/public';
			data = {key: o.api_key, maxResults: n, prettyprint: false, fields: "items(id,kind,object(attachments(displayName,fullImage,id,image,objectType,url),id,objectType,plusoners,replies,resharers,url),published,title,url,verb)"};
			break;
			
			case 'youtube': 
			var cp = id.split('/'), cq = id.split('#');
			n = n > 50 ? 50 : n ;
			href = 'http://www.youtube.com/';
			href += cq.length > 1 ? 'results?search_query='+encodeURIComponent(cq[1]) : 'user/'+id;
			href = cp.length > 1 ? 'https://www.youtube.com/playlist?list='+cp[1] : href ;
			url = 'https://gdata.youtube.com/feeds/';
			if(cp.length > 1){
				url += 'api/playlists/'+cp[1]+'?v=2'
			} else {
				url += cq.length > 1 ? 
				'api/videos?alt=rss&orderby=published&max-results='+n+'&racy=include&q='+encodeURIComponent(cq[1]) : 
				'base/users/'+id+'/'+feed+'?alt=rss&v=2&orderby=published&client=ytapi-youtube-profile';
			}
			url = frl + encodeURIComponent(url);
			break;		
			
			case 'flickr':
			var cq = id.split('/'), fd = cq.length > 1 ? 'groups_pool' : 'photos_public' ;
			id = cq.length > 1 ? cq[1] : id ;
			href = 'http://www.flickr.com/photos/'+id;
			url = 'http://api.flickr.com/services/feeds/'+fd+'.gne?id='+id+'&lang='+o.lang+'&format=json&jsoncallback=?';
			break;
			
			case 'delicious':
			href = 'http://www.delicious.com/'+id;
			url = 'http://feeds.delicious.com/v2/json/'+id;
			break;
			
			case 'pinterest':
			var cp = id.split('/');
			url = 'http://www.pinterest.com/'+id+'/';
			url += cp.length > 1 ? 'rss' : 'feed.rss';
			href = 'http://www.pinterest.com/'+id;
			url = frl + encodeURIComponent(url);
			break;
			
			case 'rss':
			href = id;
			url = frl + encodeURIComponent(id);
			break;
			
			case 'lastfm':
			href = 'http://www.last.fm/user/'+id;
			var ver = feed == 'lovedtracks' ? '2.0' : '1.0' ;
			url = frl + encodeURIComponent('http://ws.audioscrobbler.com/'+ver+'/user/'+id+'/'+feed+'.rss');
			break;
			
			case 'dribbble':
			href = 'http://www.dribbble.com/'+id;
			url = feed == 'likes' ? 'http://api.dribbble.com/players/'+id+'/shots/likes' : 'http://api.dribbble.com/players/'+id+'/shots' ;
			break;
			
			case 'vimeo':
			href = 'http://www.vimeo.com/'+id;
			url = 'http://vimeo.com/api/v2/'+id+'/'+feed+'.json';
			break;
			
			case 'stumbleupon':
			href = 'http://www.stumbleupon.com/stumbler/'+id;
			url = frl + encodeURIComponent('http://rss.stumbleupon.com/user/'+id+'/'+feed);
			break;
			
			case 'deviantart':
			href = 'http://'+id+'.deviantart.com';
			url = frl + encodeURIComponent('http://backend.deviantart.com/rss.xml?type=deviation&q=by%3A'+id+'+sort%3Atime+meta%3Aall');
			break;
			
			case 'tumblr':
			href = 'http://'+id+'.tumblr.com';
			url = 'http://'+id+'.tumblr.com/api/read/json?callback=?';
			break;
			
			case 'instagram':
			href = '#';
			url = 'https://api.instagram.com/v1';
			var cp = id.substr(0,1), cq = id.split(cp), url1 = encodeURIComponent(cq[1]), qs = '', ts = 0;
			switch(cp)
			{
				case '?':
				var p = cq[1].split('/');
				qs = '&lat='+p[0]+'&lng='+p[1]+'&distance='+p[2];
				url += '/media/search';
				break;
				case '#':
				url += '/tags/'+url1+'/media/recent';
				ts = 1;
				break;
				case '!':
				url += '/users/'+url1+'/media/recent';
				break;
				case '@':
				url += '/locations/'+url1+'/media/recent';
				break;
			}
			if(o.accessToken == '' && ts == 0){
				if (location.hash) {
					o.accessToken = location.hash.split('=')[1] ;
				} else {
					location.href="https://instagram.com/oauth/authorize/?client_id="+o.clientId+"&redirect_uri="+o.redirectUrl+"&response_type=token"; 
				}
			}
			url += '?access_token='+o.accessToken+'&client_id='+o.clientId+'&count='+n+qs;
			break;
		}

		jQuery.ajax({
			url: url,
			data: data,
			cache: opt.cache,
			dataType: 'jsonp',
			success: function(a){
				var error = '';
				switch(type)
				{
					case 'facebook':
						if(cp.length > 1){
							a = a.data;
						} else {
							if(a.responseStatus == 200){
								a = a.responseData.feed.entries;
							} else {
								error = a.responseDetails;
							}
						}
					break;
					case 'google':
						error = a.error ? a.error : '' ;
						a = a.items;
					break;
					case 'flickr':
						a = a.items;
					break;
					case 'instagram':
						a = a.data;
					break;
					case 'twitter':
						error = a.error ? a.error : '' ;
						if(cq.length > 1){a = a.results} ;
					break;
					case 'youtube':
						if(a.responseStatus == 200){
							a = a.responseData.feed.entries;
							if(cp.length > 1){var pl = cp[0];}
						} else {
							error = a.responseDetails;
						}
					break;
					case 'dribbble':
						a = a.shots;
					break;
					case 'tumblr':
						a = a.posts;
					break;
					case 'delicious':
					break;
					case 'vimeo':
					break;
					default:
						if(a.responseStatus == 200){
							a = a.responseData.feed.entries;
						} else {
							error = a.responseDetails;
						}
					break;
				}
				if(error == ''){
					$.each(a, function(i,item){
						if(i < n){
							var html = [], q = item.link, u='<a href="'+href+'">'+id+'</a>', w='', x = '<a href="'+q+'">'+item.title+'</a>', y='', z='', zz='', m='', d = item.publishedDate, sq = q, st = item.title, s = '';
							switch(type)
							{
								case 'facebook':
								if(cp.length > 1){
									id = item.from.id;
									var d = new Date();
									d = d.setFbAlbum(item.updated_time);
									var set = parseQ(item.link);
									st = cp[0] != '' ? cp[0] : item.from.name ;
									u = '<a href="http://www.facebook.com/media/set/?set='+set[1]+'">'+st+'</a>';
									x = '';
									z = '<a href="'+item.link+'"><img src="'+item.images[o.image_width].source+'" alt="" /></a>';
									if(o.comments > 0 && item.comments){
										i = 0;
										m += '<span class="meta"><span class="comments">comments</span></span>';
										$.each(item.comments.data, function(i,cmt){
											if(o.comments > i){
												m += '<span class="meta item-comments"><a href="http://facebook.com/'+cmt.from.id+'">'+cmt.from.name+'</a>'+cmt.message+'</span>';
												i++;
											} else {
												return false;
											}
										});
									}
									z += m;
								} else {
									z = item[o.text].replace(/\/l.php/gi,'http://www.facebook.com/l.php').replace(/href="\//gi,'href="http://www.facebook.com/');
								}
								break;
								
								case 'twitter':
								d = parseTwitterDate(item.created_at);
								var un = cq.length > 1 ? item.from_user : item.user.screen_name ;
								var ua = cq.length > 1 ? item.profile_image_url : item.user.profile_image_url ;
								href = 'http://www.twitter.com/'+un;
								q = href;
								u = '<a href="'+q+'">'+un+'</a>'
								y = o.thumb == true ? '<a href="'+q+'" class="thumb"><img src="'+ua+'" alt="" /></a>' : '' ;
								z = linkify(item.text);
								if(o.images != '' && item.entities.media){
									$.each(item.entities.media, function(i,media){
										z += '<a href="'+media.media_url+'"><img src="'+media.media_url+':'+o.images+'" alt="" /></a>';
									});
								}
								sq = item.id_str;
								break;
								
								case 'delicious':
								var d = new Date();
								d = d.setRFC3339(item.dt);
								x = '<a href="'+item.u+'">'+item.d+'</a>';
								z = item.n;
								sq = item.u;
								st = item.d;
								break;
								
								case 'rss':
								z = item[o.text];
								break;
								
								case 'pinterest':
								var src = $('img',item.content).attr('src');
								y = src ? '<a href="'+q+'"><img src="'+src+'" alt="" /></a>' : '' ;
								z = item.contentSnippet;
								st = z;
								break;

								case 'youtube':
								var v = [];
								v = parseQ(item.link);
								y = '<a href="'+q+'"><img src="http://img.youtube.com/vi/'+v['v']+'/'+o.thumb+'.jpg" alt="" /></a>';
								z = item.contentSnippet;
								if(cp.length > 1){u = '<a href="'+href+'">'+pl+'</a>'}
								break;
								
								case 'flickr':
								d = parseTwitterDate(item.published);
								x = '<a href="' + q + '" title="'+ item.title +'"><img src="' + item.media.m + '" alt="" /></a>';
								break;
								
								case 'lastfm':
								q = item.content;
								break;
								
								case 'dribbble':
								q = item.url;
								d = item.created_at;
								y = '<a href="'+q+'"><img src="' + item.image_teaser_url + '" alt="' + item.title + '" /></a>';
								z = '<span class="meta"><span class="views">'+num(item.views_count)+'</span><span class="likes">'+num(item.likes_count)+'</span><span class="comments">'+num(item.comments_count)+'</span></span>';
								sq = item.url;
								break;
								
								case 'instagram':
								d = parseInt(item.created_time * 1000,10);
								x = '';
								y = '<a href="'+q+'"><img src="' + item.images[o.thumb].url + '" alt="" /></a>';
								z = item.caption !=null ? htmlEncode(item.caption.text) : '' ;
								if(item.comments.count > 0 && o.comments > 0){
									i = 0;
									m += '<span class="meta"><span class="comments">'+num(item.comments.count)+' comments</span></span>';
									$.each(item.comments.data, function(i,cmt){
										if(o.comments > i){
											m += '<span class="meta item-comments"><img src="'+cmt.from.profile_picture+'" />';
											m += cmt.from.full_name+' - '+cmt.text+'</span>';
											i++;
										} else {
											return false;
										}
									});
								}
								if(item.likes.count > 0 && o.likes > 0){
									i = 0;
									m += '<span class="meta"><span class="likes">'+num(item.likes.count)+' likes</span></span>';
									m += '<span class="meta item-likes">';
									$.each(item.likes.data, function(i,lk){
										if(o.likes > i){
											m += '<img src="'+lk.profile_picture+'" />';
											i++;
										} else {
											return false;
										}
									});
									m += '</span>';
								}
								u = '<a href="'+q+'">'+item.user.username+'</a>';
								st = item.caption !=null ? item.caption.text : '' ;
								break;

								case 'vimeo':
								f = feed, at = item.name, tx = item.description, q = item.url;
								if(f == 'channels'){
									y = item.logo != '' ? '<a href="'+q+'" class="logo"><img src="'+item.logo+'" alt="" width="'+px+'" /></a>' : '' ;
								} else if(f == 'groups'){
									y = '<a href="'+q+'"><img src="'+item.thumbnail+'" alt="" /></a>';
								} else {
									var thumb = 'thumbnail_'+o.thumb, at = item.title, tx = f != 'albums' ? item.duration+' secs' : item.description ;
									y = '<a href="'+item.url+'"><img src="'+item[thumb]+'" alt="" /></a>';
								}
								x = '<a href="'+q+'">'+at+'</a>';
								z = tx;
								if(o.stats == true){
									var m = '';
									m += f == 'albums' || f == 'channels' || f == 'groups' ? '<span class="videos">'+num(item.total_videos)+'</span>' : '' ;
									if(f == 'channels'){
										m += '<span class="users">'+num(item.total_subscribers)+'</span>';
									} else if(f == 'groups'){
										m += '<span class="users">'+num(item.total_members)+'</span>';
									} else if(f != 'albums'){
										m += '<span class="likes">'+num(item.stats_number_of_likes)+'</span><span class="views">'+num(item.stats_number_of_plays)+'</span><span class="comments">'+num(item.stats_number_of_comments)+'</span>';
									}
									z += '<span class="meta">'+m+'</span>';
								}
								var dt = item.upload_date;
								if(f == 'likes'){
									dt = item.liked_on;
								} else if(f == 'albums' || f == 'channels' || f == 'groups'){
									dt = item.created_on;
								}
								var d = new Date();
								d = d.setVimeo(dt);
								sq = q;
								st = at;
								break;	
								
								case 'stumbleupon':
								var src = $('img',item.content).attr('src');
								y = src != '' && feed == 'favorites' ? '<a href="'+q+'"><img src="'+src+'" alt="" /></a>' : '' ;
								z = item.contentSnippet;
								break;
								
								case 'deviantart':
								var src = $('img',item.content).attr('src');
								y = src ? '<a href="'+q+'"><img src="'+src+'" alt="" /></a>' : '' ;
								z = item.contentSnippet;
								break;
								
								case 'tumblr':
								q = item['url-with-slug'];
								d = item.date;
								x = '<a href="'+q+'">';
								switch(item.type)
								{
									case 'photo':
									x = item['photo-caption'];
									z = '<a href="'+q+'"><img src="'+item['photo-url-'+o.thumb]+'" alt="" /></a>';
									st = x;
									break;
									case 'video':
									x += item['video-caption'];
									z = o.video != '400' ? item['video-player-'+o.video] : item['video-player'] ;
									st = x;
									break;
									case 'regular':
									x += item['regular-title'];
									z = item['regular-body'];
									st = x;
									break;
									case 'quote':
									x += item['quote-source'];
									z = item['quote-text'];
									st = x;
									break;
									case 'audio':
									x = item['id3-artist'] ? '<a href="'+q+'">'+item['id3-artist']+' - '+item['id3-album']+'</a>' : '' ;
									x += item['id3-title'] ? '<a href="'+q+'" class="track">'+item['id3-title']+'</a>' : '' ;
									z = item['audio-caption'];
									z += item['audio-player'];
									st = item['id3-artist']+' - '+item['id3-album']+' - '+item['id3-title'];
									break;
									case 'conversation':
									x += item['conversation-title'];
									z = item['conversation-text'];
									st = x;
									break;
									case 'link':
									x = '<a href="'+item['link-url']+'">'+item['link-text'];
									z = item['link-description'];
									st = item['link-text'];
									break;
								}
								x += item.type != 'photo' || item.type != 'audio' ? '</a>' : '' ;
								st = stripHtml(st);
								sq = q;
								break;
								
								case 'google':
								var g = item.object.replies ? num(item.object.replies.totalItems) : 0, m = item.object.plusoners ? num(item.object.plusoners.totalItems) : 0, p = item.object.resharers ? num(item.object.resharers.totalItems) : 0, dl;
								var d = new Date();
								d = d.setRFC3339(item.published);
								dl = {src: "",imgLink: "",useLink: "",useTitle: ""};
								var k = item.object.attachments;
								if (k) if (k.length){
									for (var l = 0; l < k.length; l++) {
										var h = k[l];
										if (h.image) {
											dl.src = h.image.url;
											dl.imgLink = h.url;
											if (h.fullImage) {
												dl.w = h.fullImage.width || 0;
												dl.h = h.fullImage.height || 0
											}
										}
										if (h.objectType == "article") dl.useLink = h.url;
										if (h.displayName) dl.useTitle = h.displayName
									}
									if (!dl.useLink) dl.useLink = dl.imgLink;
									var img_h = o.image_height ? o.image_height : 75 ;
									var img_w = o.image_width ? o.image_width : 75 ;
									if (dl.src.indexOf("resize_h") >= 0) dl.src = dl.w >= dl.h ? dl.src.replace(/resize_h=\d+/i, "resize_h=" + img_h) : dl.src.replace(/resize_h=\d+/i, "resize_w=" + img_w)
								}
								dl = dl;
								q = dl.useLink;
								y = (dl.src ? (dl.useLink ? '<a href="' + dl.useLink + '">' : '')+'<img src="' + dl.src + '" />'+(dl.useLink ? '</a>' : '') : '');
								var t1 = px/(dl.w/dl.h) < px/3 ? ' class="clear"' : '' ;
								x = (dl.useLink ? '<a href="' + dl.useLink + '"'+t1+'>' : '')+(item.title ? item.title : dl.useTitle)+(dl.useLink ? '</a>' : '');
								if(o.shares){
									z = '<span class="meta"><span class="plusones">+1s '+m+'</span><span class="shares">'+p+'</span><span class="comments">'+g+'</span></span>';
								}
								sq = q;
								st = dl.useTitle;
								break;
							}
							
							icon = '<a href="'+href+'"><img src="'+path+o.icon+'" alt="" class="icon" /></a>';

							if(type == 'twitter'){
								var intent = 'https://twitter.com/intent/';
								s = '<a href="'+intent+'tweet?in_reply_to='+sq+'&via='+opt.twitterId+'" class="share-reply"></a>';
								s += '<a href="'+intent+'retweet?tweet_id='+sq+'&via='+opt.twitterId+'" class="share-retweet"></a>';
								s += '<a href="'+intent+'favorite?tweet_id='+sq+'" class="share-favorite"></a>';
							} else {
								s = share(st,sq,opt.twitterId);
							}

							$.each(o.out.split(','), function(i,v){
								
								zz += v != 'intro' ? '<span class="section-'+v+'">' : '' ;
								switch(v)
								{
									case 'intro':
									zintro = '<span class="section-'+v+'"><a href="'+q+'">'+intro+'</a> <span>'+nicetime(new Date(d).getTime(),0)+'</span></span>';
									break;
									case 'title':
									zz += x;
									break;
									case 'thumb':
									if(type == 'rss'){
										var src = item.content.indexOf("img") >= 0 ? $('img',item.content).attr('src') : '' ;
										y = src ? '<a href="'+q+'" class="thumb"><img src="'+src+'" alt="" /></a>' : '' ;
									}
									zz += y;
									break;
									case 'text':
									zz += z;
									break;
									case 'user':
									zz += u;
									break;
									case 'meta':
									zz += m;
									break;
									case 'share':
									zz += s;
									break;
								}
								zz += v != 'intro' ? '</span>' : '' ;
							});
							
							var df = type == 'instagram' ? nicetime(d,1) : nicetime(new Date(d).getTime(),1);
							var ob = df;
							switch(opt.order)
							{
								case 'random':
								ob = randomish(6);
								break;
								case 'none':
								ob = 1;
								break;
							}
							var out = '<li rel="'+ob+'" class="dcsns-li dcsns-'+type+' dcsns-feed-'+fn+'">'+w+'<div class="inner">'+zz+'<span class="clear"></span></div>'+zintro+icon+'</li>';
							if(opt.max == 'days'){
								if(df <= f2 * 86400 && df >= f1 * 86400){
									list.push(out);
								} else if(df > f2 * 86400) {
									return false;
								}
							} else {
								list.push(out);
							}
						}
					});
				} else if(opt.debug == true){
					list.push('<li class="dcsns-li dcsns-error">Error. '+error+'</li>');
				}
			},
			complete: function(){
				var $newItems = $(list.join(''));
				if(opt.wall == true){
					stream.isotope( 'insert', $newItems );
				} else {
					stream.append($newItems);
					sortstream(stream,'asc');
				}
				if(type == 'facebook' && cp.length < 2){
					fbHrefLink(id,$newItems);
				} else if(type == 'flickr' && cq.length > 1){
					flickrHrefLink(cq[1],$newItems);
				}
			}
		});
		return;
	}

	function linkify(text){
		text = text.replace(
			/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
			function(url){
				var full_url = !url.match('^https?:\/\/') ? 'http://' + url : url ;
				return '<a href="' + full_url + '">' + url + '</a>';
			}
		);
		text = text.replace(/(^|\s)@(\w+)/g, '$1@<a href="http://www.twitter.com/#!/$2">$2</a>');
		text = text.replace(/(^|\s)#(\w+)/g, '$1#<a href="http://twitter.com/#!/search/%23$2">$2</a>');
		return text;
	}
	
	function htmlEncode(v){
		return $('<div/>').text(v).html();
	}
	
	function stripHtml(v){
		var $html = $(v);
		return $html.text();
	}

	Date.prototype.setRFC3339 = function(dString){
	   var utcOffset, offsetSplitChar;
	   var offsetMultiplier = 1;
	   var dateTime = dString.split('T');
	   var date = dateTime[0].split('-');
	   var time = dateTime[1].split(':');
	   var offsetField = time[time.length - 1];
	   var offsetString;
	   offsetFieldIdentifier = offsetField.charAt(offsetField.length - 1);
	   if (offsetFieldIdentifier == 'Z') {
		  utcOffset = 0;
		  time[time.length - 1] = offsetField.substr(0, offsetField.length - 2);
	   } else {
		  if (offsetField[offsetField.length - 1].indexOf('+') != -1) {
			 offsetSplitChar = '+';
			 offsetMultiplier = 1;
		  } else {
			 offsetSplitChar = '-';
			 offsetMultiplier = -1;
		  }
		  offsetString = offsetField.split(offsetSplitChar);
		  time[time.length - 1] == offsetString[0];
		  offsetString = offsetString[1].split(':');
		  utcOffset = (offsetString[0] * 60) + offsetString[1];
		  utcOffset = utcOffset * 60 * 1000;
	   }
	   this.setTime(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) + (utcOffset * offsetMultiplier ));
	   return this;
	};
	
	Date.prototype.setFbAlbum = function(dString){
	   var utcOffset, offsetSplitChar = '+', offsetMultiplier = 1, dateTime = dString.split('T'), date = dateTime[0].split('-'), time = dateTime[1].split(':'), offsetField = time[time.length - 1], offsetString;
		  if (offsetField[offsetField.length - 1].indexOf('+') != -1) {
			 offsetSplitChar = '-';
			 offsetMultiplier = -1;
		  }
		  offsetTime = offsetField.split(offsetSplitChar);
		  utcOffset = parseInt((offsetTime[1]/100),10) * 60 * 1000;
	   this.setTime(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], offsetTime[0]) + (utcOffset * offsetMultiplier ));
	   return this;
	};
	
	Date.prototype.setVimeo = function(dString){
	   var utcOffset = 0, offsetSplitChar, offsetMultiplier = 1;
	   var dateTime = dString.split(' ');
	   var date = dateTime[0].split('-');
	   var time = dateTime[1].split(':');
	   this.setTime(Date.UTC(date[0], date[1] - 1, date[2], time[0], time[1], time[2]) + (utcOffset * offsetMultiplier ));
	   return this;
	};

	function parseTwitterDate(a){
		var out = $.browser.msie ? a.replace(/(\+\S+) (.*)/, '$2 $1') : a ;
		return out;
	}

	function nicetime(a,out){
		var d = Math.round((+new Date - a) / 1000), fuzzy;
		if(out == 1) {
			return d;
		} else if(out == 0) {
			var chunks = new Array();
					chunks[0] = [60 * 60 * 24 * 365 , 'year'];
					chunks[1] = [60 * 60 * 24 * 30 , 'month'];
					chunks[2] = [60 * 60 * 24 * 7, 'week'];
					chunks[3] = [60 * 60 * 24 , 'day'];
					chunks[4] = [60 * 60 , 'hr'];
					chunks[5] = [60 , 'min'];
					var i = 0;
					var j = chunks.length;
					for (i = 0; i < j; i++) {
						s = chunks[i][0];
						n = chunks[i][1];
						if ((xj = Math.floor(d / s)) != 0)
							break;
					}
					fuzzy = xj == 1 ? '1 '+n : xj+' '+n+'s';
					if (i + 1 < j) {
						s2 = chunks[i + 1][0];
						n2 = chunks[i + 1][1];
						if ( ((xj2 = Math.floor((d - (s * xj)) / s2)) != 0) )
							fuzzy += (xj2 == 1) ? ' + 1 '+n2 : ' + '+xj2+' '+n2+'s';
					}
					fuzzy += ' ago';
			return fuzzy;
			}
        }
		
		function num(a){
            var b = a;
            if (a > 999999) b = Math.floor(a / 1E6) + "M";
            else if (a > 9999) b = Math.floor(a / 1E3) + "K";
            else if (a > 999) b = Math.floor(a / 1E3) + "," + a % 1E3;
            return b
        }
		
		function parseQ(url){
			var v = [], hash, q = url.split('?')[1];
			if(q != undefined){
				q = q.split('&');
				for(var i = 0; i < q.length; i++){
					hash = q[i].split('=');
					v.push(hash[1]);
					v[hash[0]] = hash[1];
				}
			}
			return v;
		}
		
		function sortstream(obj,d){
			var $l = $('li',obj);
			$l.sort(function(a, b){
				var keyA = parseInt($(a).attr('rel'),10), keyB = parseInt($(b).attr('rel'),10);
				if(d == 'asc'){
					return (keyA > keyB) ? 1 : -1;
				} else {
					return (keyA < keyB) ? 1 : -1;
				}
				return 0;
			});
			$.each($l, function(index, row){
				obj.append(row);
			});
			$('.dcsns-loading').slideUp().remove();
			return;
		}
		
		function randomish(l){
			var i = 0, out = '';
			while(i < l){
				out += Math.floor((Math.random()*10)+1)+'';
				i++;
			}
			return out;
		}
		
		function ticker(s,b,speed){
			var $a = $('li:last',s),$b = $('li:first',s),$gx,bh = $b.outerHeight(true);
			if($('li',s).not('.inactive').length > 2){
				if(b == 'next'){
					$gx = $a.clone().hide();
					$b.before($gx);
					$a.remove();
					if($a.hasClass('inactive')){
						ticker(s,b,speed);
					} else {
						$('.inner',$gx).css({opacity: 0});
						$gx.slideDown(speed,'linear',function(){
							$('.inner',this).animate({opacity: 1},speed);
						});
						return;
					}
				} else {
					$gx = $b.clone();
					if($b.hasClass('inactive')){
						$a.after($gx);
						$b.remove();
						ticker(s,b,speed);
					} else {
						$b.animate({marginTop: -bh+'px'},speed,'linear',function(){
							$a.after($gx);
							$b.remove();
						});
						$('.inner',$b).animate({opacity: 0},speed);
					}
				}
			}
		}

		function fbHrefLink(id,obj){
			jQuery.ajax({
				url: 'https://graph.facebook.com/'+id,
				dataType: 'jsonp',
				success: function(a){
					$('.icon',obj).each(function(){
						$(this).parent().attr('href',a.link);
					});
					$('.section-user a',obj).each(function(){
						$(this).attr('href',a.link);
						$(this).text(a.username);
					});
				}
			});
		}
		
		function flickrHrefLink(id,obj){
			jQuery.ajax({
				url: 'http://api.flickr.com/services/feeds/groups_pool.gne?id='+id+'&format=json&jsoncallback=?',
				dataType: 'jsonp',
				success: function(a){
					$('.icon',obj).each(function(){
						$(this).parent().attr('href',a.link);
					});
				}
			});
		}
		
		function share(st,sq,twitterId){
			var s = '', sq = encodeURIComponent(sq), st = encodeURIComponent(st);
			s = '<a href="http://www.facebook.com/sharer.php?u='+sq+'&t='+st+'" class="share-facebook-dcsns"></a>';
			s += '<a href="https://twitter.com/share?url='+sq+'&text='+st+'&via='+twitterId+'" class="share-twitter-dcsns"></a>';
			return s;
        }
})(jQuery);

jQuery(window).load(function(){
	jQuery.getScript("//platform.twitter.com/widgets.js", function(){});
	jQuery('.section-share a').click(function(){
		var u = jQuery(this).attr('href');
		window.open(u,'sharer','toolbar=0,status=0,width=626,height=436');
		return false;
	});
});