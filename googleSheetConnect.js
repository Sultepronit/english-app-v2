var myApp = "https://script.google.com/macros/s/AKfycby5Gf4_PVOZxohbTHplidiOrOQBZXOAmTRx4QhJD-nFlz8Lvq6ycu2evra0nXPeA4fB/exec";

function getData () {
    var action = "getTasks";
    var url = myApp+"?action="+action

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
			let dbArray = JSON.parse(xhr.response);
			//console.log(dbArray);
			console.log(dbArray.length);
			//startSession();
			parseDb(dbArray);
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

function toCell(num, col, newValue)
{
	var action = "toCelll";
	var xhr = new XMLHttpRequest();
	var body = 'num=' + encodeURIComponent(num) + '&col=' + encodeURIComponent(col) +
	'&newValue=' + encodeURIComponent(newValue) + '&action=' + encodeURIComponent(action);
	xhr.open("POST", myApp, true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	//$("#updateTaskModal").modal("hide");
        	//alert(xhr.response);
        }
    };
	try { xhr.send(body);} catch (err) { }
	//try { xhr.send(body);} catch (err) {console.log(err) }
	//console.log("Saved to sheet!");
}
