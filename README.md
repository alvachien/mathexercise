# INTRODUCTION
This web app was written for exercises' generation of Math (including the puzzle game and English), targets to help the students in Primary School to do practices. It can store the failure in the exercises, trace the results via statistics charts, plan and integrated for award plans, and it also provided several puzzle games.

This app also support to print the exercise out as PDF format.

# LIVE DEMO
A live demo was deployed in [github.io](https://alvachien.github.io/mathexercise/).

The demo above does not support the functionalities requires data storing, including awarding, failure retry, etc.

# CONTENT
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
2. Print the exercies to PDF file;
3. Record the time spent and trace the failure of the exercies;
5. Use the failure failor to continue the exercise until it is fully succeed;
6. Possibility to retest upon failures;
7. Show the statistics of the quiz to the authorized user;
8. Chosen puzzle games included: Calculate 24, Sudou, and more to come;
9. Multiple langues supported: English, Simplified Chinese;
10. Integrated award system;
    - Award plan. Set a plan to encourage the quiz taker;
    - Award overview. Take the analysis upon the point owned and used;
11. Authority control. Only authorizied users (normally parents) can use the following part:
    - Statistics of the quiz result
    - Award plan creation
12. English word diction [Ongoing];
13. Chinese word diction [Ongoing];
14. More to come

# DESIGN
Take a look at the design doc for this project: [click here](https://github.com/alvachien/mathexercise/blob/master/design.md).

# DEPENDENCIES
This web app depends on the following project
1. [AC Identity Server](https://github.com/alvachien/acidserver)
2. [AC Quiz API](https://github.com/alvachien/acquizapi)

# CREDITS
This web app credits to the following libraries:
1. [Angular 7](https://angular.io/) and its [Github repo](https://github.com/angular/angular)
2. [Angular Material2](https://material.angular.io/)
3. [ngx-translate](http://www.ngx-translate.com/)
4. [oidc-client](https://github.com/IdentityModel/oidc-client-js)
5. [jspdf](https://parall.ax/products/jspdf), and its [Github repo](https://github.com/MrRio/jsPDF)
6. [ngx-charts](https://swimlane.github.io/ngx-charts/)
7. [moment](https://github.com/moment/moment)
8. [howler.js](https://howlerjs.com/)

# AUTHOR
**Alva Chien (Hongjun Qian) | 钱红俊**

A programmer, a photographer and a father.
 
Contact me:

1. Via mail: alvachien@163.com. Or,
2. [Check my flickr](http://www.flickr.com/photos/alvachien).

# LICENSE
MIT
