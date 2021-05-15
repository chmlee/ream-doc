+++
title = "Type System"
weight = 6
+++

{% box(class="note") %}
Examples with types are not supported by the embedded editor.
Use the [web editor](https://chmlee.github.io/ream-editor) to test the examples instead.

See [Note](/contribution/note) for more information.
{% end %}

REAM is statically typed, that is, the compiler check for and catch type errors when compiling your dataset.

Type annotations are added after the key and wrapped by parentheses:
```ream
f - <key> (<type>): <value>
```

Values can be one of the three primitive types:
- `str`: [String](/tutorial/variable#string)
- `num`: [Number](/tutorial/variable#number)
- `bool`: [Boolean](/tutorial/variable#boolean)

or the following composition type:
- `list <T>`: [List](/tutorial/list) of `<T>` where `<T>` is a primitive type.

Example:
```ream
# Example
- key_1 (str): value
- key_2 (num): 3.14159
- key_3 (bool): FALSE
- list_1 (list str):
  * item 1
  * item 2
  * item 3
- key_2 (list num):
  * 1
  * -2
  * 3.14159
- key_3 (list bool):
  * TRUE
  * FALSE
  * TRUE
```

If no type annotation is provided, the compiler will guess the type of the value.
So the following two entries generates identical abstract syntax trees:
```ream
# Example
- key_1 (str): value
- key_2 (num): 3.14159
- key_3 (bool): FALSE
```

```ream
# Example
- key_1: value
- key_2: 3.14159
- key_3: FALSE
```

For untyped lists, the type of the first element would be used.
The following two lists generate identical abstract syntax trees:
```ream
# Example
- key:
  * 1
  * -2
  * 3.14159
```

```ream
# Example
- key (list num):
  * 1
  * -2
  * 3.14159
```

But the following would produce a different one:
```ream
# Example
- key (list str):
  * 1
  * -2
  * 3.14159
```

And the following would raise `TypeError(HeterogeneousList)`:
```ream
# Example
- key:
  * 1
  * item
  * 3.14159
```




Type annotations can be used to convert values types.
Add type annotation `str` to store `3.14159` and `FALSE` as strings.
```ream
# Example
- key_1: 3.14159
- key_2 (str): 3.14159
- key_3: FALSE
- key_4 (str): FALSE
```

Type annotations can help catch type errors:
```ream
# BadExample
- key_1 (num): 10O0.1
- key_2 (bool): False
```

Without type annotations, both `10O0.1` and `False` are passed as strings.
