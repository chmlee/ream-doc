+++
title = "List"
weight = 3
+++

A list is a sequence of strings, numbers, and/or boolean, in the form of:

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
- list of strings:
  * item 1
  * item 2
  * item 3
- list of numbers:
  * $1$
  * $-2$
  * $3.1415926$
```

{% editor(id="list") %}
# Example
- list of strings:
  * item 1
  * item 2
  * item 3
- list of numbers:
  * $1$
  * $-2$
  * $3.1415926$
{% end %}

{% box(class="tip") %}
By default, items in lists would be joined as strings with semicolons as separators
{% end %}

REAM is indentation insensitive.
Spaces before asterisks are not required, but two spaces are recommended.

```ream
# Example
- still a list:
* item 1
* item 2
* item 3
```

{% editor(id="list-no-indentation") %}
# Example
- still a list:
* item 1
* item 2
* item
{% end %}

Empty lines between list items are allowed, but discouraged:
```ream
# Example
- still a list:
  * item 1

  * item 2
  * item 3
```

{% editor(id="list-emtpy-line") %}
# Example
- still a list:
  * item 1

  * item 2
  * item 3
{% end %}

{% box(class="detail" id="list-as-array")%}
I'm considering limiting lists to be sequences of items of *the same type*, also known as arrays.
If for any reason you want to save data of different types as tuples, just use [subentries](/ream-doc/Language/Basics/Entry#subentry) as named tuples.
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
