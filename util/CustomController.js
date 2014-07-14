jQuery.sap.declare("sap.ui.demo.myFiori.util.CustomController");

sap.ui.core.Control.extend("sap.ui.demo.myFiori.util.CustomController", {

	metadata : {
      aggregations: {
        "saleOrders" : {
          type : "SaleOrder",
          multiple : true,
          singularItem : "saleOrder"
        },
        defaultAggregation : "saleOrders"
      }
	},

	onAfterRendering : function() {
      
      $("#" + this.getId()).find("h2").click(function(){
    	  
    	//$(this).next().append( "<p>Test</p>" );
    	  
        $(this).next().slideToggle();
        
      }).next().hide();
    },

	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.writeStyles();
        oRm.addClass("accordion");
        oRm.writeClasses();
        oRm.write(">");
        $.each(oControl.getSaleOrders() , function( index, item ) {
          oRm.write("<h2>");
          oRm.write(item.getSoid());
          oRm.write("</h2>");
          oRm.write("<p>");
          oRm.write(item.getBuyername());
          oRm.write("</p>");
        });
		oRm.write("</div>");
	}
});

sap.ui.core.Element.extend("SaleOrder",{
	  metadata : {
	    properties : {
	      "soid" : {type : "string"},
	      "buyername" : {type : "string"}
	    }
	  }
	});

