+++
title = "Getting Started"
weight = 1
+++
{% box(class="note") %}
The tutorial is a work in progress.
It provides too much information to be a tutorial, and too little to be a reference.
Future work for the tutorial as well as the documentation as a whole should focus on reorganizing the content according to [Divio documentation system](https://documentation.divio.com/).

For first time readers, simply ignore all **DETAIL** (they look like this **NOTE**, but are colored grey).
If you wish to contribute, **DETAIL** provide some insights for future changes.
In the future all **DETAIL** would either be moved to [Language Design](/overview/language-design/) or [Contribution](/contribution).
{% end %}

The recommended way to edit REAM files it to use [REAM Editor](https://chmlee.github.io/ream-editor), a web-based editor designed to read and write REAM files.
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
