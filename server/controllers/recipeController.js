require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * Get /
 * Homepage
 */
exports.homepage = async(req, res) => {
    try {
      
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const caribbean = await Recipe.find({ 'category': 'Caribbean' }).limit(limitNumber);
        const mexican = await Recipe.find({ 'category': 'Mexican' }).limit(limitNumber);
        const seafood = await Recipe.find({ 'category': 'Seafood' }).limit(limitNumber);

        const food = { latest, caribbean, mexican, seafood }; 

        res.render('index',{ title: 'Grandma Taught Me - Home', categories, food } );
    }   catch (error) {
        res.statue(500).send({messaage: error.message || "Error Occured" });
    }

}



/**
 * Get /categories
 * Categories
 */
 exports.exploreCategories = async(req, res) => {
    try {
      
        const limitNumber = 6;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{ title: 'Grandma Taught Me - Categories', categories } );
    }   catch (error) {
        res.statue(500).send({messaage: error.message || "Error Occured" });
    }

}


/**
 * Get /catories/:id
 * Categories By Id
 */
 exports.exploreCategoriesById = async(req, res) => {
    try {
      let categoryId = req.params.id;
      const limitNumber = 20; 
      const categoryById = await Recipe.find({ 'category': categoryId });

        res.render('categories', { title: 'Grandma Taught Me - Categories', categoryById } );
    }   catch (error) {
        res.statue(500).send({messaage: error.message || "Error Occured" });
    }
}


/**
 * Get /recipe/:id
 * Recipes
 */
 exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id; 
      const recipe = await Recipe.findById(recipeId);

        res.render('recipe',{ title: 'Grandma Taught Me - Recipes', recipe } );
    }   catch (error) {
        res.statue(500).send({messaage: error.message || "Error Occured" });
    }
}


/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
      res.render('search', { title: 'Grandma Taught Me - Search', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
    
  }


/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
    try {
      const limitNumber = 20;
      const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
      res.render('explore-latest', { title: 'Grandma Taught Me - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


  /**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
    try {
      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random() * count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render('explore-random', { title: 'Grandma Taught Me - Explore Latest', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 


 /**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Grandma Taught Me - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }
  
  /**
   * POST /submit-recipe
   * Submit Recipe
  */
  exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  } 





















//async function insertDymmyCategoryData(){

//    try {
//      await Category.insertMany([
//       {
//            "name": "Caribbean",
//            "image": "caribbean-food.jpg"
//        },
//        {
//            "name": "Chinese",
//            "image": "chinese-food.jpg"
//        },
//        {
//            "name": "Indian",
//            "image": "indian-food.jpg"
//        },
//        {
//            "name": "Mexican",
//            "image": "mexican-food.jpg"
//        },
//        {
//            "name": "Seafood",
//            "image": "seafood.jpg"
//        },
//        {
//            "name": "SoulFood",
//            "image": "soul-food.jpg"
//        },
//    ]);
//    } catch (error) {
//      console.log('err', + error)
//
//    }
//} 

// insertDymmyCategoryData();



// async function insertDymyRecipeData(){
//     try {
//         await Recipe.insertMany([
//             { 
//                         "name": "Southern Fried Chicken",
//                         "description": `Buttermilk for this recipe: ½ cup of buttermilk = ½ cup of milk + ½ tablespoon of apple cider vinegar. Stir and let it sit for 5 minutes. Pour the peanut oil (preferred) or vegetable oil into a deep fryer, 6-quart skillet, or Dutch oven until the oil is 1-inch deep.
//                         Heat the oil over medium heat or until it reaches 350 degrees F.
//                         While youre waiting for the oil to heat up, Place 1 cup of the divided flour, garlic powder, onion powder, paprika, and red pepper in a medium-size mixing bowl or 1-gallon resealable food storage bag. 
//                         Shake (or mix) the sealed bag to combine the ingredients for a homemade poultry seasoning, and set the flour mixture aside.
//                         Pour the second cup of flour into a second resealable bag (or medium-sized mixing bowl) and set it aside.
//                         In another medium-sized bowl, whisk together the buttermilk and egg, and set that mixture aside too.
//                         Sprinkle the chicken pieces with salt and pepper.
//                         The chicken will go through a 3-step process from here.
//                         First, place the chicken in the bag (or bowl) of seasoned flour and shake or toss to coat the chicken evenly. 
//                         Second, shake off the excess flour and dip the chicken into the buttermilk mixture.
//                         Third, transfer the chicken to the last bag (or bowl) of flour and shake or toss until it’s very well coated. 
//                         Place the coated chicken into the pre-heated oil, skin-side down, and be careful not to overcrowd the chicken in the oil. You can fry a second batch if need be to avoid overcrowding by frying all the chicken at once. Just make sure the hot oil remains at 350 degrees F.
//                         Cook the chicken pieces for 10 to 12 minutes, occasionally turning to prevent excessive browning.
//                         As the chicken batter turns golden brown, remove it from the hot oil, and allow it to drain in a closed container (to keep the fried chicken warm) with a paper towel under the chicken. 
//                         Serve soul food Southern fried chicken right away, and enjoy!`,
//                         "email": "hello@maya.co.us",
//                         "ingredients": [
//                             "6-8 pieces of chicken (or one 3-pound chicken cut into pieces)",
//                             "48 oz. of peanut oil, or vegetable oil",
//                             "2 cups of all-purpose flour, divided", 
//                             "1 ½ teaspoon of garlic powder",
//                             "1 ½ teaspoon of onion powder",
//                             "1 ½ teaspoon of paprika",
//                             "¾ teaspoon of red pepper",
//                             "1 ½ teaspoon of salt",
//                             "¾ teaspoon of black pepper",
//                             "1 egg",
//                             "½ cup of buttermilk (½ cup of buttermilk = ½ cup of milk & ½ tablespoon of apple cider vinegar)",
//                          ],
//                          "category": "SoulFood", 
//                         "image": "southern-fried-chicken.jpg"
//                       },
//                        { 
//                          "name": "Jamaican Oxtails",
//                          "description": `Rinse oxtails with water and vinegar and pat dry. Cover oxtails with brown sugar, soy sauce, Worcestershire sauce, salt, garlic powder, black pepper, all-spice, and browning and rub into oxtails.
//                          Set Pressure Cooker on High Sauté and once hot, add vegetable oil. Next, add your larger oxtail pieces to the pot, flat side down about ¼ inch apart, and brown on each side.
//                          Remove oxtail after browning and place in bowl.
//                          Deglaze your pressure cooker by adding about 2 Tbsp of beef broth to the insert. Take a wooden spoon and deglaze your pot by removing the brown bits at the bottom. Then add your yellow onions, green onions, carrots, garlic, and scotch bonnet pepper. Stir and sauté for about 5 minutes or until the onions have softened.
//                          Add dried thyme, oxtails, remaining beef broth, and ketchup to the pressure cooker insert.
//                          Press “Cancel” on your Instant Pot. Cover and cook on high pressure for 45 minutes. Once timer is done, allow pressure cooker to naturally release.
//                          Once all pressure has released, open lid and remove oxtails and vegetables, leaving liquid behind. Turn Pressure Cooker on sauté. Once liquid begins to simmer, create a corn starch slurry by combining corn starch and water to a separate bowl. Stir into simmering liquid. Add drained butter beans into pressure cooker and allow to simmer for about 5 minutes, until liquid is slightly thickened and butterbeans are warmed.
//                          Add oxtails and vegetables back to the pressure cooker. Serve and enjoy`,
//                          "email": "hello@maya.co.us",
//                          "ingredients": [
//                             "2.5 lbs oxtails",
//                             "¼ cup brown sugar",
//                             "1 Tablespoon soy sauce",
//                             "1 Tablespoon Worcestershire Sauce",
//                             "1 Tablespoon salt",
//                             "2 teaspoons garlic powder",
//                             "1 teaspoon black pepper",
//                             "1 teaspoon all-spice",
//                             "1 teaspoon browning",
//                             "2 Tablespoons vegetable oil",
//                             "1 yellow onion chopped",
//                             "4 green onions chopped",
//                             "1 Tablespoon garlic chopped",
//                             "2 whole carrots chopped",
//                             "1 scotch bonnet or habanero pepper seeds and membrane removed and chopped",
//                             "1 cup beef broth",
//                             "1 Tablespoon ketchup",
//                             "1 teaspoon dried thyme",
//                             "2 Tablespoons water",
//                             "1 Tablespoon cornstarch",
//                             "1 16 oz can Butter Beans drained",
//                          ],
//                          "category": "Caribbean", 
//                          "image": "oxtails.jpg"
//                        },
//                        { 
//                         "name": "Orange Chicken",
//                         "description": `To make orange sauce:
//                         In a medium pot, add orange juice, sugar, vinegar, soy sauce, ginger, garlic, and red chili flakes. Heat for 3 minutes.
//                         In a small bowl, whisk 1 Tablespoon of cornstarch with 2 Tablespoons of water to form a paste. Add to orange sauce and whisk together. Continue to cook for 5 minutes, until the mixture begins to thicken. Once the sauce is thickened, remove from heat and add orange zest.
//                         To make chicken:
//                         Place flour and cornstarch in a shallow dish or pie plate. Add a pinch of salt. Stir.
//                         Whisk eggs in shallow dish.
//                         Dip chicken pieces in egg mixture and then flour mixture. Place on plate.
//                         Heat 2 -3 inches of oil in a heavy-bottomed pot over medium-high heat. Using a thermometer, watch for it to reach 350 degrees.
//                         Working in batches, cook several chicken pieces at a time. Cook for 2 - 3 minutes, turning often until golden brown. Place chicken on a paper-towel-lined plate. Repeat.
//                         Toss chicken with orange sauce. You may reserve some of the sauce to place on rice. Serve it with a sprinkling of green onion and orange zest, if so desired.
//                         Source: https://www.modernhoney.com/chinese-orange-chicken/`,
//                         "email": "hello@maya.co.us",
//                         "ingredients": [
//                             "Chicken:",
//                                 "4 Boneless Skinless Chicken Breasts cut into bite-size pieces",
//                                 "3 Eggs whisked",
//                                 "⅓ cup Cornstarch",
//                                 "⅓ cup Flour",
//                                 "Oil for frying",
//                             "Orange Chicken Sauce:",
//                                 "1 cup Orange Juice",
//                                 "½ cup Sugar",
//                                 "2 Tablespoons Rice Vinegar or White Vinegar",
//                                 "2 Tablespoons Soy Sauce use tamari for a gluten-free dish",
//                                 "¼ teaspoon Ginger",
//                                 "¼ teaspoon Garlic Powder or 2 garlic cloves, finely diced",
//                                 "½ teaspoon Red Chili Flakes",
//                                 "Orange Zest from 1 orange",
//                                 "1 Tablespoon Cornstarch",
//                             "Garnish:",
//                                 "Green Onions",
//                                 "Orange Zest",
//                          ],
//                          "category": "Asian", 
//                          "image": "orange-chicken.jpg"
//                         },
//                         { 
//                             "name": "Chicken Tikka Masala",
//                             "description": `In a bowl, combine chicken with all of the ingredients for the chicken marinade; let marinate for 10 minutes to an hour (or overnight if time allows).
//                             Heat oil in a large skillet or pot over medium-high heat. When sizzling, add chicken pieces in batches of two or three, making sure not to crowd the pan. Fry until browned for only 3 minutes on each side. Set aside and keep warm. (You will finish cooking the chicken in the sauce.)
//                             Melt the butter in the same pan. Fry the onions until soft (about 3 minutes) while scraping up any browned bits stuck on the bottom of the pan. 
//                             Add garlic and ginger and sauté for 1 minute until fragrant, then add garam masala, cumin, turmeric and coriander. Fry for about 20 seconds until fragrant, while stirring occasionally.
//                             Pour in the tomato puree, chili powders and salt. Let simmer for about 10-15 minutes, stirring occasionally until sauce thickens and becomes a deep brown red colour.
//                             Stir the cream and sugar through the sauce. Add the chicken and its juices back into the pan and cook for an additional 8-10 minutes until chicken is cooked through and the sauce is thick and bubbling. Pour in the water to thin out the sauce, if needed.
//                             Garnish with cilantro (coriander) and serve with hot garlic butter rice and fresh homemade Naan bread.`,
//                             "email": "hello@maya.co.us",
//                             "ingredients": [
//                                 "For the chicken marinade:",
//                                     "28 oz (800g) boneless and skinless chicken thighs cut into bite-sized pieces",
//                                     "1 cup plain yogurt",
//                                     "1 1/2 tablespoons minced garlic",
//                                     "1 tablespoon ginger",
//                                     "2 teaspoons garam masala",
//                                     "1 teaspoon turmeric",
//                                     "1 teaspoon ground cumin",
//                                     "1 teaspoon Kashmiri chili (or 1/2 teaspoon ground red chili powder)",
//                                     "1 teaspoon of salt",
//                                 "For the sauce:",
//                                     "2 tablespoons of vegetable/canola oil",
//                                     "2 tablespoons butter",
//                                     "2 small onions (or 1 large onion) finely diced",
//                                     "1 1/2 tablespoons garlic finely grated",
//                                     "1 tablespoon ginger finely grated",
//                                     "1 1/2 teaspoons garam masala",
//                                     "1 1/2 teaspoons ground cumin",
//                                     "1 teaspoon turmeric powder",
//                                     "1 teaspoon ground coriander",
//                                     "14 oz (400g) tomato puree (tomato sauce/Passata)",
//                                     "1 teaspoon Kashmiri chili (optional for colour and flavour)",
//                                     "1 teaspoon ground red chili powder (adjust to your taste preference)",
//                                     "1 teaspoon salt",
//                                     "1 1/4 cups of heavy or thickened cream (use evaporated milk for lower calories)",
//                                     "1 teaspoon brown sugar",
//                                     "1/4 cup water if needed",
//                                     "4 tablespoons Fresh cilantro or coriander to garnish",
//                              ],
//                              "category": "Indian", 
//                              "image": "tikka-masala.jpg"
//                         },
//                         { 
//                         "name": "Chicken Tortilla Soup",
//                         "description": `In a medium-size pot, add enough oil to coat the bottom of the pan and heat over medium-high; season your chicken thighs to taste with salt and any other seasonings of choice. Once the oil is hot, sear your chicken on both sides in batches for two to three minutes, until brown, and place it on a sheet to the side as you sear the rest. 

//                         Reduce the heat to medium and add bacon and cook that often stirring until crispy; then add onion, serrano, and garlic. Season lightly with salt, stir together, and let that sweat down until everything has softened about three minutes. 
                        
//                         Add cumin, coriander, paprika, cinnamon, stir and cook until toasted and fragrant, about 30 seconds; add guajillo chili, ancho chili, two corn cobs (optional), add chicken stock, scraping the bottom of the pan with a wooden spoon. Then add your chicken back, increase the heat to medium-high and as soon as it starts to boil, immediately reduce the heat to low and simmer for 15 minutes or until the chicken is cooked. Next, take the guajillo and ancho chilies out (they should be soft), place them in a blender, discard your corn cobs, remove your chicken, and set it to the side. 
                        
//                         Add one and a half cups of your broth in your blender and blend your chilies on high speed until smooth and bright orange. Pour that back in your simmering broth and stir together. Add crushed tomatoes, allow it to simmer, and reduce while you shred all your chicken with two forks until finely shredded. 
                        
//                         Let your broth reduce for five minutes, turn off the heat, add all of your chicken back, corn kernels (optionally reserve some extra for plating), and chopped cilantro. 
                        
//                         In a bowl, add your tortilla chips, top it with Oaxaca cheese and shredded cheddar. Pre-melt the cheese (optionally with a kitchen torch); then ladle in your hot soup generously, top that filler with more tortilla chips, fresh diced avocado, corn kernels (optional), and finally, fresh cilantro leaves. `,
//                         "email": "hello@maya.co.us",
//                         "ingredients": [
//                             "4 oz (113g) bacon, half-inch cubes",
//                             "1 lb (16oz) chicken thighs, boneless & skinless",
//                             "1 medium onion, finely diced",
//                             "5 cloves of garlic, finely chopped",
//                             "2 Serrano chilies, sliced",
//                             "2 teaspoons (2g) ground cumin",
//                             "1 teaspoon (1g) ground coriander",
//                             "1 teaspoon (1g) smoked paprika",
//                             "1/2 teaspoons (1g) ground cinnamon",
//                             "2 dried guajillo chilies, de-seeded",
//                             "1 dried ancho chili, de-seeded",
//                             "4 cups (960ml) chicken stock", 
//                             "2 ears of corn",
//                             "1/2 28 oz can crushed tomatoes",
//                             "salt to taste",
//                             "cilantro for garnish", 
//                             "2 avocados, diced", 
//                             "3 limes", 
//                             "1 piece Oaxaca cheese", 
//                             "1 cup shredded cheddar",
//                          ],
//                          "category": "Mexican", 
//                          "image": "tortilla-soup.jpg"
//                         },
//                         { 
//                             "name": "New Orleans Crawfish Pasta",
//                             "description": `Cook the pasta in a large pot of boiling salted water until al dente, about 8 minutes. Drain, reserving 1/4 cup of the cooking liquid. Return to the pot and toss with the olive oil and reserved cooking liquid. Cover to keep warm.
//                             In a large saute pan or skillet, melt the butter over medium-high heat. Add the onions and cook, stirring, until soft, about 5 minutes. Add the garlic, creole seasoning, salt, and cayenne, and cook, stirring, for 1 minute. Add the white wine and cook over high heat until nearly all evaporated. Add the cream lemon juice and cook, stirring occasionally, until slightly reduced. Add the crawfish tails and cook, stirring, to warm through. Add the onions and parsley and cook for 1 minute. Add the cooked pasta and toss to coat with the sauce. Cook until the pasta is warmed through, about 1 minute. Remove from the heat and add 1/2 cup of the cheese.
//                             Turn out into a serving bowl and top with the remaining 1/2 cup of cheese. Serve.`,
//                             "email": "hello@maya.co.us",
//                             "ingredients": [
//                                 "1 pound linguine or fettucine",
//                                 "2 tablespoons olive oil",
//                                 "6 tablespoons unsalted butter",
//                                 "1 cup chopped yellow onions",
//                                 "2 tablespoons minced garlic",
//                                 "2 teaspoons creole seasoning",
//                                 "1/2 teaspoon salt",
//                                 "1/4 teaspoon cayenne",
//                                 "1/4 cup dry white wine",
//                                 "2 cups heavy cream",
//                                 "1 tablespoon fresh lemon juice",
//                                 "1 pound crawfish tails",
//                                 "1/2 cup chopped green onions",
//                                 "1/2 cup chopped fresh parsley leaves",
//                                 "1 cup grated Parmesan",
//                              ],
//                              "category": "Seafood", 
//                              "image": "crawfish-pasta.jpg"
//                         },
//         ]);
//     } catch (error) {
//         console.log('err', + error)
//     }
// }

// insertDymyRecipeData