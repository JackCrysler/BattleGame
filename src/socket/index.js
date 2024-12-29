import toast from '../utils/toast'
let socket = null
const createSocket = () => {
  const usp = new URLSearchParams(window.location.hash.split('?')[1])
  const uid = usp.get('uid')
  const url_online = `111.229.117.16:9000`
  const url_local = `111.229.117.16:9000`
  const host = process.env.NODE_ENV === "production" ? url_online : url_local
  socket = window.io(`ws://${host}?uid=${uid}`, {
    autoConnect: false
  })
  window.socket = socket
  socket.on('message', (msg) => {
    typeof msg === 'string' && console.log(msg)
    Object.prototype.toString.call(msg) === '[object Object]' && console.log(msg.msg || JSON.stringify(msg))

  })
  socket.on('disconnect', (msg) => {
    toast.show(msg)
    if (msg === 'io server disconnecct') {
      socket.open()
    }
  })
  socket.on('close', (msg) => {
    toast.show('socket close', msg)
  })
  socket.on('rejoin',(roomInfo) => {
    console.log('rejoin room', roomInfo)
  })
  return socket
}

export { createSocket }