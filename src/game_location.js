function GameLocation(position, size, kind, seed)
{
    this.position = position;
    this.size = size;
    this.kind = kind;
    this.seed = seed;
    this.renderer = new GameLocationRenderer(this);

    this.isPositionInside = function(position)
    {
        let delta = Position.Subtract(this.position, position);
        let distance = delta.length();
        return (distance <= this.size);
    }

    this.getViewFrom = function(position)
    {
        let delta = Position.Subtract(this.position, position);
        let distance = delta.length();
        return distance;
    }

    this.getRandomPosition = function()
    {
        let random_distance = utils.randomUniform(0, this.size);
        let random_angle = utils.randomUniform(0, Math.PI*2);
        let x = Math.cos(random_angle) * random_distance;
        let y = Math.sin(random_angle) * random_distance;
        let pos = new Position(x,y);
        pos.add(this.position);
        return pos;
    }
}
function GameLocationRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.filter_id = null;
    this.filter = null;
    this.turbulence = null;
    this.displacementMap = null;
    this.radialGradient = null;
    this.circle = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);

        this.dom = this.parent.append("g");

        this.filter_id = "game_location_displacementFilter_seed_" + this.data.seed;
        this.gradient_id = "game_location_gradient_seed_" + this.data.seed;
        this.filter = (
            this.dom
            .append("filter")
            .attr("id", this.filter_id)
        );
        this.turbulence = (
            this.filter
            .append("feTurbulence")
            // https://drafts.fxtf.org/filter-effects/#feTurbulenceElement
            .attr("type", "turbulence")
            .attr("baseFrequency", 0.05)
            .attr("numOctaves", 2)
            .attr("seed", this.data.seed)
            .attr("result", "turbulence_" + this.data.seed)
        );
        this.displacementMap = (
            this.filter
            .append("feDisplacementMap")
            .attr("in", "SourceGraphic")
            .attr("in2", "turbulence_" + this.data.seed)
            .attr("seed", this.data.seed)
            .attr("scale", this.data.size)
            .attr("xChannelSelector","R")
            .attr("yChannelSelector","G")
        );
        this.radialGradient = (
            this.dom
            .append("radialGradient")
            .attr("id", this.gradient_id)
        );
        let gradient_stops = [
            [0, "#ffffff"],
            [7, "#717171"],
            [16, "#52381d"],
            [31, "#2f7e36"],
            [88, "#549121"],
            [95, "#9d911e"],
            [100, "#ffe34f"]
        ];
        for (let i=0; i<gradient_stops.length; ++i)
        {
            this.radialGradient
                .append("stop")
                .attr("offset", gradient_stops[i][0] + "%")
                .attr("stop-color", gradient_stops[i][1])
            ;
        }

        this.circle = (
            this.dom
            .append("circle")
            .attr("r", this.data.size)
            .attr("class", "game_location " + this.data.kind)
            .attr("style", "filter: url(#"+this.filter_id+"); fill: url(#"+this.gradient_id+")")
        );
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        this.circle.attr("cx", this.data.position.x);
        this.circle.attr("cy", this.data.position.y);

    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) {
            this.dom.remove();
        }
        
        this.filter_id = null;
        this.filter = null;
        this.turbulence = null;
        this.displacementMap = null;
        this.radialGradient = null;
        this.circle = null;

        this.parent = null;
        this.dom = null;
    };
}
