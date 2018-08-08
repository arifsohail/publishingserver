<?php

$content = <<<EOD
  import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <p><Link to="/mygatsbysite/multidots/page-2/index.html">Go to page 2</Link></p>
    <p><Link to="/mygatsbysite/multidots/page-3/index.html">Go to page 3</Link></p>
  </div>
)

export default IndexPage


EOD;
$contentPage2 = <<<EOD
    import React from 'react'
import Link from 'gatsby-link'

const SecondPage = () => (
  <div>
    <h1>Hi people This is a second page</h1>
    <p>Welcome to page 2</p>
    <p><Link to="/mygatsbysite/multidots/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/multidots/page-3/index.html">Go to page 3</Link></p>
  </div>
)

export default SecondPage
EOD;

$contentPage3 = <<<EOD
    import React from 'react'
import Link from 'gatsby-link'

const ThirdPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to page 3</p>
    <p><Link to="/mygatsbysite/multidots/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/multidots/page-2/index.html">Go to page 2</Link></p>
  </div>
)

export default ThirdPage
EOD;




$postDataArr = [
    "site_name" => "multidots",
    "pages" => [
        [ "filename" => "index.js",
            "content" => $content
        ],
        [ "filename" => "page-2.js",
            "content" => $contentPage2
        ],
        [ "filename" => "page-3.js",
            "content" => $contentPage3
        ],
    ],
];
$curl = curl_init();

curl_setopt_array($curl, array(
    CURLOPT_PORT => "8080",
    CURLOPT_URL => "http://34.211.109.30:8080/api/publish-gatsby-pages",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($postDataArr),
    CURLOPT_HTTPHEADER => array(
        "content-type: application/json"
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}