# Rock-Paper-Scissors Multiplayer Game


**Rock-Paper-Scissors (RPS) Multiplayer Game** is an online RPS game where people can play and talk with each other through the chat feature.

## Feature list

 * Add player one
 * Add player two
 * Chat with each other
 * Play RPS with each other
 * Display `Disconnected` status to other player

The code below shows `Disconnected` status to the player:

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

## Stuff used to make this:

 * [Firebase](https://firebase.google.com/)
 * [jQuery](https://api.jquery.com/)
 * [JavaScript](https://www.w3schools.com/js/)

## User Interface (UI)
### Waiting for Player 1 and Player 2
![](https://imgur.com/3BKQBNW.png)
### Waiting for Player 1 or Player 2
![](https://imgur.com/C67HluV.png)
### Player 1 Pick a Choice (Player 1 Point-of-View)
![](https://imgur.com/yXXpYqT.png)
### Player 1 Pick a Choice (Player 2 Point-of-View)
![](https://imgur.com/xkLTepo.png)
### Player 2 Pick a Choice (Player 1 Point-of-View)
![](https://imgur.com/XNq2dBU.png)
### Player 2 Pick a Choice (Player 2 Point-of-View)
![](https://imgur.com/ganRTpA.png)
### Player 1 Wins
![](https://imgur.com/JPtrqrt.png)
### Player 2 Wins
![](https://imgur.com/fnYy9h2.png)
### Draw
![](https://imgur.com/TjbKSWi.png)
### Chat with Each Other
![](https://imgur.com/WH4RAt2.png)
### Disconnected Player
![](https://imgur.com/ux9fKtD.png)

## Demo
### Player 1 Check-In
![](https://imgur.com/FlDp2zM.gif)
### Player 2 Check-In
![](https://imgur.com/2pGJt8i.gif)
### Player 1 Pick a Choice
### Player 2 Pick a Choice
### Player 1 Wins
### Player 2 Wins
### Draw
### Chatting with Each Other
### Disconnected Player


## RPS Multiplayer Game Production Link

[https://hanselgunawan.github.io/RPS-Game](https://hanselgunawan.github.io/RPS-Game/)

## Contact Me
* E-mail: hanselgunawan94@gmail.com
* LinkedIn: https://www.linkedin.com/in/hanselbtritama/
