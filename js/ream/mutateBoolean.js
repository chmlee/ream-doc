import { mutateString } from './mutateString';

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

export { mutateBoolean };
