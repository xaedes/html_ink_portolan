function Player(world)
{
    this.world = world;

    this.position = new Position(0,0);
    this.inLocations = [];

    this.renderer = new PlayerRenderer(this);
}
function PlayerRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.width = 32;
    this.height = 32;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);
// <image x="120" y="720" width="1000" height="900" href="assets/img/image.svg" />
        // this.dom = this.parent.append("circle");
        // this.dom.attr("r", 10);
        // this.dom.attr("class", "player");
        this.dom = this.parent.append("image");
        this.dom.attr("width", this.width);
        this.dom.attr("height", this.height);
        this.dom.attr("href", "img/pikeman.svg");
        this.dom.attr("class", "player");
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        this.dom.attr("x", this.data.position.x - this.width/2);
        this.dom.attr("y", this.data.position.y - this.height/2);

    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) {
            this.dom.remove();
        }
        

        this.parent = null;
        this.dom = null;
    };
}
