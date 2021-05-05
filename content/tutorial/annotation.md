+++
title = "Annotation"
weight = 4
+++

Annotations follow
[strings](/tutorial/variable#string),
[numbers](/tutorial/variable#number),
and
[booleans](/tutorial/variable#boolean)
in variables in the form of
```ream
- <key>: <value>
  > <annotation>
```
and items in [lists](/tutorial/list) in the form of

```ream
- <key>:
  * <item>
    > <annotation>
```

They start with a single greater sign (`>`), and a space is required before `>` and the content.

Recall that REAM is indentation-insensitive.
The indentation before `>` is optional, but the convention is to align `>` with the first character of the key_(for non-list values) or value (for list items).

Examples:

```ream
# Example
- key_1: value
  > Annotation for string
- key_2: 1
  > Annotation for number
- key_3: TRUE
  > Annotation for boolean
```

{% editor(id="entry") %}
# Example
- key_1: value
  > Annotation for string
- key_2: 1
  > Annotation for number
- key_3: TRUE
  > Annotation for boolean
{% end %}

```ream
# Example
- list:
  * value
    > Annotation for string
  * 1
    > Annotation for number
  * TRUE
    > Annotation for boolean
```

{% editor(id="annotation-list") %}
# Example
- list:
  * value
    > Annotation for string
  * 1
    > Annotation for number
  * TRUE
    > Annotation for boolean
{% end %}

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

{% editor(id="annotation-mistake")%}
> Annotation can't be placed here...
# BadExample
> ...or here
- key: value
{% end %}

Empty lines around annotations are allowed, but discouraged.

```ream
# Example
- key_1: value 1
- key_2: value 2
  > Annotation
- key_3: value 3

  > Valid annotation

- key_4: value 4
```

{% editor(id="annotation-empty-line")%}
# Example
- key_1: value 1
- key_2: value 2
  > Annotation
- key_3: value 3

  > Valid annotation

- key_4: value 4
{% end %}
