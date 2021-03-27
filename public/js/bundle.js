(function () {
  'use strict';

  function mutateString(valueRaw) {
    const content = valueRaw.trim();
    return { type: 'string', subtype: '', content };
  }

  function mutateNumber(valueRaw) {
    if (valueRaw[0] === '$' && valueRaw[valueRaw.length - 1] === '$') {
      // TODO: add number syntax checking
      // return string type if false
      const [, content] = valueRaw.match(/\$(.*)\$/);
      return { type: 'number', subtype: '', content };
    }
    return null;
  }

  function mutateBoolean(valueRaw) {
    if (valueRaw[0] === '`' && valueRaw[valueRaw.length - 1] === '`') {
      const [, content] = valueRaw.match(/`(.*)`/);
      let bool;
      if (content === 'TRUE') {
        bool = 'true';
      } else if (content === 'FALSE') {
        bool = 'false';
      } else {
        return mutateString(valueRaw); // not boolean; return string
      }
      return { type: 'bolean', subtype: bool, content: bool };
    }
    return null;
  }

  function merge(parent, children) {
    const result = [];
    if (children.length === 0) return [parent]; // end of branch
    children.forEach((child) => {
      const newRow = parent.concat(...child);
      result.push(newRow);
    });
    return result;
  }

  function flattenEntry(entry) {
    function unwrapContent(variable) {
      if (variable.value.type === 'list') {
        const items = variable.value.content
          .map((item) => item.content)
          .join(';');
        return items;
      }
      return variable.value.content;
    }
    // collect parent item
    const parent = entry.variables
      .map((variable) => unwrapContent(variable));

    // new collect parent item

    // collect children item
    const children = [];
    for (let i = 0; i < entry.subEntries.length; i += 1) {
      const subEntry = entry.subEntries[i];
      const child = flattenEntry(subEntry);
      child.forEach((row) => children.push(row));
    }

    // merge parent and children
    const result = merge(parent, children);
    return result;
  }

  function toCSV(tree, sep = ',') {
    const flatEntry = flattenEntry(tree);
    const flatEntryString = flatEntry.map((row) => row.join(sep));
    const csvRaw = flatEntryString.join('\r\n');
    return csvRaw;
  }

  // Line Class
  class MdFile {
    constructor(text) {
      this.fileText = text;
      this.fileArray = [''].concat(this.fileText.split(/\r?\n/));
      this.level = 0;
      this.lineIndex = 1;
      this.fileMaxIndex = this.fileArray.length - 1;
    }

    lineRaw(j = this.lineIndex) {
      return this.fileArray[j];
    }

    lineToken(j = this.lineIndex) {
      if (this.lineRaw(j) === '' || j > this.fileMaxIndex) return 'x';
      const [token] = this.lineRaw(j).match(/[^\s]+/);
      return token;
    }

    nextLine() {
      this.lineIndex += 1;
      while (!/\S/.test(this.lineRaw())) {
        this.lineIndex += 1;
        if (this.lineIndex > this.fileMaxIndex) {
          break;
        }
      }
    }

    undoNextLine() {
      this.lineIndex -= 1;
      while (!/\S/.test(this.lineRaw())) {
        this.lineIndex -= 1;
        if (this.lineIndex > this.fileMaxIndex) {
          break;
        }
      }
    }

    parseEntry() {
      // check if Entry
      if (this.lineToken() === '#'.repeat(this.level + 1)) {
        if (!/\w/.test(this.lineRaw())) throw Error('Entry must have name!');
        const entryName = this.lineRaw().match(/ *#+ *([\w+ ]+[^ ])/)[1];
        this.nextLine();

        // check variable
        const variables = [];
        while (this.lineToken() === '-') {
          const variable = this.parseVariable(this.lineRaw());
          variables.push(variable);
          this.nextLine();
        }

        // check subEntry
        const subEntries = [];
        this.level += 1;
        while (this.lineToken() === '#'.repeat(this.level + 1)) {
          const subEntry = this.parseEntry();
          subEntries.push(subEntry);
          // this.nextLine();
        }
        this.level -= 1;
        return {
          type: 'entry',
          name: entryName,
          variables,
          subEntries,
        };
      }
      return null;
    }

    parseVariable(string) {
      const [, key, valueRaw] = string.match(/- +(\b[ *\w]+\b) *:(.*)$/);
      const value = this.parseValue(valueRaw.trim());
      const variable = { type: 'variable', key, value };
      return variable;
    }

    parseValue(valueRaw) {
      const value = this.parseList(valueRaw)
                 ?? mutateBoolean(valueRaw)
                 ?? mutateNumber(valueRaw)
                 ?? mutateString(valueRaw);
      const comment = this.parseComment();
      value.comment = comment;
      return value;
    }

    parseList(valueRaw) {
      if (valueRaw === '') {
        // check token for the fist non-trivial line
        let j = this.lineIndex + 1;
        while (this.lineRaw(j).trim() === '') {
          j += 1;
        }
        if (this.lineToken(j) !== '*') throw Error('Variable must have value!');
        // loop throuh all list item
        this.lineIndex = j;
        const content = [];
        while (this.lineToken() === '*') {
          const item = this.parseValue(this.lineRaw().match(/ *\* *([\S+ ]+[^ ])/)[1]);
          content.push(item);
          this.nextLine();
        }
        this.undoNextLine();
        return { type: 'list', subtype: '', content };
      }
      return null;
    }

    parseComment() {
      // check token for the fist non-trivial line
      let j = this.lineIndex + 1;
      while (j < this.fileMaxIndex && this.lineRaw(j).trim() === '') {
        j += 1;
      }
      if (this.lineToken(j) !== '>') return '';
      this.lineIndex = j;
      const comment = this.lineRaw().match(/ *> *([\S+ ]+[^ ])/)[1];
      return comment;
    }

    setDefault() {
      this.level = 0;
      this.lineIndex = 1;
    }

    toTree() {
      const tree = this.parseEntry();
      this.setDefault();
      return tree;
    }

    toCSV() {
      const tree = this.toTree();
      return toCSV(tree);
    }
  }

  console.log(3);

  let buttons = document.querySelectorAll(".update-button");

  buttons.forEach(button => button.addEventListener('click', event => {
    const id = event.target.id;
    const input = document.getElementById(`${id}-input`).value;
    let mdFile = new MdFile(input);
    let output;
    try {
      output = mdFile.toCSV();
    } catch (error) {
      output = error;
    }
    document.getElementById(`${id}-output`).innerHTML = output;
  }));





  // let button = buttons[0];
  // button.addEventListener("click", function() {
  //   alert("test")
  // });

}());
