let RPS = {
    user_id:0,
    databaseTurn:0,
    player: {
        player_id:1,
        player_name: '',
        player_wins: 0,
        player_losses: 0,
        player_turns: 0,
        player_choice: ''
    },
    opponent: {
        opponent_id:2,
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
    displayGame:function () {
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
                        newRefPlayer = ref.child(1);
                        newRefPlayer.on("value", function(snapshot) {
                            $(".waiting-player").html(snapshot.val().player_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                    }
                    else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
                    {
                        newRefOpponent = ref.child(2);
                        newRefOpponent.on("value", function(snapshot) {
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                    }
                    else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
                    {
                        newRefPlayer = ref.child(1);
                        newRefOpponent = ref.child(2);
                        newRefPlayer.on("value", function(snapshot) {
                            $(".waiting-player").html(snapshot.val().player_name);
                            if(RPS.user_id === 1)
                            {
                                $(".info-opponent").show();
                                $(".info-opponent").html("Waiting for your turn...");
                                $(".player-choices-list").show();
                            }
                            else if (RPS.user_id === 2)
                            {
                                $(".info-player").show();
                                $(".info-player").html("<span style='text-transform: capitalize'>" + snapshot.val().player_name + "</span> is choosing...");
                                $(".opponent-choices-list").hide();
                            }
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        newRefOpponent.on("value", function(snapshot) {
                            $(".waiting-opponent").html(snapshot.val().opponent_name);
                        }, function(errorObject) {
                            console.log("The read failed: " + errorObject.code);
                        });
                        RPS.databaseTurn = snapshot.val().turn;
                        $(".rps-form").hide();

                        if(RPS.user_id === snapshot.child(1).val().player_id && RPS.databaseTurn === 1)
                        {
                            newRefPlayer = ref.child(1);
                            $(".player-choices-list").show();
                            $(".info-player").show();
                            newRefPlayer.on("value", function (snapshot) {
                                $(".info-player").html(snapshot.val().player_choice);
                            });
                            newRefPlayer = ref.child(2);
                            newRefPlayer.on("value", function (snapshot) {
                                $(".info-opponent").html("<span style='text-transform: capitalize'>" + snapshot.val().opponent_name + "</span> is waiting for your turn...");
                            });
                        }
                        else if(RPS.user_id === snapshot.child(1).val().player_id && RPS.databaseTurn === 2)
                        {
                            newRefPlayer = ref.child(1);
                            $(".player-choices-list").hide();
                            $(".info-player").show();
                            newRefPlayer.on("value", function (snapshot) {
                                $(".info-player").html(snapshot.val().player_choice);
                            });
                            newRefOpponent = ref.child(2);
                            newRefOpponent.on("value", function (snapshot) {
                                $(".info-opponent").html("<span style='text-transform: capitalize'>" + snapshot.val().opponent_name + "</span> is choosing...");
                            });
                        }
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
                newRef = ref.child(1);
                newRef.set(RPS.player);

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().player_name + "!");
                    $(".waiting-player").html(snapshot.val().player_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = 1;
                RPS.displayGame();
                $(".rps-form").hide();
            }
            else if(snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                alert("ROOM IS FULL!");
            }
            else if(snapshot.hasChild("1") && !snapshot.hasChild("2"))
            {
                RPS.opponent.opponent_name = user_name;
                newRef = ref.child(2);
                newRef.set(RPS.opponent);
                ref.update({
                    turn: 1
                });

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().opponent_name + "!");
                    $(".waiting-opponent").html(snapshot.val().opponent_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = 2;
                newRef = ref.child(1);
                newRef.on("value", function(snapshot) {
                    $(".info-player").show();
                    $(".info-player").html("<span style='text-transform: capitalize'>" + snapshot.val().player_name + "</span> is choosing...");
                    $(".opponent-choices-list").hide();
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

                ref.on("value", function(snapshot) {
                    RPS.databaseTurn = snapshot.val().turn;
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

                RPS.displayGame();
                $(".rps-form").hide();
            }
            else if(!snapshot.hasChild("1") && snapshot.hasChild("2"))
            {
                RPS.player.player_name = user_name;
                newRef = ref.child(1);
                newRef.set(RPS.player);

                newRef.on("value", function(snapshot) {
                    console.log(snapshot.val());
                    $(".rps-form").hide();
                    $("#you-are-message").html("welcome, " + snapshot.val().player_name + "!");
                    $(".waiting-player").html(snapshot.val().player_name);
                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
                RPS.user_id = 1;
                RPS.displayGame();
                $(".rps-form").hide();
            }
        });
    },
    updatePlayerChoice:function (playerChoice) {
        let database = firebase.database();
        let ref = database.ref('players');
        let newRef;
        newRef = ref.child(1);
        newRef.update({
            player_choice:playerChoice
        });

        RPS.databaseTurn++;
        ref.update({
           turn:RPS.databaseTurn
        });

        // if(RPS.user_id === 1)
        // {
        //     $(".player-choices-list").hide();
        //     $(".info-player").show();
        //     newRef.on("value", function (snapshot) {
        //         $(".info-player").html(snapshot.val().player_choice);
        //     });
        //     newRef = ref.child(2);
        //     newRef.on("value", function (snapshot) {
        //         $(".info-opponent").html("<span style='text-transform: capitalize'>" + snapshot.val().opponent_name + "</span> is choosing...");
        //     });
        // }
        // else if(RPS.user_id === 2)
        // {
        //     $(".player-choices-list").hide();
        //     $(".info-player").show();
        //     $(".info-player").html("Done choosing.");
        //     $(".opponent-choices-list").show();
        // }
    }
};

$(document).ready(function() {
    RPS.initializeFirebase();
    RPS.displayGame();

    $(".player-choices-list").hide();
    $(".opponent-choices-list").hide();
    $(".info-player").hide();
    $(".info-opponent").hide();

    $("#submitName").on("click", function (event) {
        let name = $("#userName").val();
        event.preventDefault();
        RPS.pushToDb(name);
    });

    $(".player-choice").on("click", function (event) {
        RPS.updatePlayerChoice($(event.target).text());
        RPS.displayGame();
    });
});

