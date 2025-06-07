const express = require('express');
const router = express.Router();
const request = require('request');

// 犬の画像を取得するルート
router.get('/', (req, res) => {
    request('https://dog.ceo/api/breeds/image/random', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const data = JSON.parse(body);
            const dogImageUrl = data.message; // 画像URLを取得
            res.json({ imageUrl: dogImageUrl }); // 画像URLをJSON形式で返す
        } else {
            res.status(500).json({ error: '犬の画像の取得に失敗しました' }); // エラーハンドリング
        }
    });
});

module.exports = router; // ルーターをエクスポート
