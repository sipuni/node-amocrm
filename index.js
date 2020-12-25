const axios = require('axios');

const apiUrl = '/api/v4';

const valueOrNull = (val) => val ? val : null;

function trim(str, ch) {
  let start = 0, end = str.length;

  while(start < end && str[start] === ch)
      ++start;

  while(end > start && str[end - 1] === ch)
      --end;

  return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function firstOrNull(arr) {
  if (Array.isArray(arr)) {
    return arr[0] || null;
  }
  return null;
}

class CRUDMethods {

  constructor (api, entity) {
    this.entity = entity;
    this.api = api;
  }

  async get(id) {
    return this.api.getEntity(`/${this.entity}`, id);
  }

  async create(properties) {
    return this.api.createEntity(`/${this.entity}`, properties);
  }

  async update(properties) {
    return this.api.updateEntity(`/${this.entity}`, properties);
  }

  async list(query, limit=10) {
    return this.api.listEntity(`/${this.entity}`, query, limit);
  }

  async delete(id) {

  }
}

class CallsMethods {
  constructor (api) {
    this.entity = 'calls';
    this.api = api;
  }

  async create(properties) {
    return this.api.createEntity(`/${this.entity}`, properties);
  }
}

class SipuniAmocrm {
  options = {};
  customFieldsCache = {};
  cachedMethodsObjects = {};

  constructor(options) {
    this.options = options;
  }

  _getMethodsObject(entity, className) {
    if (!this.cachedMethodsObjects[entity]) {
      this.cachedMethodsObjects[entity] = new className(this, entity);
    }
    return this.cachedMethodsObjects[entity];
  }

  // API methods grouped by entity

  get tasks() {
    return this._getMethodsObject('tasks', CRUDMethods);
  }

  get leads() {
    return this._getMethodsObject('leads', CRUDMethods);
  }

  get companies() {
    return this._getMethodsObject('companies', CRUDMethods);
  }

  get contacts() {
    return this._getMethodsObject('contacts', CRUDMethods);
  }

  get calls() {
    return this._getMethodsObject('calls', CallsMethods);
  }

  // Universal requests

  async request(method, path, paramsOrData = {}) {
    const isGet = method === 'GET';
    const params = isGet ? paramsOrData : {};
    const data = !isGet ? paramsOrData : {};
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.options.accessToken) {
      headers['Authorization'] = `Bearer ${this.options.accessToken}`;
    } else {
      params['USER_LOGIN'] = this.options.login;
      params['USER_HASH'] = this.options.hash;
    }

    try {
      const response = await axios.request({
        url: `https://${this.options.domain}${apiUrl}${path}`,
        method,
        data,
        params,
        headers,
      });
      return valueOrNull(response.data);
    } catch (error) {
      console.log(error.response.data);
      let message = '';
      if (error.response) {
        if (error.response.data.title) {
          message = `${error.response.data.title}. ${error.response.data.detail}`;
        }
        if (error.response.data['validation-errors']) {
          const validationErrors = JSON.stringify(error.response.data['validation-errors'], null, 2);
          message += `\n${validationErrors}`;
        }
        if (!message) {
          message = `${error.response.status} ${error.response.statusText}`;
        }
      } else {
        message = `${error.message}`;
      }
      throw new Error(message);
    }
  }

  async requestMultipage(data_field, path, params = {}) {
    const result = [];
    let page = 1;
    let hasMorePages = true;
    while(hasMorePages) {
      const data = await this.request('GET', path, {
        ...params,
        page,
      });
      result.push(...data._embedded[data_field]);
      hasMorePages = data._page_count > page;
      page += 1;
    }
    return result;
  }

  async _entityRequest(method, path, paramsOrData, singleResult = true) {
    const result = await this.request(method, path, paramsOrData);
    const entity = trim(path, '/');
    if (singleResult) {
      return firstOrNull(result && result._embedded[entity]);
    } else {
      return result && result._embedded && result._embedded[entity];
    }
  }

  async getEntity(path, itemId) {
    return this.request('GET', `${path}/${itemId}`, {});
  }

  async listEntity(path, query, limit=10) {
    return this._entityRequest('GET', path,
      {
      ...query,
      limit
      },
      false);
  }

  async createEntity(path, properties) {
    return this._entityRequest('POST', path, [properties], true);
  }

  async updateEntity(path, properties) {
    return this._entityRequest('PATCH', path, [properties], true);
  }

  // Leads

  async getLead(leadId) {
    return this.getEntity('/leads', leadId);
  }

  async findLeads(query, limit = 10) {
    const result = await this.request('GET', '/leads', {
      ...query,
      limit
    });
    return result?._embedded.leads;
  }

  async createLead(leadProperties) {
    const result = await this.request('POST', '/leads', [leadProperties]);
    return result._embedded.leads.shift();
  }

  async updateLead(leadProperties) {
    const result = await this.request('PATCH', '/leads', [leadProperties]);
    return result._embedded.leads.shift();
  }


  // Contacts

  getContact(contactId) {
    return this.request('GET', `/contacts/${contactId}`);
  }

  async findContacts(query, limit = 10) {
    const result = await this.request('GET', '/contacts', {
      ...query,
      limit
    });
    return result?._embedded.contacts;
  }

  async createContact(contactProperties) {
    const result = await this.request('POST', '/contacts', [contactProperties]);
    return result._embedded.contacts.shift();
  }

  async updateContact(contactProperties) {
    const result = await this.request('PATCH', '/contacts', [contactProperties]);
    return result._embedded.contacts.shift();
  }

  // Companies

  getCompany(companyId) {
    return this.request('GET', `/companies/${companyId}`);
  }

  async findCompanies(query, limit = 10) {
    const result = await this.request('GET', '/companies', {
      ...query,
      limit
    });
    return result?._embedded.companies;
  }

  async createCompany(companyProperties) {
    const result = await this.request('POST', '/companies', [companyProperties]);
    return result._embedded.companies.shift();
  }

  async updateCompany(companyProperties) {
    const result = await this.request('PATCH', '/companies', [companyProperties]);
    return result._embedded.companies.shift();
  }

  // Tasks

  async getTask(taskId) {
    return this.request('GET', `/tasks/${taskId}`);
  }

  async createTask(taskProperties) {
    const result = await this.request('POST', '/tasks', [taskProperties]);
    return result._embedded.tasks.shift();
  }

  async updateTask(taskProperties) {
    const result = await this.request('PATCH', '/tasks', [taskProperties]);
    return result._embedded.tasks.shift();
  }

  completeTask(taskId, comment = '') {
    return this.updateTask({
      id: taskId,
      is_completed: true,
      result: {
        text: comment
      }
    });
  }

  async findTasks(query, limit = 10) {
    const result = await this.request('GET', '/tasks', {
      ...query,
      limit
    });
    return result?._embedded.tasks;
  }

  // Custom Fields
  async getCustomFields(entityType) {
    if (!this.customFieldsCache[entityType]) {
      this.customFieldsCache[entityType] = await this.requestMultipage('custom_fields', `/${entityType}/custom_fields`);
    }
    return this.customFieldsCache[entityType];
  }

  preparePhoneField(phoneString, phoneEnum = 'WORK') {
    return {
      field_code: 'PHONE',
      values: [
        {
          value: phoneString,
          enum_code: phoneEnum
        }
      ]
    }
  }

}


module.exports = SipuniAmocrm;
