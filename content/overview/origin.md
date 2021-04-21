+++
title = "Origin"
weight = 4
+++

REAM was created as a quick solution to manage my undergraduate thesis data.
To understand certain REAM designs, it might helpful to first understand what problems I was trying to solve.
In summary, I was searching for an alternative to CSV, but after trying YAML and TOML I decided to create my own language that caters to my own needs and preferences.
As I develop the language and the tools, I started reflecting on my past experience dealing with social science data and gradually add more features.

## Spreadsheet/CSV

I did not want to use a spreadsheet application to organize my undergraduate thesis data, because:

(1) I use Linux, and Microsoft Excel doesn't run natively in Linux,

(2) LibreOffice Calc, a popular Excel alternative in Linux, somehow kept crashing on my machine, and,

(3) I like [Neovim](https://neovim.io/) so much that I want to edit everything in the text editor, including datasets (probably the main motivation)

I tried editing raw CSV files in Neovim, but even with plugin such as [csv.vim](https://github.com/chrisbra/csv.vim) it wasn't a smooth experience;
the `ArrangeColumn` function which I used heavily to format and align the columns was inconsistent (the documentation did state it is experimental)
That's when I started exploring other data serialization languages.

In addition to being editor-friendly, I also wanted the language to support comments so I can add inline documentation to record the rationales.
The language should also work well with Git for version control.

## YAML

I first tried YAML.
I used YAML for other projects and find it to be human-readable.
Each key-value pair occupy a line, so it's easy to version control.

YAML is also good at representing nested data structure, so instead of:
```yaml
row:
    - country_name: Belgium
      country_capital: Brussel
      country_population: 11433256
      country_euro_zone: true
      language_name: Dutch
      language_size: 0.59

    - country_name: Belgium
      country_capital: Brussel
      country_population: 11433256
      country_euro_zone: true
      language_name: French
      language_size: 0.4

    - country_name: Belgium
      country_capital: Brussel
      country_population: 11433256
      country_euro_zone: true
      language_name: German
      language_size: 0.01
```
I can do:
```yaml
Country:
    - name: Belgium
      capital: Brussel
      population: 11433256
      # data from 2019, retrieved from Work Bank
      euro_zone: true
      # joined in 1999
      Languages:
          - name: Dutch
            size: 0.59
          - name: French
            size: 0.4
          - name: German
            size: 0.01
```

This is when I started exploring ways to store data in nested structures.
With this structure, we adhere to the single source of truth principle: attributes of country `Belgium` only ever appear once in the dataset.
To "flatten" the nested data structure, all we need is [a few lines of code](https://github.com/chmlee/ream-python/blob/master/ream/decode.py#L48-#L86).

Another way to organize the data is with [anchor and alias](https://ttl255.com/yaml-anchors-and-aliases-and-how-to-disable-them/), and would look like:

```yaml
Country:
    - &Belgium
      country_name: Belgium
      country_capital: Brussel
      country_population: 11433256
      country_euro_zone: true

Languages:
    - <<: *Belgium
      language_name: Dutch
      language_size: 0.59
    - <<: *Belgium
      language_name: French
      language_size: 0.4
    - <<: *Belgium
      language_name: German
      language_size: 0.01
```

Beside being modular, this method uses native YAML features and can be easily converted to CSV.
However, the key names are verbose to avoid name collision, hence the `country_` and `language_` prefixes.

With YAML, my dataset would either be a nested structure but with everything in a single tree, or a modular structure but with everything flatten.
How can I get a nested *and* modular data structure?

My ideal way of organizing data should do the following natively:
```yaml
Country:
    - &Belgium
      name: Belgium
      capital: Brussel
      population: 11433256
      # data from 2019, retrieved from Work Bank
      euro_zone: true
      # joined in 1999
      Languages:
          - <<: *Belgium
            name: Dutch
            size: 0.59
          - <<: *Belgium
            name: French
            size: 0.4
          - <<: *Belgium
            name: German
            size: 0.01
```
(This obviously is not a valid YAML file)

## TOML

My next candidate was TOML.
It had been quite popular lately, and in my opinion is easier to learn than YAML.
We can rewrite the previous example as:
```toml
[[Country]]
name = "Belgium"
capital = "Brussel"
population = 11433256
  # data from 2019, retrieved from Work Bank
euro_zone = true
  # joined in 1999

[[Country.Language]]
name = "Dutch"
size = 0.59

[[Country.Language]]
name = "French"
size = 0.4

[[Country.Language]]
name = "German"
size = 0.01
```

I prefer TOML's syntax for [Array for Tables](https://toml.io/en/v1.0.0#array-of-tables) than YAML's indentation-based approach.
But I dislike quoting strings, and it lacks reference, which was [explicitly rejected during early design](https://github.com/toml-lang/toml/issues/13).

One thing I like about TOML is its [issue tracker](https://github.com/toml-lang/toml/issues).
The discussions helped me understood its design rationales and learned that TOML was *not* a good fit for my use.
TOML's array of tables requires full path name, so the names may be verbose if the table is several levels deep.
While searching if there were plans to make table names more concise, I found a post that stated that the language [discourages deeply nested structure](https://github.com/toml-lang/toml/issues/309#issuecomment-558338408), which was exactly what I wanted to do.
I gave up TOML soon after reading the post and moved on.

([A new issue](https://github.com/toml-lang/toml/issues/781) was opened on October 2020 to collect ideas on nested structure, but it'll probably take a long time before the community reaches consensus and have the new syntax implemented.)

## Documentation

I want my inline documentation to be easy to read.
Though I'm comfortable reading raw text files, I prefer reading HTML or PDF files if possible.
To do so with YAML or TOML, I have to write a documentation generator which either build upon an existing implementation or write one myself.
If so, I much rather write an implementation of my own language which cater to my own needs and preferences.

If I don't want to convert a data serialization language to a markup language, why don't I serialize a markup language?
All I have to do [1] is to write a decoder of this new language, and let third-party file format converters produce HTML and PDF files.

REAM features Markdown-like syntax, in particular, [Pandoc-flavored Markdown](https://pandoc.org/).
The plan was to use Pandoc as my documentation generator, and [ream-python](https://github.com/chmlee/ream-python) to serialize the data.
That's why numbers are surrounded by question marks so that they are rendered as inline math notations.
Boolean values are surrounded by backticks so that they are rendered as inline code.
The language is not indentation-based simply because in Pandoc, as well as other Markdown flavors, a 4-space indentation indicates code block, and I want to have more than 2 levels nested [2].
Empty lines are optional because Pandoc requires an empty line before block quotes, which I use for annotations.

[1]:
If you really think about it, mapping a subset of a serialization language to a subset of a markup language is way easier than the opposite.
I don't know why I thought the former would be easier.

[2]:
I was so close to make REAM indentation-based, which would be a big mistake.

## GUI

Even though I designed REAM to be editor-friendly so that I can edit it in NeoVim, development for the graphical editor started quite early.
I don't remember exactly why or when I started working on the editor, but git history shows the [first commit](https://github.com/chmlee/ream-edit/commit/26da6f263b402e87356ddaedc04ce76750c5124e) was created 10 days after the prototype of the language parser was completed.

The originally design was to have an architecture similar to [Jupyter Notebook](https://jupyter.org/) and a front-end similar to [StackEdit](https://stackedit.io/app).
REAM-python would be running on a Flask server [1], and the front-end would provide real-time rendering.
As I work on the editor, I found myself moving codes into the front-end, and eventually the only thing the server did was receiving REAM data, parsing it, and returning JSON for Vue to render in the front-end.
What if... I move *everything* to the front-end and make the editor run 100% on the client side?

The development for the editor stops before it worked properly as I had to focus on my thesis.
After submitting the paper, the focus was on polishing the parser.
I packaged it as a commandline tool and wrote the documentation.
I [published it on PyPI](https://pypi.org/project/ream/), and was about to send the links to some of my friends for review.
But I wasn't sure people were comfortable working with commandline interfaces, or whether they have Python installed or not.
That's when I revisit the idea of rewriting the parser in JavaScript so that everything runs on the client side.

Another inspiration for this move is [Hedgehog Lab](https://github.com/Hedgehog-Computing/hedgehog-lab), a scientific computing and data visualization project written in TypeScript and runs entirely in the browser.
One of the motivations behind the project is lower the barrier for scientific computation.
The author argues students who simply want to learn scientific computation shouldn't spend time installing and [configuring Python development environment](https://xkcd.com/1987/) and dealing with third-party dependencies.
The goal for Hedgehog Lab is to make working on scientific computation as easy as opening an URL in the browser.
As mentioned in [his design rationale](https://zhuanlan.zhihu.com/p/147402013):

> Even if Numpy and MATLAB are 10000 times easier than Fortran/BLAS, there are always a learning curve.
> If you can further smooth that curve, you are helping more people.
>
> ...
>
> Designing an niche toy for smart people is hard, but creating an easy-to-understand tool for commoners is even harder.

This fundamentally changes how I view the future of REAM.

[1]: I don't know why I thought Jupyter Notebook uses Flask.
It uses Tornado.

## Pain Points

(to be continued)
