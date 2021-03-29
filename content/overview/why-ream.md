+++
title = "Why REAM"
weight = 1

[extra]
level = 2
+++

REAM is a data serialization standard designed for social science datasets.
The language encourages inline documentation for individual data points, and compiles to both analysis-ready **datasets** (CSV, JSON, etc.) and human-readable **documentations** (HTML, PDF, etc.)
It also introduces unique features to make managing large data projects easier by [reducing repetition](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).
The language, along with the [toolchain](#) built around it, aims to make it easy to create, maintain, distribute and reuse social science datasets.

**Current Design:**
{% mermaid() %}
graph LR;
  SOURCE[REAM File] --> PARSER([REAM Parser]);
  PARSER --> DATA[(Datasets<br>CSV, JSON, etc.)]

  SOURCE --> CONVERTER([Third-party<br>Markdown Converter])
  CONVERTER --> DOC[[Documentation<br>HTML, PDF, etc.]]
{% end %}


**Future Design:**
{% mermaid() %}
graph LR;
  SOURCE[REAM File] --> COMPILER([REAM Compiler]);
  COMPILER --> DATA[(Datasets<br>CSV, JSON, etc.)]
  COMPILER --> DOC[[Documentations<br>HTML, PDF, etc.]]
{% end %}

## Easy to learn and use

REAM syntax is similar to Markdown, and should be easy to learn if not already familiar:

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

It takes around 15 minutes to [learn the basics](#) of the language to start writing your first REAM dataset.
Learn more advanced features later as your project scales up.

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

Instead of saving the same country name `Belgium` in three separate rows, there is now [single source of truth](https://en.wikipedia.org/wiki/Single_source_of_truth) for the variable.

## Inline documentation

REAM encourages inline documentation for individual data points through [annotations](#).
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

## Static typing*

REAM checks for data types during compile time to ensure type safety.
Instead of guessing what the types each variable would be assigned to when being read:
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

The goal is to embed the compiler into Python and R modules so you read REAM files directly as `panda.dataframe` and `tidyverse::tibble`, without ever touching CSV or JSON.

## Reference and script*

REAM implement a reference system to reuse existing data, and a python-like scripting language for basic data manipulation.
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

Variable `Year$unique_id` is now formatted by concatenating a local variable `Year$name` and the parent variable `Country$name`, separated by an underscore.

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

@@ FOR $year IN Country$years
## Year
- name (fmt): $year
- unique_id (fmt): {Country$name}_{$year}
```

{% editor(id="template")%}
# Country
- name (str): Belgium
- years (str+):
  * 2010
  * 2011
  * 2012

@@ FOR $year IN Country$years
## Year
- name (fmt): $year
- unique_id (fmt): {Country$name}_{$year}
{% end %}

(*: not implemented yet; design not yet final)

## Interoperatability*

One of the main motivation behind REAM is to make reusing datasets easy.
Say you have data on Belgium, Netherlands and Luxemborg, and want to zip all three into one master dataset then find the sum of population.

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

(Country/Luxemborg.ream)
```ream
# Country
- name (str): Luxembourg
- population (num): $619900$
```

Instead of manually copying and pasting the data, you import them into a new REAM file and bind them with templates:

(TheBeneluxUnion.ream)
```ream
# TheBeneluxUnion
- members (mod+):
  * ./Country/Belgium.ream
  * ./Country/Netherlands.ream
  * ./Country/Luxembourg.ream
- population (fn: num): Country$population.sum()

@@ FOR Member IN TheBeneluxUnion$members
## Country
- name (ref): Member$name
- population (fn: num): Member$population.to_num()
```

{% editor(id="interoperatability")%}
# TheBeneluxUnion
- members (mod+):
  * Belgium
  * Netherlands
  * Luxembourg
- population (fn: num): Country$population.sum()

@@ FOR Member IN TheBeneluxUnion$members
## Country
- name (ref): Member$name
- population (fn: num): Member$population.to_num()
{% end %}

(*: not implemented yet; design not yet final)
