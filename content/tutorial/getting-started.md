+++
title = "Getting Started"
weight = 1
+++
{% box(class="note") %}
The tutorial is a work in progress.
It provides too much information to be a tutorial, and too little to be a reference.

For first time readers, simply ignore all **DETAIL** (they look like this **NOTE**, but grey) as they contain additional information on language design, unsolved problems and known bugs.
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
- population: 11433256
- euro zone: TRUE
{% end %}

You can also edit REAM files with any text editor, and use the standalone compiler to compile the datasets.
See [ream-core](https://github.com/chmlee/ream-core) for installation guide.
