var gateway = `ws://${window.location.hostname}/ws`;
var websocket;
function onLoad(event) {
    initWebSocket();
}
function initWebSocket() {
    console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = function(event) {
        console.log('WebSocket error:', event);
    };
}
function onOpen(event) {
    console.log('Connection opened');
    websocket.send("states");
}
function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}
function onMessage(event) {
    var myObj = JSON.parse(event.data);
    console.log(myObj);
    for (i in myObj.gpios){
        var output = myObj.gpios[i].output;
        var state = myObj.gpios[i].state;
        console.log(output);
        console.log(state);
        if (state == "0"){
            document.getElementById(output).checked = true;
            document.getElementById(output+"s").innerHTML = "ON";
        }
        else{
            document.getElementById(output).checked = false;
            document.getElementById(output+"s").innerHTML = "OFF";
        }
    }
    console.log(event.data);
}
// Send Requests to Control GPIOs
function toggleCheckbox (element) {
    console.log(element.id);
    websocket.send(element.id);
    if (element.checked){
        document.getElementById(element.id+"s").innerHTML = "ON";
    }
    else {
        document.getElementById(element.id+"s").innerHTML = "OFF";
    }
}
// Function to get and update GPIO states on the webpage when it loads for the first time
function getStates(){
    websocket.send("states");
}
window.addEventListener('load', onLoad);