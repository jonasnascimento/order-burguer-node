const express = require('express')
const app = express()
const uuid = require('uuid')
const port = 3002
const bodyParser = require('body-parser')

const cors = require('cors');

const corsOptions = {
    origin: 'https://codeburguer.vercel.app',
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
  }
  
  app.use(cors(corsOptions));
  

app.use(express());


const orders = [];

app.use((req, res, next) => {
    console.log(`Método: ${req.method}, URL: ${req.url}`);
    next(); // Chama o próximo middleware na cadeia
  });

const checkOrderId = (req, res, next) => {
    const { id } = req.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        res.status(404).json({ error: "Order not found" })
    }

    req.orderIndex = index
    req.orderId = id

    next()
}

app.get('/orders', (req, res) => {

    res.json(orders);

});

app.get('/orders/:id', checkOrderId, bodyParser.json(), (req, res) => {
    const { order, clientName, price, status } = req.body
    const index = req.orderIndex
    const id = req.orderId
    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    res.json(updateOrder)

});




app.post('/orders', bodyParser.json(), (req, res) => {
    const { order, clientName, price } = req.body;

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    res.status(201).json(newOrder)

});

app.put('/orders/:id', checkOrderId, (req, res) => {
    const { order, clientName, price, status } = req.body
    const index = req.orderIndex
    const id = req.orderId
    const updateOrder = { id, order, clientName, price, status }

    orders[index] = updateOrder

    res.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, (req, res) => {
    const index = req.orderIndex

    orders.splice(index, 1)

    res.status(204).json()
})

app.patch('/orders/:id', checkOrderId, (req, res) => {
    const { order, clientName, price, } = req.body
    const index = req.orderIndex
    const id = req.orderId

    const patchOrder = { id, order, clientName, price, status: 'Pronto' }

    orders[index] = patchOrder



    res.json(patchOrder)
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



