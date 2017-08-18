const messaging = firebase.messaging();


$('.notification-btn').on('click', function() {

    messaging.requestPermission()
        .then(function() {
            console.log('Permission granted.');

            messaging.getToken().then(function(token) {
                console.log(token);

                const uid = firebase.auth().currentUser.uid;
                firebase.database().ref('subscriptions/' + uid).set(token);
            });
        })
        .catch(function() {
            console.error('Permission denied.');
        });

});
