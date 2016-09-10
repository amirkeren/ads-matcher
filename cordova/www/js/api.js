var api = {
	analyzeUrl: function(apiRoute, success, failure) {
		var request = new MFPRequest(apiRoute, MFPRequest.POST);
		var headers = {
		    "Content-Type": "application/json",
		    "Accept": "application/json",
		};
		request.setHeaders(headers);
		var inputID = "todo-add-item";
        var text = document.getElementById(inputID).value;
		var body = {
			"data": text,
		};
		document.getElementById("url-container").src = text;
		document.getElementById(inputID).value = "";
		request.send(body, success, failure);
	}
};