# Meme Central

A web application that displays and manage a collection of memes fetched from an external API. Built with Node.js, Express, and EJS, it allows users to discover, view, and track memes.

## Features

- Fetches 20 random memes once on server startup.
- Displays memes in a table on the Meme Overview page (`/memes`).
- User login/logout functionality.
- Guests can view the meme list but cannot see details.
- Logged-in users can click "Details" to view more information about a specific meme (`/memes/:id`).
- Viewed memes are highlighted per user session.
- Backend search functionality filters memes by name.
- Navbar includes logo, user status/name, and login/logout buttons.

![](public/images/meme-readme-4.jpg)

## Technologies Used

- **Backend:** Node.js
- **Framework:** Express.js
- **Template Engine:** EJS (Embedded JavaScript templates)
- **Authentication:** Passport.js (using `passport-local` strategy)
- **Session Management:** `express-session`
- **API Calls:** Axios
- **Frontend Styling:** Bootstrap 5, Bootstrap Icons, Google Fonts, custom CSS
- **JavaScript Library:** jQuery (for DOM manipulation and AJAX requests)
- **Data:** `users.json` file for demo users
- **Environment Config**: Dotenv (load environment variables from `.env``)

![](public/images/meme-readme-5.jpg)

## Installation & Setup

### Prerequisites

Node.js (v14 or higher)
npm (v6 or higher)

### Steps

1.  **Clone the repository:**
    ```
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```
    npm install
    ```
3.  **Configuration:**

    Create a `.env` file in the root with the following variables:

    ```env
    PORT=8000
    MEME_API_URL=
    SESSION_SECRET="your_session_secret"
    ```

## Running the Application

1.  **Start the server:**
    ```
    npm start
    ```
2.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000` or the port specified in your `.env` file.

## User Authentication

The application includes three pre-configured demo users:

| Username | Password |
| -------- | -------- |
| Josh     | Josh1    |
| FJ       | FJ1      |
| Student  | Student1 |

## Project Structure

<details>
<summary> Full Project Structure</summary>

```
project-root/
│
├── bin/
│   └── www
│
├── data/
│   └── users.json
│
├── middleware/
│   └── auth.js
│
├── public/
│   ├── images/
│   ├── js/
│   │   └── custom.js
│   │  
│   └── stylesheets/
│       ├── auth.css
│       ├── home.css
│       ├── meme.css
│       ├── memes.css
│       ├── navbar.css
│       └── style.css
│
├── routes/
│   ├── auth.js
│   ├── index.js
│   ├── meme.js
│   └── memes.js
│
├── views/
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── navbar.ejs
│   │   └── scripts.ejs
│   ├── error.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── meme.ejs
│   ├── memes.ejs
│   └── signup.ejs
│
├── app.js
├── .env
├── package.json
└── README.md

```

</details>


## Notes

- Meme data is cached per server session (no re-fetching on navigation or reload)
- Guests can view memes but must log in to view full details
- Viewed memes are tracked via session and persist across page reloads during the same session (until logout or server restart).
- Passwords are stored in plain text for demo purposes (In a real application, they should be hashed using a library like bcrypt).

![](public/images/meme-readme-2.jpg) ![](public/images/meme-readme-3.jpg)

_Developed as part of a Javascript servers Course Assignment._

