<template>
<div class="readyLobby">
    <div class="usernameDiv" v-if="!ready">
        <input v-if="!accountCreated" v-model="username" type="text" name="username" id="username" placeholder="Kullanıcı adı" class="username">
        <select v-if="!accountCreated" class="teamSelect" v-model="team">
            <option value="left">Left team</option>
            <option value="right">Right team</option>
        </select>
        <button class="blueButton" v-if="accountCreated" @click="setReady(true)">
            <font-awesome-icon icon="user-check" class="buttonIcon" /><strong>HAZIRIM</strong>
        </button>
        <button class="yellowButton" v-else @click="setReady(false)">
            <font-awesome-icon icon="gamepad" class="buttonIcon" /><strong>ODAYA GIR</strong>
        </button>
    </div>
    <div class="waitOthersDiv" v-else-if="!countdownStarted">
        <span class="message">DIGER OYUNCULARIN HAZIR OLMASI BEKLENIYOR</span>
        <button class="redButton" @click="setReady(false)">
            <font-awesome-icon icon="ban" class="buttonIcon" /><strong>IPTAL</strong>
        </button>
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
    margin-left: 300px;
    margin-right: 300px;
    padding: 100px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 5px solid #000;
    border-radius: 20px;
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
    height: 50px;
    font-size: 20px;
    border: 1px solid #707070;
    border-radius: 0px 20px 20px 0px;
}

.teamSelect:focus {
    outline: 0;
}

.username {
    padding: 10px;
    border: 1px solid #707070;
    border-right: none;
    width: 200px;
    height: 28px;
    border-radius: 20px 0px 0px 20px;
    margin: 30px auto;
    font-size: 20px;
}

.username:hover {
    border: 1px solid #505050;
}

.username:focus {
    outline: 0;
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
