import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      //   console.log(gotoPage);
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const prevBtn = `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
    </button>`;
    const nextBtn = `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${currentPage + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`;
    console.log(`number of pages: ${numPages}`);
    console.log(`current page: ${currentPage}`);
    //page 1, and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `${nextBtn}`;
    }
    //last page
    if (currentPage === numPages && numPages > 1) {
      return `${prevBtn}`;
    }
    //some other middle page
    if (currentPage < numPages) {
      return `${prevBtn}
      ${nextBtn}
      `;
    }
    //page 1 and there are no other pages
    return ``;
  }
}
export default new PaginationView();
