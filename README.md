# express-session-poc<br />

### yarn install

## Start the app in development mode using `yarn run dev`.
to get started, go to postman - or other api service.<br />
The server is hosted on port:3000<br />

## 1. Navigate to the /login endpoint.<br />
Add the following to the body with the POST verb:<br />
`email: user@fakedomain.com`<br />
`password: password`<br />
Complete the POST and you should recieve a hash. Copy the hash.<br />

## 2. Navigate to the /profile endpoint.<br />
Add the following to the headers, with your copied hash, using the GET verb:<br />
`access_token: <COPIED ACCESS TOKEN>`<br />
Complete the GET and you should recieve the user profile.<br />

## To register a new user:<br /> 
Navigate to the /register endpoint.<br />
Add the following to the body with the POST verb:<br />
`name: newuser`<br /><br />
`email: newuser@somedomain.com`<br />
`password: securepassword`<br />
complete the POST and you should recieve:<br />
`User created successfully, please log in.`<br />
Complete steps 1 and 2, to test your new user.<br />
