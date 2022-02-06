function Position(x, y)
{
    this.x = x;
    this.y = y;

    this.add = function(rhs)
    {
        this.x += rhs.x;
        this.y += rhs.y;
        return this;
    }
    this.subtract = function(rhs)
    {
        this.x -= rhs.x;
        this.y -= rhs.y;
        return this;
    }
}
Position.Add = function(a, b)
{
    return new Position(a.x, a.y).add(b);
};
Position.Subtract = function(a, b)
{
    return new Position(a.x, a.y).subtract(b);
};
