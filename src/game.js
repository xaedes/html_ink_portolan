function Game(storyContent) 
{
    this.params = {
        delay: {
            paragraph: 100.0,
            choice: 100.0
        }
    };
    this.renderer = new GameRenderer(this);
    this.storyContainer = document.querySelectorAll('#story')[0];
    this.storyContent = storyContent;
    this.story = new inkjs.Story(this.storyContent);

    this.world = new World();
    this.world.generate(75,100,10,10,20);

    this.showAfter = function(delay, element)
    {
        setTimeout(function() { element.classList.add("show") }, delay);
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
    this.continueStory = function() 
    {
        let game = this;
        var paragraphIndex = 0;
        var delay = 0.0;

        // Generate story text - loop through available content
        while(game.story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = game.story.Continue();

            // Create paragraph element
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            game.storyContainer.appendChild(paragraphElement);

            // Fade in paragraph after a short delay
            game.showAfter(delay, paragraphElement);

            delay += game.params.delay.paragraph;
        }

        // Create HTML choices from ink choices
        game.story.currentChoices.forEach(function(choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            game.storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            game.showAfter(delay, choiceParagraphElement);
            delay += game.params.delay.choice;

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function(event) {

                // Don't follow <a> link
                event.preventDefault();

                // Remove all existing choices
                var existingChoices = game.storyContainer.querySelectorAll('p.choice');
                for(var i=0; i<existingChoices.length; i++) {
                    var c = existingChoices[i];
                    c.parentNode.removeChild(c);
                }

                // Tell the story where to go next
                game.story.ChooseChoiceIndex(choice.index);

                // Aaand loop
                game.continueStory();
            });
        });

        game.scrollToBottom();
    };
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
    };
    this.update = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        if (this.dom === null) this.enter(parent);

        this.data.world.renderer.update(this.dom.graphics);
    };
    this.exit = function(parent = null)
    {
        if (this.parent === null) this.parent = parent;
        
        this.data.world.renderer.exit(this.dom.graphics);
        
        if (this.dom != null) {
            this.dom.graphics.remove();
        }
        this.parent = null;
        this.dom = null;
    };
}
