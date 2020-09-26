<template>
<div class="readyLobby">
    <div class="usernameDiv" v-if="!ready">
        <span class="message">HAZIR OLDUGUNDA HAZIRA TIKLA</span>
        <label v-if="!accountCreated" for="username">Ismin: </label>
        <input v-if="!accountCreated" v-model="username" type="text" name="username" id="username" class="username">
        <select v-if="!accountCreated" class="teamSelect" v-model="team">
            <option value="left">Left team</option>
            <option value="right">Right team</option>
        </select>
        <button class="ready" v-if="accountCreated" @click="setReady(true)">HAZIRIM</button>
        <button class="join" v-else @click="setReady(false)">ODAYA GIR</button>
    </div>
    <div class="waitOthersDiv" v-else-if="!countdownStarted">
        <span class="message">DIGER OYUNCULARIN HAZIR OLMASI BEKLENIYOR</span>
        <button class="notReady" @click="setReady(false)">IPTAL</button>
    </div>
    <div class="countdownDiv" v-else>
        <span class="message">OYUNUN BASLAMASINA SON</span>
        <span class="message">{{countdownSec}} SANIYE</span>
    </div>
</div>
</template>

<script>
export default {
    name: "ReadyLobby",
    props: {
        socket: Object
    },
    data() {
        return {
            ready: false,
            username: "",
            team: "left",
            accountCreated: false,
            countdownStarted: false,
            countdownObj: null,
            countdownSec: 10
        };
    },
    mounted() {
        let self = this;
        this.socket.on("users", (users) => {
            users.forEach(user => {
                if (user.username == self.username)
                    self.ready = user.ready;
            });
        });
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
    },
    methods: {
        setReady(bool) {
            this.accountCreated = true;
            this.ready = bool;
            this.socket.emit("userReady", {
                username: this.username,
                team: this.team,
                ready: this.ready
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.readyLobby {
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
</style>
