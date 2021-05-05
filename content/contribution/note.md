+++
title = "Note"
weight = 2
+++

**This documentation is for REAM v0.3,  but I haven't upgraded the embedded editor with the new implementation.
It is currently running reamparser.js, the implementation for REAM v0.2
The most reliable way to test the examples is through the [standalone editor](https://chmlee.github.io/ream-editor).**

There are three versions of REAM and three corresponding implementations:

- REAM v0.1:
[specs](https://github.com/chmlee/ream-lang),
[ream-python](https://github.com/chmlee/ream-python),
[PyPI](https://pypi.org/project/ream/)

- REAM v0.2:
[specs](https://chmlee.github.io/ream-doc-v2),
[reamparser.js](https://github.com/chmlee/reamparser.js),
[editor](https://chmlee.github.io/ream-editor-vue)<sup>[1]</sup>

- REAM v0.3:
[specs](/)(this site),
[ream-core](https://github.com/chmlee/ream-core),
[crates.io](https://crates.io/crates/ream),
[editor 1](https://chmlee.github.io/ream-editor)<sup>[2]</sup>,
[editor 2](https://chmlee.github.io/ream-wasm)<sup>[3]</sup>


[1]: I broke some node dependencies, again, and the site is currently not working.

[2]: Seems to work best on Firefox.

[3]: Both editor 1 and 2 use ream-core for parsing and rely on [WebAssembly (WASM)](https://webassembly.org/), but they are used differently.

Editor 1 is written entirely in Rust with [Yew](https://yew.rs) as the front-end, and the entire editor is compiled to WASM.
The ream-core it used is pulled directly from my GitHub page and added as a project dependency.

Editor 2 front-end is implemented in vanilla JavaScript, and the parser embedded in it is a local development branch of ream-core compiled to WASM.
This editor is mostly for development use since it is much faster to compile just ream-core.

Also I am seeing some compatible issues with Editor 1 on Chrome (AST output is not visible) so Editor 2 is made public as a backup.
If the issues are not resolved I may have to try another framework.
