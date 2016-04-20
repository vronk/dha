//_paq.push(['trackPageView', {pageNameGoesHere}]);
var layoutMaps = {
		"tile":{
			"schema:event":{
				"color":"color",
				"version":"schema:location",
				"cover":"schema:image",
				"title":"schema:startDate",
				"tagline":"schema:headline"
			},
			"schema:project":{
				"color":"color",
				"cover":"schema:image",
				"title":"schema:organizer",
				"tagline":"schema:headline"
			},
			"schema:biblio":{
				"color":"color",
				"cover":"schema:image",
				"title":"title_field",
				"tagline":"schema:keywords",
				"icon":"mediatype"
			},
			"schema:institution":{
				"color":"color",
				"cover":"schema:image",
				"title":"",
				"tagline":"schema:legalName",
			},
			"schema:menu_entry":{
				"color":"color",
				"title":"schema:headline",
				"tagline":"desc",
			}
		},
		"table":{
			"schema:event":{
				"":"schema:image",
				"Title":"schema:headline"
			},
			"schema:project":{
				"":"schema:image",
				"Title":"schema:headline",
				"Link":"schema:sameAs",
				"Tags":"schema:keywords",
				"Desc":"schema:description"
			},
			"schema:biblio":{
				"Type":"mediatype",
				"Title":"title_field",
				"Link":"schema:sameAs",
				"Tags":"schema:keywords",
				"Desc":"schema:description",
				"Author":"schema:author"
			},
			"schema:institution":{
				"":"schema:image",
				"Name":"schema:legalName"
			}
		},
		"carousel":{

		},
		"detail": {
			"schema:event":{
				"Cover":"schema:image",
				"Date":"schema:startDate",
				"Title":"schema:headline",
				"Description":"schema:description",
				"Tags":"schema:keywords",
				"Text":"schema:text"
			},
			"schema:project":{
				"Cover":"schema:image",
				"Title":"schema:headline",
				"Description":"schema:description",
				"Tags":"schema:keywords",
				"Text":"schema:text",
				"inst":"schema:organizer",
				"License":"schema:license",
				"Media":"schema:associatedMedia",
				"Links":"schema:sameAs"
			},
			"schema:biblio":{
				"Type":"mediatype",
				"Cover":"schema:image",
				"Title":"title_field",
				"Description":"schema:description",
				"Tags":"schema:keywords",
				"Link":"schema:sameAs",
				"Text":"schema:text"
			},
			"schema:institution":{
				"Cover":"schema:image",
				"Title":"schema:legalName",
				"Text":"schema:description",
			}
		}
};



//****************************************************
//***************** [dha-data] ***********************
//the local xmlHttpRequest - Wrapper
//at the moment: all-in-one-sync to simple JS-object in [dha-app]
//for more complex queries pouchdb.com should be used
Polymer({is: 'dha-data',
	properties: {
		data: {
			type: Object,
			notify: true
		},
		taxonomy: {
			type: Array,
			notify: true
		},
		request: {
			type: String,
			notify: true
		}

	},
	_handleResponse: function (e, req) {
		var cdata = req.response;
		
		//performing client side processing actions across the entire array of nodes
		for (var i = 0; i < cdata.length; i++) {
			//could be removed, but i liked the idea of being able to dynamically
			//change themecolors. should probs be a css class though
			cdata[i].color = "#ffffff";
			if(cdata[i]['schema:keywords'] == undefined){cdata[i]['schema:keywords'] = [];}
		}

		// in case this is the first call
		if(this.data == undefined){this.data = {};}

		if(e.target.id == "req"){
			this.data.en = cdata;
		}
		if(e.target.id == "reqde"){
			this.data.de = cdata;
		}
		if(e.target.id == "tags"){
			this.data.tags = cdata;
		}

		//first check on things, then fire it to app
		console.log(this.data);
		this.fire('updateData', this.data)

	}
});

//****************************************************
//***************** [dha-app] ************************
//the APP-wrapper
//wraps/filters/updates data object
//constructs menu from tags and menu entries
Polymer({is: 'dha-app',
	enableCustomStyleProperties: true,
	properties: {
		//this is used to feed a node ID for direct links
		node: {
			type: String,
			notify: true
		},

		//the object caching the entire sites content, 
		//so long as its only markup it is quite efficient
		//if media caching is desired, pouchdb.com may be advisable 
		dha_data: {
			type: Object,
			notify: true
		},
		language: {
			type: String,
			notify: true
		},
		tags: {
			type: Array,
			notify:true
		},
		type: {
			type: String,
			notify:true
		},
		head: {
			type: Object,
			notify:true
		}
	},
	listeners: {
		'swapcontent' : '_swapContent',
		'updateData' : '_updateData'
 	},
 	attached: function(){
 		var that = this;
 		this.async(function() {
 		    //var Pages = that._filterContent(that.dha_data,that.language,'schema:page',['_start']);
        	//$('#starttext')[0].innerHTML = Pages[0]['schema:text'];
        	console.log($('#starttext')[0]);
        	console.log(this.dha_data);
        	console.log(that.language);
        });
    },
	//returns the relevant nodes filtered by language, type and tags
	//data parameter is only passed to make sure the data has been loaded BEFORE the filter runs
	//this also ensures that it's rerun whenever an ajax call loads an update (not currently implemented)
	_filterContent: function (data,language,type,tags) {
		rdata = [];
		console.log(tags);
		if(data[language] != undefined){
			data[language].forEach(function(a){
				if(!type || a['schema:additionalType'] == type || type == "TopicsView"){
					if(tags == undefined || tags == null || tags.length == 0 || tags[0] == ""){
						rdata.push(a);
					}
					else if (tags.length) {
						tags.forEach(function(t){
							a['schema:keywords'].forEach(function(k){
								if(t == k){
									for (var i = 0; i < rdata.length; i++){
										if(rdata[i]['schema:name'] == a['schema:name']) {
											rdata.splice(i,1);
										}
									}
									rdata.push(a);
									rdata = rdata.filter(function (item) { return item != undefined });
								}			 
							});
						});
					}
				}
			});
		}
		return rdata;
	},

	//used to bind _filterContent to various eventlisteners, internal and external
	//we should probably have checks here in case bullshit params are passed from drupal...
	_swapContent: function (e) {
		this.type = "dummy";
		that = this;
		//quite ugly, timeout should be dynamic acc to the amount of content rendered...
		console.log(e.detail);
		var ctags = that.tags;
		this.tags = [];
		if(e.detail.action && e.detail.action == "addTag"){
			if(!ctags || ctags == null || ctags.length == 0) ctags = [""]
			console.log(ctags);
			for (var i = 0; i < ctags.length; i++){
				if(ctags[i] == e.detail.tags[0] || ctags[i] == "") {
					ctags.splice(i,1);
				}
			}
			ctags.push(e.detail.tags[0]);
		}
		else if(e.detail.action && e.detail.action == "removeTag"){
			if(!ctags || ctags == null || ctags.length == 0) ctags = [""]
			console.log(ctags);
			for (var i = 0; i < ctags.length; i++){
				if(ctags[i] == e.detail.tags[0] || ctags[i] == "") {
					ctags.splice(i,1);
				}
			}
		}
		else ctags = e.detail.tags;
		ctags = ctags.filter(function (item) { return item != undefined });
		if(e.detail.title) this.head = e.detail;
		console.log(this.head);
		setTimeout(function () {
			$('dha-page')[0].dnode = "";
			that.type = e.detail.type;
			that.tags = ctags;
			if(e.detail.history != true && e.detail.title) History.pushState(null , e.detail.title , "?page="+e.detail.title);
			else if(e.detail.history != true ) History.pushState(null , "title", "?type="+e.detail.type+"&tags="+ctags);
			//_paq.push(['trackPageView', document.URL]);
		}, 50);
	},

	//will decode parameters passed in URL and navigate to content
	//basically only used for direct node linking and history browsing
	_paramsNav: function(link) {
		that = this;
		if(link.length>1) {
        	var Params = JSON.parse('{"' + decodeURI(link[link.length-1]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	        if(Params.type || Params.tags) {
	        	$('dha-page')[0].dnode = "";
	        	var e = {'detail':{'type':Params.type,'tags':Params.tags.split(','), 'history':true}};
	        	this._swapContent(e);
	        }
	        else if(Params.page) {
	        	var Pages = this._filterContent(this.dha_data,this.language,'schema:menu_entry','');
	        	for (var i = 0; i < Pages.length; i++){
					if(Pages[i]['schema:headline'] == Params.page) {
						var pagecopy = JSON.parse(JSON.stringify(Pages[i]));
						if (pagecopy.call_type == undefined) {pagecopy.calltype = "";}
						if (pagecopy['schema:keywords'] == undefined) {pagecopy['schema:keywords'] = [""];}
						for (var y = 0; y < pagecopy['schema:keywords'].length; y++) {
							if(pagecopy['schema:keywords'][y].match(/_/)) pagecopy['schema:keywords'].splice(y,1);
						}
						pagecopy['schema:keywords'] = pagecopy['schema:keywords'].filter(function (item) { return item != undefined });
						$('dha-page')[0].dnode = "";
						that.type = pagecopy.call_type;
						that.tags = pagecopy['schema:keywords'];
						that.head = {"title":pagecopy['schema:headline'],"desc":pagecopy['desc']};
					}
				} 
	        }
     		else if(Params.node) setTimeout(function () {
     				$('dha-page')[0].dnode = Params.node;
     			}.bind(this), 1500);
        }
        else {
        	$('#headbar').hide();
        	var e = {'detail':{'type':'schema:menu_entry','tags': ['_start'], 'history':true}};
        	this._swapContent(e);
        	var Pages = this._filterContent(this.dha_data,this.language,'schema:page',['_start']);
        	//$('#starttext')[0].innerHTML = Pages[0]['schema:text'];
        }

	},

	//receiving data from dha-data - finally correct as per MVD specs
	_updateData: function (e) {
		this.dha_data = "";
		this.dha_data = e.detail;
		if(this.dha_data.en && this.dha_data.de){
			var link = document.URL.split("?");
	        this._paramsNav(document.URL.split("?"));
	        //_paq.push(['trackPageView', document.URL]);

	        var that = this;
	        window.onpopstate = function(){
	            that._paramsNav(document.URL.split("?"));
	            //_paq.push(['trackPageView', document.URL]);
	        }
	    }
	},

	//quick'n'dirty, as soon as we serve more than two languages
	//this will need to be redone entirely
	_computeLanguageIcon: function (language) {
		if (language === 'en') {
		return 'EN';
		} else {
		return 'DE';
		}
	},
	_swapLanguage: function () {
		var clang = this.language;
		this.language = "dummy";
		that = this;
		if (clang === 'en') {
			setTimeout(function () {that.language = "dummy";that.language = "de";}, 5);
		} else {
			setTimeout(function () {that.language = "dummy";that.language = "en";}, 5);
		}
	}
});


Polymer({is: 'theme-color',
	properties: {
	color: {
	type: String,
	notify: true
	},
	textColor: {
	type: String,
	notify: true,
	computed: 'computeTextColor(color)'
	},
	outline: { type: Boolean }
	},
	observers: ['colorContent(color)'],
	computeTextColor: function (color) {
	if (this.color) {
	//var lightness = one.color(this.color).lightness();
	//return lightness > 0.5 ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)';
	return '#EF6C00';
	} else {
	return null;
	}
	},
	_color: function (node, bgColor, color) {
	node.style.color = color;
	node.style.backgroundColor = bgColor;
	if (this.outline)
	this._outline(node, bgColor);
	},
	_colorBorder: function (node, borderColor) {
	node.style.borderColor = borderColor;
	},
	_outline: function (node, bgColor) {
	if (one.color(bgColor).lightness() > 0.9) {
	node.style.outline = '1px solid rgba(0,0,0,.25)';
	node.style.outlineOffset = '-1px';
	}
	},
	colorContent: function () {
	if (this.hasAttribute('themed'))
	this._color(this, this.color, this.textColor);
	if (this.hasAttribute('themed-reverse'))
	this._color(this, this.textColor, this.color);
	if (this.hasAttribute('themed-border'))
	this._colorBorder(this, this.color);
	if (this.hasAttribute('themed-border-reverse'))
	this._colorBorder(this, this.textColor);
	var nodes = Polymer.dom(this).querySelectorAll('[themed],[themed-reverse],[themed-border],[themed-border-reverse]');
	for (var i = 0; i < nodes.length; i++) {
	if (nodes[i].hasAttribute('themed')) {
	this._color(nodes[i], this.color, this.textColor);
	} else if (nodes[i].hasAttribute('themed-reverse')) {
	this._color(nodes[i], this.textColor, this.color);
	} else if (nodes[i].hasAttribute('themed-border')) {
	this._colorBorder(nodes[i], this.color);
	} else if (nodes[i].hasAttribute('themed-border-reverse')) {
	this._colorBorder(nodes[i], this.textColor);
	}
	}
	}
});