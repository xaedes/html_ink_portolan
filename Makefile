
.PHONY : all
all : js/story.js js/portolan.js

JS_FILES = main.js game.js world.js game_location.js position.js hex_coord.js array_2d.js
JS_FILEPATHS = $(addprefix src/,$(JS_FILES))

js/portolan.js: ${JS_FILEPATHS}
	cat ${JS_FILEPATHS} > js/portolan.js


js/story.js: src/story_template.js js/story.json
	cat src/story_template.js > js/story.js
	cat js/story.json >> js/story.js

js/story.json: story/main.ink tools/inklecate
	tools/inklecate -j -o js/story_with_bom.json story/main.ink
	iconv -f utf-8 -t utf-16le js/story_with_bom.json | iconv -f utf-16 -t utf-8 > js/story.json
	rm js/story_with_bom.json

tools/inklecate: tools/inklecate_linux.zip
	cd tools && unzip inklecate_linux.zip && touch inklecate
	
tools/inklecate_linux.zip:
	wget -O tools/inklecate_linux.zip https://github.com/inkle/ink/releases/download/v1.0.0/inklecate_linux.zip	

tools/Ink.tmLanguage:
	wget -O tools/Ink.tmLanguage https://github.com/inkle/ink-tmlanguage/releases/download/0.2.3/Ink.tmLanguage
	# to use in Sublime:
	# open file "tools/Ink.tmLanguage"
	# Select from Menu: "Tools/Developer/New Syntax from Ink.tmLanguage..."
	# Sublime will generate and open new file "Ink.sublime-syntax"
	# Save file in default folder (e.g. "%AppData%\Sublime Text 3\Packages\User\")
	# Open file "story.ink"
	# Open Command palette Ctrl+Shift+P and search for "set syntax ink", confirm with enter.
	# 
