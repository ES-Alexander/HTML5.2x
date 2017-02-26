# HTML5.2x
W3c HTML5 course game project files:

  HTML: game.html
  
    This is the html file on which the game is based, including the basic elements where data is presented, and the buttons for player mouse interraction.

  CSS: game.css
  
    This is the css file where game elements are styled, including styling for the game itself, as well as the analytics elements.
  
  JS: analytics.js, ball.js, collisions.js, fps.js, game.js, listeners.js, timeBasedAnim.js
  
    In order, these:
    
      - provide the updating of analytics elements to enable on-the-fly updating of analytics displays
      - provide the basis object and properties for the ball objects in the game
      - calculate and perform collisions of the balls with walls, each other, and the player/monster
      - help the usage of time-based animation by providing a frames/second counter
      - perform the updates and animations of the game itself, including mode changes and update calls
      - hold all event listeners for the game, including those for buttons, as well as keyboard and mouse input
      - provide the necessary tools for time-based animation
