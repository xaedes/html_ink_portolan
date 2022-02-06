function Array2d(width=0, height=0)
{
    this.width = width;
    this.height = height;
    this.data = [];

    this.clear = function()
    {
        this.data = [];
        for (let y = 0; y < height; y++)
        {
            let row = [];
            for (let x = 0; x < width; x++)
            {
                row.push(null);
            }
            this.data.push(row);
        }
    };

    this.get = function(x,y)
    {
        return this.data[y][x];
    };

    this.set = function(x,y,v)
    {
        this.data[y][x] = v;
        return this.data[y][x];
    };

    this.clear();
}