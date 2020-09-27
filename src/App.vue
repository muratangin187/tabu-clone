<template>
<div>
    <div class="ribbon">
        OYNA
        <i></i>
        <i></i>
        <i></i>
        <i></i>
    </div>
    <TeamTable :socket="socket" teamName="KIRMIZI" team="left"></TeamTable>
    <TeamTable :socket="socket" teamName="YESIL&nbsp;&nbsp;&nbsp;" team="right"></TeamTable>
    <ReadyLobby v-if="level == 0" :socket="socket"></ReadyLobby>
    <GameInitLobby v-else-if="level == 1" :socket="socket" :level="level" :initPlayer="currentPlayer"></GameInitLobby>
</div>
</template>

<script>
import io from 'socket.io-client';
import TeamTable from "./components/TeamTable";
import ReadyLobby from "./components/ReadyLobby";
import GameInitLobby from "./components/GameInitLobby";
import background from "@/assets/background.png";

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
        document.body.style.backgroundImage = `url(${background})`;
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
    background-position: 0px 0px;
    animation: animatedBackground 10s linear forwards;
    -moz-animation: animatedBackground 10s linear forwards;
    -webkit-animation: animatedBackground 10s linear forwards;
    -ms-animation: animatedBackground 10s linear forwards;
    -o-animation: animatedBackground 10s linear forwards;
}

@keyframes animatedBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -300px 0;
    }
}

@-moz-keyframes animatedBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -300px 0;
    }
}

@-webkit-keyframes animatedBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -300px 0;
    }
}

@-ms-keyframes animatedBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -300px 0;
    }
}

@-o-keyframes animatedBackground {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -300px 0;
    }
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

.ribbon {
    width: 200px;
    height: 60px;
    margin: 0px auto 50px;
    position: relative;
    color: #fff;
    font: 28px/60px sans-serif;
    text-align: center;
    text-transform: uppercase;
    background: #3D79D0;
}

.ribbon i {
    position: absolute;
}

.ribbon i:first-child,
.ribbon i:nth-child(2) {
    position: absolute;
    left: -20px;
    bottom: -20px;
    z-index: -1;
    border: 20px solid transparent;
    border-right-color: #043140;
}

.ribbon i:nth-child(2) {
    left: auto;
    right: -20px;
    border-right-color: transparent;
    border-left-color: #043140;
}

.ribbon i:nth-child(3),
.ribbon i:last-child {
    width: 20px;
    bottom: -20px;
    left: -60px;
    z-index: -2;
    border: 30px solid #1D53C0;
    border-left-color: transparent;

    -webkit-transform-origin: 100% 0;
    -moz-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
}

.ribbon i:last-child {
    bottom: -20px;
    left: auto;
    right: -60px;
    border: 30px solid #1D53C0;
    border-right-color: transparent;

    -webkit-transform-origin: 0 0;
    -moz-transform-origin: 0 0;
    -ms-transform-origin: 0 0;
    transform-origin: 0 0;
}

.redButton strong {
    margin: 30px 20px;
    vertical-align: middle;
    color: #fff;
    text-shadow: 0px 0px 3px #000000;
    font-weight: bolder;
    font-size: 18px;
}

.redButton .buttonIcon {
    color: #fff;
    font-size: 32px;
    padding-left: 20px;
    vertical-align: middle;
}

.redButton {
    padding: 10px;
    background-color: #df6060;
    border: 5px solid #000;
    border-radius: 100px;
    display: block;
    margin: 30px auto;
}

.redButton:hover {
    background-color: #cc5858;
}

.redButton:focus {
    outline: 0;
}

.redButton:active {
    background-color: #b84c4c;
    border: null;
}

.blueButton strong {
    margin: 30px 20px;
    vertical-align: middle;
    color: #fff;
    text-shadow: 0px 0px 3px #000000;
    font-weight: bolder;
    font-size: 18px;
}

.blueButton .buttonIcon {
    color: #fff;
    font-size: 32px;
    padding-left: 20px;
    vertical-align: middle;
}

.blueButton {
    padding: 10px;
    background-color: #64c1f0;
    border: 5px solid #000;
    border-radius: 100px;
    display: block;
    margin: 30px auto;
}

.blueButton:hover {
    background-color: #4d9fc9;
}

.blueButton:focus {
    outline: 0;
}

.blueButton:active {
    background-color: #4790b4;
    border: null;
}

.yellowButton strong {
    margin: 30px 20px;
    vertical-align: middle;
    color: #333;
    font-weight: bolder;
    font-size: 18px;
}

.yellowButton .buttonIcon {
    color: #000;
    font-size: 32px;
    vertical-align: middle;
}

.yellowButton {
    padding: 10px;
    background-color: #ffbf00;
    border: 5px solid #000;
    border-radius: 100px;
    display: block;
    margin: 30px auto;
}

.yellowButton:hover {
    background-color: #ffcb00;
}

.yellowButton:focus {
    outline: 0;
}

.yellowButton:active {
    background-color: #f1a500;
    border: null;
}
</style>
