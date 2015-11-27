// Javascript for problem 1 - Yaleesa Borgman 6215262 - 

window.onload = function() {
	list = [['ma', 'brown'],['path6484','orange'], ['path3452', 'purple'],['path5490','pink']]
	for (i=0;i < list.length; i++){
		changeColor(list[i][0], list[i][1]);	
	}	
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
	var country = document.getElementById(id);
	country.setAttribute('style', 'fill:'+color);
}