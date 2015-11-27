// Javascruot file for problem 2 - Yaleesa Borgman 6215262 - 
window.onload = function() {
	
	//parse to JSON
	var	dataString = document.getElementById("rawdata").textContent;
	var dataArray= JSON.parse(dataString)

	//list of colors [red, orange, yellow, green]
	colorlist = ["#ff471a","#ffcc66", "#f9f906", "#ccff66"]

	//for loop iterating over the datapoints in the JSON data. 
	//Color is linked to the data and given to the ChangeColor function.
	for (i=0;i < dataArray[0].points.length; i++){
		if (dataArray[0].points[i][2] > 300){
			colorcode = colorlist[0]
		} else if(dataArray[0].points[i][2] < 300 && dataArray[0].points[i][2] > 200 ) {
			colorcode = colorlist[1]
		} else if(dataArray[0].points[i][2] < 200 && dataArray[0].points[i][2] > 100 ) {
			colorcode = colorlist[2]
		} else {
			colorcode = colorlist[3]
		}
		changeColor(dataArray[0].points[i][0], colorcode);	
	}	
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
	var country = document.getElementById(id);
	country.setAttribute('style', 'fill:'+color);
}
