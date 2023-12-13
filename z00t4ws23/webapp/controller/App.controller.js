sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      return BaseController.extend("z00t4ws23.controller.App", {
        onOpenDialog: function () {
          this.getOwnerComponent().openCreateOrder();
      },
      });
    }
  );
  