function makeDiagonalRed(table) {
  for ( let tr of table.rows ) {
    for ( let td of tr.cells) {
      if ( td.cellIndex == tr.rowIndex ) {
        td.style.backgroundColor = 'red';
      }
    }
  }
}
