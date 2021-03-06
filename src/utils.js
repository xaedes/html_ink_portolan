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
        let scrollBox = d3.select("#story");
        let firstP = scrollBox.select("p:first-of-type");
        let lastP = scrollBox.select("p:last-of-type");

        let game = this;
        var progress = 0.0;
        var start = scrollBox.node().scrollTop;
        // var start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var dist = lastP.node().offsetTop - firstP.node().offsetTop - start;
        // var dist = document.body.scrollHeight - window.innerHeight - start;
        if( dist < 0 ) return;

        var duration = 300 + 300*dist/100;
        var startTime = null;
        function step(time) {
            if( startTime == null ) startTime = time;
            var t = (time-startTime) / duration;
            var lerp = 3*t*t - 2*t*t*t;
            scrollBox.node().scrollTo(0, start + lerp*dist);
            // scrollBox.node()
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
