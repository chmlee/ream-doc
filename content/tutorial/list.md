+++
title = "List"
weight = 3
+++

A list is a sequence of strings, numbers, or boolean, in the form of:

```ream
- <key>:
  * <item>
  * <item>
  ...
  * <item>
```
`<item>` should be in separate lines, following an asterisk (`*`)

Example:
```ream
# Example
- list_of_strings:
  * item 1
  * item 2
  * item 3
- list_of_numbers:
  * 1
  * -2
  * 3.1415926
- list_of_booleans:
  * TRUE
  * FALSE
```

{% editor(id="list") %}
# Example
- list_of_strings:
  * item 1
  * item 2
  * item 3
- list_of_numbers:
  * 1
  * -2
  * 3.1415926
- list_of_booleans:
  * TRUE
  * FALSE
{% end %}

{% box(class="tip") %}
By default, items in lists would be joined as strings with semicolons as separators
{% end %}

A list can't contain elements of different types.
The following will raise an error.

```ream
# BadExample
- list:
  * 1
  * item
  * TRUE
```

{% editor(id="heterogeneous-list") %}
# BadExample
- list:
  * 1
  * item
  * TRUE
{% end %}

(*: Example *should not* work. See [Note](/contribution/note) for more information, or try it in the [web-editor](https://chmlee.github.io/ream-editor))

REAM is indentation insensitive.
Spaces before asterisks are not required, but two spaces are recommended.

```ream
# Example
- still_a_list:
* item 1
* item 2
* item 3
```

{% editor(id="list-no-indentation") %}
# Example
- still_a_list:
* item 1
* item 2
* item
{% end %}

Empty lines between list items are allowed, but discouraged:
```ream
# Example
- still_a_list:
  * item 1

  * item 2
  * item 3
```

{% editor(id="list-emtpy-line") %}
# Example
- still_a_list:
  * item 1

  * item 2
  * item 3
{% end %}

{% box(class="detail" id="nest-list")%}
Should lists be nested?

The only reason why I thought of this is because I'm exploring ways to represent [GeoJson](https://geojson.org/) in REAM, but I couldn't found one nice way to do so.

```json
{
    "type": "MultiLineString",
    "coordinates":
    [
        [
            [170.0, 45.0], [180.0, 45.0]
        ],
        [
            [-180.0, 45.0], [-170.0, 45.0]
        ]
    ]
}
```
{%end%}
