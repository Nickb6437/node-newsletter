const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const request = require('request');

const app = express();

app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html')
})

// Mailchimp Setup
mailchimp.setConfig({
  apiKey: "70fee46a40ee5f098c354889c457a161-us17",
  server: "us17"
});

app.post('/', function(req, res) {
const fName = req.body.fName;
const sName = req.body.sName;
const email = req.body.email;
const listId = '5404fb1728';

const subscribingUser = {
  firstName: fName,
  lastName: sName,
  email: email
};

//Uploading the data to the server
async function run() {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: subscribingUser.email,
    status: "subscribed",
    merge_fields: {
      FNAME: subscribingUser.firstName,
      LNAME: subscribingUser.lastName
    }
  });
  //If all goes well logging the contact's id
  res.sendFile(__dirname + "/success.html")
  console.log(
    `Successfully added contact as an audience member. The contact's id is ${
   response.id
   }.`
  );
}
//Running the function and catching the errors (if any)
// ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LESSON*************************
// So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
run().catch(e => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() {
  console.log("server started on port 3000");
})

// 70fee46a40ee5f098c354889c457a161-us17 api key
// 5404fb1728 list id
