var redis = require('redis')

const config = {PORT: 6379, host: "localhost"}
client = redis.createClient();

client.connect()

client.on("connect", () => console.log("redis connected"))
client.on("error", (e) => console.log("redis failed"))

module.exports = client