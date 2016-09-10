var view = {
    refreshTable: function(response) {
        var result = JSON.parse(response.responseText);
        var ad = result.ad;
        var explanation = result.explanation;
        if (ad == undefined || explanation == undefined) {
            //don't display ad
            console.log("shouldn't display ad");
        } else {
            console.log("should display ad");
            document.getElementById("ad-container").innerHTML = ad;
            document.getElementById("explanation-container").innerHTML = explanation;
            document.getElementById("bottom-container").style.display = 'block';
        }
    }
};