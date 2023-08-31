import { getData } from './apiService.js';
import { renderCart } from './cartControl.js';
import { calculateAdd, calculateMakeYourOwn } from './formControl.js';
import { renderCardList } from './goodsService.js';
import { modalController } from './modal.js';

const init = async () => {
  const data = await getData();

  const goodsListElem = document.querySelector('.goods__list');
  renderCardList(goodsListElem, data);

  modalController({
    modal: '.modal_order',
    btnOpen: '.btn-order',
    btnClose: '.modal__close',
    open() {
      renderCart(data);
    },
  });

  const { resetForm: resetFormMakeYourOwn } = calculateMakeYourOwn();

  modalController({
    modal: '.modal_make-your-own',
    btnOpen: '.cocktail__btn_make',
    btnClose: '.modal__close',
    close: resetFormMakeYourOwn,
  });

  const { fillInForm: fillInFormAdd, resetForm: resetFormAdd } = calculateAdd();

  modalController({
    modal: '.modal_add',
    btnOpen: '.cocktail__btn_add',
    btnClose: '.modal__close',
    open({ btn }) {
      const id = btn.dataset.id; // Из data-арибута всегда приходит строка
      const item = data.find((item) => item.id.toString() === id);
      fillInFormAdd(item);
    },
    close: resetFormAdd,
  });
};

init();
