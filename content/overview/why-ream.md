+++
title = "Why REAM"
weight = 1

[extra]
level = 2
+++

{% box(class="note") %}
The project is under active development and is not production ready.
You are free to play around with the language and tools, but note that backward compatibility is not guaranteed.

Migrating from [the old documentation](https://chmlee.github.io/ream-doc) is a work in progress; information and features may be missing.
[All contributions are welcome.](/contribution)
{% end %}
<br>

REAM provides a one-stop solution to manage social science data projects.
While there are existing tools that do part of what REAM does, REAM bundle all necessarily tools and functionalities into one framework with consistent syntax.
See [Comparison](/ovewrview/comparison) for detailed discussion.

In addition, REAM adhere to the [single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth) design so that large data projects are easier to manage.
See the rest of the section for examples.

## Ease of use

REAM is easy to learn.
REAM syntax is similar to Markdown, and should look familiar:

```ream
# Country
- name: Belgium
- population: $11433256$
- euro zone: `TRUE`
```

{% editor(id="easy-to-learn-and-use") %}
# Country
- name: Belgium
- population: $11433256$
- euro zone: `TRUE`
{% end %}

It takes around half an hour to [learn the basics](/tutorial) of the language to start writing your first REAM dataset.
Learn more advanced features later as your project scales up.

REAM is easy to edit.
All REAM datasets are stored as text files, and can be edited in any text editor.
A [web-based editor](https://chmlee.github.io/ream-editor) is available to provide basic functionalities.
No local installation required; just visit the website, drag and drop your REAM datasets, and start getting productive.
Advanced functionalities are available through the [REAM CLI tool](https://github.com/chmlee/ream-core).
No complex development environment to set up.
No third-party dependencies to manage*.
Just one executable binary file.

(*: some functionalities may require [Git](https://git-scm.com/))

## Nested structure

REAM encourages data to be stored in nested structures.
Instead of managing data in the following 2-dimension spreadsheet:

```csvv
Country,Year
Belgium,2010
Belgium,2011
Belgium,2012
```
you write:
```ream
# Country
- name: Belgium

## Year
- name: 2010

## Year
- name: 2011

## Year
- name: 2012
```

and let the compiler compiles the latter to the former:

{% editor(id="nested-structure") %}
# Country
- name: Belgium

## Year
- name: 2010

## Year
- name: 2011

## Year
- name: 2012
{% end %}

To update `Belgium` to its ISO code `BEL`, you now have only one cell to update instead of three.

## Inline documentation

REAM encourages inline documentation for individual data points through [annotations](/tutorial/annotation).
Instead of editing data and its documentation in two separate files - one spreadsheet and one word document - you write:

```ream
# Country
- name: Belgium
  > officially the Kingdom of Belgium
- population: $11433256$
  > data from 2019; retrieved from World Bank
- euro zone: `TRUE`
  > joined in 1999
```

{% editor(id="inline-documentation") %}
# Country
- name: Belgium
  > officially the Kingdom of Belgium
- population: $11433256$
  > data from 2019; retrieved from World Bank
- euro zone: `TRUE`
  > joined in 1999
{% end %}

and let the compiler produce analysis-ready datasets (CSV, JSON, etc.) and human-readable documentations (HTML, PDF, etc.)
Two formats, one source.

**Current Design:**
{% mermaid() %}
graph LR;
  SOURCE[REAM File] --> PARSER(["REAM Parser<br>(reamparser.js)"]);
  PARSER --> DATA[(Datasets<br>CSV, JSON, etc.)]

  SOURCE --> CONVERTER([Third-party<br>Markdown Converter])
  CONVERTER --> DOC[[Documentation<br>HTML, PDF, etc.]]
{% end %}

**Working Design:**
{% mermaid() %}
graph LR;
  SOURCE[REAM File] --> COMPILER(["REAM Compiler<br>(ream-core.rs)"]);
  COMPILER --> DATA[(Datasets<br>CSV, JSON, etc.)]
  COMPILER --> DOC[[Documentations<br>HTML, PDF, etc.]]
{% end %}

## Static typing*

REAM checks for data types during compile time to ensure type safety.
Instead of guessing what type each variable would be assigned to when being read:
```csvv
x1,x2,x3,x4
1.0,"1.0",true,"true"
```
you specify the types through explicit type annotations:
```ream
# Data
- x1 (num): $1.0$
- x2 (str): 1.0
- x3 (bool): `TRUE`
- x4 (str): true
```

{% editor(id="static-typing")%}
# Data
- x1 (num): $1.0$
- x2 (str): 1.0
- x3 (bool): `TRUE`
- x4 (str): true
{% end %}

(*: not implemented yet)

The goal is to embed the compiler into Python and R modules through Rust bindings ([PyO3](https://github.com/PyO3/PyO3) and [extendr](https://github.com/extendr/extendr)) so you read REAM datasets directly as `panda.dataframe` and `tidyverse::tibble`, without ever touching CSV or JSON and their limited type system.

Ideally, you should be able to do something like:

```python
import ream
import pandas as pd

with open("data.ream", "r") as f:
    dat = ream.read(f)

type(dat) # pandas.core.frame.DataFrame
```

## Reference and filters*

REAM implement a reference system to reuse existing data, and filters for basic data manipulation.
Instead of manually manipulating variables with similar pattern:

```ream
# Country
- name (str): Belgium

## Year
- name (str): 2010
- unique_id (str): Belgium_2010

## Year
- name (str): 2011
- unique_id (str): Belgium_2011

## Year
- name (str): 2012
- unique_id (str): Belgium_2012
```

you write:
```ream
# Country
- name (str): Belgium

## Year
- name (str): 2010
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2011
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2012
- unique_id (fmt): {Country$name}_{Year$name}
```

{% editor(id="reference") %}
# Country
- name (str): Belgium

## Year
- name (str): 2010
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2011
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2012
- unique_id (fmt): {Country$name}_{Year$name}
{% end %}

(*: not implemted yet)

Variable `Year$unique_id` is now formatted by joining a local variable `Year$name` and the parent variable `Country$name`, separated by an underscore.

## Template*

Templates allow datasets to reuse schemas.
Instead of defining the schema for the entry of class `Year` three times:
```ream
# Country
- name (str): Belgium

## Year
- name (str): 2010
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2011
- unique_id (fmt): {Country$name}_{Year$name}

## Year
- name (str): 2012
- unique_id (fmt): {Country$name}_{Year$name}
```

you write:
```ream
# Country
- name (str): Belgium
- years (str+):
  * 2010
  * 2011
  * 2012

@@ FOR year IN Country$years
## Year
- name (fmt): &year
- unique_id (fmt): {Country$name}_{&year}
```

{% editor(id="template")%}
# Country
- name (str): Belgium
- years (str+):
  * 2010
  * 2011
  * 2012

@@ FOR year IN Country$years
## Year
- name (fmt): &year
- unique_id (fmt): {Country$name}_{&year}
{% end %}

(*: not implemented yet; design not yet final)

Variable `Year$unique_id` is now formatted by joining a local variable `Year$name` and the *template* variable `&country`, which loop through the parent varible `Country$years`.

## Modularity*

One of the main motivations behind REAM is to make reusing datasets easy.
Say you have data on Belgium, Netherlands and Luxembourg, and want to zip all three into one master dataset then find the sum of the population.

(Country/Belgium.ream)
```ream
# Country
- name (str): Belgium
- population (num): $11433256$
```

(Country/Netherlands.ream)
```ream
# Country
- name (str): Netherlands
- population (num): $11433256$
```

(Country/Luxembourg.ream)
```ream
# Country
- name (str): Luxembourg
- population (num): $619900$
```

Instead of manually copying and pasting the data, you import them into a new REAM file and bind them with templates:

(TheBeneluxUnion.ream)
```ream
# TheBeneluxUnion
- population (num): `Country$population.sum()`

@@ IMPORT Country::{Belgium, Netherlands, Luxembourg}
@@ SET Countries = [Belgium, Netherlands, Luxembourg]
@@ FOR Member IN Countries
## Country
- name (ref): Member$name
- population (ref): Member$population
```

{% editor(id="interoperatability")%}
# TheBeneluxUnion
- population (num): `Country$population.sum()`

@@ IMPORT Country::{Belgium, Netherlands, Luxembourg}
@@ SET Countries = [Belgium, Netherlands, Luxembourg]
@@ FOR Member IN Countries
## Country
- name (ref): Member$name
- population (ref): Member$population
{% end %}

(*: not implemented yet; design not yet final)
