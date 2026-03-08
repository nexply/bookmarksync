import I18n from './i18n.js';

class WebDAVError extends Error {
  constructor(message, type, statusCode, details = {}) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

class WebDAVClient {
  constructor(serverUrl, username, password) {
    this.serverUrl = serverUrl;
    this.username = username;
    this.password = password;
  }

  async testConnection() {
    try {
      const response = await fetch(this.serverUrl + '/bookmarks.json', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
        }
      });

      if (response.status === 401) {
        throw new WebDAVError(I18n.t('errors.authFailed'), 'auth', 401);
      }

      return response.ok || response.status === 404;
    } catch (error) {
      if (error instanceof WebDAVError) {
        throw error;
      }
      throw new WebDAVError(I18n.t('errors.networkError'), 'network', 0);
    }
  }

  async uploadBookmarks(bookmarkData) {
    try {
      const response = await fetch(this.serverUrl + '/bookmarks.json', {
        method: 'PUT',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.username}:${this.password}`),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookmarkData)
      });
      
      if (!response.ok) {
        throw new Error(I18n.t('errors.uploadFailed'));
      }
    } catch (error) {
      throw new Error(I18n.t('errors.uploadFailed') + ': ' + error.message);
    }
  }

  async downloadBookmarks() {
    try {
      const response = await fetch(this.serverUrl + '/bookmarks.json', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
        }
      });
      
      if (!response.ok) {
        throw new Error(I18n.t('errors.downloadFailed'));
      }

      return await response.json();
    } catch (error) {
      throw new Error(I18n.t('errors.downloadFailed') + ': ' + error.message);
    }
  }
}

export default WebDAVClient; 