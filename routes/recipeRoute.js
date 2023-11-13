import express from 'express';

const router = express.Router();

import recipeControllers from '../controllers/recipeControllers.js';
import verifyToken from '../middleware/verifyToken.js';

router.get('/', verifyToken, recipeControllers.getRecipes);
router.get('/:id', verifyToken, recipeControllers.getRecipe);
router.post('/add-recipe', verifyToken, recipeControllers.addRecipe);
router.put('/:id', verifyToken, recipeControllers.updateRecipe);
router.delete('/:id', verifyToken, recipeControllers.deleteRecipe);

export default router;
