// Demo menus for the 20 stores, keyed by Bravo store id. Each line is "Name | price (CAD) | description".
// Dishes whose names match a store's recommended dishes in Bravo's catalog get Bravo's photo and are featured;
// `rename` fixes catalog typos before matching, `skip` drops catalog entries that aren't dishes (or are alcohol).
// The other dishes and every price are made up for the demo.
export default {
  36: {
    ready: 30,
    menu: {
      'Hot pot sets': [
        'Combo for 2 | 58.99 | Copper pot, two broths, lamb, beef, vegetables and noodles',
        'Combo for 3–4 | 98.99 | Copper pot, two broths, lamb and beef platters, seafood, vegetables',
        'Spicy Dry Pot | 26.99 | Wok-tossed lamb, lotus root and potato in mala spice',
      ],
      'Soup bases': [
        'Original Clear Broth | 8.99 | Ginger, scallion and goji in a light bone broth',
        'Spicy Mala Broth | 9.99 | Beef tallow, chilies and Sichuan peppercorn',
        'Tomato Broth | 9.99 | Slow-cooked tomato, sweet and tangy',
        'Mushroom Broth | 9.99 | Wild mushrooms and dried shiitake',
      ],
      'Meats': [
        'Assorted Lamb Platter | 24.99 | Lamb leg, shoulder and belly, hand-sliced',
        'Tender Lamb Loin | 18.99 | Thin-cut loin, cooks in seconds',
        'Premium Snowflake Fatty Beef | 21.99 | Well-marbled beef rolls',
        'Beijing Lamb Roll | 16.99 | Classic rolled lamb for the copper pot',
        'Beef Tripe | 12.99 | Crunchy honeycomb tripe',
      ],
      'Seafood': [
        'Mixed Seafood Platter | 28.99 | Shrimp, squid, mussels and fish fillet',
        'Shrimp Paste | 13.99 | Hand-made, scooped straight into the pot',
      ],
      'Vegetables & tofu': [
        'Vegetable Platter | 11.99 | Napa cabbage, spinach, corn and winter melon',
        'Frozen Tofu | 6.99 | Soaks up every drop of broth',
        'Lotus Root Slices | 6.99',
        'Enoki Mushrooms | 6.99',
      ],
      'Noodles & sides': [
        'Beijing-Style Glass Noodles | 6.99 | Sweet potato noodles, chewy and slippery',
        'Hand-Cut Noodles | 5.99',
        'Lamb Siu Mai | 10.99 | Open-top dumplings with minced lamb',
        'Sesame Flatbread | 4.99 | Toasted, flaky, for dipping',
        'Sesame Dipping Sauce | 2.99 | House blend with chive flower and fermented tofu',
      ],
      'Drinks': [
        'Sour Plum Drink | 4.50 | Smoked plum and osmanthus, served cold',
        'Beijing Yogurt | 4.50',
      ],
    },
  },

  120: {
    ready: 15,
    menu: {
      'Noodles': [
        "Xi'an Oil-Splashed Noodles | 15.99 | Wide noodles, chili flakes and garlic flashed with hot oil",
        'Biang Biang Noodles | 16.99 | Hand-pulled belt noodles with pork and vegetables',
        'Tomato & Egg Biang Biang Noodles | 16.49',
        'Cumin Beef Noodles | 17.49 | Stir-fried beef with cumin, onion and peppers',
        'Hot & Sour Saozi Noodles | 15.99 | Pork, tofu and wood ear in a tangy broth',
        'Lamb Soup Noodles | 16.99',
      ],
      'Cold dishes': [
        "Xi'an Liangpi | 11.99 | Cold wheat noodles, gluten, cucumber, chili and black vinegar",
        'Sesame Liangpi | 11.99 | Same noodles in a rich sesame sauce',
        'Spicy Cucumber Salad | 7.99',
        'Garlic Wood Ear Salad | 8.49',
      ],
      'Roujiamo': [
        'Classic Pork Roujiamo | 8.99 | Slow-braised pork in a crisp baked bun',
        'Cumin Lamb Roujiamo | 10.49 | Cumin-fried lamb, onion and cilantro',
        'Spicy Beef Roujiamo | 9.99',
      ],
      'Soups': [
        'Water Basin Lamb | 17.99 | Milky lamb broth with lamb slices and glass noodles',
        'Lamb Paomo Soup | 18.49 | Torn flatbread simmered in lamb broth',
        'Hot & Sour Dumpling Soup | 13.99',
      ],
      'Dumplings': [
        'Pork & Chive Dumplings (12) | 13.99',
        'Lamb & Carrot Dumplings (12) | 14.99',
        'Spicy Wontons in Chili Oil | 12.49',
      ],
      'Drinks': [
        'Bingfeng Orange Soda | 3.50',
        'Sour Plum Drink | 3.99',
      ],
    },
  },

  104: {
    ready: 15,
    menu: {
      'Baked rice & pasta': [
        'Baked Pork Chop Rice | 16.99 | Fried pork chop on egg fried rice under tomato sauce and cheese',
        'Baked Seafood Rice in Cream Sauce | 18.49',
        'Curry Brisket Spaghetti | 16.49 | Tender beef brisket in HK-style curry',
        'Baked Portuguese Chicken Rice | 16.99 | Coconut curry, potato and chicken',
      ],
      'Wok': [
        'Dry Fried Beef Noodles | 16.49 | Wok-charred rice noodles with beef and soy',
        'Chicken Chow Mein | 15.99 | Crispy noodles with chicken and greens',
        'Fried Rice | 15.49 | Shrimp, BBQ pork, egg and scallion',
        'Singapore Rice Noodles | 15.99',
        'Salted Fish & Chicken Fried Rice | 16.49',
      ],
      'Sandwiches & toast': [
        'Egg Sandwich | 7.99 | Soft scrambled egg on milk bread',
        'Luncheon Meat & Egg Sandwich | 8.99',
        'Peanut Butter & Condensed Milk Toast | 6.99 | Thick toast, fried golden',
        'Pineapple Bun with Butter | 4.99',
        'French Toast with Syrup | 7.49',
      ],
      'Noodle soups': [
        'Satay Beef Instant Noodles | 11.99',
        'Wonton Noodle Soup | 13.49',
        'Curry Fish Ball Noodles | 12.49',
      ],
      'Set meals': [
        'All-Day Breakfast Set | 14.99 | Macaroni soup, eggs, ham, toast and a drink',
        'Macaroni Soup with Ham | 9.99',
      ],
      'Drinks': [
        'HK Milk Tea | 4.75 | Silky, strong, hot or iced',
        'Yuenyeung | 4.75 | Coffee and milk tea',
        'Iced Lemon Tea | 4.50',
        'Red Bean Ice | 5.99',
      ],
    },
  },

  73: {
    ready: 25,
    menu: {
      'Noodles': [
        'Chongqing Noodles | 13.99 | Wheat noodles in a numbing chili broth with peanuts',
        'Spicy Beef Brisket Noodles | 15.99',
        'Sour & Spicy Pork Noodles | 14.49',
        'Dry Mix Zajiang Noodles | 13.99 | Pork and yellow pea sauce, tossed dry',
        'Sichuan Dan Dan Noodles | 13.49',
        'Spicy Pork Intestine Noodles | 15.49',
      ],
      'Clay pot rice': [
        'Sichuan-Style Cured Meat Clay Pot Rice | 17.99 | Smoky cured pork, crispy rice crust',
        'Clay Pot Rice with Chicken and Spare Ribs | 18.49',
        'Cantonese Clay Pot Rice | 17.99 | Chinese sausage, cured duck and pork belly',
        'Clay Pot Rice with Chicken and Chinese Sausage | 17.99',
        'Rice Pot with Pork Ribs | 17.49',
      ],
      'Small plates': [
        'Spicy Wontons | 10.99 | Pork wontons in chili oil and black vinegar',
        'Sichuan Cold Noodles | 9.99',
        'Mouth-Watering Chicken | 12.99 | Poached chicken in chili oil and sesame',
        'Smashed Cucumber | 6.99',
        'Braised Egg | 2.50',
      ],
      'Add-ons': [
        'Extra Noodles | 3.00',
        'Fried Egg | 2.50',
        'Extra Beef Brisket | 5.50',
      ],
      'Drinks': [
        'Herbal Tea | 2.99',
        'Soy Milk | 3.50',
      ],
    },
  },

  32: {
    ready: 15,
    menu: {
      'Rice noodles': [
        'Original Crossing Bridge Rice Noodles | 15.99 | Yunnan bone broth served piping hot with toppings on the side',
        'Tomato Crossing Bridge Rice Noodles | 16.49',
        'Sichuan Spicy Rice Noodles | 15.99',
        'Sichuan Pepper Chicken Rice Noodles | 16.99 | Green Sichuan pepper broth, tender chicken',
        'Pork Tripe Rice Noodles | 16.49 | Peppery pork tripe broth',
        'Fish Maw Chicken Rice Noodles | 17.99',
        'Pickled Fish Rice Noodles (Spicy) | 17.49',
      ],
      'Rice': [
        'Beef Rice Bowl | 15.49 | Braised beef over steamed rice',
        'Pickled Fish Rice (Spicy) | 16.99',
        'Braised Pork Rice | 13.99',
      ],
      'Snacks': [
        'Three-Item Braised Platter | 11.99 | Braised egg, tofu and pork',
        'Taiwanese Popcorn Chicken | 9.99 | Crispy, salt and pepper',
        'Pan-Fried Pork Dumplings | 9.49',
        'Crispy Fried Tofu | 7.49',
        'Spicy Lotus Root | 6.99',
        'Yunnan Mint Beef Salad | 11.99',
      ],
      'Desserts': [
        'Brown Sugar Glutinous Rice Cakes | 7.99 | Crisp outside, chewy inside, brown sugar syrup',
        'Mango Pomelo Sago | 6.99',
      ],
      'Drinks': [
        'Hot Soy Milk | 3.25',
        'Lemon Green Tea | 4.99',
        'Hawthorn Juice | 3.99',
      ],
    },
  },

  52: {
    ready: 25,
    skip: ['Exquisite dim sum'],
    menu: {
      'Dim sum': [
        'Har Gow (4) | 8.99 | Whole shrimp in a thin crystal wrapper',
        'Pork & Shrimp Siu Mai (4) | 8.49',
        'Scallop Tofu Dumplings | 9.99',
        'Steamed Chicken Feet with Guilin Lily Sauce | 7.99 | Braised until tender, sweet chili bean sauce',
        'Steamed Spare Ribs with Black Bean | 7.99',
        'Egg Yolk Father’s Bun | 7.49 | Molten salted egg custard',
        'BBQ Pork Buns (3) | 7.49',
        'Shrimp Rice Roll | 9.49 | Silky rice noodle sheets, sweet soy',
        'Truffle Lobster Crispy Rice Rolls | 16.99',
        'Pan-Fried Turnip Cake | 7.49',
      ],
      'Porridge & rice': [
        'Century Egg and Lean Pork Porridge | 10.99 | Slow-cooked congee',
        'Fu Man Lou Fish, Shrimp and Crab Fried Rice | 24.99 | House special fried rice with seafood',
        'Sticky Rice in Lotus Leaf | 8.99',
      ],
      'Kitchen': [
        'Peking Duck (Half) | 42.00 | Crisp skin, pancakes, scallion and hoisin',
        'Honey Garlic Spare Ribs | 22.99',
        'Salt & Pepper Squid | 21.99',
        'Gai Lan with Garlic | 16.99',
        'Beef Chow Fun | 19.99',
        'Seafood E-Fu Noodles | 23.99',
      ],
      'Desserts': [
        'Mango Sago Dessert | 7.99',
        'Baked Egg Tarts (3) | 6.99',
        'Osmanthus Jelly | 6.49',
      ],
    },
  },

  156: {
    ready: 10,
    rename: { 'Yakult grapes': 'Yakult Grape Yogurt', 'Eat rice yogurt': 'Chewy Rice Yogurt' },
    menu: {
      'Signature yogurt': [
        'Chewy Rice Yogurt | 7.99 | Thick yogurt with chewy purple rice',
        'White Peach Dumpling Yogurt | 8.49 | White peach purée and mochi dumplings',
        'Strawberry Dumpling Yogurt | 8.49',
        'Matcha Dango Yogurt | 8.49 | Uji matcha with dango pieces',
        'Mango Pomelo Yogurt | 8.49',
        'Durian Yogurt | 9.49',
        'Avocado Yogurt Smoothie | 8.99',
      ],
      'Fruit yogurt': [
        'Yakult Grape Yogurt | 7.99 | Fresh grapes, Yakult and yogurt',
        'Blueberry Yogurt | 7.99',
        'Passion Fruit Yogurt | 7.49',
        'Kiwi Yogurt | 7.99',
        'Watermelon Yogurt | 7.49 | Seasonal',
      ],
      'Milk tea': [
        'Brown Sugar Boba Milk | 6.99',
        'Oolong Milk Tea | 6.49',
        'Taro Milk Tea | 6.99',
        'Coconut Milk Tea | 6.49',
      ],
      'Fruit tea': [
        'Grapefruit Green Tea | 6.49',
        'Lemon Black Tea | 5.99',
        'Peach Oolong | 6.49',
      ],
      'Toppings': [
        'Tapioca Pearls | 0.75',
        'Coconut Jelly | 0.75',
        'Cheese Foam | 1.25',
      ],
    },
  },

  117: {
    ready: 10,
    menu: {
      'Hot desserts': [
        'Ginger Milk Pudding | 6.99 | Set to order with fresh ginger juice',
        'Black Rice with Coconut Milk & Red Bean | 6.99',
        'Brown Sugar Ginger Tea with Red Dates & Quail Eggs | 7.49',
        'Black Sesame Soup | 6.49',
        'Walnut Soup | 6.49',
        'Sweet Potato Ginger Soup | 5.99',
        'Tofu Pudding | 5.99 | Silky tofu fa with ginger syrup',
      ],
      'Cold desserts': [
        'Mango Mango with Mochi & Sago | 8.99 | Fresh mango, mango purée, mochi and sago',
        'Taro Sago Coconut | 7.49',
        'Thai-Style Grass Jelly with Mixed Jelly and Coconut Jelly | 7.99',
        'Mango Pomelo Sago | 7.99',
        'Durian Pancakes (2) | 8.99',
        'Silky Steamed Milk Pudding | 6.49 | Double-skin milk, served cold',
      ],
      'Snacks': [
        'Steamed Fish Siu Mai | 6.99 | Hong Kong street-style',
        'Rice Noodle Rolls with Mixed Sauce | 6.99 | Sweet, peanut and sesame sauces',
        'Curry Fish Ball | 6.49',
        'Egg Waffle | 7.49',
        'Pineapple Bun | 3.99',
      ],
      'Drinks': [
        'HK Milk Tea | 4.75',
        'Hot Lemon Coke with Ginger | 4.99',
        'Red Bean Ice | 6.49',
      ],
    },
  },

  344: {
    ready: 25,
    rename: { 'Panner Pakora Chaat': 'Paneer Pakora Chaat' },
    skip: ['Espresso Martini'],
    menu: {
      'Chaat & starters': [
        'Dahi Puri | 10.99 | Crisp shells, potato, yogurt and tamarind',
        'Paneer Pakora Chaat | 12.99',
        'Akora Paneer Chaat | 12.99',
        'Samosas (2) | 8.99',
        'Calamari | 15.99 | Masala-spiced, mint chutney',
        'Salmon Tikka | 19.99',
        'Kadi Pakora | 13.99',
      ],
      'Fusion': [
        'Lamb Vindaloo Spaghetti | 22.99 | Fiery Goan vindaloo meets Italian pasta',
        'Butter Chicken Nachos | 17.99',
        'Butter Chicken Rice Bowl | 18.99',
        'Deluxe Aloo Tikki Burger | 16.99 | Spiced potato patty, chutneys, brioche',
      ],
      'Curries': [
        'Coconut Prawn Curry | 23.99 | Prawns in a coconut and curry leaf sauce',
        'Kadai Paneer | 18.99 | Paneer, peppers and onion in kadai masala',
        'Butter Chicken | 20.99',
        'Dal Makhani | 16.99',
      ],
      'Breakfast': [
        'Egg Bhurji | 13.99 | Indian-style scrambled eggs with pav',
        'Masala Omelette | 12.99',
      ],
      'Breads & rice': [
        'Butter Naan | 3.99',
        'Garlic Naan | 4.49',
        'Jeera Rice | 5.99',
      ],
      'Desserts & drinks': [
        'Tiramisu | 9.99',
        'Kinder Shake | 9.49',
        'Mango Majesty | 8.49 | Mango shake',
        'Royal Banana Fizz | 8.49',
        'Mango Lassi | 6.49',
      ],
    },
  },

  519: {
    ready: 20,
    rename: { 'Pad Pad Nor Mai': 'Pad Nor Mai', 'Thai Ice Tea': 'Thai Iced Tea' },
    menu: {
      'Starters': [
        'Stuffed Chicken Wings | 13.99 | Boneless wings stuffed with glass noodles and pork',
        'Fresh Salad Rolls | 9.99',
        'Gai Ping Platter | 15.99 | Grilled marinated chicken skewers, sticky rice',
        'Kor Moo Yang | 15.99 | Grilled pork neck, jaew dipping sauce',
        'Crying Tiger Beef | 18.99',
      ],
      'Soups & salads': [
        'Tom Yum Soup | 9.99',
        'Tom Kha | 10.99 | Coconut, galangal and lemongrass soup',
        'Yum Woon Sen | 15.49 | Glass noodle salad with shrimp and pork',
        'Green Papaya Salad | 13.99',
      ],
      'Curries': [
        'Yellow Curry | 18.99 | Potato, onion and your choice of protein',
        'Green Curry | 18.99',
        'Red Curry with Duck | 22.99',
        'Hor Mok Gai Ma Praw Onn | 21.99 | Chicken curry steamed in a young coconut',
      ],
      'Noodles & rice': [
        'Pad Thai | 17.99 | Tamarind sauce, peanuts, egg and bean sprouts',
        'Pad See Ew | 17.99',
        'Kao Soi | 18.99 | Northern curry noodle soup with crispy noodles',
        'Pad Woon Sen | 16.99',
        'Pineapple Fried Rice | 18.49',
      ],
      'Stir-fries': [
        'Pad Eggplant with Chicken | 17.99 | Thai basil, chili and garlic',
        'Pad Nor Mai | 17.49 | Bamboo shoots, chili and basil',
        'Cashew Chicken | 18.49',
      ],
      'Dessert & drinks': [
        'Mango Sticky Rice | 9.99',
        'Thai Iced Tea | 5.49',
        'Coconut Water | 4.99',
      ],
    },
  },

  499: {
    ready: 20,
    skip: ['Fried Chicken'],
    menu: {
      'Fried chicken': [
        'Original Chicken | 26.99 | Twice-fried, extra crunchy, whole chicken',
        'Sweet Spicy Chicken | 28.99 | Gochujang glaze',
        'Soy Garlic Chicken | 28.99',
        'Cheese Sprinkle Chicken | 29.99 | Dusted with sweet cheese powder',
        'Bulgogi Chicken | 29.99',
        'Wasabi Mayo Chicken | 29.99',
        'Pick Two Flavours Combo | 31.99',
      ],
      'Grilled': [
        'Grilled Chicken | 28.99 | Charcoal-style grilled, less oil',
        'Hot Grill Grilled Chicken | 29.99',
      ],
      'Boxes & skewers': [
        'Boneless Sweet Spicy Bites | 18.99',
        'Snack Box | 16.99 | Chicken, rice cakes, fries and a dip',
        'Chicken & Rice Skewer | 6.99',
      ],
      'Sides': [
        'Tteokbokki | 13.99',
        'Cheese Corn | 7.99',
        'Cheese Balls (5) | 7.99',
        'Seasoned Fries | 6.99',
        'Kimchi Fried Rice | 13.99',
        'Pickled Radish | 2.50',
      ],
      'Drinks': [
        'Milkis | 2.99',
        'Korean Pear Juice | 3.49',
        'Coke | 2.50',
      ],
    },
  },

  48: {
    ready: 15,
    menu: {
      'Noodles': [
        'Laksa Noodle Soup | 15.99 | Coconut curry broth, prawns, tofu puffs',
        'Hainanese Chicken Laksa | 16.49',
        'Penang Char Kway Teow | 15.99 | Wok-fried flat noodles, prawns, Chinese sausage',
        'Ipoh Bean Sprout Chicken Noodles | 15.49',
        'Hokkien Mee | 15.49',
        'Mee Goreng | 14.99',
        'Prawn Mee Soup | 16.49',
      ],
      'Rice': [
        'Nasi Lemak with Chicken Rendang | 16.99 | Coconut rice, sambal, anchovies, egg',
        'White-Cut Chicken Rice | 15.49 | Poached chicken, ginger and chili sauce',
        'Roast Chicken with Rice | 15.49',
        'Butterfly Pea Flower Nasi Kerabu | 16.99',
        'Curry Chicken Combo | 16.49',
        'Nasi Goreng | 14.99',
      ],
      'Roti & snacks': [
        'Malaysian Roti with Curry Beef Brisket | 14.99 | Flaky roti, slow-cooked brisket curry',
        'Roti Canai with Curry | 9.99',
        'Chicken Satay (6) | 12.99',
        'Kuih Platter | 7.99',
      ],
      'Drinks & desserts': [
        'Teh Tarik | 4.50',
        'Iced Milo Dinosaur | 5.49',
        'Cendol | 6.99',
        'Bandung Rose Milk | 4.50',
      ],
    },
  },

  55: {
    ready: 25,
    menu: {
      'Rolls': [
        'Toku Signature Roll | 17.99',
        'Red Tornado | 16.99 | Spicy tuna, tempura crunch, torched salmon',
        'Dynamite Roll | 10.99',
        'Spicy Tuna Roll | 9.99',
        'Rainbow Roll | 16.49',
        'Salmon Avocado Roll | 9.49',
      ],
      'Aburi & sashimi': [
        'Aburi Sushi Set | 26.99 | Flame-seared salmon, tuna, scallop and ebi',
        'Salmon Battera | 15.99',
        'Beef Sashimi | 18.99',
        'Salmon Sashimi (8) | 17.99',
        'Assorted Sashimi | 32.99',
      ],
      'Hot kitchen': [
        'Fresh Oysters | 21.99 | Half dozen, ponzu and lemon',
        'Grilled Squid | 15.99 | Robata-grilled, sweet soy glaze',
        'Fried Tempura | 14.99 | Prawns and seasonal vegetables',
        'Robata Skewers | 14.99',
        'Chicken Karaage | 11.99',
        'Gyoza (6) | 8.99',
      ],
      'Bowls & sets': [
        'Bento Box | 24.99 | Sashimi, tempura, teriyaki, rice and salad',
        'Sukiyaki Hotpot | 26.99',
        'Chicken Teriyaki Don | 16.99',
        'Unagi Don | 23.99',
      ],
      'Sides & drinks': [
        'Miso Soup | 3.50',
        'Edamame | 5.99',
        'Green Tea | 2.50',
        'Ramune | 3.99',
      ],
    },
  },

  605: {
    ready: 20,
    rename: { 'BOWL - Carne Asada': 'Carne Asada Bowl', 'Birriamen': 'Birriaramen' },
    skip: ['Weekend Brunch', 'Magaritas'],
    menu: {
      'Tacos': [
        'Quesabirria Tacos | 17.99 | Crispy cheese tacos with braised beef and consommé',
        'Carne Asada Tacos (3) | 15.99',
        'Al Pastor Tacos (3) | 14.99',
        'Pollo Asado Tacos (3) | 14.49',
        'Baja Fish Tacos (3) | 16.49',
        'Rajas con Queso Tacos (3) | 13.99',
      ],
      'Burritos & bowls': [
        'Burrito Norteño | 17.99 | Grilled steak, beans, rice, cheese and salsa roja',
        'Carne Asada Bowl | 18.49',
        'Chicken Tinga Bowl | 16.99',
        'Veggie Burrito | 14.99',
      ],
      'Specials': [
        'Birriaramen | 19.99 | Ramen in birria consommé with braised beef',
        'Queso Fundido Mixto | 15.99',
        'Chilaquiles | 16.99 | Weekends',
        'Enchiladas Verdes | 18.99',
      ],
      'Starters & sides': [
        'Guacamole & Chips | 12.99',
        'Elote | 7.99',
        'Mexican Rice & Beans | 5.99',
        'Churros | 8.99',
      ],
      'Drinks': [
        'Horchata | 4.99',
        'Jamaica Agua Fresca | 4.99',
        'Jarritos | 3.99',
      ],
    },
  },

  281: {
    ready: 35,
    menu: {
      'Antipasti': [
        'Focaccia & Olives | 9.00',
        'Beef Tartare | 23.00 | Hand-cut, capers, egg yolk, crostini',
        'Crab Cakes | 22.00',
        'Calamari | 19.00 | Lightly fried, lemon aioli',
        'Burrata & Beet Salad | 21.00',
        'Caesar Salad | 17.00',
        'Minestrone | 13.00',
      ],
      'Pasta & risotto': [
        'Squid Ink Linguine | 34.00 | Prawns, scallops and chili',
        'Veggie Lasagna | 28.00 | Layers of roasted vegetables, ricotta and béchamel',
        'Wild Mushroom Risotto | 32.00',
        'Spaghetti Carbonara | 29.00',
        'Pappardelle Bolognese | 31.00',
        'Gnocchi al Pomodoro | 27.00',
      ],
      'Secondi': [
        'Sablefish | 46.00 | Miso-glazed, seasonal vegetables',
        'Rack of Lamb | 52.00 | Herb crust, red wine jus',
        'Braised Wagyu Cheek | 54.00',
        'Grilled Pacific Seafood | 49.00',
        'Chicken Parmigiana | 36.00',
      ],
      'Dolci': [
        'Tiramisu | 13.00',
        'Panna Cotta | 12.00',
        'Cannoli (2) | 11.00',
      ],
    },
  },

  613: {
    ready: 15,
    menu: {
      'Manousheh': [
        'Classic Zaatar Manousheh | 7.99',
        'Wild Zaatar Manousheh | 9.49 | Wild thyme, sumac, olive oil, fresh vegetables',
        'Cheese Manousheh | 9.99',
        'Lahmeh Bi Ajjine | 11.49 | Spiced minced beef flatbread',
        'Zaatar & Cheese Half-Half | 10.49',
      ],
      'Wraps': [
        'Chicken Shawarma | 13.99 | Garlic toum, pickles and fries in a wrap',
        'Chicken Tawouk Wrap | 13.49',
        'Green Baked Falafel Wrap | 12.49',
        'Beef Burger Wrap | 14.49',
        'Vegetarian Denver Omelet Wrap | 11.99',
        'Halloumi Wrap | 12.99',
      ],
      'Flatbreads & plates': [
        'Kafta Supreme Flatbread | 15.99 | Grilled kafta, tomato, onion and parsley',
        'Mediterranean Flatbread | 14.49',
        'Chicken Shawarma Pan | 17.99 | Shawarma, rice, salad and garlic sauce',
      ],
      'Salads & sides': [
        'Fattoush | 10.99',
        'Tabbouleh | 9.99',
        'Hummus with Pita | 8.99',
        'Garlic Potatoes | 7.49',
        'Baked Fries with Toum | 6.99',
      ],
      'Drinks & sweets': [
        'Ayran | 3.99',
        'Fresh Lemonade with Mint | 5.49',
        'Chocolate Banana Manousheh | 9.49',
      ],
    },
  },

  496: {
    ready: 20,
    rename: {
      'Salad Roll - Gỏi Cuốn': 'Salad Rolls (Gỏi Cuốn)',
      'SpringRoll': 'Spring Rolls',
      'Hanoi Style Vermicelli Noodles with Charred & Caramelized Pork Grilled Over Hot Charcoal -': 'Hanoi Vermicelli with Charcoal-Grilled Pork',
    },
    menu: {
      'Starters': [
        'Anchovied Chicken Wings | 14.99 | Crispy wings tossed in fish sauce caramel',
        'Salad Rolls (Gỏi Cuốn) | 9.99 | Shrimp, pork, herbs and peanut sauce',
        'Spring Rolls | 10.49',
        'Saigon Imperial Spring Rolls | 11.49',
        'Crispy Lemongrass Tofu | 10.99',
      ],
      'Pho': [
        'Beef Pho (Phở Bò) | 17.49 | 12-hour beef broth, rice noodles, herbs',
        'Rare Beef & Brisket Pho | 17.99',
        'Chicken Pho (Phở Gà) | 16.49',
        'Vegetable Pho | 15.49',
      ],
      'Vermicelli & rice': [
        'Hanoi Vermicelli with Charcoal-Grilled Pork | 19.99 | Bún chả: caramelized pork, herbs, dipping broth',
        'Grilled Lemongrass Chicken Vermicelli | 18.49',
        'Grilled Lemongrass Chicken and Prawn | 22.99 | With broken rice and pickles',
        'Broken Rice with Pork Chop (Cơm Tấm) | 18.99',
        'Bun Dau Mam Tom | 21.99',
        'Bánh Xèo | 17.99 | Crispy turmeric crêpe with shrimp and pork',
      ],
      'Bánh mì': [
        'Grilled Pork Bánh Mì | 12.99',
        'Lemongrass Chicken Bánh Mì | 12.99',
        'Tofu Bánh Mì | 11.49',
      ],
      'Drinks': [
        'Egg Coffee | 6.99 | Whipped egg yolk over strong Vietnamese coffee',
        'Vietnamese Iced Coffee | 5.99',
        'Salted Lemonade | 5.49',
      ],
    },
  },

  465: {
    ready: 20,
    rename: {
      '24hr Marinated Sirloin Top AAA Steak & Eggs': '24hr Marinated AAA Sirloin Steak & Eggs',
      'Classic-blaze': 'Classic Blaze Burger',
      'Cheeseburgers': 'Cheeseburger',
    },
    menu: {
      'Burgers': [
        'Classic Blaze Burger | 16.99 | Fresh beef patty, lettuce, tomato, Blaze sauce',
        'Cheeseburger | 15.99',
        'Smokey BBQ Blaze | 18.49',
        'Crispy Chicken Blaze Burger | 17.49 | Buttermilk fried chicken, slaw, pickles',
        'Impossible Blaze (Vegan) | 18.99',
        'Mushroom Swiss Burger | 17.99',
        'Double Bacon Blaze | 21.99',
        'Spicy Jalapeño Burger (Halal) | 17.99',
      ],
      'Weekend brunch': [
        '24hr Marinated AAA Sirloin Steak & Eggs | 24.99 | Sirloin, two eggs, hashbrowns, toast',
        'Cheesy Sunrise | 15.99',
        'Blaze Rise N Shine | 16.49',
        'Buttermilk Pancakes | 13.99',
      ],
      'Sides': [
        'Poutine | 11.99 | Fries, cheese curds, gravy',
        'Fries | 5.99',
        'Sweet Potato Fries | 6.99',
        'Onion Rings | 7.49',
        'Caesar Salad | 10.99',
        'Gluten-Free Bun | 2.50',
      ],
      'Shakes & drinks': [
        'Vanilla Milkshake | 7.99',
        'Oreo Milkshake | 8.49',
        'Fountain Pop | 2.99',
      ],
    },
  },

  428: {
    ready: 15,
    menu: {
      'Signature pizzas (12")': [
        'Classico Pizza | 21.99 | San Marzano tomato, fior di latte, basil',
        'Capicola Pizza | 24.99 | Spicy capicola, mozzarella, chili honey',
        'Montebello Pizza | 24.99',
        'Parma Prosciutto | 26.99 | Prosciutto di Parma, arugula, parmigiano',
        'Pollo Whiskey BBQ Pizza | 24.99',
        'Supremo | 25.99',
        'Capricciosa | 24.99',
      ],
      'Classics (12")': [
        'Margherita | 18.99',
        'Pepperoni | 19.99',
        'Hawaiian | 20.99',
        'Veggie Garden | 21.99',
        'Meat Lovers | 24.99',
        'Four Cheese | 21.99',
      ],
      'By the slice': [
        'Pepperoni Slice | 4.75',
        'Margherita Slice | 4.25',
        'Hawaiian Slice | 4.75',
        'Build-Your-Own Slice | 5.25',
      ],
      'Sides & drinks': [
        'Garlic Knots (6) | 6.99',
        'Chicken Wings (10) | 15.99',
        'Caesar Salad | 9.99',
        'Tiramisu Cup | 6.49',
        'San Pellegrino | 2.99',
        'Canned Pop | 1.99',
      ],
    },
  },

  497: {
    ready: 20,
    menu: {
      'Benedicts': [
        'Classic Ham Benny | 18.99',
        'Scallop Bacon Benny | 24.99 | Seared scallops, bacon, hollandaise',
        'Smoked Salmon & Lemon Hollandaise Benny | 21.99',
        'Crab Cake Benny | 23.99',
        'Florentine Benny | 17.99',
      ],
      'Eggs & plates': [
        'Egg & Co. Breakfast | 17.99 | Two eggs, bacon or sausage, hashbrowns, toast',
        'Avocado Egg | 16.99 | Smashed avocado, poached eggs, sourdough',
        'Black Truffle & Mushroom Toast | 18.99',
        'Breakfast Carbonara | 19.99 | Spaghetti, bacon, egg yolk, parmesan',
        'Shakshuka | 18.49',
        'Chicken & Waffle | 21.99',
      ],
      'Sweet': [
        'Buttermilk Pancakes | 15.99',
        'Cinnamon French Toast | 16.49 | Brioche, cinnamon sugar, maple',
        'Berry Ricotta Pancakes | 17.49',
      ],
      'Sandwiches': [
        'B.L.T. Sandwich | 15.99 | Thick-cut bacon, lettuce, tomato on sourdough',
        'Breakfast Burrito | 16.99',
        'Grilled Cheese & Tomato Soup | 15.49',
      ],
      'Sides & drinks': [
        'Hashbrowns | 4.99',
        'Thick-Cut Bacon | 5.99',
        'Fresh Orange Juice | 5.99',
        'Latte | 5.49',
      ],
    },
  },
}
