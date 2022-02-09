function World()
{
    this.params = {

    };
    this.renderer = new WorldRenderer(this);
    this.islands = [];

    this.getLocationsOfPosition = function(position)
    {
        result = [];
        for (let i = 0; i < this.islands.length; i++)
        {
            if (this.islands[i].isPositionInside(position))
            {
                result.push(this.islands[i]);
            }
        }
        return result;
    }

    this.getVisibleFrom = function(position, max_distance)
    {
        visible = [];
        for (let i = 0; i < this.islands.length; i++)
        {
            let view_distance = this.islands[i].getViewFrom(position);
            if (view_distance < max_distance)
            {
                visible.push(this.islands[i]);
            }
        }
        return visible;
    };

    this.generate = function(numIslands, interval, width, height, randomInterval, minIslandSize, maxIslandSize)
    {
        let arr = new Array2d(width,height);
        for (let y = 0; y < arr.height; ++y)
        {
            for (let x = 0; x < arr.width; ++x)
            {
                arr.set(x,y,{
                    count: 0,
                });
            }
        }
        let count = 0;
        numIslands = Math.min(numIslands, arr.width * arr.height);
        let kind = "island";

        let used_seeds = new Set();
        while (count < numIslands)
        {
            let rx = utils.randomUniformInt(0, arr.width);
            let ry = utils.randomUniformInt(0, arr.height);
            let item = arr.get(rx,ry);
            if (item.count == 0)
            {
                item.count++;
                count++;
                let hexCoord = new HexCoord(interval, rx, ry);
                let randomOffset = new Position(
                    utils.randomUniform(-randomInterval, +randomInterval),
                    utils.randomUniform(-randomInterval, +randomInterval)
                );
                let position = hexCoord.toPosition().add(randomOffset);
                let seed = utils.randomUniformInt(0, 1024*1024);
                while (used_seeds.has(seed))
                {
                    seed = utils.randomUniformInt(0, 1024*1024);
                }
                used_seeds.add(seed);
                let size = utils.randomUniform(minIslandSize, maxIslandSize);
                let island = new GameLocation(position,size,kind,seed);
                this.islands.push(island);
            }
        }
    };
}
function WorldRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);

        this.dom = this.parent.append("g");
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        for (let i = 0; i < this.data.islands.length; i++)
        {
            this.data.islands[i].renderer.update(this.dom);
        }
    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        
        for (let i = 0; i < this.data.islands.length; i++)
        {
            this.data.islands[i].renderer.exit(this.dom);
        }

        if (this.dom != null) {
            this.dom.remove();
        }
        this.parent = null;
        this.dom = null;
    };
}
