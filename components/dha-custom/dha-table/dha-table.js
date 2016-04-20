//***************** [dha-table] ***********************
Polymer({is: 'dha-table',
	enableCustomStyleProperties: true,
	properties: { 
		events: {
				type: Array,
				notify: true,
				observer: '_updateTable'
				},
		content: {
			type: Array,
			notify: true
		},
		boundMarkup: {}
	},


	//data processing ////////////////////////////////////
	_updateTable: function () {
		//splitting by node type, so we can plot one table for every kind
		var mapped = [];
		for (var key in layoutMaps['table']) {
			var x=[]
			this.events.forEach(function(o) {
				if(o["schema:additionalType"] == key) {
					x.push(o);
				}
			});
			if(x.length > 0) {
				mapped.push(x);
			}
		}
		//there should/could be some sorting here...
		this.classList.remove('active');
		this.content = mapped;
		setTimeout(function () {
			this.classList.add('active');
			//if it's just one, expand it right away
			if(this.content.length == 1)
				this.$$('#elementtable').style.height = 'auto';
		}.bind(this), 50);
	},
	_openDetail: function (e) {
		if(e.target.getAttribute('class') == "row style-scope dha-table"){
			History.pushState(null , "title", "?node="+e.target.getAttribute('id'));
			this.fire('updateCard', e.target.getAttribute('id'));	
		}
		else {
			var row = this._findRow("row style-scope dha-table", e.target);
			History.pushState(null , "title", "?node="+row.getAttribute('id'));
			this.fire('updateCard', row.getAttribute('id'));
		}
	},
	_addTag: function(e) {
		console.log(e.target.lastChild.textContent);
		this.fire('swapcontent',{"type": "TopicsView", "tags":[e.target.lastChild.textContent],"action":"addTag","title":"Tag Selection: (click to remove)"});
	},
	///////////////////////////////////////////////////

	//styling functions ///////////////////////////////
	//since we're binding to a multidimensional array, we have to render manually via observer "_updateTable"
	//so attached is not needed, leaving it here for documentation
	attached: function () {
		setTimeout(function () {
			this.classList.add('active');
		}.bind(this), 50);
	},
	_expand: function (e) {
		if(e.detail.sourceEvent.target.previousElementSibling.style.height != 'auto')
			e.detail.sourceEvent.target.previousElementSibling.style.height = 'auto';
		else if(e.detail.sourceEvent.target.previousElementSibling.style.height == 'auto')
			e.detail.sourceEvent.target.previousElementSibling.style.height = '160px';
	},
	_multipleTypes: function (content) {
		if(content.length > 1) return true;
		else return false;
	},
	_collapsed: function (e) {
		return true;
	},
	_hideOverflow: function (a) {
		console.log(a['schema:additionalType']);
	},
	///////////////////////////////////////////////////
	
	//mapping functions ///////////////////////////////
	_mapContent: function (content,column) {
		var head;
		var field;
		if (content['schema:additionalType'] == "schema:project" || content['schema:additionalType'] == "schema:biblio" ) $('.coltwo').toggleClass('hidden', true);
		if(layoutMaps['table'][content["schema:additionalType"]]){
			head = Object.keys(layoutMaps['table'][content["schema:additionalType"]])
			if(layoutMaps['table'][content["schema:additionalType"]][head[column]] === "schema:startDate") {
				return this._parseDate(content[layoutMaps['table'][content["schema:additionalType"]][head[column]]]);
			}
			else if(layoutMaps['table'][content["schema:additionalType"]][head[column]] === "schema:image" && content[layoutMaps['table'][content["schema:additionalType"]][head[column]]] != undefined) {
				return content[layoutMaps['table'][content["schema:additionalType"]][head[column]]]['src'];
			}
			else if(layoutMaps['table'][content["schema:additionalType"]][head[column]] === "schema:sameAs" &&  content[layoutMaps['table'][content["schema:additionalType"]][head[column]]][0] != undefined) {
				return content[layoutMaps['table'][content["schema:additionalType"]][head[column]]][0]['url'];
			}
			else {return content[layoutMaps['table'][content["schema:additionalType"]][head[column]]];}
		}
		else {return ""};
	},
	_mapHeads: function(content, column) {
		var head;
		if(content[0] && layoutMaps['table'][content[0]["schema:additionalType"]]){
			head = Object.keys(layoutMaps['table'][content[0]["schema:additionalType"]])
		}
		if(head && head[column]){return head[column];}
		else {return "";}
	},
	_computeIfImage: function (line) {
		if(line['schema:additionalType'] == "schema:biblio") return false;
		return true;
	},
	_computeBibIcon: function (line) {
		if(line['schema:additionalType'] == "schema:biblio") return "hardware:developer-board";
		return false;
	},
	_computeIcon: function (types) {
		if(types[0]['schema:additionalType'] == "schema:project") return "hardware:developer-board";
		if(types[0]['schema:additionalType'] == "schema:event") return "event";
		if(types[0]['schema:additionalType'] == "schema:biblio") return "maps:local-library";
	},
	_computeCaption: function (types) {
		if(types[0]['schema:additionalType'] == "schema:project") return "PROJECTS";
		if(types[0]['schema:additionalType'] == "schema:event") return "EVENTS";
		if(types[0]['schema:additionalType'] == "schema:biblio") return "RESSOURCES";
	},
	_displayTag: function(tag) {
		if(tag.match(/_/)) return false;
		return true;
	},
	////////////////////////////////////////////////

	//helper functions ////////////////////////////
	_sort: function(e) {
		this.classList.remove('active');
		var column = e.detail.sourceEvent.target.innerHTML;
		var that = this;
		for (var i = 0; i < this.content.length; i++) {
			if(this.content[i][0][layoutMaps['table'][this.content[i][0]["schema:additionalType"]][column]] && column == "Date"){
				this.content[i].sort(function(a,b) {
	  				return b[layoutMaps['table'][a["schema:additionalType"]][column]]['value'] - a[layoutMaps['table'][a["schema:additionalType"]][column]]['value'];
				});
			}
			else if(this.content[i][0][layoutMaps['table'][this.content[i][0]["schema:additionalType"]][column]]){
				console.log(this.content[i]);
				this.content[i].sort(function(a,b) {
	  				if (a[layoutMaps['table'][a["schema:additionalType"]][column]] < b[layoutMaps['table'][a["schema:additionalType"]][column]])
	    				return -1;
		  			if (a[layoutMaps['table'][a["schema:additionalType"]][column]] > b[layoutMaps['table'][a["schema:additionalType"]][column]])
	    				return 1;
	  				return 0;
				});
			}
		};
		var cache = this.content;
			this.content = [];
			setTimeout(function () {
				that.content = cache;
			}, 50);	
		console.log(cache);
		setTimeout(function () {
			this.classList.add('active');
			//if it's just one, expand it right away
			if(this.content.length == 1)
				this.$$('#elementtable').style.height = 'auto';
		}.bind(this), 500);
	},
	_findRow: function(parentName, childObj) {
    	var testObj = childObj.parentNode;
	    while(testObj.getAttribute('class') != parentName) {
	        testObj = testObj.parentNode;
		}	    
		return testObj;
	},
	_parseDate: function(date) {
		if(date){
			var ndate = new Date(date*1000);
			return ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear();
		}
	},
	//prevent navigation for functional parts of rows - cross browser craziness
	_nonav: function(e) {
		if (!e)
      	e = window.event;
 		//IE9 & Other Browsers
    	if (e.stopPropagation) {
      		e.stopPropagation();
    	}
    	//IE8 and Lower
    	else {
      		e.cancelBubble = true;
    	}
	}
	////////////////////////////////////////////////
});