+++
title = "Variable"
weight = 2

[extra]
level = 3
+++

`<variable>` assigns a `<value>` to a `<key>`, in the form of

```ream
- <key>: <value>
```
Note that a space is required after the dash and colon.

## Key

`<key>` can't be empty.
It may contain any upper and lowercase letters (`A-Za-z`), digits (`0-9`), spaces (`U+0020`), and underscores (`_`), but can't start with a digit.
Key names are case sensitive.

Some examples for valid key names are:
```ream
# Example
- key: value
- KEY: value
- key_1: value
- key_with_underscore: value
- _: value
```

{% editor(id="key") %}
# Example
- key: value
- KEY: value
- key_1: value
- key_with_underscore: value
- _: value
{% end %}

{% box(class="tip") %}
Don't worry about what `# Example` is.
For now just see this as the title for your REAM file, and all REAM files starts with a title.
We'll discuss what it is in detail in [Entry](/tutorial/entry) section.
{% end %}

Key name can't be empty:
```ream
# BadExample
- : value
```

{% editor(id="key-cant-be-empty") %}
# BadExample
- : value
{% end %}

Key name can't start with a digit:
```ream
# BadExample
- 1key: value
```

{% editor(id="key-cant-start-with-a-digit") %}
# BadExample
- 1key: value
{% end %}

{% box(class="note") %}
This rule is not yet enforced.
{% end %}

{% box(class="detail" id="utf")%}
Key names should support UTF-8, but [ream-core](https://github.com/chmlee/ream-core) does not support UTF-8 identifiers yet.
It is recommended that you use only ASCII for now.
{% end %}

## Value

### String

```ream
# Example
- string: value
- long_string: Hello World
- quoted_string: "quote"
```

{% editor(id="string") %}
# Example
- string: value
- long_string: Hello World
- quoted_string: "quote"
{% end %}

There is not need to quote strings.
Quotation marks will be preserved.

Values can't contain line breaks.
The following will raise an error:
```ream
# BadExample
- key_1: first line
         second line
- key_2: value
```

{% editor(id="string-with-linebreak") %}
# BadExample
- key_1: first line
         second line
- key_2: value
{% end %}

Note that REAM stores strings as raw literals, so the following example is valid. `\n` will not be escaped, and is equivalent to `\\n` in JSON.
```ream
# Example
- key_1: first line\nsecond line
- key_2: value
```

{% editor(id="string-is-raw") %}
# Example
- key_1: first line\nsecond line
- key_2: value
{% end %}


### Number

Example:
```ream
# Example
- number_1: 1
- number_2: -2
- number_3: 3.1415926
```

{% editor(id="number") %}
# Example
- number_1: 1
- number_2: -2
- number_3: 3.1415926
{% end %}

{% box(class="detail" id="number-type")%}
REAM should probably distinguish between `Integer` and `Float`.
In ream-core `Number`s are validated through parsing as Rust's `f64` type, but this may change in the future.

I might also introduce `Fraction` type.
{% end %}

### Boolean

Boolean values are `TRUE` and `FALSE`, both uppercase.

Example:

```ream
# Example
- bool_1: TRUE
- bool_2: FALSE
- not_bool_1: true
- not_bool_2: False
```
Note that boolean values must be exact matches.
Values that doesn't match the pattern are stored as strings.

{% editor(id="boolean") %}
# Example
- bool_1: TRUE
- bool_2: FALSE
- not_bool_1: true
- not_bool_2: False
{% end %}

### Missing Value*

See DETAIL.

{% box(class="detail" id="missing-value")%}
How should REAM represent missing value?

One solution is to simply add a `None` type.

Another solution is converting all REAM types into [options](https://en.wikipedia.org/wiki/Option_type).
In Rust I would have to do something like `type ReamString = Option<String>`.
That being said, all missing values require explicit type annotations since `None` is not a value type but a variant of an enumeration.

The benefit of such design is more obvious when references and filters are implemented.
When referencing existing data for manipulation, users should think about how to deal with potential `None` values since referencing a `Boolean` returns `Boolean::Some(TRUE)`, `Boolean::Some(FALSE)`, or `Boolean::None`.
The filters should then provide methods similar to [`?`](https://doc.rust-lang.org/reference/expressions/operator-expr.html#the-question-mark-operator) and [`unwrap`](https://doc.rust-lang.org/std/option/enum.Option.html#method.unwrap).
{% end %}
