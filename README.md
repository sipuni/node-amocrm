# Модуль Node.js для работы с API amoCRM

[![Build Status](https://travis-ci.org/sipuni/node-amocrm.svg?branch=main)](https://travis-ci.org/sipuni/node-amocrm)

### Описание

* Библиотека использует [amoCRM API V4](https://www.amocrm.ru/developers/content/crm_platform/platform-abilities). 
* Работает с access token, но не включает реализацию OAuth
* Работает с login/hash для старых интеграций

### Установка
```
npm i @sipuni/amocrm
```

### Реализованные методы

Методы сгруппированы и доступны через соответствующие свойства у объекта класса AmoCrmAPI.
Все методы возвращают Promise
```ecmascript 6
const ampApi = new AmoCrmAPI(..)
```

Сделки
```ecmascript 6
ampApi.leads.get(leadId)
ampApi.leads.list(query, limit = 10)
ampApi.leads.create(leadProperties)
ampApi.leads.update(leadProperties)
```

Контакты
```ecmascript 6
ampApi.contacts.get(contactId)
ampApi.contacts.list(query, limit = 10)
ampApi.contacts.create(contactProperties)
ampApi.contacts.update(contactProperties)
```

Компании
```ecmascript 6
ampApi.companies.get(companyId)
ampApi.companies.list(query, limit = 10)
ampApi.companies.create(companyProperties)
ampApi.companies.update(companyProperties)
```

Задачи
```ecmascript 6
ampApi.tasks.get(taskId)
ampApi.tasks.list(query, limit = 10)
ampApi.tasks.create(taskProperties)
ampApi.tasks.update(taskProperties)
```

Звонки
```ecmascript 6
ampApi.calls.create(taskProperties)
```

### Примеры

**Авторизация с использованием access token и создание сделки**
```ecmascript 6
const AmoCrmAPI = require('@sipuni/amocrm');

const accessToken = .... // токен, полученный при помощи OAuth

const amoApi = new AmoCrmAPI({
    domain: 'mydomain.amocrm.ru', 
    accessToken
});

const lead = await amoApi.leads.create({ name: 'New lead' });
```

**Авторизация с использованием login/hash и создание сделки**
```ecmascript 6
const AmoCrmAPI = require('@sipuni/amocrm');

const login = ... // Логин пользователя
const hash = ... // Hash пароля пользователя 

const amoApi = new AmoCrmAPI({
    domain: 'mydomain.amocrm.ru', 
    login,
    hash,
});

const lead = await amoApi.leads.create({ name: 'New lead' });
```

**Создание контакта с телефоном**
```ecmascript 6
const contact = await amo.contacts.create({
    name: 'New contact',
    custom_fields_values: [
      amo.preparePhoneField('74996474747', 'WORK'),
    ],
});
```

**Создание задачи с привязкой к контакту**
```ecmascript 6
const timestamp = Math.ceil((new Date()).getTime()/1000);
const task = await amo.tasks.create({
    entity_id: contactId,
    entity_type: 'contacts',
    text: 'Call back a customer',
    complete_till: timestamp + 60*60*24,
});
```

**Поиск незавершенной задачи для ответственного и заданного контакта**
```ecmascript 6
const existing = await amo.tasks.list({
    'filter[responsible_user_id]': amoUserId,
    'filter[is_completed]': 0,
    'filter[entity_type]': 'contacts',
    'filter[entity_id]': contactId,
});
```

**Произвольный запрос к amoCRM API**

Поскольку не для всех сущностей реализованы методы, можно вызывать API методы amoCRM напрямую, при 
помощи метода request.
```ecmascript 6
const lead = await amo.request('POST', '/leads', {
  name: 'New lead'
});

const task = await amo.request('GET', '/leads/124212');
```

### Лицензия

[MIT](https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F_MIT) © [Sipuni](http://sipuni.com)