// Generate random colors. Used to generate colors for bar chart in OperationTable component
export const randomBgColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  return `rgba(${red}, ${green}, ${blue})`;
};

// Util function to transform query string to structure used for D3 Tree
export const queryTransform = (query: string) => {
  // Clean the query from '\n' and spaces and non wanted characters and form an array
  const clearQuery = (end = 0, str = '', isFirst = true) => {
    const queryArr: string[] = [];
    while (end < query.length) {
      switch (query[end]) {
        case ' ':
          !isFirst && str.length
            ? queryArr.push(str.split('\n').join(''))
            : (isFirst = false);
          str = '';
          break;
        case '}':
          queryArr.push('}');
          end++;
          break;
        case '(':
          while (query[end] !== ')' && end < query.length) {
            end++;
          }
          break;
        default:
          str = isFirst ? str : (str += query[end]);
      }
      end++;
    }
    return queryArr;
  };

  // Build array with clean query
  const arr: string[] = clearQuery();

  // If name is not provided add default as name
  if (arr[0] === '{') arr.unshift('default name');
  const treeObject: { name: string; children: any[] } = {
    name: arr[0],
    children: [],
  };

  // recursively built the nested objects in the format required for the D3 tree component
  // Format: { name: string!, attributes: string, children: Array<string> }
  const recurseFunc = (arr: string[], index: any = 0) => {
    const arrObjs: any[] = [];
    let numObj = 0;
    while (index < arr.length) {
      switch (arr[index]) {
        case '{':
          [arrObjs[numObj++].children, index] = recurseFunc(arr, index + 1);
          break;
        case '}':
          return [arrObjs, index];
        default:
          arrObjs.push({ name: arr[index] });
      }
      index++;
    }
    return [arrObjs, index];
  };

  // If object has an opening bracket build the children array with the parameters
  if (arr[1][0] === '{')
    treeObject.children = recurseFunc(arr.slice(2, arr.length))[0];
  return treeObject;
};
