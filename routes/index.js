var express = require('express');
var router = express.Router();

// ルートの定義
router.get('/', function(req, res, next) {
    res.send('Index Page');
});

module.exports = router; // ルーターをエクスポート
