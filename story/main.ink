
//-> GameLoop
-> Prolog

=== Prolog ===


It is the Age of Discovery. 
Since a very young age you wanted to make maps.
Beautiful drawings of the world. 
Finding places, connecting ports, navigating the dangers of the unknown.
All those souls that where lost on Sea.
Maybe they could have avoided their fate, if only they knew...

+ [Continue] 
-> MainMenu

 
=== MainMenu ===

<h1>Portolan</h1>

+ [Start Game] -> GameLoop
+ [End] -> EndScreen

-
-> EndScreen

== EndScreen ===

This is the end.

-> END

=== GameLoop ===

+ [Visit Island] -> Journey(->Island, ->GameLoop)
+ [Exit Game] -> MainMenu

-
-> MainMenu

=== Journey(->destination, ->goback) ===

On your way to the destination nothing particularly interesting happened.

-> destination(goback)

=== Island(->goback) ===

An island.

-> goback


