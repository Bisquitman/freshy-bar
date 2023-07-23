const API_URL = 'https://rift-harvest-clock.glitch.me';

const price = {
  Клубника: 60,
  Банан: 50,
  Манго: 70,
  Киви: 55,
  Маракуйя: 90,
  Яблоко: 45,
  Мята: 50,
  Биоразлагаемый: 20,
  Лед: 10,
  Пластиковый: 0,
};

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
      <button class="btn cocktail__btn cocktail__btn_add" data-id="${id}">Добавить</button>
    </div>
  `;
  return cocktail;
};

const init = async () => {
  const getFormData = (form) => {
    const formData = new FormData(form);
    const data = {};

    for (const [name, value] of formData.entries()) {
      if (data[name]) {
        if (!Array.isArray(data[name])) {
          data[name] = [data[name]];
        }
        data[name].push(value);
      } else {
        data[name] = value;
      }
    }

    return data;
  };

  const calculateTotalPrice = (form, startPrice) => {
    let totalPrice = startPrice;

    const data = getFormData(form);

    if (Array.isArray(data.ingredients)) {
      data.ingredients.forEach((item) => {
        totalPrice += price[item] || 0;
      });
    } else {
      totalPrice += price[data.ingredients] || 0;
    }

    if (Array.isArray(data.topping)) {
      data.topping.forEach((item) => {
        totalPrice += price[item] || 0;
      });
    } else {
      totalPrice += price[data.topping] || 0;
    }

    totalPrice += price[data.cup] || 0;

    return totalPrice;
  };

  const calculateMakeYourOwn = () => {
    const formMakeOwn = document.querySelector('.make__form_make-your-own');
    const makeInputPrice = formMakeOwn.querySelector('.make__input_price');
    const makeTotalPrice = formMakeOwn.querySelector('.make__total-price');

    const handlerChange = () => {
      const totalPrice = calculateTotalPrice(formMakeOwn, 150);
      makeInputPrice.value = totalPrice;
      makeTotalPrice.innerHTML = `${totalPrice}&nbsp;&#8381;`;
    };

    formMakeOwn.addEventListener('change', handlerChange);
    handlerChange();
  };

  calculateMakeYourOwn();

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

  modalController({
    modal: '.modal_order',
    btnOpen: '.btn-order',
    btnClose: '.modal__close',
  });

  modalController({
    modal: '.modal_make-your-own',
    btnOpen: '.cocktail__btn_make',
    btnClose: '.modal__close',
  });

  modalController({
    modal: '.modal_add',
    btnOpen: '.cocktail__btn_add',
    btnClose: '.modal__close',
  });
};

init();
