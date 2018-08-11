import * as stringify from 'json-stable-stringify';
import * as fs from 'fs';

export function saveJsonOjbect(ur: string, i18n: any) {
  fs.writeFileSync(
    ur,
    stringify(i18n, {
      space: '  ',
      cmp: (a, b) => {
        if (a != null && b != null) {
          return a.key.toLowerCase() > b.key.toLowerCase() ? 1 : -1;
        } else return a.key > b.key ? 1 : -1;
      }
    })
  );
}
