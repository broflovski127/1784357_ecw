jQuery.sap.declare("sap.em.somit.ecw.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.em.somit.ecw.util.Formatter = {
	
	/* Display the latest event */
	nominationItemEventFormatter : function (itemEventList) {
		
		var getDateObject = function( date, time ){
			if( !date || !time )
				return null; 
			
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
		
		var nListLength = itemEventList.length;
		var latestEventId = 0; 
		var oLatestDate = new Date(0,0,0); 
		for (var i = 0; i < nListLength; i++) {
			if( itemEventList[i].EventDate == undefined || itemEventList[i].EventTime == undefined )
				continue; 
			
			var oEventDate = getDateObject( itemEventList[i].EventDate, itemEventList[i].EventTime ); 
			if( oEventDate === null )
				continue; 
			
			if( oEventDate > oLatestDate ){
				latestEventId =  itemEventList[i].EventID; 
				oLatestDate = oEventDate; 
			}
		}
		
		if( latestEventId == 0 )
			return ""; 
		
		var oModel = sap.ui.getCore().getModel(); 
		var arrEventCollection = oModel.getData().EventCollection; 
		
		var arrEvent = $.grep(arrEventCollection, function( item, i ){ 
      	  return item.EventID == latestEventId; 
      	});
		
		if( arrEvent.length > 0 );
			return arrEvent[0].EventDesc; 
		
		return ""; 
	}
};