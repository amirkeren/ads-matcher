(function () {

	function App() {

		var $itemText = $("#ItemText");

        $("#SaveNewItemButton").click(onSaveNewItemButtonClicked);

		function init() {
			$("#new-todo").submit(function (e) {
				return false;
			});
		}

		function onSaveNewItemButtonClicked() {
            var itemText = $itemText.val();
			$("#url-container").html('<object width="100%" height="300px" type="text/html" data="' + itemText +
			    '"></object>');
            $.post("/api/alchemy", {"data": itemText}, function(data, status) {
                console.log("received from server - " + data);
                if (data == undefined) {
                    //don't display ad
                    console.log("shouldn't display ad");
                } else {
                    console.log("should display ad");
                    $("#ad-container").html(data.ad);
                    $("#explanation-container").html(data.explanation);
                    $("#bottom-container").show();
                }
            }, "json");
		}

		return {
			init: init
		};
	}

	window.App = new App();

}());