var game = null;
var utils = null;
function main()
{
    utils = new Utils();
    game = new Game(storyContent);
    game.renderer.update(d3.select("#game"));
    game.story.continueStory();
}
