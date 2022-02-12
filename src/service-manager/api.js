import axios from 'axios';


/*    headers:[{"Content-Type" : "application/json"},
        {"Access-Control-Allow-Origin" : "*"},
        {"Access-Control-Allow-Methods" : "DELETE, POST, GET, OPTIONS"},
        {"Access-Control-Allow-Headers" : "Content-Type, Access-Control-Allow-Header"}
      ]
});*/

/*const instanceAuth = (token) => {
    const currentToken = token || localStorage.getItem("token")
    return axios.create({
        headers: {"Content-Type" : "application/json", "Authorization": `Bearer ${currentToken}`}
    })
} */


function multipartInstanceAuth() {
  var token = localStorage.getItem('token');

  return axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        "Content-Type" : "multipart/form-data", 
        "Authorization":"Bearer " + token,                       
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    mode: 'no-cors',  
    credentials: 'same-origin',    
  });
}


const  qs  =  require ( 'querystring' )

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';


function generaInstancia() {
  return axios.create({
        headers:{
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json; charset=utf-8',
                  "Access-Control-Allow-Headers" : "Content-Type",
                  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
                },
        mode: 'no-cors',  
        credentials: 'same-origin',      
  });
}


function regeneraInstancia() {
  var token = localStorage.getItem('token');
  return axios.create({
        headers:{"Authorization":"Bearer " + token}
  });
}

class ApiManager {

    loginUser(path, data){
        return new Promise((resolve, reject) => {
          generaInstancia().post(path,data)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                  try{
                    reject(error.response.data)
                  }catch{
                    let errorCustom = {'Mensaje': "Sin conexión"}
                    reject(errorCustom)
                  }
                  reject(error.response.data)
                }).finally(function () {

                });
        })
    }

    getData(path){
        return new Promise((resolve, reject) => {
            regeneraInstancia().get(path,{timeout: 60000})
                .then(response => {resolve(response)})
                .catch(error => { 
                  reject(error.response)
                })
                .finally(function () {

                });
            })
    }

    postData(path,data,requestNum) {
        
        return new Promise((resolve, reject) => {
            regeneraInstancia().post(path, data,{timeout: 6000})
            .then(response => {resolve(response.data)})
            .catch(
              error => {
                try{
                  reject(error.response.data)
                }catch{
                  if(!requestNum || requestNum !== true){ 
                    this.postData(path,data,true)
                  }else{ 
                    let errorCustom = {'Mensaje': "Sin conexión"}
                    reject(errorCustom)
                  }
                }
                })
            .finally(function () {
                  
          });
        })
    }
    
    postDataForm(path, data) {
      return new Promise((resolve, reject) => {
        multipartInstanceAuth().post(path, data)
          .then(response => {resolve(response.data)})
          .catch(
            error => {
              try{
                reject(error.response.data)
              }catch{
                let errorCustom = {'Mensaje': "Sin conexión"}
                reject(errorCustom)
              }
            }
          )
          .finally(function () {
            
          });
      });
    } 

    postDataFormUrlencoded(path, data) {
      return new Promise((resolve, reject) => {
          axios.post(path, qs.stringify(data),config)
          .then(response => {
            resolve(response.data)
          }
            
          )
          .catch(error => {
              reject(error.response)
          })
          .finally(function () {
            
          });
      });
    }
}

export default new ApiManager()

/*async function callApi(endpoint, options = {}) {
  await simulateNetworkLatency();

  options.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const url = BASE_URL + endpoint;
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}


    postPromise(parameters){
        return new Promise((resolve, reject) => {
            instanceAuth(this.token).post(parameters, {})
                .then(response => {resolve(response.data)})
                .catch(error => reject(error.response.data))
        })
    }

const api = {
  badges: {
    list() {
      return callApi('/badges');
    },
    create(badge) {
      return callApi(`/badges`, {
        method: 'POST',
        body: JSON.stringify(badge),
      });
    },
    read(badgeId) {
      return callApi(`/badges/${badgeId}`);
    },
    update(badgeId, updates) {
      return callApi(`/badges/${badgeId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
    // Lo hubiera llamado `delete`, pero `delete` es un keyword en JavaScript asi que no es buena idea :P
    remove(badgeId) {
      return callApi(`/badges/${badgeId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;*/