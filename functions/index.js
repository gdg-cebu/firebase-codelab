const functions = require('firebase-functions');
const request = require('request');

exports.sendNotifications = functions.database.ref('/message/{messageKey}').onCreate(function(e) {
    const data = e.data.val();
    const serverKey = 'AAAABa4nEVA:APA91bGlAd_lBJUUPuP4bmiJgE70waw29vnju6wO2knSBK4w98xo3Vs4tSmFJONb78ipXYoa3EzdVQwb14ynb_j15TTctrG6ZHMKhmPtJP3-GNfoDbj9NWLqzARSxP8sYz9xEqulviaU';
    return new Promise(function(resolve, reject) {
        e.data.ref.root.child('subscriptions').once('value', function(snapshot) {
            const subscriptions = snapshot.val();

            for (let subscription in subscriptions) {
                const subscriptionToken = subscriptions[subscription];

                request.post('https://fcm.googleapis.com/fcm/send', {
                    headers: {
                        'Authorization': 'key=' + serverKey,
                        'Content-Type': 'application/json'
                    },
                    body: {
                        notification: {
                            title: data.user.displayName,
                            body: data.text || 'sent an image',
                            icon: data.user.photoURL || 'static/images/firebase.png',
                            click_action: 'https://workshop-62608.firebaseapp.com/'
                        },
                        to: subscriptionToken
                    },
                    json: true
                });
            }

            resolve();
        });
    });
});
