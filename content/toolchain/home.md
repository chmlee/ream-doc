+++
title = "Toolchain"
template = "page-sidebar.html"
weight = 3
+++

The following tools are developed around REAM language.
The goal is to provide a user-friendly workflow to create, edit, distribute and reuse REAM files.

## Alpha

- [reamparser.js](https://github.com/chmlee/reamparser.js):
a REAM parser written in JavaScript.
This is the current default parser for REAM Editor, but may be replaced by ream-core (see below).

- [REAM Editor](https://chmlee.github.io/ream-editor):
a web-based editor for REAM.

- [REAM Editor Lite](https://github.com/chmlee/ream-editor-lite):
a lite version of REAM Editor as a Vue component.

- [prism-ream](https://github.com/chmlee/prism):
a fork of syntax highlighting library [PrismJS](https://github.com/PrismJS/prism) with REAM support added.
Pull requests may be submitted once the language is stable.

- [ream.vim](https://github.com/chmlee/ream.vim):
syntax highlighting for REAM in Vim.

- [ream-core](https://github.com/chmlee/ream-core):
an experimental REAM CLI tool  written in Rust.
Planned functionalities include encoder, decoder, linter, and documentation generator.
It may replace reamparser.js as the default parser for REAM Editor if the development goes well.

## Planned

- A project and package manager for REAM, inspired by [python-poetry](https://python-poetry.org) and [Cargo](https://doc.rust-lang.org/cargo/).


## Not maintained
- [ream-python](https://github.com/chmlee/ream-python):
a REAM parser and emitter written in Python and [lark](https://github.com/lark-parser/lark).
It is still available on [Pypi](https://pypi.org/project/ream/) if anyone is interested.
