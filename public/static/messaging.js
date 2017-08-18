const messaging = firebase.messaging();


$('.notification-btn').on('click', function() {

    messaging.requestPermission()
        .then(function() {
            console.log('Permission granted.');

            messaging.getToken().then(function(token) {
                console.log(token);

                const currentUser = firebase.auth().currentUser;
                firebase.database().ref('subscriptions/' + currentUser.uid).set(token);
            });
        })
        .catch(function() {
            console.error('Permission denied.');
        });

});

messaging.onMessage(function(data) {
    console.log('[onMessage] received a  new message');
    console.log(data);
});
