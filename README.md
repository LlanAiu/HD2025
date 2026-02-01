# Solo Mafia: Play Mafia against AI's!

## Inspiration
We wanted to take advantage of LLMs to create new interactive experiences. At Duke, we often get together with our friends to play board games, and we often play Secret Hitler or Mafia. 
However, when everyone has a test the next day but you, there is no one to play with! That's why we created Solo Mafia: so you can be an imaginary criminal or a guardian of the community. 
## What it does
Our mafia game runs in the browser. The user inputs their name, and their desired number of players (7-16). The user and the players will be randomly assigned roles (Mafia, Detective, Doctor, or Villager). 
They then proceed through the night and day cycles of a normal Mafia game. They can accuse, vote, kill if they are mafia, heal if they are the doctor, and investigate if they are the detective. 
## How we built it
We used python for the back-end game logic. Our front-end, which runs on the browser, is coded in typescript using the Next.JS framework. Routing is handled with FastAPI HTTP requests and websockets.
## Challenges we ran into
In the beginning of the build phase, we had to backtrack and set the details of the game straight, making sure they would be compatible with LLM API restrictions. We also had to make sure the back-end and the LLM 
interface were expecting the same things from each other.  After the build phase, we ran into many bugs while integrating the front-end and back-end, as well as general bugs after integration while testing the final product.
## Accomplishments that we're proud of
We planned our code out relatively early so we didn't have to make huge changes in the build phase. Writing clean, documented code that could be quickly understood and debugged. We also tested incrementally so we could count on the code that we tested. 
## What we learned
We learned the importance of documentation and communication between project areas, how to prompt-engineer effectively, how to route with websockets, and when to use async functions. 
## What's next for Solo Mafia
We already have ideas for a few new features. Our first priority is deploying the project in a way that doesn't use too much money calling the LLM APIs. The next feature we would implement is improving the AIs
to make them more realistic (smarter, more human) and have more varied personalities. After those features, we would implement multiplayer (multiple human players).
