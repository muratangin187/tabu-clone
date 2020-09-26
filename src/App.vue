<template>
<div>
    <span>Game state: {{level}}</span>
    <TeamTable :socket="socket" teamName="KIRMIZI" team="left"></TeamTable>
    <TeamTable :socket="socket" teamName="YESIL" team="right"></TeamTable>
    <ReadyLobby v-if="level == 0" :socket="socket"></ReadyLobby>
    <GameInitLobby v-else-if="level == 1" :socket="socket" :level="level" :initPlayer="currentPlayer"></GameInitLobby>
</div>
</template>

<script>
import io from 'socket.io-client';
import TeamTable from "./components/TeamTable";
import ReadyLobby from "./components/ReadyLobby";
import GameInitLobby from "./components/GameInitLobby";

export default {
    name: 'App',
    data() {
        return {
            level: 0,
            currentPlayer: '',
            socket: io()
        };
    },
    mounted() {
        let self = this;
        this.socket.emit("getState");
        this.socket.on("state", (state) => {
            self.level = state.level;
            self.currentPlayer = state.currentPlayer;
        });
    },
    components: {
        TeamTable,
        ReadyLobby,
        GameInitLobby
    },
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Josefin Sans', sans-serif;
    background-color: #eee;
}

body a {
    color: #ffffff;
    text-decoration: none;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.card {
    position: absolute;
    top: 50%;
    left: 50%;
    height: 400px;
    width: 300px;
    perspective: 600px;
    transform: translate(-50%, -50%);
    transform-style: preserve-3d;
    transition: 0.5s;
}

.card.card-flip:hover .card-front {
    transform: rotateX(-180deg);
}

.card.card-flip:hover .card-back {
    transform: rotateX(0deg);
}

.card-front {
    height: 100%;
    width: 100%;
    background-position: 50% 50%;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(189, 189, 189);
    border: 2px solid #000;
    border-radius: 20px;
    backface-visibility: hidden;
    color: #000;
    text-align: center;
    transform: rotateX(0deg);
    transition: 0.5s;
}

.card-back {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(189, 189, 189);
    border: 2px solid #000;
    border-radius: 20px;
    backface-visibility: hidden;
    transform: rotateX(180deg);
    transition: 0.5s;
    color: #000;
    text-align: center;
}

.card header {
    font-size: 26px;
}

.card h2 {
    margin: 40% auto 35% auto;
    font-size: 26px;
}

.card h2 span {
    color: #000;
    font-size: 20px;
}

.card-back button {
    border: 1px solid #444;
    color: #fff;
    padding: 20px;
    font-size: 20px;
    background-color: rgba(255, 255, 255, 0);
}

.card-back button:hover {
    border-color: #000;
}

.card-back button:focus {
    outline: 0;
}

.card-back button:active {
    border-color: #222;
}

.card-front button {
    padding: 10px;
    margin: 0px 10px;
    font-size: 20px;
    border-radius: 20px;
}

.card-front button:focus {
    outline: 0;
}
</style>
