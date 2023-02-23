import icons from 'url:../../img/icons.svg';

export default class View{

    _data;
    
    render(data){
        if(!data || (Array.isArray(data) && data.length===0)) return this.renderError();
        this._data = data;

        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
    
    update(data){
        this._data = data;
       
        const newMarkup = this._generateMarkup();
       

        //Od html mark-upa kreira DOM element koji se nalazi u memoriji
        const newDOM = document.createRange().createContextualFragment(newMarkup);
        //Imamo niz sa svim elementima na DOM-u - newEl - novi DOM, curEl - trenutniDOM
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        console.log(newElements, curElements);

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            //.isEqualNode() - proverava da li su dva node-a jednaki
            //.firstChild - tekst se nalazi na first child
            //.nodeValue - vraca text ukoliko je node tekstualnog tipa, i vraca undefined ukoliko je nesto drugo
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
            }

            //U primeru gore menjamo samo tekst - dok na primer u data propertiju na dugmicima za + - se nalaze takodje znacajni podaci. Moramo i attribute koji su se promenili, takodje da azuriramo

            //Kod onih koji se razlikuju - curEl za attr.name dobija atr.value od novog el
            if(!newEl.isEqualNode(curEl)){
                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value);
                })
            }
        });

    }

    _clear(){
        this._parentElement.innerHTML = '';
    }


    renderSpinner = function(){
        const markup = `
              <div class="spinner">
                  <svg>
                    <use href="${icons}#icon-loader"></use>
                  </svg>
                </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderError(message = this._errorMessage){
        const markup = `
                <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message){
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

}