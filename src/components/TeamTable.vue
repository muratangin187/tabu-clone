<template>
<div class="team-table" :class="team == 'left'? 'leftTeamTable' : 'rightTeamTable'">
    <span class="teamName" :class="team == 'left' ? 'leftName' : 'rightName' ">
        <font-awesome-icon icon="users" class="teamIcon" />{{ teamName }}
        <span class="teamPoint" :class="team == 'left' ? 'leftPoint':'rightPoint'">{{ team == "left" ? leftPoint : rightPoint}}</span>
    </span>
    <div class="player" v-for="user in teamUsers" :key="user.id" :class="user.ready ? readyClass : notReadyClass">
        <span v-if="currentPlayer == user.username">⭐</span>{{user.username}}
    </div>
</div>
</template>

<script>
export default {
    name: "TeamTable",
    props: {
        teamName: String,
        socket: Object,
        team: String,
    },
    data() {
        return {
            users: [],
            readyClass: "readyClass",
            notReadyClass: "notReadyClass",
            level: 0,
            currentPlayer: '',
            leftPoint: 0,
            rightPoint: 0,
        }
    },
    computed: {
        teamUsers: function () {
            let self = this;
            let arr = [];
            this.users.forEach((user) => {
                if (user.team == self.team)
                    arr.push(user);
            });
            return arr;
        }
    },
    mounted() {
        let self = this;
        this.socket.emit("getUsers");
        this.socket.on("users", (users) => {
            self.users.splice(0, self.users.length);
            users.forEach((user) => {
                self.users.push(user);
            });
        });
        this.socket.on("state", (state) => {
            self.level = state.level;
            self.currentPlayer = state.currentPlayer;
        });
        this.socket.on("pointUpdate", (point) => {
            self.leftPoint = point.left;
            self.rightPoint = point.right;
        });
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.teamName {
    font-size: 30px;
    font-weight: bold;
    margin: 10px;
    color: #707070;
    padding: 20px 23px;
    border: 5px solid #000;
    border-radius: 20px 20px 0px 0px;
    vertical-align: middle;
}

.leftName {
    background-color: rgb(212, 73, 73);
    color: #fff;
}

.rightName {
    background-color: rgb(64, 194, 64);
    color: #fff;
}

.teamIcon {
    margin: 3px 20px 10px 5px;
    vertical-align: middle;
    font-size: 30px;
}

.teamPoint {
    font-size: 25px;
}

.readyClass {
    background-color: #59B6E6;
}

.notReadyClass {
    background-color: #707070;
}

.leftTeamTable {
    float: left;
}

.rightTeamTable {
    float: right;
}

.player {
    padding: 18px 10px;
    margin-left: 10px;
    border: 5px solid #000;
    border-bottom: none;
    color: #fff;
    width: 222px;
    font-weight: bold;
    vertical-align: middle;
}

.player:first-of-type {
    margin-top: 10px;
}

.player:last-of-type {
    border-bottom: 5px solid #000;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
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
