jQuery.sap.require("sap.ui.demo.myFiori.util.Formatter");

var itemSelected = false; 
var itemIndexMap = {}; 

sap.ui.controller("sap.ui.demo.myFiori.view.Master", {
	
	onInit : function() {
		_itemIndexMap = new Object(); 
	}, 
	
	afterBinding: function() {
	    $(".hidden, .MainListItemStatus").hide(); 
	    
	    /* Sort List */
	    /*function sortAlpha(a,b){
	        return a.id < b.id ? 1 : -1;
	    };
	    $('.MasterList .MainListItem').sort(sortAlpha).appendTo('.MasterList');*/
	    
	    /* Main List Item */
	    /*$(".MainListItem").each( function(){
	    	oMainListItem = sap.ui.getCore().byId( $(this).attr('id') );
	    	var context = oMainListItem.getBindingContext();
			var oModel = context.getModel();  
			var itemList = oModel.getProperty("NomItemCollection", context);  
			
			var listLength = itemList.length;
			for (var i = 0; i < listLength; i++) {
			    if( itemList[i].ItemEventList.length > 0 )
			    	oMainListItem.addStyleClass("InProgressItem"); 
			}
	    });*/ 

	    /* Assign index to item */
	    $(".ItemTable").each( function(){
	    	$(this).find(".ItemIndex").each( function(i) {
	    		var oText = sap.ui.getCore().byId( $(this).attr('id') ); 
	    		oText.setText( i + 1 ); 
	    		var key = $(this).closest("tr").find(".Key").text(); 
	    		itemIndexMap[ key  ] = i + 1; 
	    	});
	    });
	    
	},

	handleListItemPress : function (evt) {
		this.nav.to("Empty");
		var context = evt.getSource().getBindingContext();
		var oModel = context.getModel();  
        var mainPos = oModel.getProperty("NomKey", context);                    //  
        var data = oModel.getData(); 
        var result = $.grep(data, function(e){ return e.NomStatus == "None"; });
        
        $(".SelectedItem").removeClass("SelectedItem"); 
        var oButton = sap.ui.getCore().byId($("#" + evt.getSource().getId()).closest(".NomContainer").
				find(".CaptureButton").attr('id'));
	    oButton.setEnabled( false ); 
		
		$(".hidden:visible").slideToggle(); 

		/*if( itemSelected==true ){
			itemSelected = false; 
			return; 
		}*/
		/*var oModel = new sap.ui.model.json.JSONModel("model/item.json");
		var tableId = $("#" + evt.getSource().getId()).closest(".NomContainer").find(".ItemTable").attr('id'); 
		var oTable = sap.ui.getCore().byId( tableId ); 
		oTable.setModel( oModel ); 
		oTable.bindItems("/NomItemList",
				new sap.m.ColumnListItem({
					press : "handleItemPress",
					type : "Active",
			        cells : [ new sap.m.Text({
			          text : "{Id}"
			        }), new sap.m.Text({
			          text : "{Name}"
			        })]
			      })
		);*/
		
		//var context = evt.getSource().getBindingContext();
		//this.nav.to("Detail", context);
		
		/*var item = evt.getSource(); 
		var myButton = new sap.m.Button("btn");
		myButton.setText("Hello World!");

		item.addContent(
	      myButton
		); */
		
		//$(".hidden").slideToggle();
		//alert("#" + evt.getSource().getId());
		
		
		
		if( $("#" + evt.getSource().getId()).closest(".NomContainer").find(".hidden").is(":visible") )
			return; 
		
		$("#" + evt.getSource().getId()).closest(".NomContainer").find(".hidden").slideToggle(); 
		if( $("#" + evt.getSource().getId()).find(".hidden").is(":visible") ){
			$("#" + evt.getSource().getId()).closest(".MainListItem").addClass("SelectedMainListItem"); 
		}else {
			$("#" + evt.getSource().getId()).closest(".MainListItem").removeClass("SelectedMainListItem"); 
		}
	},
	
	handleItemPress: function (evt) { 
		
		$("#" + evt.getSource().getId()).toggleClass('SelectedItem'); 
		
		var oButton = sap.ui.getCore().byId($("#" + evt.getSource().getId()).closest(".ExpandItemList").
				find(".CaptureButton").attr('id'));
		if( $("#" + evt.getSource().getId()).closest(".ExpandItemList").find(".SelectedItem").length > 0 ){
			oButton.setEnabled( true ); 
		}else {
			oButton.setEnabled( false ); 
		}
			
	},
	
	handleSelectAll: function (evt) { 
		$("#" + evt.getSource().getId()).closest(".ExpandItemList").find(".NomItem").addClass("SelectedItem"); 
		
		var oButton = sap.ui.getCore().byId($("#" + evt.getSource().getId()).closest(".ExpandItemList").
				find(".CaptureButton").attr('id'));
		oButton.setEnabled( true ); 
	},
	
	handleCapturePress : function (evt) { 
		
		this.nav.to("Empty");
		
		var oButton = sap.ui.getCore().byId($("#" + evt.getSource().getId()).closest(".ExpandItemList").
				find(".CaptureButton").attr('id'));
		if( oButton.getText()=="Capture"){
			oButton.setText("Done"); 
		}else{
			oButton.setText("Capture"); 
			oButton.setEnabled( false ); 
			$("#" + evt.getSource().getId()).closest(".ExpandItemList").find(".SelectedItem").removeClass("SelectedItem");
			return; 
		}
		
		var selectedItemKeyList = new Array(); 
		/* Collect Selected Item */
		$("#" + evt.getSource().getId()).closest(".ExpandItemList").find(".SelectedItem").each(
				function(){
					selectedItemKeyList.push( $(this).find(".Key").text() ); 
				}); 
		
		/* TODO : Create Event List Model, Pass to Detail View */
		var context = evt.getSource().getBindingContext();
		var oModel = context.getModel();  
		var allItemList = oModel.getProperty(context.getPath()).NomItemCollection;
		
		var eventList = {}; 
		eventList = JSON.parse(JSON.stringify(oModel.getData().EventCollection));
		//eventList = jQuery.extend(true, {}, oModel.getData().EventCollection);
        //var eventList = oModel.getData().EventCollection; 
        var selectedItemList = $.grep(allItemList, function( item, i ){ 
        	  return $.grep(selectedItemKeyList, function( itemKey, index ){ 
            	  return itemKey == item.MaterialNo; 
          	}).length > 0;
        	});
        var unselectedItemList = $.grep(allItemList, function( item, i ){ 
      	  return $.grep(selectedItemKeyList, function( itemKey, index ){ 
          	  return itemKey != item.MaterialNo; 
        	}).length > 0;
      	});
        
        /* Add selected item in to Event List */
		var selectedItemListLength = selectedItemList.length;
		for (var i = 0; i < selectedItemListLength; i++) { /* Item iteration */
			
			var eventListLength = selectedItemList[i].ItemEventList.length;
			for (var j = 0; j < eventListLength; j++) { /* Item - Event iteration */
				
				var isInserted = false; 
			    var item = { itemIndex  : itemIndexMap[selectedItemList[i].MaterialNo],  
			    		     materialNo : selectedItemList[i].MaterialNo };
			    var eventDesc = "NONE"; 
			    var eventSeq = "0"; 
				 
				$(eventList).each( function() {
					 if (this.EventID != selectedItemList[i].ItemEventList[j].EventID ){
						 return; 
					 }
						  
					 /* Insert item to the empty event, or the one that has the same timestamp */
					 eventDesc = this.EventDesc; 
					 eventSeq = this.EventSeq; 
					 if(typeof this.eventItems === 'undefined'){
						 this.EventDate = selectedItemList[i].ItemEventList[j].EventDate; 
						 this.EventTime = selectedItemList[i].ItemEventList[j].EventTime; 
						 this.eventItems = [];  
						 this.eventItems.push( item ); 
						 isInserted = true; 
					 }else if(this.EventDate === selectedItemList[i].ItemEventList[j].EventDate &&
							  this.EventTime === selectedItemList[i].ItemEventList[j].EventTime ){
						 this.eventItems.push( item );
						 isInserted = true; 
					 }

				});
				
				/* Insert item to the new Event in case of new timestamp */
				if( isInserted===false ){
					var newEvent = {}; //JSON.parse(JSON.stringify(this));; 
					newEvent.EventDesc = eventDesc; 
					newEvent.EventId = selectedItemList[i].ItemEventList[j].EventID;
					newEvent.EventSeq = eventSeq;
					newEvent.EventDate = selectedItemList[i].ItemEventList[j].EventDate;
					newEvent.EventTime = selectedItemList[i].ItemEventList[j].EventTime; 
					newEvent.eventItems = []; 
					newEvent.eventItems.push( item );
					eventList.push( newEvent ); 
				}
			}
		}
		
		/* Add unselected item on the same event with the same timestamp */
		var allItemListLength = allItemList.length;
		for (var i = 0; i < allItemListLength; i++) { /* Item iteration */
			
			if( selectedItemKeyList.indexOf(allItemList[i].MaterialNo) > -1 ){
				continue; 
			}
			
			var eventListLength = allItemList[i].ItemEventList.length;
			for (var j = 0; j < eventListLength; j++) { /* Item - Event iteration */
				
				$(eventList).each( function() {
					 if (this.EventID != allItemList[i].ItemEventList[j].EventID || 
					     this.EventDate != allItemList[i].ItemEventList[j].EventDate ||
					     this.EventTime != allItemList[i].ItemEventList[j].EventTime ){
						 return; 
					 }
					 
					 var item = { itemIndex  : itemIndexMap[allItemList[i].MaterialNo],  
			    		          materialNo : allItemList[i].MaterialNo };
					 this.eventItems.push( item );
					 isInserted = true; 
				});
			}
		}
		
		var eventListData = {
				EventCollection : []
		}; 
		
		eventListData.EventCollection = eventList; 
		//var eventListJSON = JSON.stringify(eventListData);
		
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(eventListData);
		this.nav.to("Detail", oModel);
	},
	
	handleSearch : function (evt) {
		
		// create model filter
		var filters = [];
		var query = evt.getParameter("query");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("SoId", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
		}
		
		// update list binding
		var list = this.getView().byId("list");
		var binding = list.getBinding("items");
		binding.filter(filters);
	}
});