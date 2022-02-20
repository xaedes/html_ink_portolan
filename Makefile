
BUILD_JS_FILE = portolan.js
BUILD_STORY_JS_FILE = story_content.js
BUILD_STORY_JSON_FILE = story_content.json
STORY_JS_TEMPLATE_FILE = story_content_template.js

JS_FILES = \
	main.js game.js world.js game_location.js position.js \
	hex_coord.js array_2d.js story.js story_choice.js \
	story_paragraph.js player.js utils.js

MAIN_STORY_FILE = main.ink
STORY_FILES = $(MAIN_STORY_FILE)

BUILD_JS_FILEPATH = $(addprefix js/,$(BUILD_JS_FILE))
BUILD_STORY_JS_FILEPATH = $(addprefix js/,$(BUILD_STORY_JS_FILE))
BUILD_STORY_JSON_FILEPATH = $(addprefix js/,$(BUILD_STORY_JSON_FILE))

STORY_JS_TEMPLATE_FILEPATH = $(addprefix src/,$(STORY_JS_TEMPLATE_FILE))
JS_FILEPATHS = $(addprefix src/,$(JS_FILES))

MAIN_STORY_FILEPATH = $(addprefix story/,$(MAIN_STORY_FILE))
STORY_FILEPATHS = $(addprefix story/,$(STORY_FILES))

ALL_TARGET_FILES = $(BUILD_JS_FILEPATH) $(BUILD_STORY_JS_FILEPATH)  $(BUILD_STORY_JSON_FILEPATH) 


.PHONY : all
all : $(ALL_TARGET_FILES)

clean: 
	rm $(ALL_TARGET_FILES)

$(BUILD_JS_FILEPATH): ${JS_FILEPATHS}
	cat ${JS_FILEPATHS} > $(BUILD_JS_FILEPATH)

$(BUILD_STORY_JS_FILEPATH):  $(BUILD_STORY_JSON_FILEPATH)
	cat $(STORY_JS_TEMPLATE_FILEPATH) > $(BUILD_STORY_JS_FILEPATH)
	cat $(BUILD_STORY_JSON_FILEPATH) >> $(BUILD_STORY_JS_FILEPATH)

$(BUILD_STORY_JSON_FILEPATH): $(STORY_FILEPATHS) tools/inklecate
	tools/inklecate -j -o js/story_content_with_bom.json $(MAIN_STORY_FILEPATH)
	iconv -f utf-8 -t utf-16le js/story_content_with_bom.json | iconv -f utf-16 -t utf-8 > $(BUILD_STORY_JSON_FILEPATH)
	rm js/story_content_with_bom.json

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
