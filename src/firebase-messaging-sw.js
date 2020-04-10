importScripts('https://www.gstatic.com/firebasejs/6.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.1.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '525845878170'
});

const messaging = firebase.messaging();