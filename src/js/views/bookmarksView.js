import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class BookmarksView extends View {
  _successMessage = '';
  _errorMessage = 'No bookmarks found ☹ Search for a recipe and bookmark it';
  _parentElement = document.querySelector('.bookmarks__list');
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
