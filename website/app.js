let d = new Date();
let newDate = d.toDateString();
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = ",&appid=2eec3ea5cf5a6c6130efa46ca43c79d0&units=metric";
const server = "https://weather-app-0k8k.onrender.com";
const error = document.getElementById("error");
const genData = () => { 
  let countryCode = document.getElementById("zip").value;
  let mood = document.getElementById("feelings").value;
  weatherData(countryCode).then((data) => {
    if (data) {
      const {
        main: { temp },
        name: city,
        weather: [{ description }],
      } = data;
      const info = {
        newDate,city,temp: Math.round(temp), description,mood,
      };
      postData(server + "/add", info);
      updatingUI();
      document.getElementById('entry').style.opacity = 1;
    }
  });
};
document.getElementById("generate").addEventListener("click", genData);
const weatherData = async (countryCode) => {
  try {
    const res = await fetch(baseURL + countryCode + apiKey);
    const data = await res.json();

    if (data.cod != 200) {
      error.innerHTML = data.message;
      setTimeout(_=> error.innerHTML = '', 2000)
      throw `${data.message}`;
    }

    return data;
  } catch (err) {
    console.log('Error Found',err);
  }
};
const postData = async (url = "", info = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  });

  try {
    const newData = await res.json();
    console.log(`You just saved`, newData);
    return newData;
  } catch (error) {
    console.log('Error In Post Data',error);
  }
};
const updatingUI = async () => {
  const res = await fetch(server + "/all");
  try {
    const savedData = await res.json();

    document.getElementById("date").innerHTML = savedData.newDate;
    document.getElementById("city").innerHTML = savedData.city;
    document.getElementById("temp").innerHTML = savedData.temp;
    document.getElementById("description").innerHTML = savedData.description;
    document.getElementById("content").innerHTML = savedData.mood;
  } catch (erorr) {
    console.log("UpdatinUI",erorr);
  }
};