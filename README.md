# WanderStay 🧳

WanderStay is a full-stack web application inspired by Airbnb that allows users to explore, create, edit, and manage travel accommodation listings. The platform provides an intuitive interface for browsing destinations and viewing detailed property information.

## Features

* View all available listings
* Add new property listings
* Edit existing listings
* Delete listings
* Detailed listing pages
* Responsive Bootstrap UI
* MongoDB database integration
* RESTful routing
* Server-side form validation

## Tech Stack

  ### Frontend
  * HTML
  * CSS
  * Bootstrap 5
  * EJS
  
  ### Backend
  * Node.js
  * Express.js
  
  ### Database
  * MongoDB
  * Mongoose

## Project Structure

WanderStay/
│
├── init/
│   ├── data.js
│   └── index.js
│
├── models/
│   └── listing.js
│
├── views/
│   ├── listingsrelated/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   └── includes/
│       ├── navbar.ejs
│       └── footer.ejs
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       └── script.js
│
├── app.js
├── package.json
├── package-lock.json
└── README.md

## Installation

1. Clone the repository
git clone <your-github-repository-link>

2. Navigate to the project folder
cd WanderStay

3. Install dependencies
npm install

4. Start MongoDB
mongosh

5. Run the application
node app.js

6. Open browser
http://localhost:8080/listings


## Screenshots

Add screenshots of:
* Listing Details Page
* Create Listing Form
* Edit Listing Page

## Future Enhancements

* User Authentication
* Authorization
* Reviews and Ratings
* Image Upload with Cloudinary
* Interactive Maps
* Booking System
* Search and Filters

## Learning Outcomes

This project helped in understanding:

* CRUD Operations
* RESTful APIs
* MongoDB & Mongoose
* Express Routing
* EJS Templating
* Bootstrap Styling
* Form Validation
* Full-Stack Web Development

## Author

Amrita Patnaik
