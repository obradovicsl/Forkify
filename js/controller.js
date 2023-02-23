
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipe = async function(){

  try{

    const id = window.location.hash.slice(1); 

    if(!id) return;    
    //Rendering spinner
    recipeView.renderSpinner();

    //Update results view to mark selected search result
    bookmarksView.update(model.state.bookmarks);
    resultsView.update(model.getSearchResultPage());
    
    //Loading recipe
    await model.loadRecipe(id);
    
    //Rendering recipe
    recipeView.render(model.state.recipe);
    console.log('ee');

    console.log(model.getSearchResultPage());
    
  }catch(err){
    resultsView.renderError();
    recipeView.renderError();
  }
};

const controlSearchResults = async function(){
  try{

    resultsView.renderSpinner();


    // 1) Get search 
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search result
    await model.loadSearchResults(query);


    // 3) Render result
    resultsView.render(model.getSearchResultPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  }catch(err){
    console.log(err);
  }
}

const controlPagination = function(goToPage){
  // 1) Render NEW result
  resultsView.render(model.getSearchResultPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
} 

const controlServings = function(newServing){
    model.updateServings(newServing);

    // recipeView.render(model.state.recipe);
    recipeView.update(model.state.recipe);

  }

const  controlAddBookmark = function(){
  if(!model.state.recipe.bookmarked){
    //Add bookmark
    model.addBookmark(model.state.recipe);
  }else{
    //Remove bookmark
    model.deleteBookmark(model.state.recipe.id);
  }

    //Update recipe view
    recipeView.update(model.state.recipe);

    //Render bookmarks
    bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe =async function(newRecipe){

  try{
  //Show loading spinner  
  addRecipeView.renderSpinner();

   await model.uploadRecipe(newRecipe);
   console.log(model.state.recipe);

   //Render recipe
   recipeView.render(model.state.recipe);

   //Update bookmarks
   bookmarksView.render(model.state.bookmarks);

   //Change ID in URL
   //History API on browser - .pushState() - can change URL without reloading the page
   window.history.pushState(null, '', `#${model.state.recipe.id}`); 

   //Succes message
    addRecipeView.renderMessage();

   //Close form window
   setTimeout(() => { 
      addRecipeView.toggleWindow()
   }, MODAL_CLOSE_SEC*1000);
  }catch(err){
    console.log(err);
    addRecipeView.renderError(err.message);
  }

}

const init = function(){
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(showRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

init();