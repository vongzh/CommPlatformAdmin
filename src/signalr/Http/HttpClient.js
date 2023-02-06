export class HttpClient {
  get(url, headers) {
    return this.send('GET', url, headers)
  }
  post(url, data, headers) {
    return this.send('POST', url, headers, data)
  }

  send(method, url, headers, data) {
    return new Promise((resolve, reject) => {
      if (XMLHttpRequest) {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        if (headers) {
          Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]))
        }
        xhr.send(data)
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.response)
          } else {
            reject({
              status: xhr.status,
              statusText: xhr.statusText
            })
          }
        }
        xhr.onerror = () => {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          })
        }
      }
    })
  }
}
