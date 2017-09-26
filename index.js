let RPS = {
    user_id:0,
    player_id:1,
    opponent_id:2,
    player: {
        player_name: '',
        player_wins: 0,
        player_losses: 0,
        player_turns: 0,
        player_choice: ''
    },
    opponent: {
        opponent_name: '',
        opponent_wins: 0,
        opponent_losses: 0,
        opponent_turns: 0,
        opponent_choice: ''
    },
    initializeFirebase:function () {
        const config = {
            apiKey: "AIzaSyCqQegmCWlWxRucjKqP2-8cXZYOHprbJsc",
            authDomain: "rps-game-4b0f0.firebaseapp.com",
            databaseURL: "https://rps-game-4b0f0.firebaseio.com",
            projectId: "rps-game-4b0f0",
            storageBucket: "rps-game-4b0f0.appspot.com",
            messagingSenderId: "441313473203"
        };
        firebase.initializeApp(config);
    },
    checkIfDbEmpty:function () {
        let database = firebase.database();
        let ref = database.ref('players');
        ref.on('value', function (snapshot) {
            if(snapshot.val() !== null)
            {
                ref.on("value", function (snapshot) {
                    if(snapshot.numChildren() < 2)
                    {
                        $(".rps-form").show();
                    }
                    else
                    {
                        $(".rps-form").hide();
                    }
                });
            }
            else
            {
                let newRefPlayer, newRefOpponent;
                ref.on('value', function (snapshot) {
                    if(snapshot.hasChild("1") && !snapshot.hasChild("2"))
                    {
                        newRefPlayer = ref.child(RPS.player_id);
                        newRefPlayer.on("value", function(snapshot) {
                            $(".waiting-player").html(snapshot.val().player_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                    }
                    else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
                    {
                        newRefOpponent = ref.child(RPS.opponent_id);
                        newRefOpponent.on("value", function(snapshot) {
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                    }
                    else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
                    {
                        newRefPlayer = ref.child(RPS.player_id);
                        newRefOpponent = ref.child(RPS.opponent_id);
                        newRefPlayer.on("value", function(snapshot) {
                            $(".waiting-player").html(snapshot.val().player_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        newRefOpponent.on("value", function(snapshot) {
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        $(".player-choices-list").show();
                        $(".opponent-choices-list").show();
                        $(".rps-form").hide();
                    }
                });
            }
        });
    },
    pushToDb:function (user_input_name) {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRef;
        let user_name = user_input_name;
        ref.once('value', function (snapshot) {
            if(!(snapshot.hasChild("1")) && !(snapshot.hasChild("2")))
            {
                RPS.player.player_name = user_name;
                newRef = ref.child(RPS.player_id);
                newRef.set(RPS.player);

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().player_name + "!");
                    $(".waiting-player").html(snapshot.val().player_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = RPS.player_id;
                RPS.checkIfDbEmpty();
                $(".rps-form").hide();
            }
            else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                alert("ROOM IS FULL!");
            }
            else if(snapshot.hasChild("1") && !snapshot.hasChild("2"))
            {
                RPS.opponent.opponent_name = user_name;
                newRef = ref.child(RPS.opponent_id);
                newRef.set(RPS.opponent);

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().opponent_name + "!");
                    $(".waiting-opponent").html(snapshot.val().opponent_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = RPS.opponent_id;
                $(".player-choices-list").show();
                $(".opponent-choices-list").show();
                RPS.checkIfDbEmpty();
                $(".rps-form").hide();
            }
            else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                RPS.player.player_name = user_name;
                newRef = ref.child(RPS.player_id);
                newRef.set(RPS.player);

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().player_name + "!");
                    $(".waiting-player").html(snapshot.val().player_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = RPS.player_id;
                $(".player-choices-list").show();
                $(".opponent-choices-list").show();
                RPS.checkIfDbEmpty();
                $(".rps-form").hide();
            }
        });
    }
};

$(document).ready(function() {
    RPS.initializeFirebase();
    RPS.checkIfDbEmpty();

    $(".player-choices-list").hide();
    $(".opponent-choices-list").hide();

    $("#submitName").on("click", function (event) {
        let name = $("#userName").val();
        event.preventDefault();
        RPS.pushToDb(name);
    });
});

