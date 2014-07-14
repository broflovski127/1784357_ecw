jQuery.sap.declare("sap.ui.demo.myFiori.util.Formatter");

jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.demo.myFiori.util.Formatter = {
	
	_statusStateMap : {
		"P" : "Success",
		"N" : "Warning"
	},

	statusText :  function (value) {
		var bundle = this.getModel("i18n").getResourceBundle();
		return bundle.getText("StatusText" + value, "?");
	},
	
	statusState :  function (value) {
		var map = sap.ui.demo.myFiori.util.Formatter._statusStateMap;
		return (value && map[value]) ? map[value] : "None";
	},
	
	date : function (value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}); 
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},
	
	/* Custom */
	masterListClassFormatter : function ( itemList ) {
		var listLength = itemList.length;
		for (var i = 0; i < listLength; i++) {
		    if( itemList[i].ItemEventList.length > 0 )
		      return "InProgressItem";
		}
		
		return ""; 
	}, 
	
	masterItemListClassFormatter : function (itemEventList) {
		
		var getDate = function( date, time ){
			var year, month, day, hour, minute; 
			var arrDate = date.split("/");
			if( arrDate.length == 3 ){
				day = arrDate[0]; 
				month = arrDate[1] - 1;
				year = arrDate[2];
			}else 
				return null; 
			
			var arrTime = time.split(":");
			if( arrTime.length == 2 ){
				hour = arrTime[0]; 
				minute = arrTime[1];
			}else 
				return null; 
			
			return new Date(year,month,day,hour,minute,0,0);
		}; 
		
		var listLength = itemEventList.length;
		var eventId = 0; 
		var latestDate = new Date(0,0,0); 
		for (var i = 0; i < listLength; i++) {
			if( itemEventList[i].EventDate == undefined || itemEventList[i].EventTime == undefined )
				continue; 
			
			var eventDate = getDate( itemEventList[i].EventDate, itemEventList[i].EventTime ); 
			if( eventDate == null )
				continue; 
			
			if( eventDate > latestDate ){
				eventId =  itemEventList[i].EventID; 
				latestDate = eventDate; 
			}
		}
		
		if( eventId == 0 )
			return ""; 
		
		var oModel = sap.ui.getCore().getModel(); 
		var arrEventCollection = oModel.getData().EventCollection; 
		
		var arrEvent = $.grep(arrEventCollection, function( item, i ){ 
      	  return item.EventID == eventId; 
      	});
		
		if( arrEvent.length > 0 );
			return arrEvent[0].EventDesc; 
		
		return status; 
	}
};