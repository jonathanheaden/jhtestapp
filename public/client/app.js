Vue.use(VueRouter)

const Home = {
    template: `
    <div class="user">
    <h1> Bingo Game</h1>
        <h2 v-show="gameOver.status">Winner is {{gameOver.winner}}</h2>
        <h3>Your player</h3>
        <ul>
            <li v-for="(item, index) in thisplayer.card" v-show="thisplayer.vals[index]">{{item}}</li>
        </ul>
        <ul class="bingocard player" v-show="playerjoined">
            <li>{{thisplayer.name}}</li>
            <li v-for="(item, index) in thisplayer.card"><button v-on:click="gotPhrase(index)" v-show="!(thisplayer.vals[index])">{{item}}</button></li>
        </ul>   
         <ul class="bingocard" v-for="player in players">       
                <li class="playername">{{player.name}}</li>
                <li v-for="phrase in player.card" class="cardphrase">{{phrase}}</li>
        </ul>
        <form >
        <fieldset>
            <legend>New Player</legend>
            <table>
                <tr>
                <td>
                <label>Name</label> </td>
                <td><input type="text" required v-model="playerName"> </td>
                </tr> 
                <tr>
                <tr><td><label>New Game Description</label></td><td><input type="text" v-model="gameDescription"> </td>
                <td><button v-on:click="startNewGame()">Start & Join New Game</button></td>
                </tr>
                <tr><td colspan=3 align="center" v-show="areThereGamesInProgress">Or join one of these games</td></tr>
                <tr>
                <td colspan=2 align="right">
                <select v-model="gameselection" v-show="areThereGamesInProgress">
                    <option v-for="(item, index) in gameslist" :value=item.id :selected="(gameselection == 'item.id')">{{item.description}}</option>
                </select>
                </td>
                <td><button v-on:click="createPlayer()" v-show="areThereGamesInProgress">Join Game</button></td></tr>
            </table>
        </fieldset>
        </form>

    </div>`,
    data: function () {
        return {
            playerName: '',
            gameselection: '',
            gameDescription:'',
            player: '',
            winner: ''
        }
    },
    computed: {
        gameslist(){
            return store.state.games
        },
        areThereGamesInProgress() {
            return store.state.games.length > 0
        },
        showNewPlayerForm() {
            return (store.state.players.length < 6) && (store.state.playerid == '007')
        },
        playerjoined(){
            return (store.state.playerid != '007')
        },
        gameOver() {
            return {
                status: store.state.gameOver,
                winner: store.state.winner
            }
        },
        players() {
            var oplayers = []
            if (store.state.gameid) {
                store.state.players.map(plyr => {
                    if (plyr.playerid != store.state.playerid) {
                        oplayers.push(plyr)
                    }
                })
                // store.state.players.forEach(function (item, index, array) {
                //     if (item.playerid != store.state.playerid) {oplayers.push(item)}
                // })
            }
            return oplayers
        },
        thisplayer(){
            var p = {
                name: '',
                card: []
            }
            //  store.state.players.forEach(function (item, index, array) {        
            //     if (item.playerid == store.state.playerid) {
            //         p = item
            //     }
            // })
           if (store.state.gameid) {
               store.state.players.map(plyr => {
                   if (plyr.playerid == store.state.playerid) {
                       p = plyr
                   }
               })
           }
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
        startNewGame(){
// post description to /api
            axios.post(store.state.siteUrl +'api', {
                    description: this.gameDescription
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
             if (!store.state.gameOver) {
                axios.put(store.state.siteUrl + 'api/players/' + store.state.playerid + '/' + id)
                    .then(response => {
                        this.refreshPlayers()
                        if (response.data.gamestatus == 'Game Over') {
                            store.commit('setWinner', response.data.winner)
                        }
                    })
                    .catch(error => {
                        console.log('There was an error: ' + error.message)
                    })
             }
        },
        refreshPlayers() {
            axios.get(store.state.siteUrl + 'api/' + store.state.gameid + store.state.playerid)
                .then(response => {
                    store.commit('setPlayers', response.data.players)
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        refreshGames(){
             axios.get(store.state.siteUrl + 'api')
                .then(response => {
                    store.commit('setGames', response.data.games)
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        PlayerRefreshLoop() {
            var self = this
             if (!store.state.gameOver) { this.refreshPlayers() }
            setTimeout(function () {
                self.PlayerRefreshLoop()
            }, 5000);
        }
    },
    created: function () {
       this.refreshGames();
        if (store.state.gameid) {
            this.PlayerRefreshLoop();
        }
    }
}

const store = new Vuex.Store({
    state: {
        players: [],
        playerid: '007',
        gameid: undefined,
        winner: undefined,
        gameOver: false,
        games: [], //array of objects with {description, id}
        siteUrl: this.document.URL
    },
    mutations: {
        setPlayers(state, resultingplayers) {
            state.players = resultingplayers
        },
        setPlayerid(state, item) {
            state.playerid = item
        },
        setGames(state, gameslist){
            state.games = gameslist
        },
        setWinner(state, name) {
            state.winner = name
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
        axios.get(store.state.siteUrl+'api')
            .then(response => {
                store.commit('setPlayers', response.data.players)
            })
            .catch(error => {
                console.log('There was an error: ' + error.message)
            })
    }
})
