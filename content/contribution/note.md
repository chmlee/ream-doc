+++
title = "Note"
weight = 2
+++

This documentation is for REAM v0.3 and above,  but I haven't upgraded the embedded editor with the new implementation.
The editor in the site is currently running reamparser.js, the implementation for REAM v0.2.
The most reliable way to test the examples is through the [standalone editor](https://chmlee.github.io/ream-editor).

---

There are three major versions of REAM and three corresponding implementations:

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
[editor-yew](https://chmlee.github.io/ream-editor),
[editor-wasm](https://chmlee.github.io/ream-wasm)<sup>[2]</sup>


[1]: I broke some node dependencies, again, and the site is currently not working. Sad :(

[2]: Both editor 1 and 2 use ream-core for parsing and rely on [WebAssembly (WASM)](https://webassembly.org/), but they are used differently.

Editor-yew is written entirely in Rust with [Yew](https://yew.rs) as the front-end, and the entire editor is compiled to WASM.
The ream-core it used is pulled directly from my GitHub `master` branch and added as a project dependency.

The front-end for editor-wasm is implemented in vanilla JavaScript, and the parser embedded in it is a local `dev` branch of ream-core compiled to WASM.
This editor is mostly for development use since it is much faster to compile just ream-core and not the entire editor.
New functionalities will be tested in editor-wasm before adding to editor-yew.
