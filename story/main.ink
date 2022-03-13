INCLUDE common_functions.ink
INCLUDE external_functions.ink

VAR arr_current_observations = -1

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

// ~ temp bearing = RANDOM(0,359)

After landing you explore the island and finally look for other visible islands in the surrounding ocean. 

->list_observations(goback, 0)

= list_observations(->goback, idx)
~ temp invalid = Array_isInvalid(arr_current_observations)
{invalid:->done(goback)}
~ temp size = Array_size(arr_current_observations)
{idx>=size:->done(goback)}
~ temp bearing = Array_get(arr_current_observations, idx)
You see another {island|isle} at {print_num(bearing)} degree.

->list_observations(goback, idx+1)

= done(->goback)
->goback

