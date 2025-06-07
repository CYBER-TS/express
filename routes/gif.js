const express = require('express');
const router = express.Router();
const request = require('request');

// 猫の画像を取得するルート
router.get('/', (req, res) => {
    request('https://api.thecatapi.com/v1/images/search', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const catImageUrl = data[0].url; // 画像URLを取得
            res.json({ imageUrl: catImageUrl }); // 画像URLをJSON形式で返す
        } else {
            res.status(500).json({ error: 'Failed to fetch cat image' }); // エラーハンドリング
        }
    });
});

module.exports = router; // ルーターをエクスポート
