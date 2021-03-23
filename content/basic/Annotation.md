+++
title = "Annotation"
order = 3
+++
# Annotation

Annotations follow
[strings](Variable.html#string),
[numbers](Variable.html#number),
and
[booleans](Variable.html#boolean)
in variables in the form of
```ream
- <key>: <value>
  > <annotation>
```
and items in [lists](List.html) in the form of

```ream
- <key>:
  * <item>
    > <annotation>
```

They start with a single greater sign (`>`), and a space is required before `>` and the content.

Recall that REAM is indentation-insensitive.
The indentation before `>` is optional, but the convention is to align `>` with the first character of the key (for non-list values) or value (for list items).

Examples:

```ream
# Example
- key 1: value
  > Annotation for string
- key 2: $1$
  > Annotation for number
- key 3: `TRUE`
  > Annotation for boolean
```
<EditorLite-EditorLite item="annotation1" />

```ream
# Example
- list:
  * value
    > Annotation for string
  * $1$
    > Annotation for number
  * `TRUE`
    > Annotation for boolean
```
<EditorLite-EditorLite item="annotation2" />

Annotations are ignored when compiled to datasets.

However, that is not to say annotations can be placed anywhere in the file.
**Annotations are not comments**: they annotate **values**, and can only follow values.
Placing annotations in any other places will raise errors:

```ream
> Annotation can't be placed here...
# BadExample
> ...or here
- key: value
```

Empty lines around annotations are allowed, but discouraged.

```ream
# Example
- key 1: value 1
- key 2: value 2
  > Annotation
- key 3: value 3

  > Valid annotation

- key 4: value 4
```
<EditorLite-EditorLite item="annotation3" />
