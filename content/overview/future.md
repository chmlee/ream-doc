+++
title = "Future"
weight = 5
+++

{% box(class="note") %}
This section is a work in progress
{% end %}

The future of REAM is interoperability.

To do so require us to think of datasets not just as data serializations but as programmes with well-defined APIs for other datasets/programmes to utilize.
In additional to a well-design language, the tooling is also crucial to make distributing and reusing data easy, including a documentation generator, a schema validator and a package manager.

## Motivation

If I want to do matrix calculation in Python, I don't need to implement a linear algebra library from scratch.
I can use `numpy`:

1. Download `numpy`

```shell
pip install --user numpy
```

2. Import `numpy`
```python
import numpy as np
import numpy.linalg as la
```

3. Use `numpy`
```python
mat_A_inv = la.inv(mat_A)
```

<br/>

If I want to create fancy plots in R, I don't need to write a graphing library from scratch.
I can use `ggplot2`

1. Download `ggplot2`
```R
install.packages("ggplot2")
```

2. Import `ggplot2`
```R
library(ggplot2)
```

3. Use `ggplot2`
```R
plot_2 = ggplot(dat = dat) + geom_point(aes(x = x, y = y))
```

<br/>

If I want to add country GDP as a control variable in my dataset, I don't need to calculate GDP for each country myself.
I can use GDP data from World Bank Open Data.

1. Download dataset

- Google `World Bank GDP` and click on the first result

- Download the data in CSV format

- Unzip `API_NY.GDP.MKTP.CD_DS2_en_csv_v2_1678496.zip`

2. Import dataset

- Read the dataset:

```R
wb = read.csv("./API_NY.GDP.MKTP.CD_DS2_en_csv_v2_1678496.csv")
```

- See error messages:

```R
Error in read.table(file = file, header = header, sep = sep, quote = quote,  :
  more columns than column names)
```

- Open the CSV file in a text editor.
Discover the dataset header is on line 5.

- Reread the dataset:

```R
wb = read.csv("./API_NY.GDP.MKTP.CD_DS2_en_csv_v2_1678496.csv", skip = 4, header = T)
```

3. Use dataset

- write function `get_gdp` to extract GDP:

```R
get_gdp = function(country, year) {
  col_i = grep(paste0('X', year), names(wb))
  gdp = wb[wb$Country.Name == country,][col_i]
  return(gdp[1,1])
}
```

- apply the function by row:

```R
my_data$GDP = apply(my_data, 1, function(row) get_gdp(row['country'], row['year']))
```

- Discover Cote d'Ivoire has `NA` GDP.
Oh, it's called "Sierra Leone" in the World Bank's dataset.

- Figure out all the name differences between the two datasets and write a "dictionary" to translate the names.

```R
country_dict = list(
  "Brunei" = "Brunei Darussalam",
  "Dominican Republic" = "Dominica",
  "Cote d'Ivoire" = "Sierra Leone"
  # You get the idea
)
```

- Modify `get_gdp`

```R
get_gdp = function(my_country, year) {
  col_i = grep(paste0('X', year), names(wb))
  wb_country = country_dict[[my_country]]
  gdp = wb[wb$Country.Name == wb_country,][col_i]
  return(gdp[1,1])
}
```

- Apply the function again:

```R
my_data$GDP = apply(my_data, 1, function(row) get_gdp(row['country'], row['year']))
```

There should be an easier way to import existing datasets.
We need a package manager for data.

It's not unheard of to download datasets with package managers. Beside the build-in datasets in R, you can download quite a few datasets from CRAN using `install.pacakges`, including example datasets in libraries (`diamonds` in ggplot2), datasets as libraries (`titanic`), or wrappers of APIs (`censusapi`).

But my ideal package manager is more than a downloader.

## Dependency

Consider Alesina et al. 2003 study on ethnic, linguistic and religious fractionalization.
To calculate ethnic fractionalization index for each country, Alesina compiled a list of ethnic groups world wide by consulting six types of sources:

- Encyclopedia Brittanica (EB)
- CIA World Factbook (CIA)
- Scarrit and Mozaffar (1999) (SM)
- Levinson (1998) (LEV)
- World Directory of Minorities (WDM)
- National census data (CENSUS)

If you plot the dependency graph, it'll look like the following:

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH
{% end %}

Alesina also calculated fractionalization indexes for language and religion based on data from Encyclopedia Brittanica.
Let's update the dependency graph:

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER
    REL --> MASTER
    LAN --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH

    REL[[Religion Data]]
    EB --> REL

    LAN[[Language Data]]
    EB --> LAN
{% end %}

To study the effect of fractionalization, variables from past studies are added from Easterly and Levine (1997) and La Porta et al. (1997):

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER
    REL --> MASTER
    LAN --> MASTER
    EAL --> MASTER
    LAP --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH

    REL[[Religion Data]]
    EB --> REL

    LAN[[Language Data]]
    EB --> LAN

    EAL(["Easterly and Levine<br/>(1997)"])
    LAP(["La Porta et al.<br/>(1997)"])
{% end %}

The Fractionalization indices are compared with existing measures:

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER
    REL --> MASTER
    LAN --> MASTER
    EAL --> MASTER
    LAP --> MASTER
    ANM --> MASTER
    ANN --> MASTER
    FER --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH

    REL[[Religion Data]]
    EB --> REL

    LAN[[Language Data]]
    EB --> LAN

    EAL(["Easterly and Levine<br/>(1997)"])
    LAP(["La Porta et al.<br/>(1997)"])

    ANM(["Atlas Narodov<br/>Mira (1964)"])
    ANN(["Annett<br/>(2001)"])
    FER(["Fearon<br/>(2002)"])
{% end %}

We can continue to graph the dependencies for each of the dependencies.
After adding a few of Easterly and Levine's dependencies, we get:

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER
    REL --> MASTER
    LAN --> MASTER
    EAL --> MASTER
    LAP --> MASTER
    ANM --> MASTER
    ANN --> MASTER
    FER --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH

    REL[[Religion Data]]
    EB --> REL

    LAN[[Language Data]]
    EB --> LAN

    EAL(["Easterly and Levine<br/>(1997)"])
    LAP(["La Porta et al.<br/>(1997)"])

    ANM(["Atlas Narodov<br/>Mira (1964)"])
    ANN(["Annett<br/>(2001)"])
    FER(["Fearon<br/>(2002)"])

    TAH --> EAL
    TAH(["Taylor and Hudson<br/>(1997)"])

    GUN --> EAL
    GUN(["Gunnemark (1991)"])

    SIV --> EAL
    SIV(["Sivard (1993)"])

    WRI --> EAL
    WRI(["World Resource<br/>Institute (1992)"])
{% end %}

I am not able to find the original dataset for the study, but I would assume all relevant data are extracted from the dependencies, manually or through scripts, to a master dataset.

The practice of copying dependencies to your own project is known as [vendoring](https://stackoverflow.com/questions/26217488/what-is-vendoring) in programming.
Vendoring is not necessarily a bad thing, but we do loose some information along the way.

(TODO: add more discussion on pros and cons of vendoring)

## Versioning

Let's zoom in on the dependency graph and focus on ethnic data.

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB --> ETH
{% end %}

If researchers plan to reproduce the research with updated dependencies, how would they update the dataset?

{% mermaid() %}
graph BT;
    MASTER([Master Dataset])
    ETH --> MASTER

    ETH[[Ethnic Data]]
    CIA --> ETH
    SM([SM]) --> ETH
    LEV([LEV]) --> ETH
    WDM --> ETH
    CENSUS --> ETH
    EB_OLD["EB (2001)"] --> ETH
    subgraph EB
    EB_OLD -.-> EB_NEW["EB (2010)"]
    end
{% end %}

If the original dataset was created by manually copying and pasting data from dependencies, you'll probably have to repeat the process.
If the dataset was created through extracting data from dependencies through scripts, we can rerun the scripts and generate the updated dataset *only if* the schemas remain the same.
Otherwise you'll have to analyze the schema changes and run custom migration scripts before running the original scripts.

(To be continued)
