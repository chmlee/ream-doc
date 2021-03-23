+++
title = "List"
order = 2
+++
# List

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
<EditorLite-EditorLite item="list1" />

::: tip
By default, items in lists would be joined as strings with semicolons as separators
:::

Recall that REAM is indentation insensitive.
Spaces before asterisks are not required, but two spaces are recommended.

```ream
# Example
- still a list:
* item 1
* item 2
* item 3
```

<EditorLite-EditorLite item="list2" />

Empty lines between list items are allowed, but discouraged:
```ream
# Example
- still a list:
  * item 1

  * item 2
  * item 3
```
<EditorLite-EditorLite item="list3" />

::: details Note: Array
I'm considering limiting lists to be sequences of items of *the same type*, also known as arrays.
If for any reason you want to save data of different types as tuples, just use [subentries](/ream-doc/Language/Basics/Entry#subentry) as named tuples.
:::

::: details Note: Nested List
Should lists be nested?

The only reason why I thought of this is because I'm exploring ways to represent [GeoJson](https://geojson.org/) in REAM:
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

But I have trouble coming up with a valid syntax.

Say we want to encode the following JSON:
```json
{
    "Example": {
        "list":
        [
          ["item 1.1", "item 1.2"],
          ["item 2.1", "item 2.2"]
        ]
    }
}
```

The initial idea was something like:
```ream
# Example
- list:
  * * item 1.1
    * item 1.2
  * * item 2.1
    * item 2.2
```

But the REAM file can also be interpreted as:
```json
{
    "Example": {
        "list":
        [
          ["item 1.1"],
          "item 1.2",
          ["item 2.1"],
          "item 2.2"
        ]
    }
}
```

Maybe I won't implement nested list.
:::
