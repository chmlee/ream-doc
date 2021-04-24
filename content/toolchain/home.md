+++
title = "Toolchain"
template = "page-sidebar.html"
weight = 3
+++

The following tools are developed around REAM.
The goal is to provide a user-friendly workflow to create, edit, distribute and reuse REAM files.

## Alpha

- [reamparser.js](https://github.com/chmlee/reamparser.js):
REAM parser written in JavaScript.
This is the default parser for REAM Editor, but will be replaced by ream-core.

- [ream-core](https://github.com/chmlee/ream-core):
REAM compiler written in Rust.
Planned functionalities include encoder, decoder, linter, and documentation generator.
The goal is to replace reamparser.js as the default compiler embedded in REAM Editor.

- [REAM Editor](https://chmlee.github.io/ream-editor):
a web-based editor for REAM.

- [REAM Editor Lite](https://github.com/chmlee/ream-editor-lite):
a lite version of REAM Editor as a Vue component embedded in the [old documentation](https://chmlee.github.io/ream-doc).

- [prism-ream](https://github.com/chmlee/prism):
a fork of syntax highlighting library [PrismJS](https://github.com/PrismJS/prism) with REAM support added.
Pull requests may be submitted once the language is stable.

- [ream.vim](https://github.com/chmlee/ream.vim):
syntax highlighting for REAM in Vim.

## Planned

- [Cargo-inspired](https://doc.rust-lang.org/cargo/) package manager for REAM with ream-core embedded in it.

## Not maintained
- [ream-python](https://github.com/chmlee/ream-python):
a REAM parser and emitter written in Python and [lark](https://github.com/lark-parser/lark).
It is still available on [PyPI](https://pypi.org/project/ream/) if anyone is interested.
