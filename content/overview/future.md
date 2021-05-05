+++
title = "Future"
weight = 5
+++


The future of REAM is interoperability.

(Working in progress)

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

To add country GDP as a control variable in my dataset, I don't need to calculate GDP for each country myself.
I can use GDP data from World Bank.

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

- Open the CSV file in a text editor, and discover the dataset header is on line 5.

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

There should be a easier way to import and existing datasets.

In fact, it's not unheard of to download datasets with package managers. Beside the build-in datasets in R, you can download quite a few datasets from CRAN using `install.pacakges`, including example datasets in libraries (`diamonds` in ggplot2), datasets as libraries (`titanic`), or wrappers of APIs (`censusapi`).

But my ideal package manager is more than a downloader.

## Dependency

Variables of my undergraduate thesis data come from one of the three sources:

- [Geographical Research On War, Unified Platform (GROWUP)](https://growup.ethz.ch/),
- [UCDP Georeferenced Event Dataset (GED)](https://ucdp.uu.se/downloads/index.html#ged_global)
- [World Bank Open Data](https://data.worldbank.org/).

The dependency graph for my dataset is then:

{% mermaid() %}
graph BT;
  MASTER[My dataset]
  GROWUP --> MASTER
  GED--> MASTER
  WB[World Bank] --> MASTER
{% end %}

But each of the three datasets has its own dependencies:

{% mermaid() %}
graph BT;
  MASTER[My dataset]
  GROWUP --> MASTER
  GED--> MASTER
  WB[World Bank] --> MASTER

  S1[Source 1] --> GROWUP
  S2[Source 2] --> GROWUP
  SN[Source n] --> GROWUP

  N1[News 1] --> GED
  N2[News 2] --> GED
  NN[News n] --> GED

  C1[Country 1] --> WB
  C2[Country 2] --> WB
  CN[Country n] --> WB
{% end %}

And each of the dependencies has their own dependencies.

(To be continued)
