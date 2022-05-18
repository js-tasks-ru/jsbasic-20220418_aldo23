function makeFriendsList(friends) {
  friends = friends.map( friend => friend.firstName + ' ' + friend.lastName );

  let ul = document.createElement('ul');

  for( let friend of friends ) {
    let li = document.createElement('li');
    li.innerHTML = friend;
    ul.append(li);
  }

  return ul;
}
