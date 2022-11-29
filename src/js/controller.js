import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
//below - polyfills async await while the one above polyfills everything else
import 'regenerator-runtime/runtime';
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log(id, typeof id);
    if (!id) return;
    recipeView.renderSpinner();

    //0) update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    //1)updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // resultsView.render(model.getSearchResultsPage());
    // 2) Loading recipe
    await model.loadRecipe(id);
    // const { recipe } = model.state;
    // 3)rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
// controlRecipes();
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1) get search query
    const query = SearchView.getQuery();
    if (!query) return;

    //2) load search results
    await model.loadSearchResults(query);
    //3)render results
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    //above- defaults to 1

    //4)render the initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

controlPagination = function (gotoPage) {
  //this will work because render overrites the markup that was there previously because of the this.clear() in View.js

  //1)render new results - copied from above
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //2)render new pagination buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddbookmark = function () {
  // 1) add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //2) update recipeview
  recipeView.update(model.state.recipe);

  //3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //show loading spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //successmessage
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('😥', err);
    addRecipeView.renderError(err.message);
  }
};

function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddbookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
  // controlServings();
}
init();
