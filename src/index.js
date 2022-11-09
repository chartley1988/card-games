import "./style_card.scss";

// Dictionary of Standard 52 Card deck definitions
const Standard = (function () { 
	const suit = {
    'diamond':"♦",
    'heart': "♥",
    'spade': "♠",
    'club': "♣"
    }

    const members = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"]
    
    return {
        suit,
        members
    }
})();

// Creates card object, and handles DOM instantiation
const Card = (number, suit) => {
    //Properties
    number = number;
    suit =  suit;

    //Functions
    const getNumber = () => number;
    const getSuit = () => suit;
    
    // Instances the card objoct in the DOM, the target arguement
    // is where in the dom the card should be instanced.
    const make = (target) => {
        const card = document.createElement('div');
        const top_left = document.createElement('div');
        const bottom_right = document.createElement('div');
        // Add CSS classes to DOM object
        card.classList.add('playing'); // Specific to Standard 52 Deck
        card.classList.add('card'); // Generic to all cards
        card.dataset.suit = suit; // Adds suit as a data attribute to DOM object.
        card.dataset.number = number;
        // Adds CSS classes to corners of the card
        top_left.classList.add('top-left');
        bottom_right.classList.add('bottom-right');
        // Adds Suit and Number to opposite corners of cards
        [top_left, bottom_right].forEach(node => {
            const cornerNumber = document.createElement('div');
            const cornerSuit = document.createElement('div');
            // Sets text content of the card corners
            cornerNumber.textContent = number;
            cornerSuit.textContent = suit;
            // Adds data attribute of suit to both symbol and Letters for each corner
            cornerNumber.dataset.suit = suit;
            cornerSuit.dataset.suit = suit;
            // Adds both corner DOM elements to parent corner
            node.appendChild(cornerNumber);
            node.appendChild(cornerSuit);
            // Adds both corner elements to parent card
            card.appendChild(node);
        });
        // Adds center div to card with class 'card-center'
        const cardCenter = document.createElement('div');
        cardCenter.classList.add('card-center');
        card.appendChild(cardCenter);
        cardCenter.dataset.number = number;
        cardCenter.dataset.suit = suit;
        
        // Makes a center flexbox, appends it to cardCenter
        const makeCenterFlex = () => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('center-flex');
            cardCenter.appendChild(newDiv);
            return(newDiv);
        }

        // Makes a new card symbol, appends it to target
        const makeSymbol = (target) => {
            const symbol = document.createElement('div');
            symbol.textContent = suit;
            target.appendChild(symbol)
            return(symbol);
        }

        const makeAce = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "A";
        }

        const makeTwo = () => {
            const flex = makeCenterFlex();
            for (let i = 1; i <= number; i++) makeSymbol(flex);
        }

        const makeThree = () => {
            const flex = makeCenterFlex();
            for (let i = 1; i <= number; i++) makeSymbol(flex);
        }

        const makeFour = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            for (let i = 1; i <= 2; i++) makeSymbol(flex1);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
        }

        const makeFive = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 2; i++) makeSymbol(flex1);
            for (let i = 1; i <= 2; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "5";
        }

        const makeSix = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex2);
        }

        const makeSeven = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "7";
        }

        const makeEight = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 3; i++) makeSymbol(flex1);
            for (let i = 1; i <= 3; i++) makeSymbol(flex3);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
            flex2.dataset.number = "8";
        }

        const makeNine = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 4; i++) makeSymbol(flex1);
            for (let i = 1; i <= 4; i++) makeSymbol(flex3);
            makeSymbol(flex2);
            flex2.dataset.number = "5";
        }

        const makeTen = () => {
            const flex1 = makeCenterFlex();
            const flex2 = makeCenterFlex();
            const flex3 = makeCenterFlex();
            for (let i = 1; i <= 4; i++) makeSymbol(flex1);
            for (let i = 1; i <= 4; i++) makeSymbol(flex3);
            for (let i = 1; i <= 2; i++) makeSymbol(flex2);
            flex2.dataset.number = "10";
        }

        const makeJack = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "J";
        }

        const makeQueen = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "Q";
        }

        const makeKing = () => {
            const flex = makeCenterFlex();
            makeSymbol(flex);
            flex.dataset.number = "K";
        }

        
        if(number ==="A") makeAce();
        if(number ==="2") makeTwo();
        if(number ==="3") makeThree();
        if(number ==="4") makeFour();
        if(number ==="5") makeFive();
        if(number ==="6") makeSix();
        if(number ==="7") makeSeven();
        if(number ==="8") makeEight();
        if(number ==="9") makeNine();
        if(number ==="10") makeTen();
        if(number ==="J") makeJack();
        if(number ==="Q") makeQueen();
        if(number ==="K") makeKing();




        target.appendChild(card);
    };

    return {
        getNumber,
        getSuit,
        make
    };
}

// Generates a standard deck of 52 cards.
const make52 = (target) => {
    const suitArray = [
        Standard.suit["diamond"],
        Standard.suit["heart"],
        Standard.suit["club"],
        Standard.suit["spade"]
    ]
    
    for (let index = 0; index < suitArray.length; index++) {
        const suit = suitArray[index];
        for (let index = 0; index < Standard.members.length; index++) {
            const cardNumber = Standard.members[index];
            const newCard = Card(cardNumber, suit);
        }
    }
}

// Generates 13 cards of a specified suit, to a specified target
const make13 = (suit, target) => {
    for (let index = 0; index < Standard.members.length; index++) {
        const cardNumber = Standard.members[index];
        const newCard = Card(cardNumber, suit);
        newCard.make(target);
    }
}

// Makes a grid for cards to instance to, For debug purposes.
const makeFlop = (target) => {
    const lineBreak = document.createElement('hr');
    const flop = document.createElement('div');
    flop.classList.add('flop');

    target.appendChild(lineBreak);
    target.appendChild(flop);
    
    return(flop);
}

const target = document.body;
const diamondFlop = makeFlop(target);
const heartFlop = makeFlop(target);
const clubFlop = makeFlop(target);
const spadeFlop = makeFlop(target);

const lineBreak = document.createElement('hr');
target.appendChild(lineBreak);
make13(Standard.suit['diamond'], diamondFlop);
make13(Standard.suit['heart'], heartFlop);
make13(Standard.suit['club'], clubFlop);
make13(Standard.suit['spade'], spadeFlop);
