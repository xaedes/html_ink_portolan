function World()
{
    this.params = {

    };
    this.renderer = new WorldRenderer(this);
    this.islands = [];

    this.generate = function(numIslands, interval, width, height, randomInterval)
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
        while (count < numIslands)
        {
            let rx = Math.floor(Math.random() * arr.width);
            let ry = Math.floor(Math.random() * arr.height);
            let item = arr.get(rx,ry);
            if (item.count == 0)
            {
                item.count++;
                count++;
                let hexCoord = new HexCoord(interval, rx, ry);
                let randomOffset = new Position(
                    (Math.random()*2-1) * randomInterval,
                    (Math.random()*2-1) * randomInterval
                );
                let position = hexCoord.toPosition().add(randomOffset);
                let island = new GameLocation(position,kind);
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
        if (this.dom === null) this.enter(parent);

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
