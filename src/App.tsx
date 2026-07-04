import { useEffect, useState } from 'react';
import './App.css';

type ForecastDay = {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
};
type HourlyForecast = {
  time: string;
  temperature: number;
  weatherCode: number;
};

type WeatherData = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  humidity: number;
  uvIndex: number;
  airQuality: number;
  sunrise: string;
  sunset: string;
  time: string;
  weatherCode: number;
  forecast: ForecastDay[];
  hourly: HourlyForecast[];
  
};
type CitySuggestion = {
  id: number;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

type AppLanguage = 'en' | 'ru' | 'uk';

 
const getWeatherIcon = (code: number, isNight = false) => {
   if (code === 0) return isNight ? '🌙' : '☀️';
    if ([1, 2].includes(code)) return isNight ? '☁️🌙' : '🌤️';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
  if ([61, 63, 65, 66, 67].includes(code)) return '🌧️';
  if ([71, 73, 75, 77].includes(code)) return '❄️';
  if ([80, 81, 82].includes(code)) return '🌦️';
  if ([85, 86].includes(code)) return '🌨️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌍';
};

const getWeatherLabel = (code: number, language: AppLanguage = 'en') => {
  const labels = {
    en: {
      clear: 'Clear sky',
      partly: 'Partly cloudy',
      cloudy: 'Cloudy',
      fog: 'Fog',
      drizzle: 'Drizzle',
      rain: 'Rain',
      snow: 'Snow',
      rainShowers: 'Rain showers',
      snowShowers: 'Snow showers',
      thunderstorm: 'Thunderstorm',
      update: 'Weather update',
     
     
    },

    ru: {
      clear: 'Ясно',
      partly: 'Переменная облачность',
      cloudy: 'Облачно',
      fog: 'Туман',
      drizzle: 'Морось',
      rain: 'Дождь',
      snow: 'Снег',
      rainShowers: 'Ливни',
      snowShowers: 'Снегопад',
      thunderstorm: 'Гроза',
      update: 'Погода',
    
    },

    uk: {
      clear: 'Ясно',
      partly: 'Мінлива хмарність',
      cloudy: 'Хмарно',
      fog: 'Туман',
      drizzle: 'Мряка',
      rain: 'Дощ',
      snow: 'Сніг',
      rainShowers: 'Зливи',
      snowShowers: 'Снігопад',
      thunderstorm: 'Гроза',
      update: 'Погода',
      
    },
  };

  const current = labels[language];

  if (code === 0) return current.clear;
  if ([1, 2].includes(code)) return current.partly;
  if (code === 3) return current.cloudy;
  if ([45, 48].includes(code)) return current.fog;
  if ([51, 53, 55, 56, 57].includes(code)) return current.drizzle;
  if ([61, 63, 65, 66, 67].includes(code)) return current.rain;
  if ([71, 73, 75, 77].includes(code)) return current.snow;
  if ([80, 81, 82].includes(code)) return current.rainShowers;
  if ([85, 86].includes(code)) return current.snowShowers;
  if ([95, 96, 99].includes(code)) return current.thunderstorm;

  return current.update;
};
const getWeatherClass = (code: number) => {
  if (code === 0) return 'sunny';
  if ([1, 2].includes(code)) return 'partly';
  if (code === 3) return 'cloudy';
  if ([45, 48].includes(code)) return 'foggy';

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return 'rainy';
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'snowy';
  }

  if ([95, 96, 99].includes(code)) {
    return 'stormy';
  }

  return 'default-weather';
};

const formatDate = (date: string, language: AppLanguage = 'en') => {
  const locale =
    language === 'ru' ? 'ru-RU' :
    language === 'uk' ? 'uk-UA' :
    'en-US';

  return new Date(date).toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

const formatHour = (time: string) => {
  return time.slice(11, 16);
};
const isNightTime = (time: string) => {
  const hour = Number(time.slice(11, 13));
  return hour < 6 || hour >= 20;
};
const detectLanguage = (text: string): AppLanguage => {
  const lowerText = text.toLowerCase();

  const ukrainianLetters = /[іїєґ]/i;
  const cyrillicLetters = /[а-яё]/i;

  if (ukrainianLetters.test(lowerText)) {
    return 'uk';
  }

  if (cyrillicLetters.test(lowerText)) {
    return 'ru';
  }

  return 'en';
};
const translations = {
  en: {
    title: 'WeatherNow',
    subtitle: 'Search any city and get real weather data using an API.',
    cityPlaceholder: 'City, for example Zagreb',
    countryPlaceholder: 'Country, for example Croatia',
    search: 'Search',
    loading: 'Loading weather...',
    notFound: 'City not found. Try another city or country.',
    error: 'Something went wrong. Please try again.',
    humidity: 'Humidity',
    wind: 'Wind',
    updated: 'Updated',
    fiveDay: '5-Day Forecast',
    hourly: 'Hourly Forecast',
    hint: 'Click on a day to see hourly weather',
    radar: 'Weather Radar',
showRadar: 'Show Radar',
hideRadar: 'Hide Radar',
feelsLike: 'Feels like',
sunrise: 'Sunrise',
sunset: 'Sunset',
uvIndex: 'UV Index',
myLocation: 'My location',
locationError: 'Could not get your location.',
addFavorite: 'Add to favorites',
favorites: 'Favorite cities',
airQuality: 'Air Quality',
goodAir: 'Good',
moderateAir: 'Moderate',
badAir: 'Bad',
low: 'Low',
moderate: 'Moderate',
high: 'High',
veryHigh: 'Very high',
  },

  ru: {
    title: 'WeatherNow',
    subtitle: 'Найдите любой город и получите реальную погоду через API.',
    cityPlaceholder: 'Город, например Загреб',
    countryPlaceholder: 'Страна, например Хорватия',
    search: 'Поиск',
    loading: 'Загрузка погоды...',
    notFound: 'Город не найден. Попробуйте другой город или страну.',
    error: 'Что-то пошло не так. Попробуйте ещё раз.',
    humidity: 'Влажность',
    wind: 'Ветер',
    updated: 'Обновлено',
    fiveDay: 'Прогноз на 5 дней',
    hourly: 'Почасовой прогноз',
    hint: 'Нажмите на день, чтобы увидеть погоду по часам',
    radar: 'Радар погоды',
showRadar: 'Показать радар',
hideRadar: 'Скрыть радар',
feelsLike: 'Ощущается как',
sunrise: 'Восход',
sunset: 'Закат',
uvIndex: 'УФ-индекс',
myLocation: 'Моя локация',
locationError: 'Не удалось получить вашу локацию.',
addFavorite: 'Добавить в избранное',
favorites: 'Избранные города',
airQuality: 'Качество воздуха',
goodAir: 'Хорошее',
moderateAir: 'Среднее',
badAir: 'Плохое',
low: 'Низкий',
moderate: 'Средний',
high: 'Высокий',
veryHigh: 'Очень высокий',
  },

  uk: {
    title: 'WeatherNow',
    subtitle: 'Знайдіть будь-яке місто та отримайте реальну погоду через API.',
    cityPlaceholder: 'Місто, наприклад Загреб',
    countryPlaceholder: 'Країна, наприклад Хорватія',
    search: 'Пошук',
    loading: 'Завантаження погоди...',
    notFound: 'Місто не знайдено. Спробуйте інше місто або країну.',
    error: 'Щось пішло не так. Спробуйте ще раз.',
    humidity: 'Вологість',
    wind: 'Вітер',
    updated: 'Оновлено',
    fiveDay: 'Прогноз на 5 днів',
    hourly: 'Погодинний прогноз',
    hint: 'Натисніть на день, щоб побачити погоду по годинах',
    radar: 'Радар погоди',
showRadar: 'Показати радар',
hideRadar: 'Сховати радар',
feelsLike: 'Відчувається як',
sunrise: 'Схід сонця',
sunset: 'Захід сонця',
uvIndex: 'УФ-індекс',
myLocation: 'Моя локація',
locationError: 'Не вдалося отримати вашу локацію.',
addFavorite: 'Додати в обране',
favorites: 'Обрані міста',
airQuality: 'Якість повітря',
goodAir: 'Добра',
moderateAir: 'Середня',
badAir: 'Погана',
low: 'Низький',
moderate: 'Середній',
high: 'Високий',
veryHigh: 'Дуже високий',
  },
};
const translatePlace = (
  cityName: string,
  countryName: string,
  language: AppLanguage
) => {
  const places: Record<string, Record<AppLanguage, string>> = {
    Zagreb: {
      en: 'Zagreb',
      ru: 'Загреб',
      uk: 'Загреб',
    },
    Croatia: {
      en: 'Croatia',
      ru: 'Хорватия',
      uk: 'Хорватія',
    },
    Kyiv: {
      en: 'Kyiv',
      ru: 'Киев',
      uk: 'Київ',
    },
    Ukraine: {
      en: 'Ukraine',
      ru: 'Украина',
      uk: 'Україна',
    },
    Kharkiv: {
      en: 'Kharkiv',
      ru: 'Харьков',
      uk: 'Харків',
    },
    Lviv: {
      en: 'Lviv',
      ru: 'Львов',
      uk: 'Львів',
    },
    Odesa: {
      en: 'Odesa',
      ru: 'Одесса',
      uk: 'Одеса',
    },
    Dnipro: {
      en: 'Dnipro',
      ru: 'Днепр',
      uk: 'Дніпро',
    },
    Bergen: {
      en: 'Bergen',
      ru: 'Берген',
      uk: 'Берген',
    },
    Norway: {
      en: 'Norway',
      ru: 'Норвегия',
      uk: 'Норвегія',
    },
  };

  return {
    city: places[cityName]?.[language] || cityName,
    country: places[countryName]?.[language] || countryName,
  };
};
const getAirQualityLabel = (value: number, text: any) => {
  if (value <= 15) return text.goodAir;
  if (value <= 35) return text.moderateAir;
  return text.badAir;
};

const getUvLabel = (value: number, text: any) => {
  if (value <= 2) return text.low;
  if (value <= 5) return text.moderate;
  if (value <= 7) return text.high;
  return text.veryHigh;
};

const getStatusClass = (type: 'uv' | 'air', value: number) => {
  if (type === 'uv') {
    if (value <= 2) return 'status-good';
    if (value <= 5) return 'status-medium';
    return 'status-bad';
  }

  if (value <= 15) return 'status-good';
  if (value <= 35) return 'status-medium';
  return 'status-bad';
};

function App() {
  const [city, setCity] = useState(() => {
  return localStorage.getItem('weather-city') || 'Zagreb';
});
const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
const getCitySuggestions = async (value: string) => {
  setCity(value);

  if (value.trim().length < 2) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        value
      )}&count=5&language=en&format=json`
    );

    const data = await response.json();

    if (!data.results) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      data.results.map((place: any) => ({
        id: place.id,
        name: place.name,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
      }))
    );
  } catch {
    setSuggestions([]);
  }
};
  const [country, setCountry] = useState(() => {
  return localStorage.getItem('weather-country') || 'Croatia';
});
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en');
  const [showRadar, setShowRadar] = useState(false);
 const [unit, setUnit] = useState<'C' | 'F'>(() => {
  const savedUnit = localStorage.getItem('weather-unit');

  return savedUnit === 'F' ? 'F' : 'C';
});
  
 const [favorites, setFavorites] = useState<string[]>(() => {
  const savedFavorites = localStorage.getItem('weather-favorites');

  return savedFavorites ? JSON.parse(savedFavorites) : [];
});

const text = translations[appLanguage];
const convertTemp = (temp: number) => {
  return unit === 'C' ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
};
useEffect(() => {
  localStorage.setItem('weather-favorites', JSON.stringify(favorites));
}, [favorites]);
const selectFavorite = (favorite: string) => {
  const [favoriteCity, favoriteCountry] = favorite.split(', ');

  setCity(favoriteCity);
  setCountry(favoriteCountry);

  setTimeout(() => {
    const form = document.querySelector('.search-form') as HTMLFormElement;
    form?.requestSubmit();
  }, 0);
};
useEffect(() => {
  localStorage.setItem('weather-unit', unit);
}, [unit]);
useEffect(() => {
  localStorage.setItem('weather-city', city);
}, [city]);

useEffect(() => {
  localStorage.setItem('weather-country', country);
}, [country]);
useEffect(() => {
  getWeather();
}, []);

const tempSymbol = unit === 'C' ? '°C' : '°F';
 const selectedHourly = weather
  ? weather.hourly
      .filter((hour) => hour.time.startsWith(selectedDate))
      .filter((_, index) => index % 3 === 0)
  : [];
 const currentWeatherType = weather
  ? getWeatherClass(weather.weatherCode)
  : 'partly';

const weatherClass = weather
  ? `${currentWeatherType} ${isNightTime(weather.time) ? 'night' : 'day'}`
  : 'partly day';
  const getWeatherByCoords = async (latitude: number, longitude: number) => {
  try {
    setLoading(true);
    setError('');
    setWeather(null);

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=5&timezone=auto`
    );

    const weatherData = await weatherResponse.json();
  
   let airQualityValue = 0;


try {
  const airResponse = await fetch(
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5&timezone=auto`
);

  const airData = await airResponse.json();

  airQualityValue = Number(airData.current?.pm2_5) || 0;
} catch {
  airQualityValue = 0;
} 

let locationCity = text.myLocation;
let locationCountry = '';

try {
  const locationResponse = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );

  const locationData = await locationResponse.json();

  locationCity =
    locationData.city ||
    locationData.locality ||
    locationData.principalSubdivision ||
    text.myLocation;

  locationCountry = locationData.countryName || '';
} catch {
  locationCity = text.myLocation;
  locationCountry = '';
}
  
 
    setWeather({
    city: locationCity,
country: locationCountry,
      latitude,
      longitude,
      temperature: weatherData.current.temperature_2m,
      apparentTemperature: weatherData.current.apparent_temperature,
      windSpeed: weatherData.current.wind_speed_10m,
      humidity: weatherData.current.relative_humidity_2m,
      uvIndex: weatherData.daily.uv_index_max
        ? weatherData.daily.uv_index_max[0]
        : 0,
      airQuality: airQualityValue, 
      sunrise: weatherData.daily.sunrise[0],
      sunset: weatherData.daily.sunset[0],
      time: weatherData.current.time,
      weatherCode: weatherData.current.weather_code,

      forecast: weatherData.daily.time.map((date: string, index: number) => ({
        date,
        maxTemp: weatherData.daily.temperature_2m_max[index],
        minTemp: weatherData.daily.temperature_2m_min[index],
        weatherCode: weatherData.daily.weather_code[index],
      })),

      hourly: weatherData.hourly.time.map((time: string, index: number) => ({
        time,
        temperature: weatherData.hourly.temperature_2m[index],
        weatherCode: weatherData.hourly.weather_code[index],
      })),
    });

    setSelectedDate(weatherData.current.time.slice(0, 10));
  } catch {
    setError(text.error);
  } finally {
    setLoading(false);
  }
};
const handleMyLocation = () => {
  if (!navigator.geolocation) {
    setError(text.locationError);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      getWeatherByCoords(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    () => {
      setError(text.locationError);
    }
  );
};
  
const addToFavorites = () => {
  if (!weather) return;

  const favoriteCity = `${weather.city}, ${weather.country}`;

  if (favorites.includes(favoriteCity)) return;

  setFavorites([...favorites, favoriteCity]);
};
  const getWeather = async (event?: React.FormEvent) => {
    event?.preventDefault();
   const detectedLanguage = detectLanguage(`${city} ${country}`);
setAppLanguage(detectedLanguage); 

    if (!city.trim()) {
    setError(text.notFound);  
      return;
    }

    try {
      setLoading(true);
      setError('');
      setWeather(null);

const languages = ['en', 'ru', 'uk', 'hr'];

const cityAliases: Record<string, string> = {
  'загреб': 'Zagreb',
  'zagreb': 'Zagreb',

  'киев': 'Kyiv',
  'київ': 'Kyiv',
  'kiev': 'Kyiv',
  'kyiv': 'Kyiv',

  'харьков': 'Kharkiv',
  'харков': 'Kharkiv',
  'харків': 'Kharkiv',
  'kharkov': 'Kharkiv',
  'kharkiv': 'Kharkiv',

  'львов': 'Lviv',
  'львів': 'Lviv',
  'lviv': 'Lviv',

  'одесса': 'Odesa',
  'одеса': 'Odesa',
  'odesa': 'Odesa',
  'odessa': 'Odesa',

  'днепр': 'Dnipro',
  'дніпро': 'Dnipro',
  'dnipro': 'Dnipro',
};

const countryAliases: Record<string, string> = {
  'хорватия': 'HR',
  'хорватія': 'HR',
  'хрватска': 'HR',
  'hrvatska': 'HR',
  'croatia': 'HR',

  'украина': 'UA',
  'україна': 'UA',
  'ukraine': 'UA',

  'франция': 'FR',
  'франція': 'FR',
  'france': 'FR',

  'германия': 'DE',
  'німеччина': 'DE',
  'germany': 'DE',
  'deutschland': 'DE',

  'италия': 'IT',
  'італія': 'IT',
  'italy': 'IT',

  'испания': 'ES',
  'іспанія': 'ES',
  'spain': 'ES',

  'австрия': 'AT',
  'австрія': 'AT',
  'austria': 'AT',

  'польша': 'PL',
  'польща': 'PL',
  'poland': 'PL',

  'сша': 'US',
  'usa': 'US',
  'united states': 'US',
  'america': 'US',

  'канада': 'CA',
  'canada': 'CA',
};

const normalizedCity = city.trim().toLowerCase();
const normalizedCountry = country.trim().toLowerCase();

const searchCity = cityAliases[normalizedCity] || city.trim();
const preferredCountryCode = countryAliases[normalizedCountry] || '';

let place: any = null;

for (const language of languages) {
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      searchCity
    )}&count=20&language=${language}&format=json`
  );

  const geoData = await geoResponse.json();

  if (geoData.results && geoData.results.length > 0) {
    const preferredPlace = preferredCountryCode
      ? geoData.results.find(
          (item: any) => item.country_code === preferredCountryCode
        )
      : null;

    place = preferredPlace || geoData.results[0];
    break;
  }
}

if (!place) {
 setError(text.notFound); 
  return;
}
if (!place) {
 setError(text.notFound);
  return;
}   

const weatherResponse = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&forecast_days=5&timezone=auto`
);
      const weatherData = await weatherResponse.json();
   let airQualityValue = 0;

try {
 const airResponse = await fetch(
  `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${place.latitude}&longitude=${place.longitude}&current=pm2_5&timezone=auto`
);
  const airData = await airResponse.json();

  airQualityValue = Number(airData.current?.pm2_5) || 0;
} catch {
  airQualityValue = 0;
}   

   setWeather({
  city: place.name,
  country: place.country,
  latitude: place.latitude,
  longitude: place.longitude,
  temperature: weatherData.current.temperature_2m,
apparentTemperature: weatherData.current.apparent_temperature,
windSpeed: weatherData.current.wind_speed_10m,
humidity: weatherData.current.relative_humidity_2m,
uvIndex: weatherData.daily.uv_index_max
  ? weatherData.daily.uv_index_max[0]
  : 0,
 airQuality: airQualityValue,
sunrise: weatherData.daily.sunrise[0],
sunset: weatherData.daily.sunset[0],
time: weatherData.current.time,
  weatherCode: weatherData.current.weather_code,

  forecast: weatherData.daily.time.map((date: string, index: number) => ({
    date,
    maxTemp: weatherData.daily.temperature_2m_max[index],
    minTemp: weatherData.daily.temperature_2m_min[index],
    weatherCode: weatherData.daily.weather_code[index],
  })),

  hourly: weatherData.hourly.time.map((time: string, index: number) => ({
    time,
    temperature: weatherData.hourly.temperature_2m[index],
    weatherCode: weatherData.hourly.weather_code[index],
  })),
});

setSelectedDate(weatherData.current.time.slice(0, 10));
    } catch {
     setError(text.error);
    } finally {
      setLoading(false);
    }
  };


 return (
  <main className={`app ${weatherClass}`}>
    <div className="sky-scene">
      {(currentWeatherType === 'sunny' || currentWeatherType === 'partly') && (
        <div className="sun-3d"></div>
      )}

      {(currentWeatherType === 'partly' ||
        currentWeatherType === 'cloudy' ||
        currentWeatherType === 'foggy' ||
        currentWeatherType === 'rainy' ||
        currentWeatherType === 'stormy') && (
        <>
        <div className="cloud-3d cloud-3d-one"></div>
<div className="cloud-3d cloud-3d-two"></div>  
        </>
      )}

      <div className="night-stars"></div>

      <div className="night-cloud night-cloud-one"></div>
      <div className="night-cloud night-cloud-two"></div>

      <div className="shooting-star shooting-star-one"></div>
      <div className="shooting-star shooting-star-two"></div>

      {(currentWeatherType === 'rainy' || currentWeatherType === 'stormy') && (
        <div className="rain-3d">
          {[...Array(90)].map((_, index) => (
            <span
              key={index}
              className="rain-drop"
              style={{
                left: `${(index * 2.3) % 100}%`,
                animationDelay: `${(index % 10) * 0.15}s`,
                animationDuration: `${0.9 + (index % 5) * 0.15}s`,
              }}
            ></span>
          ))}
        </div>
      )}

      <div className="sea">
        <div className="wave wave-one"></div>
        <div className="wave wave-two"></div>
        <div className="wave wave-three"></div>
      </div>
    </div>

   
 
      <section className="weather-card">
        <div className="hero">
          
       <h1>{text.title}</h1>
<p>{text.subtitle}</p>   
        </div>
      <div className="unit-switch">
  <button
    type="button"
    className={unit === 'C' ? 'active-unit' : ''}
    onClick={() => setUnit('C')}
  >
    °C
  </button>

  <button
    type="button"
    className={unit === 'F' ? 'active-unit' : ''}
    onClick={() => setUnit('F')}
  >
    °F
  </button>
</div>  

      <form className="search-form" onSubmit={getWeather}>
 
<div className="city-field">
  <input
    type="text"
    placeholder={text.cityPlaceholder}
    value={city}
    onChange={(event) => getCitySuggestions(event.target.value)}
  />

  {suggestions.length > 0 && (
    <div className="suggestions">
      {suggestions.map((suggestion) => (
        <button
          type="button"
          key={suggestion.id}
          onClick={() => {
            setCity(suggestion.name);
            setCountry(suggestion.country);
            setSuggestions([]);
          }}
        >
          {suggestion.name}, {suggestion.country}
        </button>
      ))}
    </div>
  )}
</div>

  <input
    type="text"
    placeholder={text.countryPlaceholder}
    value={country}
    onChange={(event) => setCountry(event.target.value)}
  />

 <button type="submit">{text.search}</button> 
</form> 
<div className="quick-actions">
  <button
    type="button"
    className="quick-button"
    onClick={handleMyLocation}
  >
    📍 {text.myLocation}
  </button>

  {favorites.map((favorite) => (
  <div className="favorite-item" key={favorite}>
    <button
      type="button"
      className="quick-button"
      onClick={() => selectFavorite(favorite)}
    >
      ⭐ {favorite}
    </button>

    <button
      type="button"
      className="remove-favorite"
      onClick={() =>
        setFavorites(favorites.filter((city) => city !== favorite))
      }
    >
      ×
    </button>
  </div>
))}
</div>
{loading && (
  <div className="weather-loader">
    <div className="loader-cloud">☁️</div>
    <div className="loader-sun">☀️</div>
    <p>{text.loading}</p>
  </div>
)}
  
        {error && <p className="error">{error}</p>}
{weather && (
  <div className={`result-card ${getWeatherClass(weather.weatherCode)}`}>
    <div className="weather-icon">
      {getWeatherIcon(weather.weatherCode)}
    </div>

    <h2>
      {translatePlace(weather.city, weather.country, appLanguage).city},{' '}
  {translatePlace(weather.city, weather.country, appLanguage).country} 
    </h2>

    <p className="weather-label">
      {getWeatherLabel(weather.weatherCode, appLanguage)}
    </p>

    <div className="temperature">
     {convertTemp(weather.temperature)}
{tempSymbol}
    </div>
  <button
  type="button"
  className="favorite-button"
  onClick={addToFavorites}
>
  ⭐ {text.addFavorite}
</button>  

   <div className="details">
  <div>
    <span>{text.humidity}</span>
    <strong>{weather.humidity}%</strong>
  </div>

  <div>
    <span>{text.wind}</span>
    <strong>{weather.windSpeed} km/h</strong>
  </div>

  <div>
    <span>{text.feelsLike}</span>
    <strong>
      {convertTemp(weather.apparentTemperature)}
      {tempSymbol}
    </strong>
  </div>
 <div>
  <span>{text.uvIndex}</span>
  <strong>
    {Number.isFinite(weather.uvIndex) ? Math.round(weather.uvIndex) : 0}
  </strong>
  <small className={getStatusClass('uv', weather.uvIndex || 0)}>
    {getUvLabel(weather.uvIndex || 0, text)}
  </small>
</div>
<div>
  <span>{text.airQuality}</span>
  <strong>
    {Number.isFinite(weather.airQuality)
      ? `${Math.round(weather.airQuality)} PM2.5`
      : '0 PM2.5'}
  </strong>
 <small className={getStatusClass('air', weather.airQuality || 0)}>
  {getAirQualityLabel(weather.airQuality || 0, text)}
</small> 
</div>

  <div>
    <span>{text.sunrise}</span>
    <strong>{formatHour(weather.sunrise)}</strong>
  </div>

  <div>
    <span>{text.sunset}</span>
    <strong>{formatHour(weather.sunset)}</strong>
  </div>

  <div>
    <span>{text.updated}</span>
    <strong>{weather.time.slice(11, 16)}</strong>
  </div>
</div>
    <div className="radar">
  <div className="radar-header">
    <h3>{text.radar}</h3>

    <button
      type="button"
      className="radar-button"
      onClick={() => setShowRadar(!showRadar)}
    >
      {showRadar ? text.hideRadar : text.showRadar}
    </button>
  </div>

  {showRadar && (
    <div className="radar-map">
      <iframe
        title="Weather radar"
        src={`https://embed.windy.com/embed2.html?lat=${weather.latitude}&lon=${weather.longitude}&detailLat=${weather.latitude}&detailLon=${weather.longitude}&width=650&height=450&zoom=7&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
        frameBorder="0"
      ></iframe>
    </div>
  )}
</div>

   <div className="forecast">
  <h3>{text.fiveDay}</h3>

  <div className="forecast-list">
    {weather.forecast.map((day) => (
      <button
        type="button"
        className={`forecast-card ${
          selectedDate === day.date ? 'active-day' : ''
        }`}
        key={day.date}
        onClick={() => setSelectedDate(day.date)}
      >
        <span>{formatDate(day.date, appLanguage)}</span>

        <div className="forecast-icon">
          {getWeatherIcon(day.weatherCode)}
        </div>

        <p>{getWeatherLabel(day.weatherCode, appLanguage)}</p>

        <strong>
         {convertTemp(day.maxTemp)}° / {convertTemp(day.minTemp)}° 
        </strong>
      </button>
    ))}
  </div>
</div>

<div className="hourly">
 <h3>{text.hourly} — {formatDate(selectedDate, appLanguage)}</h3>
 <p className="forecast-hint">{text.hint}</p>
  <div className="hourly-list">
    {selectedHourly.map((hour) => (
      <div className="hourly-card" key={hour.time}>
        <span>{formatHour(hour.time)}</span>

        <div className="hourly-icon">
          {getWeatherIcon(hour.weatherCode)}
        </div>

        <strong>{convertTemp(hour.temperature)}
{tempSymbol}
</strong>
      </div>
    ))}
  </div>
</div> 
  </div>
)}
      

 
   
            
      </section>
    </main>
  );
}

export default App;
