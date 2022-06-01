/**
 * Компонент, который реализует таблицу
 * с возможностью удаления строк
 *
 * Пример одного элемента, описывающего строку таблицы
 *
 *      {
 *          name: 'Ilia',
 *          age: 25,
 *          salary: '1000',
 *          city: 'Petrozavodsk'
 *      }
 *
 */
export default class UserTable {
  constructor(rows) {
    this.rows = rows;
    this.render();
  }

  // Метод отрисовывает элемент table
  render() {
    // Создаем table
    this.elem = document.createElement('table');

    // Создаем thead
    let thead = document.createElement('thead');
    thead.insertAdjacentHTML('afterbegin', `
      <tr>
        <th>Имя</th>
        <th>Возраст</th>
        <th>Зарплата</th>
        <th>Город</th>
        <th></th>
      </tr>
    `);

    // Создаем tbody
    let tbody = document.createElement('tbody');
    for(let row of this.rows) {
      let tr = document.createElement('tr');
      for(let item in row) {
        tr.insertAdjacentHTML('beforeend', `<td>${row[item]}</td>`);
      }
      tr.insertAdjacentHTML('beforeend', '<td><button>X</button></td>');
      tr.addEventListener('click', this.deleteRow);
      tbody.insertAdjacentElement('beforeend', tr);
    }

    // Формируем table
    this.elem.insertAdjacentElement('afterbegin', thead);
    this.elem.insertAdjacentElement('beforeend', tbody);
  }

  // Метод удаляет строку таблицы
  deleteRow(event) {
    if(event.target.tagName == 'BUTTON') {
      this.remove();
    }
  }
}
