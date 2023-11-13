import Recipe from '../models/recipeModels.js';
const recipeControllers = {
    getRecipes: async (req, res) => {
        try {
            const recipes = await Recipe.find(); //return array
            console.log(`Proverka`);
            if (recipes.length > 0) {
                res.status(200).json({
                    recipes: recipes, // its array of recipes obj
                    message: `All recipes`
                });
            } else {
                res.status(404).json({ message: `Cant find recipes` });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    getRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findOne({ _id: id });
            if (recipe) {
                return res.status(200).json({ recipe: recipe });
            } else {
                return res.status(404).json({ message: `Recipe not found` });
            }
        } catch (err) {
            res.status(500).json({
                message: `Error while trying to get one recipe by ID`
            });
        }
    },
    updateRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            if (!name || !description) {
                res.status(409).json({ message: `Please add required data` });
            } else {
                const result = await Recipe.updateOne(
                    { _id: id },
                    { name: name, description: description }
                );
                console.log(result); //
                if (result.modifiedCount > 0) {
                    return res.status(200).json({ message: `Recipe updated` });
                } else {
                    res.status(404).json({ message: `Nothing to update` });
                }
            }
        } catch (err) {
            res.status(500).json({ message: `Error while trying to update` });
        }
    },
    addRecipe: async (req, res) => {
        try {
            const { name, description } = req.body;
            if (!name || !description) {
                return res
                    .status(404)
                    .json({ message: `Please fullfil all fields` });
            } else {
                const result = await Recipe.create({
                    name: name,
                    description: description
                });
                if (result) {
                    return res
                        .status(201)
                        .json({ message: `Recipe added`, recipe: result });
                }
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    },
    deleteRecipe: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await Recipe.deleteOne({ _id: id });
            console.log(result);

            if (result.deletedCount > 0) {
                return res.status(200).json({ message: `Recipe deleted` });
            } else {
                return res.status(404).json({ message: `Nothing to delete` });
            }
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

export default recipeControllers;
