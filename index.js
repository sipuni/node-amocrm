const axios = require('axios');

const apiUrl = '/api/v4';

const valueOrNull = (val) => val ? val : null;


class SipuniAmocrm {
  options = {};

  constructor(options) {
    this.options = options;

    // TODO: validate
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
      query,
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
      query,
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
      query,
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
}


module.exports = SipuniAmocrm;
