import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    description: {
        type: String,
        require: true
    }
});

const Recipe = new mongoose.model('Recipe', recipeSchema);

export default Recipe;
