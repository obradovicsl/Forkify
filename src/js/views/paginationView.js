import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler){
        this._parentElement.addEventListener('click', function(e){
            const btn = e.target.closest('.btn--inline');
            if(!btn) return;
            const page = +btn.dataset.goto;
            
            handler(page);
        });
    }

    _generateMarkup(){
        const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        const curPage = this._data.page;

        console.log(numPage);
        //Page 1 and other pages
        if(curPage === 1 &&  numPage > 1)
            return `${this.generateMarkupButton(curPage+1, 'next')}`;

         //Last page
         if(curPage === numPage && numPage>1)
            return `${this.generateMarkupButton(curPage-1)}`;
            
        //Other page
        if(curPage < numPage)
        return `
            ${this.generateMarkupButton(curPage+1, 'next')}

            ${this.generateMarkupButton(curPage-1)}
        `;

        //Page 1 and NO other pages
        return ``;
    }

    generateMarkupButton(page, direction = 'prev'){
        if(direction === 'prev'){
            return `
                <button data-goto="${page}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${page}</span>
                </button>
            `;
        }else if(direction === 'next'){
            return `
                <button data-goto="${page}" class="btn--inline pagination__btn--next">
                    <span>Page ${page}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
    }
}



export default new PaginationView();