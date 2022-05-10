function namify(users) {
  let names = [];

  for (let elem of users) {
    names.push(elem.name);
  }

  return names;
}
