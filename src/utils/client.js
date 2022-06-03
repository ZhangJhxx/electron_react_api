const net = require('net');

const ReadyState = {
  UNSET: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}

class XMLHttpRequest {
  constructor() {
    this.readyState = ReadyState.UNSET;
    this.headers = { "Connection": "keep-alive" };//请求头
  }
  open(method, url) {
    this.method = method || 'GET';
    this.url = url;
    // http://127.0.0.1:3000/get => hostname = 127.0.0.1 port=3000 path=/get
    let { hostname, port, path } = require('url').parse(url);
    this.hostname = hostname;
    this.port = port;
    this.path = path;
    this.headers['Host'] = `${hostname}:${port}`;
    const socket = this.socket = net.createConnection({ hostname, port }, () => {
      //连接成功之后，监听服务器的数据
      socket.on('data', (data) => {
        data = data.toString();
        //处理响应
        // console.log(data);
        let [response, bodyRows] = data.split('\r\n\r\n');
        let [statusLine, ...headerRows] = response.split('\r\n');
        let [, statusCode, statusMessage] = statusLine.split(' ');
        this.status = statusCode;
        this.statusText = statusMessage;
        this.responseHeaders = headerRows.reduce((memo, header) => {
          let [key, value] = header.split(': ');
          memo[key] = value;
          return memo;
        }, {});
        this.readyState = ReadyState.HEADERS_RECEIVED;
        this.onreadystatechange && this.onreadystatechange();
        let [, body,] = bodyRows.split('\r\n');
        this.readyState = ReadyState.LOADING;
        this.onreadystatechange && this.onreadystatechange();
        this.response = this.responseText = body;
        this.readyState = ReadyState.DONE;
        this.onreadystatechange && this.onreadystatechange();
        this.onload && this.onload();
      })
    })
    this.readyState = ReadyState.OPENED;
    this.onreadystatechange && this.onreadystatechange();
  }
  setRequestHeader(header, value) {
    this.headers[header] = value;
  }
  getAllResponseHeaders() {
    return Object.keys(this.responseHeaders).map(key => `${key}: ${this.responseHeaders[key]}`).join('\r\n');
  }
  getResponseHeader(key) {
    return this.responseHeaders[key];
  }
  send(body) {
    body = body || '';
    const rows = [];
    if(body) this.headers['Content-Length'] = Buffer.byteLength(body);
    rows.push(`${this.method} ${this.path} HTTP/1.1`);
    rows.push(...Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`));
    const request = rows.join('\r\n') + '\r\n\r\n' + body;
    // console.log(request);
    this.socket.write(request);
  }
}
/**
* GET /get HTTP/1.1
* Accept-Encoding: gzip, deflate, br
* Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
* Connection: keep-alive
* Host: localhost:8080
* Referer: http://localhost:8080/get.html
* User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36
* name: any
*/


function client(method,url,headers,callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status ==200){
      console.log(xhr.response);
      if (callback) callback(xhr.response);
    }
  }

  xhr.open(method, url);
  xhr.responseType = 'text';
  for(let i=0; i<headers.length; i++) {
    xhr.setRequestHeader(headers[i]['header_head'], headers[i]['header_body']);
  }

  xhr.send(JSON.stringify({
    name: 'anyname',
    age: 11
  }));
}
export default client;
// client_post('http://127.0.0.1:8080/post',{
//   header_head:'Content-Type',
//   header_body:'application/json'
// })

