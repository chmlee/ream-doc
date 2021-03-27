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

export { toCSV };
