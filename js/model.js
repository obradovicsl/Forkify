import {async} from 'regenerator-runtime';
import {API_URL} from './config.js';
import {getJSON, sendJSON} from './helpers.js';
import { RES_PER_PAGE } from './config.js';
import {KEY} from './config.js';

export const state = {
    recipe: {},
    search: {
        query: {},
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: []
};

const createRecipeObject = function(data){
    const  {recipe} = data.data;
        
    //Azuriramo state objekat - koji je exportovan i dostupan controleru
        return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        //Ovo je isto kao da smo napisali
        //key:recipe.key - samo sto ukoliko recipe.key nepostoji, nece biti vraceno nista, jer && vraca prvu falsy value(ako je ima, ako ne, onda vraca poslednje)
        ...(recipe.key && {key: recipe.key}),
        };
}

export const loadRecipe = async  function(id){

    try{
        const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
        
    //Azuriramo state objekat - koji je exportovan i dostupan controleru
        state.recipe = createRecipeObject(data);
        console.log(state.recipe);

        if(state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
            state.recipe.bookmarked = true;
        else 
            state.recipe.bookmarked = false;

    }catch(err){
        throw err;
    }
}

export const loadSearchResults = async function(query){
    try{
        state.search.query = query;

        const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

        state.search.results =  data.data.recipes.map(res => {
            return {
                id: res.id,
                title: res.title,
                publisher: res.publisher,
                image: res.image_url,
                ...(res.key && {key: res.key}),
            }
        });
        state.search.page = 1;
    }catch(err){
        throw err;
    }
}

export const getSearchResultPage = function(page = state.search.page){
    state.search.page=page;

    const start = (page-1)*state.search.resultsPerPage;
    const end = page*state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function(newServing){
    state.recipe.ingredients.forEach(ing =>{
        ing.quantity *= newServing / state.recipe.servings;
    });

    state.recipe.servings = newServing;
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe){
    //Add bookmark
    state.bookmarks.push(recipe);

    //Mark current recipe as bookmarked
    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function(id){
    //Delete bookmark from bookmarks array
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //Mark current recipe as not bookmarked
    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

const init = function(){
    const storage = localStorage.getItem('bookmarks');
    if(storage) state.bookmarks = JSON.parse(storage);
}
const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}

// clearBookmarks();
init();

export const uploadRecipe = async function(newRecipe){

    try{
    //Array of ingredients
    //Od objekta pravimo niz, zatim filtriramo samo one kojima je prvi el 'ingridient' a drugi el nije prazan, zatim vracamo svaki od tih elemenata kao objekat
        const ingredients = Object.entries(newRecipe).filter(entry => 
            entry[0].startsWith('ingredient') && entry[1] != '')
            .map(ing => {
                const ingArr = ing[1].replaceAll(' ', '').split(',');
                if(ingArr.length !== 3){
                    throw new Error('Wrong ingredient format!');
                }

                const [quantity, unit, description] = ingArr;
                return {quantity: quantity? +quantity:null, unit, description};
                });


            const recipe = {
                title: newRecipe.title,
                source_url: newRecipe.sourceUrl,
                image_url : newRecipe.image,
                publisher : newRecipe.publisher,
                cooking_time: +newRecipe.cookingTime,
                servings:  +newRecipe.servings,
                ingredients,
            };

            const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);

            state.recipe = createRecipeObject(data);
            addBookmark(state.recipe);
        }catch(err){
            throw err;
         }
}