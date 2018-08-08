<?php

$content = <<<EOD
    import React from 'react'
import Link from 'gatsby-link'


  <div>
    <h1>Hi khanjan your site is ready using gatsby</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <p><Link to="/mygatsbysite/khanjan/page-2/index.html">Go to page 2</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-3/index.html">Go to page 3</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-4/index.html">Go to page 4</Link></p>
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
    <p><Link to="/mygatsbysite/khanjan/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-3/index.html">Go to page 3</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-4/index.html">Go to page 4</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-5/index.html">Go to page 5</Link></p>
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
    <p><Link to="/mygatsbysite/khanjan/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-2/index.html">Go to page 2</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-4/index.html">Go to page 4</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-5/index.html">Go to page 5</Link></p>
  </div>
)

export default ThirdPage
EOD;

$contentPage4 = <<<EOD
    import React from 'react'
import Link from 'gatsby-link'

const ForthPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to page 4</p>
    <p><Link to="/mygatsbysite/khanjan/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-2/index.html">Go to page 2</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-3/index.html">Go to page 3</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-5/index.html">Go to page 5</Link></p>
  </div>
)

export default ForthPage
EOD;

$contentPage5 = <<<EOD
    import React from 'react'
import Link from 'gatsby-link'

const FifthPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to page 5</p>
    <p><Link to="/mygatsbysite/khanjan/index.html">Go back to the homepage</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-2/index.html">Go to page 2</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-3/index.html">Go to page 3</Link></p>
    <p><Link to="/mygatsbysite/khanjan/page-4/index.html">Go to page 4</Link></p>
  </div>
)

export default FifthPage
EOD;
$layoutContent = <<<EOD
    import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import './index.css'

const Header = () => (
    <div style={{
        background: 'rebeccapurple', marginBottom: '1.45rem',
    }}
    >
        <div
            style={{
                margin: '0 auto',
                maxWidth: 960,
                padding: '1.45rem 1.0875rem',
            }}
        >
            <h1 style={{ margin: 0 }}>
                <Link
                    to="/mygatsbysite/khanjan/index.html"
                    style={{
                        color: 'white',
                        textDecoration: 'none',
                    }}
                >
                    Gatsby Site of khanjan
            </Link>
            </h1>
        </div>
    </div>
)

const TemplateWrapper = ({
  children
}) => (
        <div>
            <Helmet
                title="Gatsby Default Starter"
                meta={[
                    { name: 'description', content: 'Sample' },
                    { name: 'keywords', content: 'sample, something' },
                ]}
            />
            <Header />
            <div
                style={{
                    margin: '0 auto',
                    maxWidth: 960,
                    padding: '0px 1.0875rem 1.45rem',
                    paddingTop: 0,
                }}
            >
                {children()}
            </div>
        </div>
    )

TemplateWrapper.propTypes = {
    children: PropTypes.func,
}

export default TemplateWrapper

EOD;

$postDataArr = [
    "site_name" => "khanjan",
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
        [ "filename" => "page-4.js",
            "content" => $contentPage4
        ],
        [ "filename" => "page-5.js",
            "content" => $contentPage5
        ],
    ],
    "layout" => [
        [ "filename" => "index.js",
            "content" => $layoutContent
        ],
    ]
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