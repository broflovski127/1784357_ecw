jQuery.sap.declare("sap.ui.demo.myFiori.util.ExtendedDisplayListItem");

sap.m.CustomListItem.extend("sap.ui.demo.myFiori.util.ExtendedDisplayListItem", {

      onAfterRendering : function() {
      $("#" + this.getId()).find("li").click(function(){
        //$(this).append( "<p>Test</p>" ); 
      });
    },
	renderer: {}
}
);