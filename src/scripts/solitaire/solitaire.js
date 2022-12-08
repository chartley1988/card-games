import "./_solitaireStyle.scss";
import { addDeckBase, deckDisplay } from "../deckDisplay/deckDisplay";
import StandardCards from "../standardPackOfCards";

const Solitaire = () => {
  ///////////////////////////////////////////////
  /////////// HELPER FUNCTIONS
  ///////////////////////////////////////////

  // Builds the talon pile, which is a waste pile.
  function buildTalon(surface) {
    talon = addDeckBase("stack");
    talon.container.classList.add("talon");
    surface.appendChild(talon.container);
  }

  // Builds the stock pile where cards are drawn from.
  // The top card of the stack is the last card of the deck array.
  function buildStock(surface) {
    stock = addDeckBase("stack");
    stock.deck.cards = StandardCards();
    stock.deck.state = "idle";
    stock.deck.removeCard("joker", "joker");
    stock.deck.removeCard("joker", "joker");
    stock.deck.cards.forEach((card) => {});
    stock.container.classList.add("stock");
    surface.appendChild(stock.container);
    console.log(stock.cascadePercent);

    stock.cascade();
  }

  // Builds all 4 foundations
  function buildFoundations(surface) {
    // Initiate 4 foundations, where the cards are ultimately stacked
    buildFoundation(surface, "foundation-1");
    buildFoundation(surface, "foundation-2");
    buildFoundation(surface, "foundation-3");
    buildFoundation(surface, "foundation-4");
  }

  // builds the tableaus, and moves cards onto them...
  // probably want this to be 2 steps

  function buildTableauAddCards(stock, surface) {
    for (let i = 1; i < 8; i++) {
      const newTableau = buildTableau(`tableau-${i}`);
      tableaus[`tableau-${i}`] = newTableau;
      surface.appendChild(newTableau.container);
      for (let index = 0; index < i; index++) {
        setTimeout(() => {
          setTimeout(() => {
            stock.moveCardToDeck(newTableau);
          }, index * 50);
        }, i * 300);
        if (i === 7 && index === 6) {
          const newFlip = flipBottomCards.bind(null, tableaus);
          setTimeout(() => {
            setTimeout(() => {
              onStockClick();
            }, index * 50);
          }, i * 300);
          setTimeout(() => {
            setTimeout(() => {
              newFlip();
            }, index * 50);
          }, i * 450);
        }
      }
    }
  }

  // Builds the foundations where cards are stacked starting with Ace.
  // target = element that the foundation is appended to.
  // className = string name of class to add, makes layout simpler.
  const buildFoundation = (target, className) => {
    const foundation = addDeckBase("stack");
    foundation.container.classList.add(className);
    target.appendChild(foundation.container);
    return foundation;
  };

  // Builds the tableau stacks in the bottom of solitaire where cards are cascaded in order.
  // target = element that the tableau is appended to.
  // className = string name of class to add, makes layout simpler.
  const buildTableau = (className) => {
    const tableau = addDeckBase("cascade");
    tableau.container.classList.add(className);
    return tableau;
  };

  // Good god I don't know what to call this function. Flips the bottom
  // card of each tableau at the start of the game.
  function flipBottomCards(tableaus) {
    for (const key in tableaus) {
      tableaus[key].deck.cards[tableaus[key].deck.cards.length - 1].flipCard();
    }
  }

  const onStockClick = () => {
    stock.deck.cards[stock.deck.cards.length - 1].card.addEventListener(
      "click",
      turnStockCard
    );
  };

  const turnStockCard = async () => {
    const topCard = stock.deck.cards[stock.deck.cards.length - 1];
    topCard.card.removeEventListener("click", turnStockCard);
    const move = stock.moveCardToDeck(talon);
    topCard.flipCard();
    onStockClick();
  };

  // the main doozy which runs all our helper functions
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
    // Flips bottom card only of each Tableau after init
    // Adds click listener to top stock card to flip card to Talon.
    //-> moved click listener and flip bottom Cards to end of build Tableau add Cards

    return table;
  }

  async function makeDecks() {}

  ///////////////////////////////////////
  // PROPERTIES
  ///////////////////////////////////////

  let stock = {};
  let talon = {};
  let foundations = {};
  let tableaus = {};
  // probably need to add more props here...

  // The Initializer, we will want to do more
  const initializeGame = () => {
    const surface = buildSurface();
    // where we do more game initialization

    return surface;
  };

  return {
    initializeGame,
  };
};

export default Solitaire();
