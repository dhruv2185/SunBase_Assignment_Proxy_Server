const express = require('express');

const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = 3001;
const API_BASE_URL = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";
app.use(express.json());

app.use(cors({
    origin: '*',
}));

app.post('/login', async (req, res) => {
    try {
        const response = await fetch('https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                login_id: req.body.login_id,
                password: req.body.password,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            res.json(data);
        } else {

            res.status(response.status).send('Unable to Login');
        }
    } catch (error) {

        res.status(500).send('Unable to Login');
    }


});
app.post("/getCustomerList", async (req, res) => {
    try {
        const response = await fetch(`${API_BASE_URL}?cmd=get_customer_list`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${req.body.auth_token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch customer list");
        }

        const customerList = await response.json();
        res.json(customerList);
    } catch (error) {

        res.status(500).json({ error: "Failed to fetch data" });
    }
});
app.post("/deleteUser", async (req, res) => {
    try {
        const response = await fetch(`${API_BASE_URL}?cmd=delete&uuid=${req.body.uuid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${req.body.auth_token}`,
            }
        });

        if (response.status === 200) {
            return res.status(200).json({ message: "Successfully deleted" });
        } else if (response.status === 500) {
            return res.status(500).json({ error: "Error: Not deleted" });
        } else if (response.status === 400) {
            return res.status(400).json({ error: "UUID not found" });
        } else {
            throw new Error("Unexpected response status");
        }
    } catch (error) {

        return res.status(500).json({ error: "Failed to delete customer" });
    }
})
app.post("/createUser", async (req, res) => {
    try {
        if (!req.body.first_name || !req.body.last_name) {
            return res.status(400).json({ error: "First name and last name are mandatory parameters" });
        }

        const response = await fetch(`${API_BASE_URL}?cmd=create`, {
            method: "POST", headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${req.body.auth_token}`
            },
            body: JSON.stringify({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                street: req.body.street,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                email: req.body.email,
                phone: req.body.phone
            })

        });
        if (response.status === 201) {
            return res.status(201).json({ message: "Successfully Created" });
        } else {
            throw new Error("Failed to create customer");
        }
    } catch (error) {

        return res.status(500).json({ error: "Failed to create customer" });
    }
})
app.post("/editUser", async (req, res) => {
    try {

        const response = await fetch(`${API_BASE_URL}?cmd=update&uuid=${req.body.uuid}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${req.body.auth_token}`
            },
            body: JSON.stringify({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                street: req.body.street,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                email: req.body.email,
                phone: req.body.phone
            })

        })
        if (response.status === 200) {
            return res.status(200).json({ message: "Successfully Updated" });
        } else if (response.status === 500) {
            return res.status(500).json({ error: "UUID not found" });
        } else if (response.status === 400) {
            return res.status(400).json({ error: "Body is Empty" });
        } else {
            throw new Error("Failed to update customer");
        }
    } catch (error) {

        return res.status(500).json({ error: "Failed to update customer" });
    }

})
app.listen(port, () => {
    console.log(`Your Proxy server is running `);
});
