const express = require('express');
const request = require('request');
const app = express();
const router = express.Router();
const port = 30178; // ポート番号を30177に変更

// Open-Meteo APIの設定
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=35.682839&longitude=139.759455&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Tokyo';

// 猫の画像APIの設定
const catImageUrl = 'https://api.thecatapi.com/v1/images/search';

// 格言のリスト
const adviceList = [
    '失敗は成功のもと。',
    '継続は力なり。',
    '明日は明日の風が吹く。',
    '七転び八起き。',
];

// ランダムに格言を選ぶ関数
const getRandomAdvice = () => {
    return adviceList[Math.floor(Math.random() * adviceList.length)];
};

// 天気コードを人間が理解できる形式に変換する関数
const getWeatherDescription = (code) => {
    const weatherDescriptions = {
        0: '晴れ - Clear sky',
        1: '主に晴れ - Mainly clear',
        2: '部分的に曇り - Partly cloudy',
        3: '曇り - Overcast',
        45: '霧 - Fog',
        48: '霧 - Depositing rime fog',
        51: '小雨 - Light drizzle',
        53: '中雨 - Moderate drizzle',
        55: '大雨 - Dense drizzle',
        56: '凍結小雨 - Light freezing drizzle',
        57: '凍結大雨 - Dense freezing drizzle',
        61: '小雨 - Slight rain',
        63: '中雨 - Moderate rain',
        65: '大雨 - Heavy rain',
        66: '凍結小雨 - Light freezing rain',
        67: '凍結大雨 - Heavy freezing rain',
        71: '小雪 - Slight snowfall',
        73: '中雪 - Moderate snowfall',
        75: '大雪 - Heavy snowfall',
        77: '雪粒 - Snow grains',
        80: '小雨シャワー - Slight rain showers',
        81: '中雨シャワー - Moderate rain showers',
        82: '大雨シャワー - Violent rain showers',
        85: '小雪シャワー - Slight snow showers',
        86: '大雪シャワー - Heavy snow showers',
        95: '雷雨 - Thunderstorm (slight or moderate)',
        96: '雷雨（小ひょう） - Thunderstorm with slight hail',
        99: '雷雨（大ひょう） - Thunderstorm with heavy hail',
    };
    return weatherDescriptions[code] || '不明';
};

// 天気コードの解説を返す関数
const getWeatherCodeExplanation = (code) => {
    const explanations = {
        0: '晴れ - 雲がほとんどない状態。',
        1: '主に晴れ - 雲が少ない状態。',
        2: '部分的に曇り - 雲が多いが、雨は降らない状態。',
        3: '曇り - 雲が多く、雨は降らない状態。',
        45: '霧 - 視界が悪くなるほどの霧が発生している状態。',
        48: '霧 - 霧が付着している状態。',
        51: '小雨 - 軽い雨が降っている状態。',
        53: '中雨 - 中程度の雨が降っている状態。',
        55: '大雨 - 大雨が降っている状態。',
        56: '凍結小雨 - 軽い凍結雨が降っている状態。',
        57: '凍結大雨 - 大きな凍結雨が降っている状態。',
        61: '小雨 - 軽い雨が降っている状態。',
        63: '中雨 - 中程度の雨が降っている状態。',
        65: '大雨 - 大雨が降っている状態。',
        66: '凍結小雨 - 軽い凍結雨が降っている状態。',
        67: '凍結大雨 - 大きな凍結雨が降っている状態。',
        71: '小雪 - 軽い雪が降っている状態。',
        73: '中雪 - 中程度の雪が降っている状態。',
        75: '大雪 - 大雪が降っている状態。',
        77: '雪粒 - 雪粒が降っている状態。',
        80: '小雨シャワー - 軽い雨シャワーが降っている状態。',
        81: '中雨シャワー - 中程度の雨シャワーが降っている状態。',
        82: '大雨シャワー - 激しい雨シャワーが降っている状態。',
        85: '小雪シャワー - 軽い雪シャワーが降っている状態。',
        86: '大雪シャワー - 大きな雪シャワーが降っている状態。',
        95: '雷雨 - 軽度または中程度の雷雨が発生している状態。',
        96: '雷雨（小ひょう） - 軽いひょうを伴う雷雨。',
        99: '雷雨（大ひょう） - 大きなひょうを伴う雷雨。',
    };
    return explanations[code] || '不明な天気コード';
};

// ルートエンドポイント
app.get('/weather', (req, res) => {
    let weatherInfo = '';
    let advice = getRandomAdvice();
    let catImage = '';

    // 天気情報を取得
    request(weatherUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const weatherData = JSON.parse(body);
            console.log(weatherData); // デバッグ用にAPIレスポンスを出力

            // 現在の天気情報
            const currentWeather = weatherData.hourly;
            const currentTemperature = currentWeather.temperature_2m[0];
            const currentWeatherCode = currentWeather.weathercode[0];
            const currentWeatherDescription = getWeatherDescription(currentWeatherCode);
            const currentWeatherCodeExplanation = getWeatherCodeExplanation(currentWeatherCode);
            weatherInfo += `<h2>現在の東京の天気</h2><p>${currentTemperature}°C, ${currentWeatherDescription} (天気コード: ${currentWeatherCode}) - ${currentWeatherCodeExplanation}</p>`;

            // 今後の天気予報
            weatherInfo += `<h2>今後の天気予報</h2><table border="1"><tr><th>日付</th><th>最高気温 (°C)</th><th>最低気温 (°C)</th><th>天気</th><th>説明</th></tr>`;
            const dailyWeather = weatherData.daily;
            for (let i = 0; i < dailyWeather.weathercode.length; i++) {
                const maxTemp = dailyWeather.temperature_2m_max[i];
                const minTemp = dailyWeather.temperature_2m_min[i];
                const weatherCode = dailyWeather.weathercode[i];
                const weatherDescription = getWeatherDescription(weatherCode);
                const weatherCodeExplanation = getWeatherCodeExplanation(weatherCode);

                weatherInfo += `<tr>
                    <td>${dailyWeather.time[i]}</td>
                    <td>${maxTemp}°C</td>
                    <td>${minTemp}°C</td>
                    <td>${weatherDescription} (天気コード: ${weatherCode})</td>
                    <td>${weatherCodeExplanation}</td>
                </tr>`;
            }
            weatherInfo += `</table>`;
        } else {
            weatherInfo = '<h2>天気情報の取得に失敗しました。</h2>';
        }

        // 猫の画像を取得
        request(catImageUrl, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                const catData = JSON.parse(body);
                catImage = `<img src="${catData[0].url}" alt="猫の画像" style="max-width: 300px;"/>`;
            } else {
                catImage = '<p>猫の画像の取得に失敗しました。</p>';
            }

            // レスポンスを送信
            res.send(`
<html>
    <head>
        <title>東京の天気</title>
    </head>
    <body>
        <h1>東京の天気</h1>
        ${weatherInfo}
        ${catImage} <!-- 猫の画像を表示 -->
        <p>${advice}</p> <!-- 格言を猫の画像の下に表示 -->
    </body>
</html>
`);
        });
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました。`);
});　

module.exports = router; // ルーターをエクスポート
