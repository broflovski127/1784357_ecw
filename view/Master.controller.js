jQuery.sap.require("sap.em.somit.ecw.util.Formatter");
jQuery.sap.require("sap.em.somit.ecw.util.Selector");

sap.ui.controller("sap.em.somit.ecw.view.Master", {
	
	onInit : function() {
		this._itemIndexMap = {}; //Nomination Item - Index Map 
	}, 
	
	onAfterRendering : function() {
	}, 
	
	onAfterBinding: function() {
		
		$(".Hidden").hide();

	    /* Assign index to item */
		this._itemIndexMap = {}; 
		var itemIndexMap = this._itemIndexMap; 
	    $(".NominationItemTable").each( function(){
	    	$(this).find(".ItemIndex").each( function(i) {
	    		var oIndexText = sap.ui.getCore().byId( $(this).attr('id') ); 
	    		if( oIndexText )
	    			oIndexText.setText( i + 1 ); 
	    		
	    		var itemKey = $(this).closest("tr").find(".Key").text(); 
	    		itemIndexMap[ itemKey ] = i + 1; 
	    	});
	    });
	    
	},

	handleNominationPress : function (evt) {
		
		var sourceId = "#" + evt.getSource().getId(); 
		this.nav.to("Empty"); 
        
        $(".SelectedItem").removeClass("SelectedItem"); //Clear selected item
        $(".Hidden:visible").slideToggle(); //Hide visible expanded item
        this.setCaptureButtonEnable( sourceId, false ); 

		$(sourceId).closest(".MasterListItemBox").find(".Hidden").slideToggle(); 
		if( $(sourceId).find(".Hidden").is(":visible") ){
			$(sourceId).closest(".MasterListItemBox").addClass("SelectedMainListItem"); 
		}else {
			$(sourceId).closest(".MasterListItemBox").removeClass("SelectedMainListItem"); 
		}
	},
	
	handleNominationItemPress: function (evt) { 
		var sourceId = "#" + evt.getSource().getId(); 
		
		$(sourceId).toggleClass('SelectedItem'); 

		if( $(sourceId).closest(".ExpandedNominationItemList").find(".SelectedItem").length > 0 ){
			this.setCaptureButtonEnable( sourceId, true );
		}else {
			this.setCaptureButtonEnable( sourceId, false );
		}	
	},
	
	handleSelectAllButton: function (evt) { 
		var sourceId = "#" + evt.getSource().getId(); 
		
		$(sourceId).closest(".ExpandedNominationItemList").find(".NomItem").addClass("SelectedItem"); 
		this.setCaptureButtonEnable( sourceId, true );
	},
	
	handleCapturePressButton : function (evt) { 
		var sourceId = "#" + evt.getSource().getId(); 
		
		this.nav.to("Empty");
		
		var oCaptureButton = this.getCaptureButton( sourceId );
		if( oCaptureButton ){
			if( oCaptureButton.getText()=="Capture"){
				oCaptureButton.setText("Done"); 
			}else{
				oCaptureButton.setText("Capture"); 
				oCaptureButton.setEnabled( false ); 
				$(sourceId).closest(".ExpandedNominationItemList").find(".SelectedItem").removeClass("SelectedItem");
				return; 
			}
		}
		
		/* Collect Selected Item */
		var selectedItemKeyList = new Array(); 
		$(sourceId).closest(".ExpandedNominationItemList").find(".SelectedItem").each(
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
			    var item = { ItemIndex  : this._itemIndexMap[selectedItemList[i].MaterialNo],  
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
					 if(typeof this.EventItems === 'undefined'){
						 this.EventDate = selectedItemList[i].ItemEventList[j].EventDate; 
						 this.EventTime = selectedItemList[i].ItemEventList[j].EventTime; 
						 this.EventItems = [];  
						 this.EventItems.push( item ); 
						 isInserted = true; 
					 }else if(this.EventDate === selectedItemList[i].ItemEventList[j].EventDate &&
							  this.EventTime === selectedItemList[i].ItemEventList[j].EventTime ){
						 this.EventItems.push( item );
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
					newEvent.EventItems = []; 
					newEvent.EventItems.push( item );
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
			var itemIndexMap = this._itemIndexMap;
			for (var j = 0; j < eventListLength; j++) { /* Item - Event iteration */
				
				$(eventList).each( function() {
					 if (this.EventID != allItemList[i].ItemEventList[j].EventID || 
					     this.EventDate != allItemList[i].ItemEventList[j].EventDate ||
					     this.EventTime != allItemList[i].ItemEventList[j].EventTime ){
						 return; 
					 }
					 
					 var item = { ItemIndex  : itemIndexMap[allItemList[i].MaterialNo],  
			    		          materialNo : allItemList[i].MaterialNo };
					 this.EventItems.push( item );
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
	}, 
	
	/* UTILITY FUNCTION */
	getCaptureButton : function( siblingId ) {
		return sap.em.somit.ecw.util.Selector.
			getSiblingComponentFromSource(siblingId,".MasterListItemBox",".CaptureButton");
	}, 
	
	setCaptureButtonEnable : function ( siblingId, bEnable ) {
		var oCaptureButton = this.getCaptureButton(siblingId);
	
	if( oCaptureButton )
		oCaptureButton.setEnabled( bEnable ); 
	}, 
	
	setCaptureButtonText : function ( siblingId, sText ) {
		var oCaptureButton = this.getCaptureButton(siblingId);
	
	if( oCaptureButton )
		oCaptureButton.setText( sText ); 
	}, 
});