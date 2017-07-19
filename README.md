# jhtestapp

## API Endpoints

| Verb | url  | Params  |  Return |
|---|--:|---|---|
| get  |/api   | none  | Landing page (not used) | 
| get  |/api/game   | none  |  Home page for no selected player |
| get  | /api/game/:playerid   | 4 digit playerid of current player   | Home page for selected Player |
| get  | /api/players/:playerid   |4 digit playerid of current player   |  Get card for selected Player (not used) |
| put  | /api/players/:playerid/:phrase   | 4 digit playerid of current player & index of phrase which is being ticked  | Mark a card as done |
| post  | /api/users  | request body contains `playername`  | create a new player |

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
