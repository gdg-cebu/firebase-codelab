importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase.js');
importScripts('static/config.js');

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(data) {
    console.log(data);
});
