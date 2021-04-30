window.addEventListener('load', function () {
  let existingHistory;
  if (!JSON.parse(localStorage.getItem('history'))) {
    existingHistory = [];
  } else {
    existingHistory = JSON.parse(localStorage.getItem('history'));
  }

  let historyItems = [];

  getForecast = (weatherValue) => {
    if (!weatherValue) {
      return;
    }

    let apiKey = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherValue}&appid=875237a179f3849c7b98272538507d81&units=imperial`;
    fetch(apiKey)
      .then((res) => res.json())
      .then((data) => {
  
        let forecast = document.querySelector('#forecast');
        forecast.innerHTML = '<h4 class="mt-3"></h4>';

        forecastRow = document.createElement('div');
        forecastRow.className = '"row"';

        for (let i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
    
            let col = document.createElement('div');
            col.classList.add('col-md-2');
            let card = document.createElement('div');
            card.classList.add('card', 'bg-primary', 'text-white');
            let wind = document.createElement('p');
            wind.classList.add('card-text');
            wind.textContent = `Wind Speed: ${data.list[i].wind.speed} MPH`;
            let humidity = document.createElement('p');
            humidity.classList.add('card-text');
            humidity.textContent = `Humidity : ${data.list[i].main.humidity} %`;
            let body = document.createElement('div');
            body.classList.add('card-body', 'p-2');
            let title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = new Date(
              data.list[i].dt_txt
            ).toLocaleDateString();
            let img = document.createElement('img');
            img.setAttribute(
              'src',
              `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
            );
            let p1 = document.createElement('p');
            p1.classList.add('card-text');
            p1.textContent = `Temp: ${data.list[i].main.temp_max} °F`;
            let p2 = document.createElement('p');
            p2.classList.add('card-text');
            p2.textContent = `Humidity: ${data.list[i].main.humidity}%`;

            col.appendChild(card);
            body.appendChild(title);
            body.appendChild(img);
            body.appendChild(wind);
            body.appendChild(humidity);
            body.appendChild(p1);
            body.appendChild(p2);
            card.appendChild(body);
            forecast.appendChild(col);
          }
        }
      });
  }

  function getUVIndex(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/uvi?appid=875237a179f3849c7b98272538507d81&lat=${lat}&lon=${lon}`
    )
      .then((res) => res.json())
      .then((data) => {
        let body = document.querySelector('.card-body');
        let uvIndex = document.createElement('p');
        uvIndex.id = 'uv';
        uvIndex.textContent = 'UV Index: ';
        let button = document.createElement('span');
        button.classList.add('btn', 'btn-sm');
        button.innerHTML = data.value;

        switch (data.value) {
          case data.value < 3:
            button.classList.add('btn-success');
            break;
          case data.value < 7:
            button.classList.add('btn-warning');
            break;
          default:
            button.classList.add('btn-danger');
        }

        body.appendChild(uvIndex);
        uvIndex.appendChild(button);
      });
  }

  const handleHistory = (term) => {
    if (existingHistory && existingHistory.length > 0) {
      let existingEntries = JSON.parse(localStorage.getItem('history'));
      let newHistory = [...existingEntries, term];
      localStorage.setItem('history', JSON.stringify(newHistory));
    } else {
      historyItems.push(term);
      localStorage.setItem('history', JSON.stringify(historyItems));
    }
  };


  function searchMain (weatherValue) {
    var apiKey = `https://api.openweathermap.org/data/2.5/weather?q=${weatherValue}&appid=875237a179f3849c7b98272538507d81&units=imperial`;
    fetch(apiKey)
      .then((res) => res.json())
      .then((data) => {

        if (!existingHistory.includes(weatherValue)) {
          handleHistory(weatherValue);
        }

        today = document.querySelector('#today');
        today.textContent = ' ';
  
        let title = document.createElement('h3');
        title.classList.add('card-title');
        title.textContent = `${
          data.name
        } (${new Date().toLocaleDateString()})`;
        let card = document.createElement('div');
        card.classList.add('card');
        let temp = document.createElement('p');
        temp.classList.add('card-text');
        temp.textContent = `Temperature: ${data.main.temp} °F`;
        let wind = document.createElement('p');
        wind.classList.add('card-text');
        let humid = document.createElement('p');
        humid.classList.add('card-text');
        humid.textContent = `Humidity: ${data.main.humidity} %`;
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'bg-primary', 'text-white');
        let img = document.createElement('img');
        img.setAttribute(
          'src',
          `https://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );
  
        title.appendChild(img);
        cardBody.appendChild(title);
        cardBody.appendChild(temp);
        cardBody.appendChild(humid);
        cardBody.appendChild(wind);
        card.appendChild(cardBody);
        today.appendChild(card);
  
        getForecast(weatherValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      });
  }

  function makeRow(weatherValue) {
  
    let liTag = document.createElement('li');
    liTag.classList.add('list-group-item', 'list-group-item-action');
    liTag.id = weatherValue;
    let text = weatherValue;
    liTag.textContent = text;

    liTag.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        searchMain(e.target.textContent);
      }
    });
    document.getElementById('history').appendChild(liTag);
  }

  if (existingHistory && existingHistory.length > 0) {
    existingHistory.forEach((item) => makeRow(item));
  }

  function getSearchVal() {
    let weatherValue = document.querySelector('#search-value').value;
    if (weatherValue) {
      searchMain(weatherValue);
      makeRow(weatherValue);
      document.querySelector('#search-value').value = '';
    }
  }

  document
    .querySelector('#search-button')
    .addEventListener('click', getSearchVal);
});


document.body.style.backgroundImage = "url('/images/background1.jpeg')";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "cover";


