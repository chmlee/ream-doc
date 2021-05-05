+++
title = "Entry"
weight = 5
+++

An entry is a collection of variables.
An entry class is proceeded by one or multiple pound signs `#`, in the form of:

```ream
# <entry class>
- <key 1>: <value 1>
- <key 2>: <value 2>
...
- <key n>: <value n>
```
`# Example` in previous examples are the classes of Level-1 Entries, as denoted by the single leading pound sign.
All REAM files start with a Level-1 Entry, and contain exactly one Level-1 Entry.

Entries are useful when describing an object with multiple attributes:

```ream
# Country
- name: Belgium
- capital: Brussels
- population: 11433256
- euro zone: TRUE
```

{% editor(id="entry")%}
# Country
- name: Belgium
- capital: Brussels
- population: 11433256
- euro zone: TRUE
{% end %}

Here we define an object of `Country` class, whose name is `Belgium`, capital is `Brussels`, population is `11433256`, and is part of the `euro zone`.

Let's add some annotations.
```ream
# Country
- name: Belgium
  > short for the Kingdom of Belgium
- capital: Brussels
- population: 11433256
  > data from 2019; retrieved from World Bank
- euro zone: TRUE
  > joined in 1999
```

{% editor(id="entry-with-annotation") %}
# Country
- name: Belgium
  > short for the Kingdom of Belgium
- capital: Brussels
- population: 11433256
  > data from 2019; retrieved from World Bank
- euro zone: TRUE
  > joined in 1999
{% end %}

Entries can have zero variables:
```ream
# Country
```

{% editor(id="entry-with-no-variable")%}
# Country
{% end %}

Entries should have local unique keys.
The following code will raise an error:
```ream
# Country
- name: Belgium
- language: Dutch
- language: French
- language: German
```

{% editor(id="entry-duplicate-keys") %}
# Country
- name: Belgium
- language: Dutch
- language: French
- language: German
{% end %}

{% box(class="note") %}
The current parser don't check for duplicate keys yet, so technically this is still valid.
This rule will be enforced in future versions.
{% end %}

## Subentry

Entries can be nested, and the level of the entry is denoted by the number of leading `#`.
So a Level-1 Entry takes the form of `# <Level 1 Entry Class>`, and a Level-2 Entry takes the form of `## <Level 2 Entry Class>`, and so forth.

Examples:
```ream
# Country
- name: Belgium

## Language
- name: Dutch

## Language
- name: French

## Language
- name: German
```

{% editor(id="subentry") %}
# Country
- name: Belgium

## Language
- name: Dutch

## Language
- name: French

## Language
- name: German
{% end %}

The `# Country` entry has one variable `name` and three Level-2 child entries `## Language`.

The three `## Language`  subentries are **terminal nodes** as they do not contain any subentry.
When compiling the dataset, the parser look for all terminal nodes in the REAM file and flatten the data structure.
Thus the previous example produces a dataset with three rows (one for each terminal node) and two columns (one of each variable).

Note that the variable keys are scoped, so `## Language` is allowed to have a variable with the key `name` despite its parent entry `# Country` also contain a variable with the same key.

Entry must be nested in order.
Level-2 Entries can only be nested in a Level-1 Entry, and Level-3 Entries can only be nested in a Level-2 Entry, and so forth.
Compare the datasets compiled from the following two examples with the previous one:
```ream
# Country
- name: Belgium

## Language
- name: Dutch
  > This is in a Level 2 Entry

### Language
- name: French
  > This is in a Level 3 Entry

### Language
- name: German
  > This is in a Level 3 Entry
```

{% editor(id="subentry-2") %}
# Country
- name: Belgium

## Language
- name: Dutch
  > This is in a Level 2 Entry

### Language
- name: French
  > This is in a Level 3 Entry

### Language
- name: German
  > This is in a Level 3 Entry
{% end %}

```ream
# Country
- name: Belgium

## Language
- name: Dutch
  > This is in a Level 2 Entry

## Language
- name: French
  > This is in a Level 2 Entry

### Language
  > This is in a Level 3 Entry
- name: German
```

{% editor(id="subentry-3")%}
# Country
- name: Belgium

## Language
- name: Dutch
  > This is in a Level 2 Entry

## Language
- name: French
  > This is in a Level 2 Entry

### Language
  > This is in a Level 3 Entry
- name: German
{% end %}


A visualization of the differences between the three schemas are as follows.
The terminal nodes are colored yellow.

![tree](/img/tree.svg)


<!--
:::details Note: Duplicate Entry Class
Can a `### Language` entry be nested in another `## Language` entry?
This doesn't really make sense, but currently there is no rule against it, and the parser is able to parse it.

Maybe this shouldn't be allowed?
:::
-->

An entry can contain subentires of differenct classes:

```ream
# Country
- name: Belgium

## City
- name: Brussels

## Language
- name: Dutch
```

{% editor(id="subentry-different-class") %}
# Country
- name: Belgium

## City
- name: Brussels

## Language
- name: Dutch
{% end %}

Also, entries of the same class need not have identical variables, nor the same variable order.
```ream
# Country
- name: Belgium

## Language
- name: Dutch
- size: 0.59

## Language
- size: 0.4
- name: French

## Language
- name: German
```

{% editor(id="subentry-different-schema")%}
# Country
- name: Belgium

## Language
- name: Dutch
- size: 0.59

## Language
- size: 0.4
- name: French

## Language
- name: German
{% end %}

Observe that the order of the variables are preserved by default.

The datasets compiled by the last two examples are not too useful for analysis.
To compile quality analysis-ready datasets, we should specify the schema of the datasets in the codebook.
