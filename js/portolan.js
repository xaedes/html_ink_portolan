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

    this.player = new Player(this.world);

    let start_island_idx = utils.randomUniformInt(0, this.world.islands.length);
    let start_island = this.world.islands[start_island_idx];

    this.player.position = start_island.getRandomPosition();
    this.player.inLocations = this.world.getLocationsOfPosition(this.player.position);

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
        this.data.player.renderer.update(this.dom.graphics);
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
                let size = 20;
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
    this.length = function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
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
        if (this.v % 2 == 1) x += this.interval * 0.5;
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
function Player(world)
{
    this.world = world;

    this.position = new Position(0,0);
    this.inLocations = [];

    this.renderer = new PlayerRenderer(this);
}
function PlayerRenderer(data)
{
    this.data = data;
    this.parent = null;
    this.dom = null;

    this.width = 32;
    this.height = 32;

    this.enter = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom != null) this.exit(this.parent);
// <image x="120" y="720" width="1000" height="900" href="assets/img/image.svg" />
        // this.dom = this.parent.append("circle");
        // this.dom.attr("r", 10);
        // this.dom.attr("class", "player");
        this.dom = this.parent.append("image");
        this.dom.attr("width", this.width);
        this.dom.attr("height", this.height);
        this.dom.attr("href", "img/pikeman.svg");
        this.dom.attr("class", "player");
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(this.parent);

        this.dom.attr("x", this.data.position.x - this.width/2);
        this.dom.attr("y", this.data.position.y - this.height/2);

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

    this.randomUniform = function(min, max)
    {
        return min + (max - min) * Math.random();
    }
    this.randomUniformInt = function(min, max)
    {
        return Math.floor(this.randomUniform(min, max));
    }
}
