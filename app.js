const express = require("express");
const body_parser = require("body-parser");
const request = require("request");
const https = require("https")


const app = express();
app.use(body_parser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
    };

    var jsonData = JSON.stringify(data);
    var url = "https://us14.api.mailchimp.com/3.0/lists/8d8123c4e8";
    var options = {
        method: "POST",
        auth: "guimag:349f30295e37255bf8453bdcd9dc2a26-us14"
    }

    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT, function(){
    console.log("Server is running on port 3000");
});

//api key
// 349f30295e37255bf8453bdcd9dc2a26-us14
//Audience id
//  8d8123c4e8