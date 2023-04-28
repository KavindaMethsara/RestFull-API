const express = require('express');
const Joi = require('joi');
const app = express();
app.use(express.json());

//Give data to the server
const customers = [
    {
        "id": 1,
        "name": "Gayan"
    },
    {
        "id": 2,
        "name": "Bathisha"
    },
    {
        "id": 3,
        "name": "Navodya"
    }
];

//Read Request Handlers
// Display the Message when the URL consist of '/'
app.get("/", (req, res) => {
    res.send("Welcome to our REST API!");
});

// Display the List Of Customers when URL consists of api customers
app.get("/api/customers", (req, res) => {
    res.send(customers);
});

// Display the Information Of Specific Customer when you mention the id.
app.get("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));

    if (!customer) {
        res.status(404).send('<h2>Oops customer is not found for id ' + req.params.id + '</h2>'); 
    } else {
        res.send(customer);
    }
});

//CREATE Request Handler
//CREATE New Customer Information
app.post("/api/customers", (req, res) => {
    const { error } = validateCustomer(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const newCustomer = {
        id: customers.length + 1,
        name: req.body.name
    }

    customers.push(newCustomer);

    res.send(newCustomer);
});

//Update Request Handler
// Update Existing Customer Information
app.put("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    
    if (!customer) {
        res.status(404).send('<h2>Oops customer is not found for id ' + req.params.id + '</h2>'); 
    }

    const { error } = validateCustomer(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    customer.name = req.body.name;

    res.send(customer);
});

app.delete("/api/customers/:id", (req, res) => {
    const customer = customers.find((c) => c.id === parseInt(req.params.id));
    
    if (!customer) {
        res.status(404).send('<h2>Oops customer is not found for id ' + req.params.id + '</h2>'); 
    }

    const index = customers.indexOf(customer);
    customers.splice(index, 1);

    res.send("customer "+customer.name+" is removed!");
});

function validateCustomer(customer) {
    const schema = Joi.object({ name: Joi.string() .min(3) .required()});

    const validation = schema.validate(customer);

    return validation;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}...`));