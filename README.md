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

Сделки
```
getLead(leadId)
async findLeads(query, limit = 10)
async createLead(leadProperties)
async updateLead(leadProperties)
```

Контакты
```
getContact(contactId)
async findContacts(query, limit = 10)
async createContact(contactProperties)
async updateContact(contactProperties)
```

Компании
```
getCompany(companyId)
async findCompanies(query, limit = 10)
async createCompany(companyProperties)
async updateCompany(companyProperties)
```

Задачи
```
async getTask(taskId)
async createTask(taskProperties)
async updateTask(taskProperties)
completeTask(taskId, comment = '')
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

const lead = await amoApi.createLead({ name: 'New lead' });
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

const lead = await amoApi.createLead({ name: 'New lead' });
```

**Создание контакта с телефоном**
```ecmascript 6
const contact = await amo.createContact({
    name: 'New contact',
    custom_fields_values: [
      amo.preparePhoneField('74996474747', 'WORK'),
    ],
});
```

**Создание задачи с привязкой к контакту**
```ecmascript 6
const timestamp = Math.ceil((new Date()).getTime()/1000);
const task = await amo.createTask({
    entity_id: contactId,
    entity_type: 'contacts',
    text: 'Call back a customer',
    complete_till: timestamp + 60*60*24,
});
```

**Поиск незавершенной задачи для ответсвенного и заданного контакта**
```ecmascript 6
const existing = await amo.findTasks({
    'filter[responsible_user_id]': amoUserId,
    'filter[is_completed]': 0,
    'filter[entity_type]': 'contacts',
    'filter[entity_id]': contactId,
});
```

### Лицензия

[MIT](https://ru.wikipedia.org/wiki/%D0%9B%D0%B8%D1%86%D0%B5%D0%BD%D0%B7%D0%B8%D1%8F_MIT) © [Sipuni](http://sipuni.com)