# ENGO551_Lab5

Project Overview
This lab introduces the integration of MQTT protocol with a web-based geolocation tracker, demonstrating real-time geospatial data sharing and visualization. Utilizing the Paho MQTT JavaScript client and Leaflet.js for mapping, this project allows users to publish their current location as a GeoJSON message to an MQTT broker, which is then visualized on a web map. Additionally, users can publish custom messages to any MQTT topic.

Features
- MQTT Connection Management: Users can connect to an MQTT broker by specifying the host and port. The interface provides "Start" and "End" buttons to manage the connection.
- Real-time Geolocation Sharing: By pressing the "Share My Status" button, users can publish their current location along with a randomly generated temperature value to a predefined MQTT topic.
- Custom Message Publishing: A dedicated section allows users to publish custom messages to any topic they specify.
- Dynamic Map Visualization: The application visualizes the user's location on a map and displays the current temperature. The color of the marker changes based on the temperature value, indicating different temperature ranges.


Files Included
- index.html: The main HTML document providing the structure for the IoT Geolocation Tracker application.
- main.js: Contains the JavaScript code handling MQTT connection, geolocation sharing, message publishing, and map visualization.
- style.css: The stylesheet for customizing the appearance of the web application.


Additional Notes
- MQTT Broker: This application uses the public MQTT broker at test.mosquitto.org for demonstration purposes. Users can specify other brokers by changing the host and port.
- Security: The application establishes a secure connection using WebSockets Secure (WSS) to comply with content security policies on GitHub Pages.
- Compatibility: The application is designed to run in web browsers on both desktop and mobile devices, leveraging browser geolocation capabilities. (However there were issues connecting to MQTT broker on phone web app, to be addressed soon)


Hosting
The application is hosted using GitHub Pages, enabling easy access from anywhere at [https://joshuaobi1/joshuaobi1.github.io](https://joshuaobi1.github.io/). This approach simplifies sharing and testing across different devices, especially for mobile-based geolocation tracking.
