# Spotify Radio - Semana JS Expert 6.0

Spotify radio is an audio streaming app where you can add effects in real time.

JS-Expert Project of the Week by the dear [@Erick Wendel](https://github.com/ErickWendel), with the challenge of implementing unit tests and e2e and achieving 100% coverage.

## Preview

Open https://spotify-radio-grilario.herokuapp.com/ and play audio.

Open https://spotify-radio-grilario.herokuapp.com/controller and control the transmission.

<img src="./prints/demo.png" />

## Getting Started

### Prerequisites

* [Nodejs in version 17](https://nodejs.org/en/blog/release/v17.7.2/)
* [Sox](http://sox.sourceforge.net/)
* libsox-fmt-mp3

Or

* [Docker](https://docs.docker.com/engine/install/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

Step 1: Clone the repo
   ```sh
   git clone https://github.com/Grilario/js-expert-spotify.git
   cd js-expert-spotify
   ```
Step 2:  Install NPM packages
   ```sh
    npm ci --silent
   ```
Step 3:  Run app
   ```sh
   npm run start
   ```

   Open http://localhost:3000 and take a look around.

#### Or with Docker

Step 1: Clone the repo
   ```sh
   git clone https://github.com/Grilario/js-expert-spotify.git
   cd js-expert-spotify
   ```
Step 2:  Run in docker
   ```sh
    npm run start:docker
   ```
   
   Open http://localhost:3000 and take a look around.

### Guide

   Open http://localhost:3000/home and play audio.
   
   Open http://localhost:3000/controller and control the transmission.


## Checklist Features

- Web API:
    - [x] Must achieve 100% code coverage in tests
    - [x] Must have end to end tests validating all API routes
    - [x] Must deliver static files like Node.js Stream
    - [x] Must deliver music files as Node.js Stream
    - [x] Given a disconnected user, should not break API
    - [x] Even if multiple commands are fired at the same time, it should not break the API
    - [x] If an unexpected error occurs, the API should continue working
    - [x] Project needs to run on Linux, Mac and Windows environments

- Web App:
    - Client:
        - [x] Must play the broadcast
        - [x] Shouldn't pause if any effects are added
    - Controller:
        - [x] Must achieve 100% code coverage in tests
        - [x] Must be able to start or stop a broadcast
        - [x] Must send commands to add audio effects to a stream

## Tasks per class

- Lesson 01: Cover service and route layers with unit tests and achieve 100% code coverage.
- Lesson 02: Maintain 100% code coverage and implement e2e tests for the entire API.
- Lesson 03: implement unit tests for the frontend and maintain 100% code coverage.
- **PLUS**:
    - [x] provide a new effect
        - [x] add a new button on controller
        - [x] add new effect sound to `audios/fx/` folder
        - [x] repost on heroku

### Credits to used audios

#### Streaming 
- [English Conversation](https://youtu.be/ytmMipczEI8)

#### Effects
- [Applause](https://youtu.be/mMn_aYpzpG0)
- [Applause Audience](https://youtu.be/3IC76o_lhFw)
- [Boo](https://youtu.be/rYAQN11a2Dc)
- [Fart](https://youtu.be/4PnUfYhbDDM)
- [Laugh](https://youtu.be/TZ90IUrMNCo)
- [Fart Shitting](https://freesound.org/people/IFartInUrGeneralDirection/sounds/64532/)
- [Rapaaz](https://youtu.be/Jvl0L9GRH6o)
