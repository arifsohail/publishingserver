import React from 'react'

class EmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log('value', event.target.value);
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    
  //   fetch('https://us18.api.mailchimp.com/3.0/lists/de66870087/members/', {
  //   method: 'post',
  //   headers: {'Authorization': 'Basic ' + base64.encode('username' + ":" + '158377d9b2e426547c76dfcd7193a84b-us18')},
  //   body: JSON.stringify(opts)
  // }).then(function(response) {
  //   return response.json();
  // }).then(function(data) {
  //   console.log(data);
  // });


  fetch('https://us18.api.mailchimp.com/3.0/lists/de66870087/members/', { 
    method: 'POST', 
    mode: "no-cors",
    headers: {
    "content-type": "application/json",
    "authorization": "Basic YWJjOjE1ODM3N2Q5YjJlNDI2NTQ3Yzc2ZGZjZDcxOTNhODRiLXVzMTg=",
    "cache-control": "no-cache",
    "postman-token": "8b6c8d3f-c742-0522-6adb-d6683df6e6b0"
    }, 
    body: JSON.stringify({
      "email_address":`${this.state.value}`,
        "merge_fields": {
        "FNAME": "sohail",
        "LNAME": "arif"
      },
      "status":"subscribed",
      "apikey": "158377d9b2e426547c76dfcd7193a84b-us18",
      
    })
  }).then(function (response) {
    console.log(response);
  }).catch(err => {
    console.log(err);
  });

  }



  render() {
    return (
      <div >
        <label>
          Email:
          <input type="email" value={this.state.value} onChange={this.handleChange} />
        </label>
        <button  onClick={this.handleSubmit}>Submit</button>
      </div>
    );
  }
}

export default EmailForm