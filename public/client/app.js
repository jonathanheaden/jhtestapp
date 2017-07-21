Vue.use(VueRouter)

const Home = {
    template: `
    <div class="user">
    <h1> Bingo Game</h1>
        <h2 v-show="!gameOver">Winner is {{winner}}</h2>
        <h3 v-show="playerjoined">Your player</h3>
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
        <fieldset v-show="!playerjoined">
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
                    <td><button v-on:click="createPlayer()" v-show="gamePlacesAvailable">Join Game</button>
                    <div v-show="(areThereGamesInProgress && !showNewPlayerForm)">Game is Full :(</div></td>
                </tr>
            </table>
        </fieldset>
        </form>

    </div>`,
    data: function () {
        return {
            playerName: '',
            gameselection: undefined,
            gameDescription: ''
            // player: ''
        }
    },
    computed: {
        gameslist() {
            result = []
            if (store.state.games) {
                store.state.games.map(game => {
                    if (game.gameon) {
                        result.push({
                            description: game.description,
                            id: game.id
                        })
                    }
                })
            }
            return result
        },
        areThereGamesInProgress() {
            return this.gameslist.length > 0
        },
        showNewPlayerForm() {
            var result = false
            if (this.gameselection) {
                console.log(this.gameselection)
                store.state.games.map(game => {
                    if (game.id == this.gameselection) {
                        console.log(game)
                        result = (game.numplayers < 6)
                    }
                })
            }
            return result
        },
        gamePlacesAvailable(){
            return (this.areThereGamesInProgress && this.showNewPlayerForm)
        },
        playerjoined() {
            return (store.state.playerid != undefined)
        },
        gameOver() {
            return store.state.gameOver
        },
        winner(){
            return store.state.winner
        },
        players() {
            var oplayers = []
            if (store.state.gameid && store.state.players) {
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
        gameid(){
            return store.state.gameid
        },
        playerid(){
            return store.state.playerid
        },
        thisplayer() {
            var p = {
                name: '',
                card: []
            }
            //  store.state.players.forEach(function (item, index, array) {        
            //     if (item.playerid == store.state.playerid) {
            //         p = item
            //     }
            // })
            if (store.state.gameid && store.state.players) {
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
        createPlayer(){
            var gameidtojoin = this.gameselection ? this.gameselection : store.state.gameid
            store.commit('setPlayername',this.playername)
            this.createPlayerinGame(gameidtojoin)
        },
        createPlayerinGame(gameidtojoin) {
            console.log(this.playerName + ' ' + gameidtojoin)
            axios.post(store.state.siteUrl + 'api/users/' + gameidtojoin, {
                    playername: this.playerName
                })
                .then(response => {
                    console.log(response.data)
                    store.commit('setPlayerid', response.data.playerid)
                    this.playerId = response.data.playerid
                    //this.refreshPlayers()
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        startNewGame() {
            // post description to /api
            axios.post(store.state.siteUrl + 'api', {
                    description: this.gameDescription
                })
                .then(response => {
                    store.commit('setGame',response.data.id)
                    this.createPlayer()
                    // store.commit('setPlayerid', response.data.id)
                    // this.playerId = response.data.id
                    this.refreshPlayers()
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        gotPhrase(id) {
            if (!store.state.gameOver) {
                axios.put(store.state.siteUrl + 'api/players/' + this.game.id + '/' + id)
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
            axios.get(store.state.siteUrl + 'api/' + this.gameid + "/" + this.playerid)
                .then(response => {
                    console.log(response.data)
                    store.commit('setPlayers', response.data.players)
                })
                .catch(error => {
                    console.log('There was an error: ' + error.message)
                })
        },
        refreshGames() {
            console.log('refresh games')
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
            console.log(this)
            if (this.gameid && !this.gameOver) {
                this.refreshPlayers()
            }
            setTimeout(function () {
                self.PlayerRefreshLoop()
            }, 5000);
        }
    },
    created: function () {
        console.log(this)
        this.refreshGames();
        if (this.gameid) {
            console.log('in game')
            this.PlayerRefreshLoop();
        }
    }
}

const store = new Vuex.Store({
    state: {
        players: [],
        playerid: undefined,
        gameid: undefined,
        playername: undefined,
        winner: undefined,
        gameOver: false,
        games: [], //array of objects with {description, id, gameon}
        siteUrl: this.document.URL.split('?')[0]
    },
    mutations: {
        setPlayers(state, resultingplayers) {
            state.players = resultingplayers
        },
        setPlayerid(state, item) {
            state.playerid = item
        },
        setPlayername(state, item) {
            state.playername = item
        },
        setGame(state,gameid){
            state.gameid = gameid
        },
        setGames(state, gameslist) {
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
    }
    // created() {
    //     axios.get(store.state.siteUrl + 'api')
    //         .then(response => {
    //             store.commit('setPlayers', response.data.players)
    //         })
    //         .catch(error => {
    //             console.log('There was an error: ' + error.message)
    //         })
    // }
})
