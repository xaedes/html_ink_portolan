var game = null;
var utils = null;
function main()
{
    utils = new Utils();
    game = new Game(storyContent);
    game.renderer.update(d3.select("#game"));
    game.story.continueStory();
}
function Game(storyContent) 
{
    this.story = new Story(storyContent);
    this.world = new World();
    this.world.generate(75,100,10,10,20);

    this.renderer = new GameRenderer(this);
}
function GameRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);
        this.dom = {
            graphics: null,
            story: null,
        };
        let svg = this.parent.append("svg");
        let cam = svg.append("g").attr("class", "cam");
        const zoom = d3.zoom().on("zoom", e=>{
            cam.attr("transform", (transform = e.transform))
        });
        svg.call(zoom);
        // let cam = svg;

        this.dom.graphics = cam;
        this.dom.story = this.parent.append("div");
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        this.data.world.renderer.update(this.dom.graphics);
        this.data.story.renderer.update(this.dom.story);
    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        
        this.data.world.renderer.exit(this.dom.graphics);
        this.data.story.renderer.exit(this.dom.story);
        
        if (this.dom != null) {
            this.dom.graphics.remove();
            this.dom.story.remove();
        }
        this.parent = null;
        this.dom = null;
    };
}
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
        if (this.dom === null) this.enter(this.parent);

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
}function Array2d(width=0, height=0)
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
}function Story(storyContent)
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
}function StoryParagraph(text, delay)
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
function Utils()
{
    this.showAfter = function(delay, element)
    {
        // element.transition().duration(delay).attr("class")
        setTimeout(
            function() { 
                element.each(
                    function(d) {
                        this.classList.add("show")
                    }
                );
            }, 
            delay
        );
        // setTimeout(function() { element.classList.add("show") }, delay);
    };

    this.scrollToBottom = function()
    {
        let game = this;
        var progress = 0.0;
        var start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var dist = document.body.scrollHeight - window.innerHeight - start;
        if( dist < 0 ) return;

        var duration = 300 + 300*dist/100;
        var startTime = null;
        function step(time) {
            if( startTime == null ) startTime = time;
            var t = (time-startTime) / duration;
            var lerp = 3*t*t - 2*t*t*t;
            window.scrollTo(0, start + lerp*dist);
            if( t < 1 ) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    };
}
