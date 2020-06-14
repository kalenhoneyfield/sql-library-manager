const bookTable = document.getElementById('bookTable');
const searchInput = document.getElementById('searchInput');
const tableRows = bookTable.querySelectorAll('.bookRow');

const perPage = 10;

searchInput.addEventListener('keyup', (e) => {
  const text = searchInput.value.toLowerCase();

  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].innerText.toLowerCase().includes(text)) {
      tableRows[i].classList.remove('hidden');
      tableRows[i].classList.add('pagi');
    } else {
      tableRows[i].classList.add('hidden');
      tableRows[i].classList.remove('pagi');
    }
  }
  const list = bookTable.querySelectorAll('.pagi');
  showPage(list, 0);
  appendPageLinks(list);
});

let showPage = (list, page) => {
  let sIndex = page * perPage; //starting index value
  let eIndex = page * perPage + perPage; //ending index value

  for (let i = 0; i < list.length; i++) {
    list[i].classList.add('hidden');
  }

  for (sIndex; sIndex < eIndex; sIndex++) {
    list[sIndex] ? list[sIndex].classList.remove('hidden') : false;
  }
};

let appendPageLinks = (list) => {
  const totalPages = Math.ceil(list.length / perPage);
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  //count the total pages and paste the li elements to the page
  for (let i = 0; i < totalPages; i++) {
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.textContent = i + 1;
    i === 0 ? anchor.classList.add('active') : anchor.classList.remove('active');

    li.append(anchor);
    pagination.append(li);
  }
};

document.querySelector('.pagination').addEventListener('click', (e) => {
  const act = document.querySelectorAll('.active');
  act.forEach((node) => node.classList.remove('active'));
  e.target.classList.add('active');
  const list = bookTable.querySelectorAll('.pagi');
  const index = e.target.textContent - 1;
  showPage(list, index);
});

showPage(tableRows, 0);
appendPageLinks(tableRows);
