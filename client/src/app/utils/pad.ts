/**
 * 获取快速入口的图标数量
 * @param source 源数组
 * @param cols 列的数量
 * @param rows 行的数量，如果为0或null的话，取全部
 * @param last 加在最后一个的项目
 */
export function paddingArray(source: any[], cols: number, rows: number = null, fillElement = {}, last: any = null) {
  if (!source || !source.length) {
    return [];
  }

  // 在全部展开(rows === null)并且需要最后一个元素的时候(last !== null), 在元素刚好排满一行的时候需要插入新的一行, 放置最后一个元素
  let paddedArray = padding(source, cols, fillElement, !rows && last);

  let ret = rows ? paddedArray.slice(0, cols * rows) : paddedArray;

  // 在元素排满或不够的时候， 不需要放置最后一个元素
  if (last && ((!rows) || (rows * cols < source.length))) {
    ret[ret.length - 1] = last;
  }

  return ret;
}

function padding(source: any[], size: number, fillElement: any, needNewRow: boolean) {
  let len = source.length;

  let remain = size - len % size;

  let ret = source.slice(0, source.length);

  if (remain < size) {
    for (let i = 0; i < remain; i++) {
      ret.push(fillElement);
    }
  } else if (needNewRow) {
    for (let i = 0; i < size; i++) {
      ret.push(fillElement);
    }
  }

  return ret;
}
