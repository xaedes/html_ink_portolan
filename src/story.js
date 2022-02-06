function Story(storyContent)
{
    this.storyContent = storyContent;

    this.params = {
        delay: {
            paragraph: 100.0,
            choice: 100.0
        }
    };
    this.inkStory = new inkjs.Story(this.storyContent);

    this.paragraphs = [];
    this.choices = [];
    

    // this.storyContainer = document.querySelectorAll('#story')[0];
    this.renderer = new StoryRenderer(this);

    this.chooseIndex = function(index)
    {
        // todo: remove existing choices
        for (let i = 0; i < this.choices.length; i++)
        {
            this.choices[i].remove = true;
        }
        this.inkStory.ChooseChoiceIndex(index);
        this.renderer.update();
    };

    this.continueStory = function() 
    {
        var paragraphIndex = 0;
        var delay = 0.0;

        // Generate story text, loop through available content
        while(this.inkStory.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = this.inkStory.Continue();

            let storyParagraph = new StoryParagraph(paragraphText, delay);
            this.paragraphs.push(storyParagraph);

            delay += this.params.delay.paragraph;
        }

        // Create HTML choices from ink choices
        let story = this;
        this.inkStory.currentChoices.forEach(function(choice) {
            let storyChoice = new StoryChoice(story, choice.text, choice.index, delay);
            story.choices.push(storyChoice);

            delay += story.params.delay.choice;

        });
        this.renderer.update();
        utils.scrollToBottom();
    };    
}
function StoryRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);

        this.dom = this.parent.append("div");
        this.dom.attr("id", "story");
        this.dom.attr("class", "container");
        // this.dom.append("h1")
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);
        

        for (let i = 0; i < this.data.paragraphs.length; i++)
        {
            if (this.data.paragraphs[i].remove === true)
            {
                this.data.paragraphs[i].renderer.exit(this.dom);
            }
            else
            {
                this.data.paragraphs[i].renderer.update(this.dom);
            }
        }
        this.data.paragraphs = this.data.paragraphs.filter(paragraph => !paragraph.remove);
        for (let i = 0; i < this.data.choices.length; i++)
        {
            if (this.data.choices[i].remove === true)
            {
                this.data.choices[i].renderer.exit(this.dom);
            }
            else
            {
                this.data.choices[i].renderer.update(this.dom);
            }
        }
        this.data.choices = this.data.choices.filter(choice => !choice.remove);

    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;

        for (let i = 0; i < this.data.paragraphs.length; i++)
        {
            this.data.paragraphs[i].renderer.exit(this.dom);
        }

        for (let i = 0; i < this.data.choices.length; i++)
        {
            this.data.choices[i].renderer.exit(this.dom);
        }

        if (this.dom != null) {
            this.dom.remove();
        }

        this.parent = null;
        this.dom = null;
    };
}
