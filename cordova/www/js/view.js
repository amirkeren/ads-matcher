var view = {
    refreshTable: function(response) {
        var result = JSON.parse(response.responseText);
        var ad = result.ad;
        var explanation = result.explanation;
        if (ad == undefined || explanation == undefined) {
            //don't display ad
            console.log("shouldn't display ad");
            alert(result.error);
        } else {
            console.log("should display ad");
            var adStr = JSON.stringify(ad);
            var explanationStr = JSON.stringify(explanation);
            document.getElementById("ad-container").innerHTML = adStr.substring(1, adStr.length - 1);
            document.getElementById("explanation-container").innerHTML = explanationStr.substring(1,
                explanationStr.length - 1);
            document.getElementById("bottom-container").style.display = 'block';
        }
    }
};