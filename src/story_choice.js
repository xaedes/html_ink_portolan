function StoryChoice(story, text, index, delay)
{
    this.story = story;
    this.text = text;
    this.index = index;
    this.delay = delay;
    this.remove = false;
    this.renderer = new StoryChoiceRenderer(this);
}
function StoryChoiceRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);
        let choice = this.data;
        this.dom = {
            paragraph: null,
            link: null,
        };

        this.dom.paragraph = (
            this.parent
            .append("p")
            .attr("class", "choice")
        );
        this.dom.link = (
            this.dom.paragraph
            .append("a")
            .attr("href", "#")
            .html(this.data.text)
            .on("click", function(e){
                e.preventDefault();
                choice.story.chooseIndex(choice.index);
                choice.story.continueStory();
            })
        );
        utils.showAfter(this.data.delay, this.dom.paragraph);
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
            this.dom.link.remove();
            this.dom.paragraph.remove();
        }

        this.parent = null;
        this.dom = null;
    };
}