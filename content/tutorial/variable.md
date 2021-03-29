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
- key with spaces: value
- key_with_underscore: value
- _: value
```

{% editor(id="key")%}
# Example
- key: value
- KEY: value
- key_1: value
- key with spaces: value
- key_with_underscore: value
{% end %}

{% box(class="tip") %}
Don't worry about what `# Example` is.
For now just see this as the title for your REAM file, and all REAM files starts with a title.
We'll discuss what it is in detail in [Entry](entry) section.
{% end %}

Key name can't be empty:
```ream
# BadExample
- : value
```

{% editor(id="key-empty")%}
# BadExample
- : value
{% end %}

Key name can't start with a digit:
```ream
# BadExample
- 1: value
- 1key: value
```
{% editor(id="key-digit")%}
# BadExample
- 1: value
- 1key: value
{% end %}

{% box(class="note")%}
The current parser doesn't check for identifer names yet.
{% end %}



<!--
::: details Note: UTF-8 support
Key names should support UTF-8.
The [current parser](https://github.com/chmlee/reamparser.js) *should* be able to parse UTF-8 identifiers correctly, but this hasn't been tested extensively.
It is recommended that you use only ASCII code before UTF-8 support is stable.

[The experimental parser](https://github.com/chmlee/ream-core) does NOT support UTF-8 yet.

:::
::: details Note: Whitespace in identifiers

The [current parser](https://github.com/chmlee/reamparser.js) allows whitespaces in identifiers, but future versions may remove such support.
I plan to implement [reference](/ream-doc/Language/Advanced/Reference), and identifiers with spaces just don't look good in the current design.

```ream
# Entry
- key_1 (str): value

## SubEntry
- key_2 (fn -> str): `THIS::SUPER$key_1`
```

vs

(R style)
```ream
# Entry
- key 1 (str): value

## SubEntry
- key 2 (fn -> str): `THIS::SUPER$"key 1"`
```

or

(Python/Pandas style)
```ream
# Entry
- key 1 (str): value

## SubEntry
- key 2 (fn -> str): `THIS::SUPER["key 1"]`
```


:::
-->

## Value

`<value>` can be any of the following primitive types:

- [String](#string)
- [Number](#number)
- [Boolean](#boolean)

Value can't be empty.

### String

Example:
```ream
# Example
- string: value
- long string: Hello World
- quoted string: "quote"
```

{% editor(id="string")%}
# Example
- string: value
- long string: Hello World
- quoted string: "quote"
{% end %}


There is not need to quote strings.
Quotation marks will be preserved.

Values can't contain line breaks.
The following will raise an error:
```ream
# BadExample
- key 1: first line
         second line
- key 2: value
```

{% editor(id="string-line-break")%}
# BadExample
- key 1: first line
         second line
- key 2: value
{% end %}

{% box(class="note")%}
The [current parser](https://github.com/chmlee/reamparser.js) is able to parse the example.
It will read everything before and including `- key 1: first line`, then stop parsing and return whatever has been parsed, ignoring the rest of the file.

Ideally the parser should panic, and an error with meaningful messages should be raised.
Error handling will be improved in future versions.
{% end %}

REAM stores strings as raw literal strings, hence the following example is valid. `\n` will not be escaped, and is equivalent to `\\n` in JSON.
```ream
# Example
- key 1: first line\nsecond line
- key 2: value
```

{% editor(id="string-no-escpae")%}
# Example
- key 1: first line\nsecond line
- key 2: value
{% end %}


### Number

Numbers are wrapped by dollar signs (`$`).

Example:
```ream
# Example
- number 1: $1$
- number 2: $-2$
- number 3: $3.1415926$
```

{% editor(id="number") %}
# Example
- number 1: $1$
- number 2: $-2$
- number 3: $3.1415926$
{% end %}

<!--
::: details Note: Potential Breaking Change for Syntax
I'm considering removing the `$` requirement for numbers, and have a more YAML-like syntax for number.
:::
-->

If a leading or trailing character exist, the entire value would be interpreted as a string.

Example:
```ream
# Example
- number: $1$
- not number 1: a$1$
- not number 2: $1$b
```

{% editor(id="number-error")%}
# Example
- number: $1$
- not number 1: a$1$
- not number 2: $1$b
{% end %}

<!--
::: details Note: No Floats or Integers

Should REAM add integers and floats as primitive types?

Most programming languages and data serialization standards have clear specifications for primitive number types, such as [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) .

REAM's `Number` type doesn't really have one right now, and all `Number` values are stored as strings.
You can verify this by visiting the [online editor](https://chmlee.github.io/ream-editor/) and select `tree` as the output format.

In fact the current parser considers all values wrapper by `$` as `Number`.
So
```ream
# Example
- number: $1$
- not a number: $abc$
```
generates
```csv
1,abc
```
instead of
```csv
1,$abc$
```
even though `abc` is not a valid number.

I might adopt [ECMA's specification](https://www.ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf), or part of it (do social scientists normally store data with scientific notation?):

> A number is a sequence of decimal digits with no superfluous leading zero.
> It may have a preceding minus sign (U+002D).
> It may have a fractional part prefixed by a decimal point (U+002E).
> It may have an exponent, prefixed by `e`(U+0065) or `E`(U+0045) and optionally `+`(U+002B) or `-`(U+002D).
> The digits are the code points U+0030 through U+0039. Numeric values that cannot be represented as sequences of digits (such as `Infinity `and `NaN`) are not permitted.

Another reason against the use of an explicit `float` type in REAM is to avoid the pitfalls of floating-point accuracy.
Since REAM is designed to store social science data, and will eventually be compiled to an analysis-ready format and imported into another programme for further data analysis, lose of accuracy is bound to happen somewhere.[1]
What we can do is reduce the number of type conversion.
The plan is to have numbers saved as strings when compiling JSON and CSV, and let individual JSON and CSV parsers deal with the conversion.

```
           (no type conversion)       (conversion happens here)
               REAM parser          CSV/JSON Reader in Language X
Number("3.14")  "3.14"    3.14
   REAM                    CSV/JSON                               Language X
```
For example, in Python, `pandas.read_csv()` converts applicable strings to `int64` and `float64` by default, and allow users to specify types through `dtype` argument.
In R, `readr::read_csv` also converts applicable strings to `double` by default, and can be overrode by specifying the `col_types` argument.

Just rely on these scientific packages for type conversion.
This is what they are designed to do, so I assume they are better at handling such problem.

[1]: for example, try reading the following JSON file in Python and R and compare the result:
```json
{"number": 0.19999999999999999}
```
```python
import json

with open("./test.json", "r") as f:
    dat = json.load(f)

print(dat["number"]) # 0.19999999999999998
```
```r
library(rjson)
dat <- fromJSON(file = "./test.json")
dat["number"]

# $number
# [1] 0.2
```


Unless...

With projects like [PyO3](https://github.com/PyO3/PyO3) and [extendr](https://github.com/extendr/extendr), it might be possible to wrap the parser into a Python/R module and interact with `pandas` and `tibble` directly.
Instead of:
```
          REAM parser     pandas.read_csv()
REAM file  CSV  Pandas.dataframe
```
we may be able to do:
```
          ream.read_ream()
REAM file  Pandas.dataframe
```
by
```python
import pandas as pd
import ream

with open("data.ream", "r") as f:
    df = ream.load(f)

print(type(df)) # <class 'pandas.core.frame.DataFrame'>
```

Wouldn't this be wonderful?

If so, REAM probably need explicit float and integer types to make interacting with Pandas and Tibbles types surprise-free.
See [typed variable](/ream-doc/Language/Advanced/Typed-Variable) for more information.
:::
-->

### Boolean

Boolean values are `` `TRUE` `` and `` `FALSE` ``, both uppercase and surrounded by backticks (`` ` ``).

Example:

```ream
# Example
- bool 1: `TRUE`
- bool 2: `FALSE`
- not bool 1: `true`
- not bool 2: FALSE
```
Note that boolean values must be exact matches.
Values not wrapped by backticks or not uppercased will be stored as strings.

{% editor(id="bool")%}
# Example
- bool 1: `TRUE`
- bool 2: `FALSE`
- not bool 1: `true`
- not bool 2: FALSE
{% end %}