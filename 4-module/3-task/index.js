function highlight(table) {
  for( let tbody of table.tBodies ) {
    for( let tr of tbody.rows ) {
      
      let status = tr.cells[3].dataset.available,
          gender = tr.cells[2].innerHTML,
          age = tr.cells[1].innerHTML;

      /* 
      Почему npm test ругается на такое решение?
      tr.classList.add( !!status ? "available" : "unavailable" );
      */

      if( status == "true" ) {
        tr.classList.add("available");
      } else if( status == "false" ) {
        tr.classList.add("unavailable");
      };

      tr.hidden = !status || false;
      // tr.hidden = !status ? true : false;

      if ( gender == 'm' ) {
        tr.classList.add("male");
      } else if( gender == 'f' ) {
        tr.classList.add("female");
      };

      if( age < 18 ) {
        tr.style.textDecoration = 'line-through';
      };
    }
  }
}