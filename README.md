# Feather

Feather is a lightweight, in-memory, relational database. It uses an SQL-like query language Feather Query Language, (FQL for short, pronounced fickle).

I plan on building the database engine in TypeScript.

## FQL Grammar

```
<program> := <statements>*

<statement> :=
  <create-table-statement>  |
  <list-table-statement>    |
  <alter-table-statement>   |
  <drop-table-statement>    |
  <insert-row-statement>    |
  <select-rows-statement>   |
  <update-rows-statement>   |
  <delete-rows-statement>   |

<create-table-statement> := CREATE TABLE <identifier> (<column-definition-list>);

<list-tables-statement> := LIST TABLES;

<alter-table-statement> := ALTER TABLE <identifier> <table-alteration>;

<insert-row-statement> := INSERT INTO <table-name> (<column-name-list>) VALUES (<values-list>);

<select-rows-statement> := SELECT * | <column-list>  FROM <table-name> <where-clause>?;

<update-rows-statement> := UPDATE <table-name> <update-operation> <where-clause>?;

<delete-rows-statement> := DELETE FROM <table-name> <where-clause>?

<column-definition-list> := <column-definition> [, <column-definition>]*

<column-definition> := <identifier> <column-datatype> <column-constraints-list>

<identifier> := [A-Z a-z _]+[A-Z a-z 0-9 _]*

<column-datatype> := TEXT | NUMBER | BOOLEAN

<table-alteration> := <add-column-alteration> | <drop-column-alteration>

<add-column-alteration> := ADD COLUMN <column-definition>

<drop-column-alteration> := DROP COLUMN <identifier>

<column-name-list> := <identifier> [, <identifier>]*;

<values-list> := <value> [, <value>]*

<value> := <text> | <number> | <boolean> | <null>;

<text> := '.*' | ".*"

<number> := [0-9]+[\.[0-9]+]?

<boolean> := TRUE | FALSE

<null> := NULL

<update-operation> := <set operation>

<set-operation> := SET <column-name> = <value>;

<where-clause> := WHERE <column-relational-operator> [<logical-operator> <column-relational-operator>]*;

<column-relational-operator> := <column-name> <relational-operator> <value>;

<relational-operator> := < = | != | > | < | >= | <= | LIKE >

<logical-operator> := AND | OR

```

## Implementation

The database engine runs in three stages:

### Tokenisation

- Takes in raw character stream as input.
- Groups chracters to produce tokens.

## Analysis

- Takes in tokens as input.
- Produces an abstract syntax tree as output.

## Execution

- Takes in an abstract syntax tree as input.
- Applies the statements to a database.
- Writes to the standard output as necessary.
