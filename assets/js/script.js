document.body.style.backgroundImage = "url('./images/background1.jpeg')";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundSize = "cover";

window.addEventListener('load', function () {
  // Grab the existing history from local storage IF it exists
  let existingHistory;
  if (!JSON.parse(localStorage.getItem('history'))) {
    existingHistory = [];
  } else {
    existingHistory = JSON.parse(localStorage.getItem('history'));
  }

  let historyItems = [];

  // Function to get the forecast, loop through only the days of the week and render data to the page
  getForecast = (searchValue) => {
    if (!searchValue) {
      return;
    }

    let apiKey = `http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=875237a179f3849c7b98272538507d81&units=imperial`;
    fetch(apiKey)
      .then((res) => res.json())
      .then((data) => {
        // Select our forecast element and add a header to it
        let forecast = document.querySelector('#forecast');
        forecast.innerHTML = '<h4 class="mt-3"></h4>';

        // Create a div and give it a class of row
        forecastRow = document.createElement('div');
        forecastRow.className = '"row"';

        // Loop for 5 times to make the display 5 cards
        for (let i = 0; i < data.list.length; i++) {
          // Only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf('15:00:00') !== -1) {
            // Make cards to display info
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
              `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
            );
            let p1 = document.createElement('p');
            p1.classList.add('card-text');
            p1.textContent = `Temp: ${data.list[i].main.temp_max} °F`;
            let p2 = document.createElement('p');
            p2.classList.add('card-text');
            p2.textContent = `Humidity: ${data.list[i].main.humidity}%`;

            // Merge together and put on page
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

  // Helper function to fetch and display the UV index
  function getUVIndex(lat, lon) {
    fetch(
      `http://api.openweathermap.org/data/2.5/uvi?appid=875237a179f3849c7b98272538507d81&lat=${lat}&lon=${lon}`
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
            buttonEl.classList.add('btn-success');
            break;
          case data.value < 7:
            buttonEl.classList.add('btn-warning');
            break;
          default:
            buttonEl.classList.add('btn-danger');
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

  // Function that preforms the actual API request and creates elements to render to the page
  function searchWeather(searchValue) {
    var apiKey = `http://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=875237a179f3849c7b98272538507d81&units=imperial`;
    fetch(apiKey)
      .then((res) => res.json())
      .then((data) => {
        // Call for history method
        if (!existingHistory.includes(searchValue)) {
          handleHistory(searchValue);
        }
        // Clear content
        today = document.querySelector('#today');
        today.textContent = ' ';

        // Create html content for current weather
        let title = document.createElement('h3');
        title.classList.add('card-title');
        title.textContent = `${
          data.name
        } (${new Date().toLocaleDateString()})`;
        let card = document.createElement('div');
        card.classList.add('card');
        let wind = document.createElement('p');
        wind.classList.add('card-text');
        let humid = document.createElement('p');
        humid.classList.add('card-text');
        let temp = document.createElement('p');
        temp.classList.add('card-text');
        humid.textContent = `Humidity: ${data.main.humidity} %`;
        temp.textContent = `Temperature: ${data.main.temp} °F`;
        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'bg-primary', 'text-white');
        let img = document.createElement('img');
        img.setAttribute(
          'src',
          `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
        );

        // Append all the content that we created
        title.appendChild(img);
        cardBody.appendChild(title);
        cardBody.appendChild(temp);
        cardBody.appendChild(humid);
        cardBody.appendChild(wind);
        card.appendChild(cardBody);
        today.appendChild(card);

        // Invoke our forecast and UV functions
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      });
  }

  // Helper function to create a new row
  function makeRow(searchValue) {
    // Create a new `li` element and add classes/text to it
    let liTag = document.createElement('li');
    liTag.classList.add('list-group-item', 'list-group-item-action');
    liTag.id = searchValue;
    let text = searchValue;
    liTag.textContent = text;

    // Select the history element and add an event to it
    liTag.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        searchWeather(e.target.textContent);
      }
    });
    document.getElementById('history').appendChild(liTag);
  }

  // Render existing history to the page.
  if (existingHistory && existingHistory.length > 0) {
    existingHistory.forEach((item) => makeRow(item));
  }

  // Helper function to get a search value.
  function getSearchVal() {
    let searchValue = document.querySelector('#search-value').value;
    if (searchValue) {
      searchWeather(searchValue);
      makeRow(searchValue);
      document.querySelector('#search-value').value = '';
    }
  }

  // Attach our getSearchVal function to the search button
  document
    .querySelector('#search-button')
    .addEventListener('click', getSearchVal);
});
