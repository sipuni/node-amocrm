# Модуль Node.js для работы с API amoCRM

### Описание

* Библиотека использует amoCRM API V4. 
* Не включает реализацию OAuth.

Пример использования:
```
const AmoCrmAPI = require('@sipuni/amocrm');

const accessToken = .... // токен, полученный при помощи OAuth

const amoApi = new AmoCrmAPI('mydomain.amocrm.ru', accessToken);

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

### Лицензия

MIT