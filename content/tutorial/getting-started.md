+++
title = "Getting Started"
weight = 1
+++
{% box(class="note") %}
The tutorial is a work in progress.
It provides too much information to be a tutorial, and too little to be a reference.
Future work for the tutorial as well as the documentation should focus on reorganizing the content according to [Divio documentation system](https://documentation.divio.com/).

For first time readers, simply ignore all **DETAIL** (like the one at the bottom of the page) as they contain additional information on language design, unsolved problems and known bugs.
If you wish to contribute, **DETAIL** is a good place to start.
In the future all **DETAIL** would be moved to either [Language Design](/overview/language-design/) or [Contribution](/contribution).
{% end %}

The recommended way to edit REAM files is to use [REAM Editor](https://chmlee.github.io/ream-editor), a web-based editor designed to read and write REAM files.
It runs entirely in the browser and requires no local installation.
A lite version of REAM Editor is embedded in this documentation for readers to test the examples.

{% editor(id="getting-started")%}
# Country
- name: Belgium
- capital: Brussels
- population: $11433256$
- euro zone: `TRUE`
{% end %}

You can also edit REAM files with any text editor, and use the standalone compiler to compile the datasets.
See [reamparser.js](https://github.com/chmlee/reamparser.js) and [ream-core](https://github.com/chmlee/ream-core) for more information.


{% box(class="detail" id="two-implementation")%}
There are currently two implementations for REAM, [reamparser.js](https://github.com/chmlee/reamparser.js) and [ream-core](https://github.com/chmlee/ream-core)

reamparser.js is the default parser and implements all features mentioned in the tutorial unless stated otherwise.
It is also the parser currently used in this documentation and [REAM Editor](https://chmlee.github.io/ream-editor).

ream-core is a rewrite of reamparser.js in Rust, and is expected to replace reamparser.js in the future.
It features a slightly different syntax you see in this documentation: no wrapping numbers with `$` and no wrapping boolean values with `` ` ``.
It is missing some features, such as [list](/tutorial/list) and [annotation](/tutorial/annotation), but implement a [type system](/overview/why-ream/#static-typing).

ream-core is also compiled to [WebAssembly](https://github.com/chmlee/ream-wasm), and can be run in a browser.
Try it online [here](https://chmlee.github.io/ream-wasm).
{% end %}
