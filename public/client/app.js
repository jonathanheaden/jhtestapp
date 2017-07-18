Vue.use(VueRouter)

const Home = {
    template: `
    <div class="user">
    <h1> Bingo Game</h1>
        <h3>Your player</h3>
        <ul>
            <li v-for="(item, index) in thisplayer.card" v-show="thisplayer.vals[index]">{{item}}</li>
        </ul>
        <ul class="navbar player" v-show="playerjoined">
            <li>{{thisplayer.name}}</li>
            <li v-for="(item, index) in thisplayer.card"><button v-on:click="gotPhrase(index)" v-show="!(thisplayer.vals[index])">{{item}}</button></li>
        </ul>   
         <ul class="navbar" v-for="player in players">       
                <li class="playername">{{player.name}}</li>
                <li v-for="phrase in player.card" class="cardphrase">{{phrase}}</li>
        </ul>
        <form @submit.prevent="createPlayer" v-show="showNewPlayerForm">
        <fieldset>
            <legend>New Player</legend>
            <label>Name</label><input type="text" required v-model="playerName"> 
            <button type="Submit">Join Game</button>
        </fieldset>
        </form>

    </div>`,
    data: function () {
        return {
            playerName: '',
            player: store.state.thisplayer
        }
    },
    computed: {
        showNewPlayerForm() {
            return (store.state.players.length < 6) && (store.state.playerid == '007')
        },
        playerjoined(){
            return (store.state.playerid != '007')
        },
        players(){
            var oplayers = []
            store.state.players.forEach(function (item, index, array) {
                if (item.playerid != store.state.playerid) {oplayers.push(item)}
            })
            return oplayers 
        },
        thisplayer(){
            var p = {
                name: '',
                card: []
            }
             store.state.players.forEach(function (item, index, array) {        
                if (item.playerid == store.state.playerid) {
                    p = item
                }
            })
            return p
        }
    },
    methods: {
        createPlayer() {
            axios.post(store.state.siteUrl +'api/users', {
                    playername: this.playerName
                })
                .then(response => {
                    store.commit('setPlayerid', response.data.id)
                    this.playerId = response.data.id
                    this.refreshPlayers()
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        gotPhrase(id) {
             // /players/:playerid/:phrase
             axios.put(store.state.siteUrl + 'api/players/' + store.state.playerid + '/' + id)
             .then(response => {
                this.refreshPlayers()
             })
             .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        refreshPlayers() {
            axios.get(store.state.siteUrl + 'api/game/' + store.state.playerid)
                .then(response => {
                    store.commit('setPlayers', response.data.players)
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        PlayerRefreshLoop() {
            var self = this
            this.refreshPlayers()
            setTimeout(function () {
                self.PlayerRefreshLoop()
            }, 5000);
        }
    },
    created: function () {
        this.PlayerRefreshLoop();
    }
}

const store = new Vuex.Store({
    state: {
        players: [],
        playerid: '007',
        winner: undefined,
        gameOver: false,
        siteUrl: this.document.URL
    },
    mutations: {
        setPlayers(state, resultingplayers) {
            state.players = resultingplayers
        },
        setPlayerid(state, item) {
            state.playerid = item
        },
        setWinner(state, item) {
            state.winner = item
        },
        setGameOver(state) {
            state.gameOver = true
        }
    }
})

const router = new VueRouter({
    routes: [{
        path: '/',
        component: Home,
    }],
    mode: 'history'
})

new Vue({
    router,
    store,
    el: '#app',
    data: {
        game: []
    },
    computed: {
        players() {
            return store.state.players
        }
    },
    created() {
        axios.get(store.state.siteUrl+'api/game/007')
            .then(response => {
                store.commit('setPlayers', response.data.players)
            })
            .catch(error => {
                console.log('There was an error: ' + error.message)
            })
    }
})
