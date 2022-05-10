function showSalary(users, age) {
  users = users.filter( user => user.age <= age );
  
  users = users.map( user => user.name + ', ' + user.balance );
  
  return users.join('\n');
}
