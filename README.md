# Rock-Paper-Scissors Multiplayer Game

Feature list:

 * Add player one
 * Add player two
 * Chat with each other
 * Play Rock-Paper-Scissors (RPS) with each other
 * Display disconnected status to other player

The code below shows "Disconnected" status to the player:

```javascript
playerDisconnect:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        ref.on("value", function (snapshot) {
            if(RPS.user_id !== 0)
            {
                if(snapshot.child(1).exists() && RPS.user_id === snapshot.child(1).val().player_id)
                {
                    if(RPS.user_id !== 0)
                    {
                        database.ref("chat").onDisconnect().update({
                            message: "<span style='text-transform: capitalize'>" + snapshot.child(1).val().player_name + "</span> has disconnected!"
                        });
                    }
                    database.ref("players/1").onDisconnect().remove();
                }
                else if(snapshot.child(2).exists() && RPS.user_id === snapshot.child(2).val().opponent_id)
                {
                    database.ref("chat").onDisconnect().update({
                        message: "<span style='text-transform: capitalize'>" + snapshot.child(2).val().opponent_name + "</span> has disconnected!"
                    });
                    database.ref("players/2").onDisconnect().remove();
                    database.ref("players/turn").onDisconnect().remove();
                }
                else if(!snapshot.child(1).exists() && !snapshot.child(2).exists())
                {
                    database.ref("chat").onDisconnect().update({
                        message: ""
                    });
                }
            }
        });
```

### Stuff used to make this:

 * [Firebase](https://firebase.google.com/)
 * [jQuery](https://api.jquery.com/)
 * [JavaScript](https://www.w3schools.com/js/)

### Here's the link to my app:

[https://hanselgunawan.github.io/RPS-Game](https://hanselgunawan.github.io/RPS-Game/)
