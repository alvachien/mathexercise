# introduction
This web app which used to generate exercises of Math (actually it is more than Math, including the puzzle game and English), targets for the students in Primary School to do practices. It can store the failure in the exercises, trace the results via statistics charts, plan and integrated for award plans, and it also provided several puzzle games.

# demo
A demo was deployed in [github.io](https://alvachien.github.io/mathexercise/).

The demo above does not support the functionalities requires login, in other words, this simple app supports neither trace the result of the quiz nor award system.

# content
The features of web app including:
1. Generate the quiz based on specified scope; Including:
    - Addition
    - Subtraction
    - Multiplication
    - Division
    - Mixed operation
    - Puzzle game: Calculat 24
    - Puzzle game: Sudou
    - Puzzle game: Typing tour
    - Puzzle game: MineSweeper
    - Puzzle game: Gobang
2. Record the time spent and trace the failure of the exercies;
3. Use the failure failor to continue the exercise until it is fully succeed;
4. Possibility to retest upon failures;
5. Show the statistics of the quiz to the authorized user;
6. Chosen puzzle games included: Calculate 24, Sudou, and more to come;
7. Multiple langues supported: English, Simplified Chinese;
8. Integrated award system;
    - Award plan. Set a plan to encourage the quiz taker;
    - Award overview. Take the analysis upon the point owned and used;
9. Authority control. Only authorizied users (normally parents) can use the following part:
    - Statistics of the quiz result
    - Award plan creation
10. English word diction [Ongoing];
11. Chinese word diction [Ongoing];
12. More to come

# design
Take a look at the design doc for this project: [click](https://github.com/alvachien/mathexercise/design.md)

# dependencies
This web app depends on the following project
1. [AC Identity Server](https://github.com/alvachien/acidserver)
2. [AC Quiz API](https://github.com/alvachien/acquizapi)

# credits
This web app credits to the following libraries:
1. [Angular 6](https://angular.io/)
2. [Angular Material2](https://material.angular.io/)
3. [Bootstrap 4](https://getbootstrap.com/)
4. [ngx-translate](http://www.ngx-translate.com/)
5. [oidc-client](https://github.com/IdentityModel/oidc-client-js)
6. [Angular CLI](https://github.com/angular/angular-cli)
7. [d3.js](https://d3js.org)
8. [ngx-charts](https://swimlane.github.io/ngx-charts/)
9. [moment](https://github.com/moment/moment)
10. [howler.js](https://howlerjs.com/)

# author
**Alva Chien (Hongjun Qian) | 钱红俊**

A programmer, a photographer and a father.
 
Contact me:

1. Via mail: alvachien@163.com. Or,
2. [Check my flickr](http://www.flickr.com/photos/alvachien).

# license
MIT
