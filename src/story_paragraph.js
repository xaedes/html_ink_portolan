function StoryParagraph(text, delay)
{
    this.text = text;
    this.delay = delay;
    this.remove = false;
    this.renderer = new StoryParagraphRenderer(this);
}
function StoryParagraphRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);

        this.dom = this.parent.append("p");
        this.dom.html(this.data.text);
        utils.showAfter(this.data.delay, this.dom);
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

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
