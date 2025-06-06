const { MongoClient } = require("mongodb");

// 自分のMongoDB接続URI
const uri = "※※※";

const options = {
    serverSelectionTimeoutMS: 10000, // 10秒のタイムアウト
};

async function run() {
    const client = new MongoClient(uri, options);
    try {
        await client.connect(); // MongoDBに接続
        console.log("MongoDBに接続しました。");

        // PINGコマンドを実行
        const result = await client.db().command({ ping: 1 });
        console.log("Ping結果:", result);

        const database = client.db("notes"); // データベース名を指定
        const notes = database.collection("notes"); // コレクション名を指定

        const query = [
            {
                id: 1,
                title: "ノート1のタイトルです",
                subTitle: "ノート1のサブタイトルです",
                bodyText: "ノート1の本文です"
            },
            {
                id: 2,
                title: "ノート2のタイトルです",
                subTitle: "ノート2のサブタイトルです",
                bodyText: "ノート2の本文です"
            }
        ];

        // データを挿入
        const note = await notes.insertMany(query);
        console.log("挿入されたノート:", note);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    } finally {
        await client.close(); // MongoDBの接続を閉じる
    }
}

run().catch(console.error);

