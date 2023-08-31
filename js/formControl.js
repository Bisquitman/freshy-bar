import { cartDataControl } from "./cartControl.js";
import { price } from "./config.js";
import { getFormData } from "./getFormData.js";

export const formSubmit = (form, cb) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = getFormData(form);
    cartDataControl.addLS(data);

    if (cb) {
      cb();
    }
  });
};

export const calculateTotalPrice = (form, startPrice) => {
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

export const calculateMakeYourOwn = () => {
  const modalMakeOwn = document.querySelector('.modal_make-your-own');
  const formMakeOwn = modalMakeOwn.querySelector('.make__form_make-your-own');
  const makeInputTitle = modalMakeOwn.querySelector('.make__input-title');
  const makeInputPrice = modalMakeOwn.querySelector('.make__input_price');
  const makeTotalPrice = modalMakeOwn.querySelector('.make__total-price');
  const makeAddBtn = modalMakeOwn.querySelector('.make__add-btn');
  const initialPrice = makeTotalPrice.textContent;

  const handlerChange = () => {
    const totalPrice = calculateTotalPrice(formMakeOwn, 260);
    const data = getFormData(formMakeOwn);

    if (data.ingredients) {
      const ingredients = Array.isArray(data.ingredients) ? data.ingredients.join(', ') : data.ingredients;

      makeInputTitle.value = `Конструктор: ${ingredients}`;
      makeAddBtn.disabled = false;
    } else {
      makeAddBtn.disabled = true;
    }

    makeInputPrice.value = totalPrice;
    makeTotalPrice.innerHTML = `${totalPrice}&nbsp;&#8381;`;
  };

  formMakeOwn.addEventListener('change', handlerChange);
  formSubmit(formMakeOwn, () => {
    modalMakeOwn.closeModal('close');
  });
  handlerChange();

  const resetForm = () => {
    makeTotalPrice.innerHTML = initialPrice;
    makeAddBtn.disabled = true;
    formMakeOwn.reset();
  };

  return { resetForm };
};

export const calculateAdd = () => {
  const modalAdd = document.querySelector('.modal_add');
  const formAdd = document.querySelector('.make__form_add');
  const makeTitle = modalAdd.querySelector('.make__title');
  const makeInputTitle = modalAdd.querySelector('.make__input-title');
  const makeTotalPrice = modalAdd.querySelector('.make__total-price');
  const makeInputStartPrice = modalAdd.querySelector('.make__input-start-price');
  const makeInputPrice = modalAdd.querySelector('.make__input-price');
  const makeTotalSize = modalAdd.querySelector('.make__total-size');
  const makeInputSize = modalAdd.querySelector('.make__input-size');

  const handlerChange = () => {
    const totalPrice = calculateTotalPrice(formAdd, +makeInputStartPrice.value);
    makeInputPrice.value = totalPrice;
    makeTotalPrice.innerHTML = `${totalPrice}&nbsp;&#8381;`;
  };

  formAdd.addEventListener('change', handlerChange);
  formSubmit(formAdd, () => modalAdd.closeModal('close'));

  const fillInForm = (data) => {
    makeTitle.textContent = data.title;
    makeInputTitle.value = data.title;
    makeTotalPrice.innerHTML = `${data.price}&nbsp;&#8381;`;
    makeInputStartPrice.value = data.price;
    makeInputPrice.value = data.price;
    makeTotalSize.textContent = data.size;
    makeInputSize.value = data.size;
    handlerChange();
  };

  const resetForm = () => {
    makeTitle.textContent = '';
    makeTotalPrice.textContent = '';
    makeTotalSize.textContent = '';
    formAdd.reset();
  };

  return { fillInForm, resetForm };
};