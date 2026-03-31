var urlParams = new URLSearchParams(window.location.search);
var name = urlParams.get('name');

var unsafe_div = window.document.getElementById("vulnerable-div");
unsafe_div.innerHTML = "Hello " + name; 
