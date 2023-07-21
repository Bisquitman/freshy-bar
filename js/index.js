const API_URL = 'https://rift-harvest-clock.glitch.me';

const getData = async () => {
  const response = await fetch(`${API_URL}/api/goods`);
  const data = await response.json();
  return data;
};

const createCard = ({ id, image, title, price, size }) => {
  const cocktail = document.createElement('article');
  cocktail.className = 'cocktail';
  cocktail.innerHTML = `
    <img class="cocktail__img" src="${API_URL}/${image}" alt="Коктейль &laquo;${title}&raquo;"
      title="Коктейль &laquo;${title}&raquo;" width="256" height="304">

    <div class="cocktail__content">
      <div class="cocktail__text-wrapper">
        <h3 class="cocktail__title">${title}</h3>
        <div class="cocktail__field">
          <p class="cocktail__price text-red">${price}&nbsp;&#8381;</p>
          <p class="cocktail__size">${size}</p>
        </div>
      </div>
      <button class="btn cocktail__btn" data-id="${id}">Добавить</button>
    </div>
  `;
  return cocktail;
};

const init = async () => {
  const goodsListElem = document.querySelector('.goods__list');
  const data = await getData();
  console.log('data: ', data);

  const cardsCocktail = data.map((item) => {
    const li = document.createElement('li');
    li.className = 'goods__item';
    li.append(createCard(item));

    return li;
  });

  goodsListElem.append(...cardsCocktail);
};

init();
