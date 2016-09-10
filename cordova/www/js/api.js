var api = {
	analyzeUrl: function(apiRoute, success, failure) {
		var request = new MFPRequest(apiRoute, MFPRequest.POST);
		var headers = {
		    "Content-Type": "application/json",
		    "Accept": "application/json",
		};
		request.setHeaders(headers);
		var body = {
			"data": document.getElementById("todo-add-item").value,
		};
		request.send(body, success, failure);
	}
};