sap.ui.define([], function () {
    'use strict'
    return {
        statusText: function (sStatus) {
            var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
            switch (sStatus) {
                case "A":
                    return resourceBundle.getText("PlantStatusA");
                case "B":
                    return resourceBundle.getText("PlantStatusB");
                case "C":
                    return resourceBundle.getText("PlantStatusC");
                default:
                    return sStatus;
            }
        }
    }
})