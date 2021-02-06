# Concept

Tl;dr: we support the learning process during the ironhack bootcamp by providing students with short but frequent learning challenges on previous topics in order to keep all the knowledge fresh and to avoid ‘forgetting’ what you learned earlier on in the bootcamp. 

# Models & SChema

## User Model
-Name
-Email
-PT / FT
-Start date
-PasswordHash
-Profile picture - optional
-Creation date
-Edit date

## Flashcard Model
-Question title - char restricted 50
-Question description - char restricted 140 - Optional
-Question File upload - optional
-Question Code snippet upload - optional --> ????? how to? 
-Solution - char restricted 140
-Solution File upload - optional
-Solution code snippet upload - optional
-Topic enum [ Javascript: Basic Logic, Object Oriented, CSS: Selectors, Bootstrap, SCSS, Node.js: Express, mongoose, templating hbs, Deploying: Heroku]
-Module 1 / 2 / 3
-Difficulty [Nice to have - make it votable]
-Upvote
-Errorvote -- notify owner with email that an error was spotted. 
-Creation date
-Edit date

## Comment Model 
-Comment content - Char 140
-User id
-Flashcard id
-Creation date
-Edit date


# Routes

METHOD  -  PATH                     - PAGE              - DESCRIPTION
GET     - /                         - Home              - Displaying welcome page
GET     - /randomflashcard          - Random Card       - Displaying a random practice card
GET     - /browseflashcard          - Selection form    - Displaying form with filters for topic, difficulty & module
POST    - /browseflashcard          - Browse Cards      - Displaying all card titels filtered by topic, difficulty & module
GET     - /flashCard/create         - Create flashcard  - Display flashcard creation form
POST    - /flashcard/create         - Create flashcard      - Add flashcard to database
GET     - /flashcard/:id            - Single flashcard      - Display single flashcard (link to the update form, deletion form)
GET     - /flashcard/:id/update     - Update flashcard      - Display flashcard updating form
POST    - /flashcard/:id/update     - Update flashcard      - Update flashcard
GET     - /flashcard/:id/delete     - Delete flashcard      - Displays deletion confirmation
POST    - /flashcard/:id/delete     - Delete flashcard      - Delete flashcard
POST    - /flashcard/:id/upvote     - Upvote flashcard      - Increments points of flashcard by 1
POST    - /flashcard/:id/errorvote  - Errorvote flashcard   - Increments error points of flashcard by 1

### User
GET     - /user/signup              - signup user           - Display user creation form
POST    - /user/signup              - signup user           - Add user to database
GET     - /user/login               - Login                 - Display login form
POST    - /user/login               - User profile          - Display user profile

### Comment
GET     - /comment/create         - Create comment      - Display comment creation form
POST    - /comment/create         - Create comment      - Add comment to database