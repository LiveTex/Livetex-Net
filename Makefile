

#
#	Variables
#

JS_ROOT_DIR = ./
JS_DEPS_DIRS = /home/kononencheg/Documents/Tuna-Utils/ \
               /home/kononencheg/Documents/Tuna-Events/
JS_DEFAULT_OUT = bin/net.js
JS_DEFAULT_ENV = browser

include build/js-variables.mk



#
#	Rules
#


all : js-export


clean : js-clean


include build/js-rules.mk