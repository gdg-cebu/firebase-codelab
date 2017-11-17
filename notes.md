# Notes

## Part1: Setup App
* Firebase Features that we will cover
    * authentication
    * database
    * hosting
* Create a firebase [project](https://console.firebase.google.com/u/0/)
* install [firebase cli](https://firebase.google.com/docs/cli/)
    * install [nodejs](https://nodejs.org/en/download/)
    * `npm install -g firebase-tools`
    * `firebase login`
    * `firebase init`
* Clone/Download this [repo](https://github.com/gdg-cebu/firebase-workshop) and put it in the public folder
* `firebase serve -p 3000` to run local server
* Open browser to [localhost:3000](http://localhost:3000/)

## Part2: Authentication
* Open the public folder in your editor and let's start coding
* Load firebase to the login.html and configure it
* Enable authentication in the firebase console
    * enable google login since we don't have to setup an app for it
* Add click listener on google login button [docs](https://firebase.google.com/docs/auth/web/google-signin?authuser=0)
    ```javascript
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        var user = result.user;
        window.location = '/';
    }).catch(function(error) {
        $('.error').text(error.message);
    });
    ```
* Make the login page not accessible if user is authenticated
    ```javascript
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location = '/';
        } else {
            $('.login-section').removeClass('hidden');
        }
    });
    ```
* Logout
    * open index.html and initialize firebase js
    * load index.js
    * enable logout `firebase.auth().signOut();
    * set photo url `user.photoURL`

## Part3: Database
* Firebase has a realtime database (provides apis that allows us to easily sync data accross different connected clients)
* Go to Database and lets explore, its a big json
* DB Json:
    * store messages
    ```json
    {
        "messages": {
            "message1": {
                "content": "the content",
                "timestamp": "timestamp when it is created"
                "sender": {
                    "id": "id of the user",
                    "name": "name of the sender",
                    "photoUrl": "photoUrl of the sender",
                }
            },
            "message2": {
                "content": "the content",
                "timestamp": "timestamp when it is created",
                "sender": {
                    "id": "id of the user",
                    "name": "name of the sender",
                    "photoUrl": "photoUrl of the sender"
                }
            }
        }
    }
        
    ```
* Initialize firebase db
    `this.db = firebase.database();`
* Lets create a reference to the messages key in our databases
    `this.messages = this.db.ref('/messages')`
* Lets handle sending messages in the input field
    ```javascript
    var form = $('form');
    form.on('submit', function(e) {
        e.preventDefault();
        var textBox = $(this).find('input');
        var content = textBox.val();
        textBox.val('');
        // do something with the message
        _this.messages.push({
            'content': content,
            'timestamp': firebase.database.ServerValue.TIMESTAMP,
            'sender': {
                'uid': _this.user.uid,
                'name': _this.user.displayName,
                'photoURL': _this.user.photoURL
            }
        });
    });
    ```
* Lets save the new message to our firebase database [docs](https://firebase.google.com/docs/database/web/read-and-write)
    * `this.messages.push(data);` to push a new messages, the key is automatically set
    * `var key = this.messages.push().key` to get a unique key for a new message they you can do
    ```javascript
    var updates = {};
    updates[key] = data;
    this.messages.update(updates)
    ```
    or 
    ```javascript
    this.messages.child(key).set(data)
    ```
    or
    ```javascript
    this.db.ref('/messages/' + key).set(data)
    ```

* Lets fetch and render the messages from our firebase database [docs](https://firebase.google.com/docs/database/web/lists-of-data#listen_for_child_events)
    * Listen for child events that are triggered in response to specific operations that happen to the children of a node (e.g. child added or child updated)
    * `child_added` event can be used to retrieve list of items or listen to additions to a list of items
    ```javascript
    this.messages.on('child_added', function(data) {
        console.log(data.key, data.val());
    });
    ```
    * Let's comment out the dummy messages and render the messages from the database
    ```javascript
    this.messages.on('child_added', function(data) {
        _this._renderMessage(data.key, data.val());
    });
    ```
    ```javascript
    _renderMessage: function(key, message) {
        var element = 
        '<li class="message">' +
            '<header>' +
                '<img src="' + message.sender.photoURL + '" alt="' + message.sender.name + '">' +
                '<h2>' + message.sender.name + '</h2>' +
                '<button class="delete-btn"></button>' +
            '</header>' +
            '<p>' + message.content + '</p>' +
        '</li>';
        element = $(element);
        if (message.sender.uid === this.user.uid) {
            element.addClass('self');
        }
        $('.messages').append(element);
    },
    ```

* Let's deploy it
    `firebase deploy`


## Part 4: Storage
* Go to the console's storage page
* Initialize firebase storage [docs](https://firebase.google.com/docs/storage/web/upload-files)
    `this.storage = firebase.storage();`
* Create a reference to the path where we want to store our images
    `this.images = this.ref('images/')`
* Add listener to upload field
    ```javascript
    var fileField = form.find('input[type="file"]');
    fileField.on('change', function(e) {
        var file = this.files[0]; 
    });
    ```
* Upload the file and save the message
    ```javascript
    var newMessage = _this.messages.push();
    var uploadTask = _this.images.child(newMessage.key + file.name).put(file);
    uploadTask.on('state_changed',
        function(data) {
            var progress = (data.bytesTransferred / data.totalBytes) * 100;
            console.log(progress);
        },
        function(error) {
            console.log(error);
        },
        function() {
            newMessage.set({
                'content': '',
                'imageURL': uploadTask.snapshot.downloadURL,
                'timestamp': firebase.database.ServerValue.TIMESTAMP,
                'sender': {
                    'uid': _this.user.uid,
                    'name': _this.user.displayName,
                    'photoURL': _this.user.photoURL
                }
            });
        });
    ```
* Time to render the message with images
    ```javascript
    if (message.imageURL) {
        var content = '<img src="' + message.imageURL + '">'
    }   else {
        content = '<p>' + message.content + '</p>';
    }

    var element = 
    '<li class="message" data-key=" ' + key + ' ">' +
        '<header>' +
            '<img src="' + message.sender.photoURL + '" alt="' + message.sender.name + '">' +
            '<h2>' + message.sender.name + '</h2>' +
            '<button class="delete-btn"></button>' +
        '</header>' +
        content +
    '</li>';
    ```











