const { Storage } = require('@google-cloud/storage')
const storage = new Storage({ credentials: JSON.parse(process.env.GCS_CREDENTIALS) })
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME) // 連線到google storage 你創的空間

/*
* @param {String} buffer - 要傳送的檔案的buffer
* @destination {String} destination - 到目的地（雲端）後檔案的名稱
**/
const uploadFromBuffer = (buffer, destination) => new Promise((resolve, reject) => {
  const file = bucket.file(destination) // 先創造檔案物件

  const ws = file.createWriteStream() // 創造可寫流
  ws
    .on('error', (err) => {
      console.error('err', err)
      reject(err)
    })
    .on('finish', async () => {
      resolve(await file.publicUrl()) // 會回傳檔案的url
    })
    .end(buffer) // 寫入資料囉
})

module.exports = { uploadFromBuffer }
