function HexCoord(interval, u, v)
{
    this.interval = interval;
    this.u = Math.round(u);
    this.v = Math.round(v);

    this.toPosition = function()
    {
        let lineHeight = Math.sqrt(3) / 2.0;
        let y = this.interval * this.v * lineHeight;
        let x = this.interval * this.u;
        if (this.u % 2 == 1) x += 0.5;
        return new Position(x,y);
    };
}