function Game(storyContent) 
{
    this.story = new Story(storyContent);
    this.world = new World();
    this.world.generate(75,100,10,10,20);

    this.player = new Player(this.world);

    let start_island_idx = utils.randomUniformInt(0, this.world.islands.length);
    let start_island = this.world.islands[start_island_idx];

    this.player.position = start_island.getRandomPosition();
    this.player.inLocations = this.world.getLocationsOfPosition(this.player.position);

    this.renderer = new GameRenderer(this);
}
function GameRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);
        this.dom = {
            graphics: null,
            story: null,
        };
        let svg = this.parent.append("svg");
        let cam = svg.append("g").attr("class", "cam");
        const zoom = d3.zoom().on("zoom", e=>{
            cam.attr("transform", (transform = e.transform))
        });
        svg.call(zoom);
        // let cam = svg;

        this.dom.graphics = cam;
        this.dom.story = this.parent.append("div");
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        this.data.world.renderer.update(this.dom.graphics);
        this.data.story.renderer.update(this.dom.story);
        this.data.player.renderer.update(this.dom.graphics);
    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        
        this.data.world.renderer.exit(this.dom.graphics);
        this.data.story.renderer.exit(this.dom.story);
        
        if (this.dom != null) {
            this.dom.graphics.remove();
            this.dom.story.remove();
        }
        this.parent = null;
        this.dom = null;
    };
}
