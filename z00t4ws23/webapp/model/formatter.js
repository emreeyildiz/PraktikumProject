sap.ui.define([], function () {
    "use strict";

    return {
        formatDateRange: function (sStartDate, sEndDate) {
            var formatDateString = function (sDate) {
                if (sDate && sDate.length === 8) {
                    return sDate.slice(0, 2) + "." + sDate.slice(2, 4) + "." + sDate.slice(4);
                }
                return sDate;
            };

            return formatDateString(sStartDate) + " -- " + formatDateString(sEndDate);
        }
    };
});
