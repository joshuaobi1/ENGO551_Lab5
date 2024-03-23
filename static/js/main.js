document.addEventListener('DOMContentLoaded', function() {
    var client; // MQTT client
    var map = L.map('mapid').setView([51.0447, -114.0719], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    var geoMarker = L.marker([0,0]).addTo(map); // Placeholder marker

    // Function to start MQTT connection
    function startConnection() {
        // Get button references
        var startButton = document.getElementById('start-connection');
        var endButton = document.getElementById('end-connection');
        var mqttControls = document.getElementById('custom-message-controls');
        
        startButton.textContent = 'Connecting...'; // Change the button text to show an action is happening
        startButton.disabled = true; // Disable the button to prevent multiple clicks
        endButton.disabled = false; // Enable the end button

        var host = document.getElementById('mqtt-host').value;
        var port = parseInt(document.getElementById('mqtt-port').value, 10);
        client = new Paho.MQTT.Client(host, port, "clientId" + new Date().getTime()); // Unique client ID
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // Connect the client
        client.connect({
            onSuccess: onConnect,
            onFailure: onFailure,
            useSSL: true // Use SSL for secure connection
        });
    }

    // Function to end MQTT connection
    function endConnection() {
        if (client) {
            client.disconnect();
            alert('MQTT Connection ended.');
             resetConnectionButtons();
        }
    }

    function resetConnectionButtons() {
    var startButton = document.getElementById('start-connection');
    var endButton = document.getElementById('end-connection');
    var mqttHostInput = document.getElementById('mqtt-host');
    var mqttPortInput = document.getElementById('mqtt-port');

    startButton.textContent = 'Start';
    startButton.disabled = false; // Re-enable the start button
    endButton.disabled = true; // Keep the end button disabled until a connection is established

    mqttHostInput.disabled = false; // Re-enable the host input field
    mqttPortInput.disabled = false; // Re-enable the port input field
   
    }


    // Function to handle successful connection
    function onConnect() {
        // Subscribe to the topic for temperature
        var topic = "ENGO551/" + "Joshua_Obi" + "/my_temperature";
        client.subscribe(topic);
        alert('MQTT Connection started and subscribed to topic: ' + topic);
        document.getElementById('start-connection').textContent = 'Connected'; // Update the button text
        document.getElementById('mqtt-controls').style.display = 'none'; // Hide MQTT controls
        document.getElementById('custom-message-controls').style.display = 'block'; // Show message controls
    }

    function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        // Inform the user
        alert("Connection lost: " + responseObject.errorMessage + ". Attempting to reconnect...");
        // Optionally delay reconnection attempt to give users time to react or troubleshoot
        setTimeout(function() {
            startConnection(); // Attempt to reconnect
        }, 3000); // 3 seconds delay
    }
    
    }

    
    // Function to handle connection loss
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
            startConnection(); // Attempt to reconnect
        }
    }

    // Function to handle incoming messages
    function onMessageArrived(message) {
        console.log("onMessageArrived:" + message.payloadString);
        var receivedData = JSON.parse(message.payloadString);
        if(receivedData.type === "Feature") {
            geoMarker.setLatLng(receivedData.geometry.coordinates.reverse()).update();
            geoMarker.bindPopup("Temperature: " + receivedData.properties.temperature).openPopup();
            // Update the color of the marker based on temperature
            updateMarkerColor(receivedData.properties.temperature);
        }
    }

    // Function to handle connection failure
    function onFailure(error) {
        alert("MQTT Connection failed: " + error.errorMessage);
        document.getElementById('start-connection').textContent = 'Start'; // Reset the button text
        document.getElementById('start-connection').disabled = false; // Enable the button
        document.getElementById('end-connection').disabled = true; // Disable the end button
    }

    // Function to share geolocation status
    function shareMyStatus() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                var temperature = Math.floor(Math.random() * 50); // Random temperature for demo
                var message = new Paho.MQTT.Message(JSON.stringify({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    properties: {
                        temperature: temperature
                    }
                }));
                message.destinationName = "ENGO551/" + "Joshua_Obi" + "/my_temperature";
                client.send(message);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    // Function to change marker color based on temperature
    function updateMarkerColor(temperature) {
        var color;
        if (temperature < 10) {
            color = 'blue'; // Cold temperature
        } else if (temperature >= 10 && temperature < 30) {
            color = 'green'; // Moderate temperature
        } else {
            color = 'red'; // Hot temperature
        }
        geoMarker.setIcon(new L.Icon({
            iconUrl: 'static/images/' + color + '_marker.jpg',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        }));
    }

    // Function to publish custom messages
    function publishCustomMessage() {
    var topic = document.getElementById('custom-topic').value;
    var messageContent = document.getElementById('custom-message').value;
    if (topic && messageContent) {
        var message = new Paho.MQTT.Message(messageContent);
        message.destinationName = topic;
        client.send(message);
        alert("Message published to topic: " + topic);
    } 
    else {
        alert("Please enter both topic and message.");
    }

    }

    // Add event listeners for MQTT connection buttons
    document.getElementById('start-connection').addEventListener('click', startConnection);
    document.getElementById('end-connection').addEventListener('click', endConnection);

    // Event listener for publishing custom messages
    document.getElementById('publish-message').addEventListener('click', publishCustomMessage);

    // Add event listener for sharing geolocation
    document.getElementById('share-status').addEventListener('click', shareMyStatus);
});
