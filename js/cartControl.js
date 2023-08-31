import { sendData } from './apiService.js';
import { API_URL, CART_STORAGE_KEY } from './config.js';
import { getFormData } from './getFormData.js';
const modalOrder = document.querySelector('.modal_order');
const orderForm = modalOrder.querySelector('.order__form');
const orderCount = modalOrder.querySelector('.order__count');
const orderList = modalOrder.querySelector('.order__list');
const orderTotalPrice = modalOrder.querySelector('.order__total-price');

export const cartDataControl = {
  getLS() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
  },
  addLS(item) {
    const cartData = cartDataControl.getLS();
    item.idls = Math.random().toString(36).substring(2, 8);
    cartData.push(item);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    renderCountCart(cartData.length);
  },
  removeLS(idls) {
    const cartData = cartDataControl.getLS();
    const index = cartData.findIndex((item) => item.idls === idls);
    if (index !== -1) {
      cartData.splice(index, 1);
    }
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    renderCountCart(cartData.length);
  },
  clearLS() {
    localStorage.removeItem(CART_STORAGE_KEY);
    renderCountCart(0);
  },
};

const renderCountCart = (count) => {
  const headerBtnOrder = document.querySelector('.header__btn-order');
  headerBtnOrder.dataset.count = count || cartDataControl.getLS().length;
};

renderCountCart();

const createCartItem = (item, data) => {
  const img = data.find((cocktail) => cocktail.title === item.title)?.image;
  const li = document.createElement('li');
  li.className = 'order__item';
  li.innerHTML = `
    <img 
      class="order__item-img" 
      src="${img ? `${API_URL}/${img}` : './img/goods/make-your-own.jpg'}" 
      alt="${item.title}" 
      title="${item.title}"
    >

    <div class="order__item-info">
      <h3 class="order__item-name">${item.title}</h3>

      <ul class="topping__list">
        <li class="topping__item">${item.size}</li>
        <li class="topping__item">${item.cup}</li>
        ${
          item.topping
            ? Array.isArray(item.topping)
              ? item.topping
                  .map((toppingItem) => `<li class="topping__item">${toppingItem}</li>`)
                  .toString()
                  .replace(',', '')
              : `<li class="topping__item">${item.topping}</li>`
            : ''
        }        
      </ul>
    </div>

    <button class="order__item-delete" type="button" aria-label="Удалить коктейль" title="Удалить коктейль" data-idls="${item.idls}">
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.9401 11.9821L18.4667 6.47024C18.5759 6.34304 18.633 6.17943 18.6265 6.0121C18.6201 5.84476 18.5505 5.68603 18.4318 5.56762C18.313 5.4492 18.1539 5.37984 17.9861 5.37337C17.8183 5.36691 17.6543 5.42383 17.5267 5.53275L12.0001 11.0446L6.4734 5.5261C6.34786 5.4009 6.1776 5.33057 6.00006 5.33057C5.82253 5.33057 5.65227 5.4009 5.52673 5.5261C5.40119 5.6513 5.33067 5.82111 5.33067 5.99817C5.33067 6.17523 5.40119 6.34504 5.52673 6.47024L11.0601 11.9821L5.52673 17.494C5.45694 17.5536 5.40026 17.627 5.36025 17.7095C5.32023 17.7919 5.29774 17.8818 5.2942 17.9734C5.29065 18.0649 5.30612 18.1562 5.33964 18.2416C5.37315 18.3269 5.42399 18.4044 5.48896 18.4692C5.55393 18.534 5.63163 18.5847 5.71718 18.6181C5.80273 18.6515 5.89429 18.6669 5.9861 18.6634C6.07791 18.6599 6.168 18.6374 6.25071 18.5975C6.33342 18.5576 6.40697 18.5011 6.46673 18.4315L12.0001 12.9196L17.5267 18.4315C17.6543 18.5404 17.8183 18.5973 17.9861 18.5909C18.1539 18.5844 18.313 18.515 18.4318 18.3966C18.5505 18.2782 18.6201 18.1195 18.6265 17.9521C18.633 17.7848 18.5759 17.6212 18.4667 17.494L12.9401 11.9821Z"
          fill="currentColor" />
      </svg>
    </button>

    <p class="order__item-price">${item.price}&nbsp;&#8381;</p>
  `;

  return li;
};

const renderCartList = (data) => {
  const orderListData = cartDataControl.getLS();

  orderList.textContent = '';
  orderCount.textContent = `(${orderListData.length})`;

  orderListData.forEach((item) => {
    orderList.append(createCartItem(item, data));
  });

  orderTotalPrice.innerHTML = `${orderListData.reduce((acc, item) => acc + +item.price, 0)}&nbsp;&#8381;`;
};

const handlerSubmit = async (e) => {
  const orderListData = cartDataControl.getLS();

  e.preventDefault();
  if (!orderListData.length) {
    console.log('Корзина пуста');
    orderForm.reset();
    modalOrder.closeModal('close');
    return;
  }

  const data = getFormData(orderForm);
  const response = await sendData({ ...data, products: orderListData });

  const { message } = await response.json();
  alert(message);
  cartDataControl.clearLS();
  orderForm.reset();
  modalOrder.closeModal('close');
};

export const renderCart = (data) => {
  renderCartList(data);
  orderForm.addEventListener('submit', handlerSubmit);
  orderList.addEventListener('click', (e) => {
    if (e.target.classList.contains('order__item-delete')) {
      cartDataControl.removeLS(e.target.dataset.idls);
      renderCartList(data);
    }
  });
};
