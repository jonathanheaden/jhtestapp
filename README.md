# jhtestapp

test node/express app for azure web
 - setup as express generator boilerplate

 ``` powershell
$players = (invoke-webrequest 'http://localhost:3255/players').content | convertfrom-json
foreach ($p in $players.players) {
    $p.name                                                    
    ("-" * $p.name.length)                                     
    for ($i = 0;$i -lt 5; $i++){                              
         if ($p.card.vals[$i]) {$colour = 'green'} else {$colour = 'darkred'}   write-host -ForegroundColor $colour  $p.card.phrases[$i]    
         }
    }         
 ```
