#!/usr/bin/env bash

antlr4 -Dlanguage=JavaScript ./lib/HTMLLexer.g4
antlr4 -Dlanguage=JavaScript ./lib/HTMLParser.g4
