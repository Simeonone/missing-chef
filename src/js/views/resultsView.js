import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _successMessage = '';
  _errorMessage =
    'Search results did not find any recipe. ☹ Please try another one';
  _parentElement = document.querySelector('.results');
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new ResultsView();
