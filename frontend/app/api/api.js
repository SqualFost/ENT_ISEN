class ISEN_Api {
  constructor() {
    this.baseUrl = "https://api-ent.isenengineering.fr/v1/";
    this.headers = {
      "Content-Type": "application/json",
      Accept: "text/plain",
      Token: null,
    };
  }
  async fetchData(endpoint) {
    try {
      const response = await fetch(this.baseUrl + endpoint, {
        method: "GET",
        headers: this.headers,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
  async login(username, password) {
    try {
      const response = await fetch(this.baseUrl + "token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      this.setToken(data);
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
  async setToken(token) {
    this.headers.Token = token;
  }
  async getAbscences() {
    return this.fetchData("absences");
  }
  async getAgenda(start = 0, end = 0) {
    if (start !== 0 && end !== 0) {
      return this.fetchData(`agenda?start=${start}&end=${end}`);
    }
    if (start !== 0) {
      return this.fetchData(`agenda?start=${start}`);
    }
    if (end !== 0) {
      return this.fetchData(`agenda?end=${end}`);
    }
    const response = await this.fetchData("agenda");
    console.log("response:", response);
    return response;
  }
  async getEventById(id) {
    return this.fetchData(`agenda/event/${id}`);
  }
  async getNotations() {
    return await this.fetchData("notations");
  }
  async getUserClassNotations() {
    return this.fetchData("notations/class");
  }
  async getUserInfo() {
    return this.fetchData("personal-informations");
  }
}

export default ISEN_Api;
