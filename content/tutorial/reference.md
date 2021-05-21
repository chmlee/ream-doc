+++
title = "Reference"
weight = 7

[extra]
level = 3
+++

{% box(class="note") %}
Requires `ream-core` v0.4.0 or above.

References are not well documented and are quite buggy.
At this point you can only reference upstream variables.
Type validations are inconsistent and sometimes ignored.
Writing references in the [web-editor](https://chmlee.github.io/ream-editor) may cause the page to freeze.
{% end %}

Example:

```ream
# Country
- name: USA

## State
- name: Illinois
- country_name: USA
```
is equivalent to:

```ream
# Country
- name: USA

## State
- name: Illinois
- country_name (ref str): Country$name
```

Variable `country_name` in entry `State` is a reference to variable `name` in entry `Country`.

References are APIs that make templating and data filtering possible in the future.
In production you probably wouldn't use `ref` type directly.
