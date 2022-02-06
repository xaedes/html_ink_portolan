function GameLocation(position, kind)
{
    this.position = position;
    this.kind = kind;
    this.renderer = new GameLocationRenderer(this);
}
function GameLocationRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);

        this.dom = this.parent.append("circle");
        this.dom.attr("r", 20);
        this.dom.attr("class", "game_location " + this.data.kind);
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(parent);

        this.dom.attr("cx", this.data.position.x);
        this.dom.attr("cy", this.data.position.y);

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
