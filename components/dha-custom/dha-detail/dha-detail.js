Polymer({is: 'dha-detail',
	properties: { 
		events: {
			type: Array,
			notify: true,
			observer: 'showDetail'
		},
		prev: 		String,
		cevent: { 
			type : String,
			observer: 'showDetail' 
		},
		content: {
			type: Object,
			notify: true
		}

	},
	attached: function(){
		$('dha-detail').bind('resize', function(){
			console.log($('dha-detail'));
			$('#detailcover')[0].height= $('#detailcover')[0].width * 0,714;
		});
	},
	showDetail: function(e){
		var that = this;
		setTimeout(function () {
			this.events.forEach(function(a){
				if(that.cevent == a['schema:name']) {
					that.content = a;
					
				}
			});
		}.bind(this), 50);
	},
	_addTag: function(e) {
		console.log(e.target.lastChild.textContent);
		this.fire('swapcontent',{"type": "TopicsView", "tags":[e.target.lastChild.textContent],"action":"addTag"});
	},

	//mapping functions //////////////////////////
	_mapContent: function (content,field) {
		console.log(content);
		if(layoutMaps['detail'][content["schema:additionalType"]]){
			if(layoutMaps['detail'][content["schema:additionalType"]][field] === "schema:startDate") {
				return this._parseDate(content[layoutMaps['detail'][content["schema:additionalType"]][field]]);
			}
			else if(field == 'Cover' || field == 'icon') {
				console.log(content[layoutMaps['detail'][content["schema:additionalType"]][field]]);
				if(content[layoutMaps['detail'][content["schema:additionalType"]][field]] != undefined && content[layoutMaps['detail'][content["schema:additionalType"]][field]]['src'] != undefined && content[layoutMaps['detail'][content["schema:additionalType"]][field]]['src'] != "") {
					$('#detailcover')[0].preventLoad = false;
					return content[layoutMaps['detail'][content["schema:additionalType"]][field]]['src'];
				}
				else {
					console.log('check');
					$('#detailcover')[0].preventLoad = true; 
					return "";
				}
			}
			else if(field == 'Text' && content[layoutMaps['detail'][content["schema:additionalType"]][field]] != undefined) {
				$('#detailtext')[0].innerHTML = "";
				$('#detailtext')[0].insertAdjacentHTML('afterbegin',content[layoutMaps['detail'][content["schema:additionalType"]][field]]);
				return true;
			}
			else {return content[layoutMaps['detail'][content["schema:additionalType"]][field]];}
		}
		else {return "test"};
	},
	_parseDate: function(date) {
		if(date){
			var ndate = new Date(date*1000);
			return ndate.getDate()+"-"+ndate.getMonth()+"-"+ndate.getFullYear();
		}
	},
	_displayTag: function(tag) {
		if(tag.match(/_/)) return false;
		return true;
	},
	//////////////////////////////////////////////
});
