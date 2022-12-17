import "./_solitaireStyle.scss";
import { addDeckBase, deckDisplay } from "../deckDisplay/deckDisplay";
import {
  moveCardInTableauListener,
  emptyTableauListener,
  emptyFoundationListener,
} from "./solitaireConditions";
import StandardCards from "../cardFoundations/standardPackOfCards";

const Solitaire = () => {
  let stock = {};
  let talon = {};
  let foundations = {};
  let tableaus = {};

  const cardValueMap = (() => {
    const map = new Map();
    map.set("A", 1);
    map.set("2", 2);
    map.set("3", 3);
    map.set("4", 4);
    map.set("5", 5);
    map.set("6", 6);
    map.set("7", 7);
    map.set("8", 8);
    map.set("9", 9);
    map.set("10", 10);
    map.set("J", 11);
    map.set("Q", 12);
    map.set("K", 13);
    return map;
  })();

  const cardColorMap = (() => {
    const map = new Map();
    map.set("♥", "red");
    map.set("♦", "red");
    map.set("♠", "black");
    map.set("♣", "black");
    return map;
  })();

  const initializeGame = () => {
    const surface = buildSurface();
    return surface;
  };

  function buildSurface() {
    const table = document.createElement("div");
    table.classList.add("solitaire");
    const surface = document.createElement("div");
    surface.classList.add("surface");
    table.appendChild(surface);
    buildStock(surface);
    buildTalon(surface);
    buildFoundations(surface);
    buildTableauAddCards(stock, surface);
    return table;
  }

  function buildStock(surface) {
    stock = addDeckBase("stack");

    stock.deck.cards = StandardCards();
    for (let index = 0; index < stock.deck.cards.length; index++) {
      const card = stock.deck.cards[index];
      card.location = stock;
    }

    addDoubleClickListeners(stock.deck.cards);

    stock.deck.state = "idle";
    stock.deck.removeCard("joker", "joker");
    stock.deck.removeCard("joker", "joker");
    stock.deck.shuffleDeck();

    stock.container.classList.add("stock");
    stock.location = "stock";

    surface.appendChild(stock.container);

    const recycleWrapper = document.createElement("div");
    recycleWrapper.classList.add("recycle");
    recycleWrapper.innerHTML = `<svg style="width:100%;height:auto" viewBox="0 0 24 24">
    <path fill="currentColor" d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />
    </svg>`;
    surface.appendChild(recycleWrapper);

    setTimeout(() => {
      recycleWrapper.addEventListener("click", recycleStock);

      setTimeout(() => {
        stock.cascade();
      }, 0);
    });
  }

  function buildTalon(surface) {
    talon = addDeckBase("stack");
    talon.container.classList.add("talon");
    talon.location = "talon";
    surface.appendChild(talon.container);
  }

  function buildFoundations(surface) {
    buildFoundation(surface, "foundation-1");
    buildFoundation(surface, "foundation-2");
    buildFoundation(surface, "foundation-3");
    buildFoundation(surface, "foundation-4");
  }

  function buildFoundation(target, className) {
    const foundation = addDeckBase("stack");
    foundation.container.classList.add(className);
    emptyFoundationListener(foundation);
    foundation.location = "foundation";
    target.appendChild(foundation.container);
    return foundation;
  }

  function buildTableauAddCards(stock, surface) {
    for (let i = 1; i < 8; i++) {
      const newTableau = buildTableau(`tableau-${i}`);
      tableaus[`tableau-${i}`] = newTableau;
      surface.appendChild(newTableau.container);
    }
    for (let i = 1; i < 8; i++) {
      for (let j = i; j < 8; j++) {
        setTimeout(() => {
          setTimeout(() => {
            moveCardInTableauListener(
              tableaus[`tableau-${j}`],
              stock.deck.cards[stock.deck.cards.length - 1]
            );

            const card = stock.moveCardToDeck(tableaus[`tableau-${j}`]);
            card.location = tableaus[`tableau-${j}`];
          }, j * 100 - i * 25);
        }, i * 600);
        if (i === 7 && j === 7) {
          const newFlip = flipBottomCards.bind(null, tableaus);
          setTimeout(() => {
            setTimeout(() => {
              onStockClick();
            }, j * 100);
          }, i * 750);
          setTimeout(() => {
            setTimeout(() => {
              newFlip();
            }, j * 100);
          }, i * 750);
        }
      }
    }
  }

  function buildTableau(className) {
    const tableau = addDeckBase("cascade");
    tableau.container.classList.add(className);
    tableau.location = "tableau";
    emptyTableauListener(tableau);
    return tableau;
  }

  function flipBottomCards(tableaus) {
    const cardArray = [];
    for (const key in tableaus) {
      const targetCard =
        tableaus[key].deck.cards[tableaus[key].deck.cards.length - 1];
      cardArray.push(targetCard);
    }
    function flipBatchDuration(cardArray, duration) {
      const flipDelay = duration / cardArray.length;
      for (let i = 1; i < cardArray.length + 1; i++) {
        const timeDelay = flipDelay * i;
        const element = cardArray[i - 1];
        element.flipCard(timeDelay);
      }
    }
    flipBatchDuration(cardArray, 1000);
  }

  function onStockClick() {
    if (stock.deck.cards.length > 0) {
      stock.deck.cards[stock.deck.cards.length - 1].card.addEventListener(
        "click",
        turnStockCard
      );
    } else {
      setTimeout(() => {
        stock.container.style.visibility = "hidden";
      }, 700);
    }
  }

  function recycleStock() {
    stock.container.style.visibility = "visible";
    const talonLength = talon.deck.cards.length;

    talon.deck.cards.forEach((card) => {
      card.card.removeEventListener("click", card.boundListener);
    });

    talon.deck.cards[0].card.addEventListener("click", turnStockCard);

    const promiseArray = [];
    for (let card = 0; card < talonLength; card++) {
      const promise = new Promise((resolve, reject) => {
        setTimeout(resolve, card * 20);
      }).then(function () {
        const card = talon.moveCardToDeck(stock);
        card.flipCard();
      });
      promiseArray.push(promise);
    }
    Promise.all(promiseArray).then(function () {
      onStockClick();
    });
  }

  function turnStockCard() {
    const topCard = stock.deck.cards[stock.deck.cards.length - 1];
    topCard.card.removeEventListener("click", turnStockCard);
    const move = stock.moveCardToDeck(talon);
    move.location = talon;
    topCard.flipCard(250);
    moveCardInTableauListener(talon, move); // adds the ability to move card to tableau
    onStockClick();
  }

  // CARSONS SCRAP LOGIC STARTS HERE //
  function addDoubleClickListeners(cardArray) {
    cardArray.forEach((card) => {
      card.card.addEventListener("dblclick", function () {
        onDoubleClick(card);
      });
    });
  }

  function onDoubleClick(card) {
    printCardInfo(card);
    switch (card.location) {
      case stock:
        // Nothing
        break;
      case talon:
        if (card.number === "A") {
          addAceToFoundations(talon);
          break;
        }

        const validFoundationMove = checkForFoundationMove(card);
        if (validFoundationMove !== false) {
          addCardToFoundations(talon, validFoundationMove);
          break;
        }

        const validTableauMove = checkForTableauMove(card, talon);
        if (validTableauMove !== false) {
          addCardToTableaus(talon, validTableauMove);
          break;
        }
        /** 1) Is it an ace? --> Place on first available foundation -- return
         *  2) Is it a card that is on number higher and same suit than a card on foundation?
         *      Place on that foundation -- return
         *  3) Loop through tableaus
         *      Is the last card of this stack one number higher and opposite suit of this card?
         *          Place card at end of stack - return
         */
        break;
      case foundations[`foundation-1`]:
      case foundations[`foundation-2`]:
      case foundations[`foundation-3`]:
      case foundations[`foundation-4`]:
        /** Do nothing, once a card is in a foundation, it cannot be played. -- return
         *
         */
        break;
      case tableaus[`tableau-1`]:
      case tableaus[`tableau-2`]:
      case tableaus[`tableau-3`]:
      case tableaus[`tableau-4`]:
      case tableaus[`tableau-5`]:
      case tableaus[`tableau-6`]:
      case tableaus[`tableau-7`]:
        const currentTableau = card.location;
        if (card.faceUp === false) {
          break;
        }

        if (isLastCard(card, currentTableau)) {
          if (card.number === "A") {
            addAceToFoundations(currentTableau);
            clickToFlipToLastCard(currentTableau);
            break;
          }

          const validFoundationMove = checkForFoundationMove(card);
          if (validFoundationMove !== false) {
            addCardToFoundations(currentTableau, validFoundationMove);
            clickToFlipToLastCard(currentTableau);
            break;
          }

          const validTableauMove = checkForTableauMove(card, currentTableau);
          if (validTableauMove !== false) {
            addCardToTableaus(currentTableau, validTableauMove);
            clickToFlipToLastCard(currentTableau);
            break;
          }
        } else {
          console.log("Not last card");
          const validTableauMove = checkForTableauMove(card, currentTableau);
          if (validTableauMove !== false) {
            const timer = addMultipleCardsToTableaus(
              currentTableau,
              validTableauMove,
              card
            );
            setTimeout(() => {
              clickToFlipToLastCard(currentTableau);
            }, 300);
            break;
          }
        }

        /** 1) Is the card faceUp? If not, end sequence and return.
         *  2) Is the card the last card of the stack?
         *    Yes:
         *      If its an ace, place on first available foundation -- return
         *      If there is a foundation one number lower and same suit, place on that foundation -- return
         *      Loop through tableaus except this one:
         *        Is there a stack where last card is one number higher and opposite suit?
         *          If so, place this card there -- return
         *    No:
         *      Loop through tableaus except this one:
         *        Is there a stack where last card is one number higher and opposite suit?
         *          Get all cards below this card and shift them all to that stack.
         *
         *
         */
        break;
      default:
        console.log("Error! Unknown location!");
        break;
    }
  }

  function printCardInfo(card) {
    console.table({
      Location: card.location,
      "Face Up?": card.faceUp,
      Card: `${card.number} of ${card.suit}`,
    });
  }

  function addAceToFoundations(source) {
    console.log("ace found");
    for (const foundation in foundations) {
      if (Object.hasOwnProperty.call(foundations, foundation)) {
        const pile = foundations[foundation];
        if (pile.deck.cards.length === 0) {
          const card = source.moveCardToDeck(pile);
          break;
        }
      }
    }
  }

  function addCardToFoundations(source, destination) {
    const card = source.moveCardToDeck(destination);
    console.log(card.location);
  }

  function addCardToTableaus(source, destination) {
    const card = source.moveCardToDeck(destination);
    console.log(card.location);
  }

  function addMultipleCardsToTableaus(source, destination, card) {
    const cardIndex = source.deck.cards.findIndex((index) => index === card);
    for (let index = cardIndex; index < source.deck.cards.length; index++) {
      setTimeout(() => {
        const card = source.moveCardToDeck(
          destination,
          source.deck.cards[cardIndex]
        );
        console.log(card.location);
      }, index * 30);
    }
  }

  function checkForFoundationMove(card) {
    const cardValue = cardValueMap.get(card.number);
    for (const foundation in foundations) {
      if (Object.hasOwnProperty.call(foundations, foundation)) {
        const pile = foundations[foundation];
        if (pile.deck.cards.length > 0) {
          const topCard = pile.deck.cards[pile.deck.cards.length - 1];
          const topValue = cardValueMap.get(topCard.number);

          if (topCard.suit !== card.suit) continue;
          if (topValue + 1 !== cardValue) continue;
          return pile;
        } else {
          continue;
        }
      }
    }
    return false;
  }

  function checkForTableauMove(card, source) {
    const cardValue = cardValueMap.get(card.number);
    const cardColor = cardColorMap.get(card.suit);
    for (const tableau in tableaus) {
      if (Object.hasOwnProperty.call(tableaus, tableau)) {
        const pile = tableaus[tableau];

        if (pile.deck.cards.length > 0) {
          const topCard = pile.deck.cards[pile.deck.cards.length - 1];
          const topValue = cardValueMap.get(topCard.number);
          const topColor = cardColorMap.get(topCard.suit);

          if (pile === source) continue;
          if (topColor === cardColor) continue;
          if (topValue - 1 !== cardValue) continue;
          return pile;
        } else {
          if (cardValue === 13) {
            return pile;
          }
        }
      }
    }
    return false;
  }

  // Returns true or false if card is last in its array. ADD TO DECK CLASS
  function isLastCard(card, deckBase) {
    const cardIndex = deckBase.deck.cards.findIndex((index) => index === card);
    if (cardIndex === deckBase.deck.cards.length - 1) {
      return true;
    }
  }

  function clickToFlipToLastCard(deckBase) {
    if (deckBase.deck.cards.length === 0) {
      return;
    }
    const lastCard = deckBase.deck.cards[deckBase.deck.cards.length - 1];
    lastCard.card.addEventListener(
      "click",
      () => {
        if (lastCard.faceUp === false) {
          lastCard.flipCard();
        }
      },
      { once: true }
    );
  }

  // CARSONS SCRAP LOGIC ENDS HERE

  return {
    initializeGame,
  };
};

export default Solitaire();
