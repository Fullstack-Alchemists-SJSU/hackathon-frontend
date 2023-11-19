import {io} from 'socket.io-client'
const socket = io('http://localhost:3001')

socket.on('disconnect', () => {
	console.log('disconnected')
})

export default socket
