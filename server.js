const express = require('express');
const app = express();
const serveStatic = require("serve-static")
const path = require('path');
app.use(serveStatic(path.join(__dirname, "dist")));
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let cards = require("./cards.js");

http.listen(process.env.PORT || 3000, ()=>{
    let port = process.env.PORT || 3000;
    console.log("Server listening on port " + port);
});

let users = [];
let countdownObject;
let countdownSec = 10;

const STATES = {
    LOBBY: 0,
    GAME_INIT: 1,
    TELLER: 2,
    LISTENER: 3,
    OPPOSITE: 4,
    GAME_OVER: 5
}

let state = {
    level: STATES.LOBBY,
    currentPlayer: null, 
    turn: 0
};

let nextPlayerOnLeft = null;
let nextPlayerOnRight = null;
let leftPoint = 0;
let rightPoint = 0;

function checkId(id){
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.id == id)
            return i;
    }
    return -1;
}

function checkUsername(username){
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.username == username)
            return user;
    }
    return null;
}

function checkReadyForRoom(){
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if(!user.ready)
            return false;
    }
    return true;
}

function findFirstPlayer(){
    if(Math.floor(Math.random()*2) == 1){
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team == "left"){
                return user;
            }
        }
    }else{
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team == "right"){
                return user;
            }
        }
    }
}

function startGame(){
    console.log("game started");
    state.level = STATES.GAME_INIT;
    state.currentPlayer = findFirstPlayer();
    cards = shuffle(cards);
    console.log("currentPlayer: " + state.currentPlayer.username);
    foundNextPlayers();
    io.emit("state", state);
}

function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

function countdownStart(from, funct){
    countdownSec = from;
    io.emit("countdownStart", from);
    countdownObject = setInterval(()=>{
        if(countdownSec == 0){
            funct();
            countdownStop();
        }else{
            console.log(countdownSec--);
        }
    },1000);
}

function countdownStop(){
    if(countdownObject){
        io.emit("countdownStop");
        clearInterval(countdownObject);
        countdownSec = 10;
    }
}

function foundNextPlayers(){
    let found = false;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if(found && user.team == state.currentPlayer.team){
            if(state.currentPlayer.team == "left")
                nextPlayerOnLeft = user;
            else
                nextPlayerOnRight = user;
            return;
        }
        if(user.username == state.currentPlayer.username){
            found = true;
            // asd
            // comment
        }
    }
}

function endTurn(){
    if(nextPlayerOnLeft == null || nextPlayerOnRight == null){
        let selectedUser = null;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team != state.currentPlayer.team){
                selectedUser = user;
                break;
            }
        }
        state.currentPlayer = selectedUser;
    }else{
        if(state.currentPlayer.team == "left"){
            state.currentPlayer = nextPlayerOnRight;
        }else{
            state.currentPlayer = nextPlayerOnLeft;
        }
    }
    foundNextPlayers();
    console.log("currentPlayer:" + state.currentPlayer.username);
    io.emit("newTurn", state.currentPlayer);
}

io.on('connection', socket => {

    socket.on("newCardForPass", ()=>{
        let selectedCard = cards[state.turn++];
        console.log("selectedCard word: " + selectedCard.word);
        io.to(state.currentPlayer.id).emit("stateUpdate",{state: 1, card: selectedCard});
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team != state.currentPlayer.team){
                // opposite team user
                io.to(user.id).emit("stateUpdate", {state:2, card: selectedCard});
            }else{
                if(user.username != state.currentPlayer.username){
                    // currentUsers team, current user not included
                    io.to(user.id).emit("stateUpdate", {state:0, card: null});
                }
            }
        }
    });

    socket.on("newCardForWin", ()=>{
        let selectedCard = cards[state.turn++];
        if(state.currentPlayer.team == "left"){
            leftPoint++;
        }else{
            rightPoint++;
        }
        io.emit("pointUpdate", {left: leftPoint, right: rightPoint});
        console.log("selectedCard word: " + selectedCard.word);
        io.to(state.currentPlayer.id).emit("stateUpdate",{state: 1, card: selectedCard});
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team != state.currentPlayer.team){
                // opposite team user
                io.to(user.id).emit("stateUpdate", {state:2, card: selectedCard});
            }else{
                if(user.username != state.currentPlayer.username){
                    // currentUsers team, current user not included
                    io.to(user.id).emit("stateUpdate", {state:0, card: null});
                }
            }
        }
    });

    socket.on("newCardForTabu", ()=>{
        let selectedCard = cards[state.turn++];
        if(state.currentPlayer.team == "left"){
            leftPoint--;
        }else{
            rightPoint--;
        }
        io.emit("pointUpdate", {left: leftPoint, right: rightPoint});
        console.log("selectedCard word: " + selectedCard.word);
        io.to(state.currentPlayer.id).emit("stateUpdate",{state: 1, card: selectedCard});
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team != state.currentPlayer.team){
                // opposite team user
                io.to(user.id).emit("stateUpdate", {state:2, card: selectedCard});
            }else{
                if(user.username != state.currentPlayer.username){
                    // currentUsers team, current user not included
                    io.to(user.id).emit("stateUpdate", {state:0, card: null});
                }
            }
        }
    });

    socket.on("startRound",()=>{
        let selectedCard = cards[state.turn++];
        console.log("selectedCard word: " + selectedCard.word);
        io.to(state.currentPlayer.id).emit("stateUpdate",{state: 1, card: selectedCard});
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if(user.team != state.currentPlayer.team){
                // opposite team user
                io.to(user.id).emit("stateUpdate", {state:2, card: selectedCard});
            }else{
                if(user.username != state.currentPlayer.username){
                    // currentUsers team, current user not included
                    io.to(user.id).emit("stateUpdate", {state:0, card: null});
                }
            }
        }
        countdownStart(120, endTurn);
    });

    socket.on("getUsers", ()=>{
        io.emit('users', users);
    });

    socket.on("getState", ()=>{
        io.emit('state', state);
    });

    socket.on('userReady', (data) => {
        const {username, team, ready} = data;
        let currentUser = checkUsername(username);
        if(!currentUser){
            users.push({id: socket.id,username,team, ready});
        }else{
            currentUser.ready = ready;
        }
        io.emit('users', users);

        let readyAll = checkReadyForRoom();
        if(readyAll && users.length >= 2){
            countdownStart(10, startGame);
        }else{
            countdownStop();
        }

    });

    socket.on('disconnect', () => {
        const index = checkId(socket.id); 
        if(index != -1){
            users.splice(index, 1);
            users.forEach(user => user.ready = false);
            io.emit('users', users);
            countdownStop();
        }
    });
});