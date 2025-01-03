## Overview

This is my full-stack web application project made using Next.js and React. 

The application I have made is a productivity task managing website, with the following features:
  - the user can manage a list of tasks that are stored in a backend database using PocketBase
  - the user can start tasks in the application and a timer will show up as a countdown for the tasks, with the main idea of allowing users to focus while the timer is running in the background
  - tasks can be stopped and resumed at a later time, and changes will be stored in the database.

## Setup/Tutorial

To get started, first install local dependencies

```bash
npm install
```

And then start up the database in another terminal window:

```bash
./pocketbase serve
```

And finally, in the first terminal window, run the application with:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) within your browser to see the website and have a look around.

Ensure you are also using the latest version of node:

```bash
# with node version manager
nvm use --lts
```

## AI configuration

To get the AI chat to work correctly, please visit [https://console.groq.com/keys](https://console.groq.com/keys) and sign up and generate an API key (all free!). 

Create a file called ```$env.local ``` and create the following environment variable:

```GROQ_API_KEY="[YOUR API KEY]"```

Copy the API key generated from the website and assign it to the environment variable above, and everything should work.


