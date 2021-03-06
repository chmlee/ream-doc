+++
title = "Origin"
weight = 4
+++

REAM was created as a quick solution to manage my undergraduate thesis data.
To understand certain REAM designs, it might be helpful to first understand what problems I was trying to solve.

In summary, I was searching for an alternative to CSV, but after trying YAML and TOML I decided to create my language that caters to my needs and preferences.
As I develop the language and the tools, I started reflecting on my experience dealing with social science data and gradually add more features.

## Spreadsheet/CSV

I did not want to use a spreadsheet application to organize my undergraduate thesis data, because:

(1) I use Linux, and Microsoft Excel doesn't run natively in Linux,

(2) LibreOffice Calc, a popular Excel alternative in Linux, somehow kept crashing on my machine, and,

(3) I like [Neovim](https://neovim.io/) so much that I want to edit everything in the text editor, including datasets (probably the main motivation)

I tried editing raw CSV files in Neovim, but even with plugins such as [csv.vim](https://github.com/chrisbra/csv.vim) it wasn't a smooth experience.
That's when I started exploring other data serialization languages.

In addition to being editor-friendly, I wanted the solution to work well with Git or provide a native way for version control.
The solution should also support comments since my work was mostly zipping two larger datasets and I wanted my matching rationales to be well documented.
This was largely influenced by my work in [Composition of Religious and Ethnic Groups (CREG) Project](https://clinecenter.illinois.edu/project/Religious-Ethnic-Identity/composition-religious-and-ethnic-groups-creg-project) at [Cline Center for Advanced Social Research](https://clinecenter.illinois.edu/), where we carefully document thousands of matches when zipping dozens of datasets.


## YAML

I first tried YAML.
I used YAML for other projects and find it to be a pleasant format to work with.
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
I can write:
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

With this structure, we adhere to the single source of truth principle: attributes of country `Belgium` only ever appear once in the dataset.
To "flatten" the nested data structure, all we need is [a few lines of code](https://github.com/chmlee/ream-python/blob/master/ream/decode.py#L48-#L86) (not the most elegant solution, but it works).

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

(Spoiler: by making the language component-based)

## TOML

My next candidate was TOML.
It had been quite popular lately, and in my opinion is easier to learn than YAML (the [YAML spec](https://yaml.org/spec/1.2/spec.pdf) is 84 pages long!).
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

I prefer TOML's syntax for [Array for Tables](https://toml.io/en/v1.0.0#array-of-tables) to YAML's indentation-based approach.
But I dislike quoting strings, and it lacks reference, which was [explicitly rejected during early design](https://github.com/toml-lang/toml/issues/13).

One thing I like about TOML is its [issue tracker](https://github.com/toml-lang/toml/issues).
The discussions helped me understood its design rationales and learned that TOML was *not* a good fit for my use.
TOML's array of tables requires full path names, so the names may be verbose if the table is several levels deep.
While searching for proposals to make table names more concise, I found a post that stated that the language [discourages deeply nested structure](https://github.com/toml-lang/toml/issues/309#issuecomment-558338408), which was exactly what I wanted to do.
I gave up TOML soon after reading the post and moved on.

([A new issue](https://github.com/toml-lang/toml/issues/781) was opened on October 2020 to collect ideas on nested structure, but it'll probably take a long time before the community reaches consensus and has the new syntax implemented.)

## Documentation

I wanted my inline documentation to be easy to read.
I  was comfortable reading raw monospace text files, still, I preferred reading HTML or PDF files if possible.
To do so with YAML or TOML, I had to write a documentation generator that either builds upon an existing implementation or write one myself from scratch.
If so, I much rather write an implementation of my language which caters to my needs and preferences.

If I don't want to convert a data serialization language to a markup language, why don't I serialize a markup language?
All I have to do<sup>[1]</sup> is to write a decoder of this new language, and let third-party file format converters produce HTML and PDF files.

REAM features Markdown-like syntax, in particular, [Pandoc-flavored Markdown](https://pandoc.org/).
The plan was to use Pandoc as my documentation generator, and [ream-python](https://github.com/chmlee/ream-python) to serialize the data.
That's why in earlier versions, numbers were surrounded by dollar signs so that they were rendered as inline math notations.
Boolean values were surrounded by backticks so that they were rendered as inline code.
The language was not indentation-based simply because in Pandoc, as well as other Markdown flavors, a 4-space indentation indicates code block, and I want to have more than 2 levels nested.<sup>[2]</sup>
Empty lines were optional because Pandoc requires an empty line before block quotes, which I use for annotations.

[1]:
If you really think about it, mapping a subset of a serialization language to a subset of a markup language is way easier than the opposite.
I don't know why I thought the former would be easier.

[2]:
I was so close to make REAM indentation-based, which would be a big mistake.
