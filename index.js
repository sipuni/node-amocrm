const axios = require('axios');

const apiUrl = '/api/v4';

const valueOrNull = (val) => val ? val : null;


class SipuniAmocrm {
  options = {};
  customFieldsCache = {};

  constructor(options) {
    this.options = options;

    // TODO: validate
  }

  async amoApiGetMultipage(data_field, path, paramsOrData = {}) {
    const result = [];
    let page = 1;
    let hasMorePages = true;
    while(hasMorePages) {
      const data = await this.amoApiRequest('GET', path, {
        ...paramsOrData,
        page,
      });
      result.push(...data._embedded[data_field]);
      hasMorePages = data._page_count > page;
      page += 1;
    }
    return result;
  }

  async amoApiRequest(method, path, paramsOrData = {}) {
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
      let message = '';
      if (error.response) {
        message = `${error.response.data.title}. ${error.response.data.detail}`;
        if (error.response.data['validation-errors']) {
          const validationErrors = JSON.stringify(error.response.data['validation-errors'], null, 2);
          message += `\n${validationErrors}`;
        }
      } else {
        message = `${error.message}`;
      }
      throw new Error(message);
    }
  }

  // Leads

  getLead(leadId) {
    return this.amoApiRequest('GET', `/leads/${leadId}`);
  }

  async findLeads(query, limit = 10) {
    const result = await this.amoApiRequest('GET', '/leads', {
      ...query,
      limit
    });
    return result?._embedded.leads;
  }

  async createLead(leadProperties) {
    const result = await this.amoApiRequest('POST', '/leads', [leadProperties]);
    return result._embedded.leads.shift();
  }

  async updateLead(leadProperties) {
    const result = await this.amoApiRequest('PATCH', '/leads', [leadProperties]);
    return result._embedded.leads.shift();
  }


  // Contacts

  getContact(contactId) {
    return this.amoApiRequest('GET', `/contacts/${contactId}`);
  }

  async findContacts(query, limit = 10) {
    const result = await this.amoApiRequest('GET', '/contacts', {
      ...query,
      limit
    });
    return result?._embedded.contacts;
  }

  async createContact(contactProperties) {
    const result = await this.amoApiRequest('POST', '/contacts', [contactProperties]);
    return result._embedded.contacts.shift();
  }

  async updateContact(contactProperties) {
    const result = await this.amoApiRequest('PATCH', '/contacts', [contactProperties]);
    return result._embedded.contacts.shift();
  }

  // Companies

  getCompany(companyId) {
    return this.amoApiRequest('GET', `/companies/${companyId}`);
  }

  async findCompanies(query, limit = 10) {
    const result = await this.amoApiRequest('GET', '/companies', {
      ...query,
      limit
    });
    return result?._embedded.companies;
  }

  async createCompany(companyProperties) {
    const result = await this.amoApiRequest('POST', '/companies', [companyProperties]);
    return result._embedded.companies.shift();
  }

  async updateCompany(companyProperties) {
    const result = await this.amoApiRequest('PATCH', '/companies', [companyProperties]);
    return result._embedded.companies.shift();
  }

  // Pipelines

  async getPipeline(id) {

  }

  async createPipeline(pipelineProperties) {

  }

  // Tasks

  async getTask(taskId) {
    return this.amoApiRequest('GET', `/tasks/${taskId}`);
  }

  async createTask(taskProperties) {
    const result = await this.amoApiRequest('POST', '/tasks', [taskProperties]);
    return result._embedded.tasks.shift();
  }

  async updateTask(taskProperties) {
    const result = await this.amoApiRequest('PATCH', '/tasks', [taskProperties]);
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
    const result = await this.amoApiRequest('GET', '/tasks', {
      ...query,
      limit
    });
    return result?._embedded.tasks;
  }

  // Custom Fields
  async getCustomFields(entityType) {
    if (!this.customFieldsCache[entityType]) {
      this.customFieldsCache[entityType] = await this.amoApiGetMultipage('custom_fields', `/${entityType}/custom_fields`);
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
