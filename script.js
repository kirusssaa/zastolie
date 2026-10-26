const statusNames = {
  new: 'Новая',
  work: 'Обед назначен',
  done: 'Обед проведён',
  cancel: 'Отменена',
};

function getOrders() {
  return JSON.parse(localStorage.getItem('orders')) || [];
}

// Сохранение заявок в браузер (localStorage)
function saveOrders(orders) {
  localStorage.setItem('orders', JSON.stringify(orders));
}

function addOrder(event) {
  event.preventDefault();

  const form = event.target;
  const orders = getOrders();

  orders.push({
    id: orders.length + 1,
    fio: form.fio.value,
    phone: form.phone.value,
    hall: form.hall.value,
    occasion: form.occasion.value,
    date: form.date.value,
    time: form.time.value,
    guests: form.guests.value,
    payment: form.payment.value,
    status: 'new',
    reason: '',
  });

  saveOrders(orders); // сохраняем новую заявку
  window.location.href = 'orders.html';
}

function showMyOrders() {
  const list = document.getElementById('orders-list');
  const orders = getOrders();

  if (orders.length > 0) {
    document.getElementById('orders-empty').hidden = true;
  }

  for (const order of orders) {
    let extra = '';
    if (order.status === 'cancel') {
      extra = `<p class="order__reason">Причина отмены: ${order.reason}</p>`;
    }
    if (order.status === 'done') {
      extra = `
        <form class="form review" method="post" action="">
          <label class="form__label" for="review-${order.id}">Ваш отзыв</label>
          <textarea class="form__input review__text" id="review-${order.id}" placeholder="Спасибо за помощь и внимание" required></textarea>
          <button class="button" type="submit">Оставить отзыв</button>
        </form>`;
    }

    list.innerHTML += `
      <article class="order">
        <h2 class="order__number">Заявка № ${order.id}</h2>
        <p class="order__row"><span class="order__label">Помещение:</span> ${order.hall}</p>
        <p class="order__row"><span class="order__label">Повод:</span> ${order.occasion}</p>
        <p class="order__row"><span class="order__label">Дата:</span> ${order.date}</p>
        <p class="order__row"><span class="order__label">Время:</span> ${order.time}</p>
        <p class="order__row"><span class="order__label">Гостей:</span> ${order.guests}</p>
        <p class="order__row"><span class="order__label">Оплата:</span> ${order.payment}</p>
        <span class="status status--${order.status}">${statusNames[order.status]}</span>
        ${extra}
      </article>`;
  }
}

function showAdminTable() {
  const table = document.getElementById('admin-table');
  const filter = document.getElementById('filter').value;
  const orders = getOrders();
  let count = 0;

  table.innerHTML = '';

  for (const order of orders) {
    if (filter !== 'all' && order.status !== filter) {
      continue;
    }
    count++;

    let options = '';
    for (const key in statusNames) {
      const selected = key === order.status ? 'selected' : '';
      options += `<option value="${key}" ${selected}>${statusNames[key]}</option>`;
    }

    table.innerHTML += `
      <tr>
        <td class="table__cell">${order.id}</td>
        <td class="table__cell">${order.fio}</td>
        <td class="table__cell">${order.phone}</td>
        <td class="table__cell">${order.hall}</td>
        <td class="table__cell">${order.occasion}</td>
        <td class="table__cell">${order.date}</td>
        <td class="table__cell">${order.time}</td>
        <td class="table__cell">${order.guests}</td>
        <td class="table__cell">${order.payment}</td>
        <td class="table__cell"><span class="status status--${order.status}">${statusNames[order.status]}</span></td>
        <td class="table__cell">
          <div class="change">
            <label class="form__label" for="status-${order.id}">Статус</label>
            <select class="form__input" id="status-${order.id}">${options}</select>
            <label class="form__label" for="reason-${order.id}">Причина отмены</label>
            <input class="form__input" type="text" id="reason-${order.id}" value="${order.reason}" placeholder="Зал занят">
            <button class="button" type="button" onclick="changeStatus(${order.id})">Сохранить</button>
          </div>
        </td>
      </tr>`;
  }

  document.getElementById('admin-empty').hidden = count > 0;
}

function changeStatus(id) {
  const orders = getOrders();

  for (const order of orders) {
    if (order.id === id) {
      order.status = document.getElementById(`status-${id}`).value;
      order.reason = document.getElementById(`reason-${id}`).value;
    }
  }

  saveOrders(orders); // сохраняем новый статус
  showAdminTable();
}

function filterOrders(event) {
  event.preventDefault();
  showAdminTable();
}

if (document.getElementById('create-form')) {
  document.getElementById('create-form').addEventListener('submit', addOrder);
}

if (document.getElementById('orders-list')) {
  showMyOrders();
}

if (document.getElementById('admin-table')) {
  showAdminTable();
  document.getElementById('filter-form').addEventListener('submit', filterOrders);
}
