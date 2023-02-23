import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
};
  


export const getJSON = async function(url){
    try{

        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();
        
        if(!res.ok) throw new Error(`${data.message}, ${res.status}`);

        return data;
    }catch(err){
        throw err;
    }
}


//Sending data to API with fetch 
export const sendJSON = async function(url, uploadData){
  try{

      const fetchPro = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(uploadData)
      });

      //Takodje imamo race
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      //Podaci koje API vraca(ukoliko uopste ista vrati)
      const data = await res.json();
      
      if(!res.ok) throw new Error(`${data.message}, ${res.status}`);

      return data;
  }catch(err){
      throw err;
  }
}

//548fca8e-71aa-4ea2-8ead-58f03440e6b9