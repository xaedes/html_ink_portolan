var game = null;
function main()
{
    game = new Game(storyContent);
    game.continueStory();
    game.renderer.update(d3.select("#game"));
}
