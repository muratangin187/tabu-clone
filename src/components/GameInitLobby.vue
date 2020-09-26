<template>
<div class="gameInitLobby">
    <span class="message" v-if="countdownStarted">{{countdownSec}} SANIYE KALDI</span>
    <div class="card card-flip" v-if="!gameStarted">
        <div class="card-front">
            <h2>KIM BASLIYOR GORMEK ICIN UZERIME GEL</h2>
        </div>
        <div class="card-back" :class="currentTeam == 'left' ? 'redCard' : 'greenCard'">
            <h2 :class="currentTeam == 'left' ? 'red' : 'green'">
                {{currentTeam == "left" ? "KIRMIZI" : "YESIL"}}<br>
                <span>Takım başlıyor</span><br>
                <span>Ilk oyuncu </span>{{currentPlayer.username}}<br>
            </h2>
            <button v-if="socket.id == currentPlayer.id" @click="startGame">BASLA</button>
        </div>
    </div>
    <div class="card card-flip" v-else-if="endTurn">
        <div class="card-front">
            <h2>Bu round {{currentTeam == "right" ? "KIRMIZI" : "YESIL"}} takım 10 puan kazandı</h2>
        </div>
        <div class="card-back" :class="currentTeam == 'left' ? 'redCard' : 'greenCard'">
            <h2 :class="currentTeam == 'left' ? 'red' : 'green'">
                Sıra {{currentTeam == "left" ? "KIRMIZI" : "YESIL"}}<br>
                <span>Takımdan</span><br>
                {{currentPlayer.username}}<span> adlı oyuncuda</span><br>
            </h2>
            <button v-if="socket.id == currentPlayer.id" @click="startTurn">BASLA</button>
        </div>
    </div>
    <div class="card" v-else-if="state == 0">
        <div class="card-front">
            <h2>TAKIMIN ANLATIYOR</h2>
        </div>
    </div>
    <div class="card" v-else-if="state == 1">
        <div class="card-front">
            <h2>SEN ANLATIYORSUN<br><span style="font-size:25px; color: blue;">{{currentCard.word}}</span><br>
                <span v-for="(banword, index) in currentCard.banlist" :key="index">{{banword}}<br></span>
                <button @click="win()">BILDIK</button>
                <button @click="pass()">PAS</button>
            </h2>
        </div>
        <div class="card-back">
            <h2 :class="currentTeam == 'left' ? 'red' : 'green'">
                {{currentTeam == "left" ? "KIRMIZI" : "YESIL"}}<br>
                <span>Takım başlıyor</span><br>
                <span>Ilk oyuncu </span>{{currentPlayer.username}}<br>
            </h2>
            <button v-if="socket.id == currentPlayer.id" @click="startGame">BASLA</button>
        </div>
    </div>
    <div class="card" v-else-if="state == 2">
        <div class="card-front">
            <h2>KARSISI ANLATIYOR <br><span style="font-size:25px; color: blue;">{{currentCard.word}}</span><br>
                <span v-for="(banword, index) in currentCard.banlist" :key="index">{{banword}}<br></span>
                <button @click="tabu()">TABU</button>
            </h2>
        </div>
        <div class="card-back">
            <h2 :class="currentTeam == 'left' ? 'red' : 'green'">
                {{currentTeam == "left" ? "KIRMIZI" : "YESIL"}}<br>
                <span>Takım başlıyor</span><br>
                <span>Ilk oyuncu </span>{{currentPlayer.username}}<br>
            </h2>
            <button v-if="socket.id == currentPlayer.id" @click="startGame">BASLA</button>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: "GameInitLobby",
    props: {
        socket: Object,
        level: Number,
        initPlayer: Object,
    },
    data() {
        return {
            countdownStarted: false,
            countdownObj: null,
            countdownSec: 10,
            gameStarted: false,
            state: 0,
            currentCard: null,
            endTurn: false,
            currentPlayer: null
        }
    },
    created() {
        this.currentPlayer = this.initPlayer;
        console.log(this.currentPlayer.username);
    },
    computed: {
        currentTeam: function () {
            return this.currentPlayer.team;
        }
    },
    mounted() {
        let self = this;
        this.socket.on("countdownStart", (from) => {
            self.countdownStarted = true;
            self.countdownSec = from;
            self.countdownObj = setInterval(() => {
                self.countdownSec--;
            }, 1000);
        });
        this.socket.on("countdownStop", () => {
            self.countdownStarted = false;
            clearInterval(self.countdownObj);
            self.countdownObj = null;
            self.countdownSec = 10;
        });
        this.socket.on("stateUpdate", (result) => {
            console.log("stateUpdate state=" + result.state);
            console.log("Current card: " + JSON.stringify(result.card, null, 2));
            if (self.gameStarted != true)
                self.gameStarted = true;
            if (self.endTurn != false)
                self.endTurn = false;
            self.state = result.state;
            self.currentCard = result.card;
        });
        this.socket.on("newTurn", (currentPlayer) => {
            self.currentPlayer = currentPlayer;
            this.endTurn = true;
            console.log("end turn currentUser:" + currentPlayer.username);
        });
    },
    methods: {
        startGame: function () {
            this.gameStarted = true;
            this.socket.emit("startRound");
        },
        startTurn: function () {
            this.endTurn = false;
            this.socket.emit("startRound");
        },
        tabu: function () {
            this.socket.emit("newCardForTabu");
        },
        win: function () {
            this.socket.emit("newCardForWin");
        },
        pass: function () {
            this.socket.emit("newCardForPass");
        },
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.gameInitLobby {
    margin-left: 200px;
    margin-right: 200px;
}

.waitOthersDiv {
    padding-top: 50px;
}

.message {
    font-size: 30px;
    margin: 30px;
    display: block;
}

.teamSelect {
    padding: 10px;
    font-size: 20px;
    border: 1px solid #707070;
}

.username {
    padding: 10px;
    border: 1px solid #707070;
    border-radius: 20px;
    display: block;
    margin: 30px auto;
    font-size: 20px;
}

.username:hover {
    border: 1px solid #505050;
}

.username:focus {
    outline: 0;
}

.ready {
    padding: 20px;
    background-color: #59b6e6;
    color: #fff;
    border: none;
    border-radius: 20px;
    display: block;
    margin: 30px auto;
}

.ready:hover {
    background-color: #44a9de;
}

.ready:focus {
    outline: 0;
}

.ready:active {
    background-color: #3793c2;
    border: null;
}

.join {
    padding: 20px;
    background-color: #76E569;
    color: #fff;
    border: none;
    border-radius: 20px;
    display: block;
    margin: 30px auto;
}

.join:hover {
    background-color: #6BD85E;
}

.join:focus {
    outline: 0;
}

.join:active {
    background-color: #5FCB52;
    border: null;
}

.notReady {
    padding: 20px 50px;
    background-color: #E37373;
    color: #fff;
    border: none;
    border-radius: 20px;
    display: block;
    margin: 30px auto;
}

.notReady:hover {
    background-color: #D46666;
}

.notReady:focus {
    outline: 0;
}

.notReady:active {
    background-color: #C95555;
    border: null;
}

.player {
    padding: 10px;
    margin: 10px;
    border: 1px solid black;
}

h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

.card-back .red {
    color: white;
}

.card-back .green {
    color: white;
}

.redCard {
    background-color: rgb(194, 67, 67);
}

.greenCard {
    background-color: rgb(96, 204, 96);
}
</style>
