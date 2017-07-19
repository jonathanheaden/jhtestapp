# jhtestapp

## API Endpoints

| Verb | url  | Params  |  Return |
|---|--:|---|---|
| get | /api | none | returns a list of games with their desciptions and IDs |
| get  | /api/:gameid   | none  |  Home page for specified game for no selected player |
| get  | /api/:gameid/:playerid   | 4 digit playerid of current player   | Home page for selected Player in specified game |
| put  | /api/:gameid/:playerid/:phrase   | 4 digit playerid of current player  in sepcified game & index of phrase which is being ticked | Mark a card as done for a player in a game |
| post | /api/users/:game  | request body contains `playername`  | create a new player in a specified game |
| post | /api | request body contains a description | create a new game |

 ``` powershell
$game = (invoke-webrequest 'http://localhost:3255/api/game').content | convertfrom-json
foreach ($p in $game.players) {
    $p.name                                                    
    ("-" * $p.name.length)                                     
    for ($i = 0;$i -lt 5; $i++){                              
         if ($p.vals[$i]) {$colour = 'green'} else {$colour = 'darkred'}   write-host -ForegroundColor $colour  $p.card[$i]    
         }
    }         
 ```

## Bingo web app
- clients can register new (unique) name
- client can update their card when they hear their phrase
- use websockets to push updates to all listeners
- when one player gets all card items they win
