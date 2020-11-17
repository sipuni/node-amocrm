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


### Примеры использования

C использованием access token.
```ecmascript 6
const AmoCrmAPI = require('@sipuni/amocrm');

const accessToken = .... // токен, полученный при помощи OAuth

const amoApi = new AmoCrmAPI({
    domain: 'mydomain.amocrm.ru', 
    accessToken
});

const lead = await amoApi.createLead({ name: 'New lead' });
```

С использованием login/hash.
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

Создание контакта с телефоном
```ecmascript 6
const contact = await amo.createContact({
    name: 'New contact',
    custom_fields_values: [
      amo.preparePhoneFiled('74996474747', 'WORK'),
    ],
});
```

### Лицензия

MIT