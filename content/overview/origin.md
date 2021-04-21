+++
title = "Origin"
weight = 4
+++

REAM was created as a quick solution to manage my undergraduate thesis data.
In summary, I was finding an alternative to CSV, but after trying YAML and TOML I decided to create my own language that caters to my own needs and preferences.
As I develop the language and the tools, I started reflecting on my past experience dealing with social science data and gradually add more features.

## Spreadsheet/CSV

I did not want to use a spreadsheet application to organize my undergraduate thesis data, because:

(1) I use Linux, and Microsoft Excel doesn't run natively in Linux,

(2) LibreOffice Calc, a popular Excel alternative in Linux, somehow kept crashing on my machine, and,

(3) I like [Neovim](https://neovim.io/) so much that I want to edit everything in the text editor, including datasets (probably the main motivation)

I tried editing raw CSV files in Neovim, but even with plugin such as [csv.vim](https://github.com/chrisbra/csv.vim) it wasn't a smooth experience;
the `ArrangeColumn` function which I used heavily to format and align the columns was inconsistent (the documentation did state it is experimental)
That's when I started exploring other data serialization languages.

In addition to being editor-friendly, I also want the language to support comments so I can add inline documentation to record the rationales
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

My next candidate is TOML.
It's has been increasingly popular for configuration files, and personally I find it much easier to learn.
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

One thing I like about TOML is its [issues tracker](https://github.com/toml-lang/toml/issues).
The discussions help me understand its design rationales and learn that TOML is *not* a good fit for my use.
TOML's array of tables requires full path name, so the names may be verbose if the table is several levels deep.
While searching if there are plans to make table names more concise, I found a post that states that the language [discourages deeply nested structure](https://github.com/toml-lang/toml/issues/309#issuecomment-558338408), thus not the best choice for me.
I gave up TOML soon after reading the post and moved on.

([A new issue](https://github.com/toml-lang/toml/issues/781) was opened to collect ideas on nested structure, but it'll probably take a long time before the community reaches consensus and have the new syntax implemented.)

## Documentation

I want my inline documentation to be easy to read.
Though I'm comfortable reading raw text files, I prefer reading HTML or PDF files if possible.
To do so with YAML or TOML, I have to write a documentation generator which include a customized lexer and parser.
If so, I much rather write an implementation of my own language which cater to my own needs and preferences.

If I don't want to convert a data serialization language to a markup language, why don't I serialize a markup language?
All I have to do [1] is to write a decoder of this new language, and let third-party file format converters produce HTML and PDF files.

REAM features Markdown-like syntax, in particular, [Pandoc-flavored Markdown](https://pandoc.org/).
The plan was to use Pandoc as my documentation generator, and [ream-python](https://github.com/chmlee/ream-python) to serialize the data.
That's why numbers are surrounded by question marks so that they are rendered as inline math notations.
Boolean values are surrounded by backticks so that they are rendered as inline code.
The language is not indentation-based simply because in Pandoc, as well as other Markdown flavors, 4-space indentation indicates code block, and I want to have more than 2 levels nested [2].
Empty lines are optional because Pandoc requires an empty line before block quotes.

[1]:
If you really think about it, mapping a subset of a serialization language to a subset of a markup language is way easier than the opposite.
I don't know why I thought the former would be easier.

[2]:
I was so close to make REAM indentation-based, which would be a big mistake.
