import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

let page = 0;
let matches = books
let count = 1;

function selectAndOrAppend(selector, append){

    count++;
    console.log(`append ${append}`)
    if(append === null){
        return document.querySelector(selector)
    }else if(append === undefined){
        console.log(`error caused by ${count} of selectAndOrAppend`)
    }
    
    return document.querySelector(selector).appendChild(append)
}

function initializePage(){


    const theme = localStorage.getItem('theme');
    const starting = document.createDocumentFragment()
    
    for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
    
        starting.appendChild(element)
    }
    
    selectAndOrAppend('[data-list-items]', starting)

    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = 'All Genres'
    genreHtml.appendChild(firstGenreElement)
    
    for (const [id, name] of Object.entries(genres)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        genreHtml.appendChild(element)
    }
    
    selectAndOrAppend('[data-search-genres]', genreHtml)
    
    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = document.createElement('option')
    firstAuthorElement.value = 'any'
    firstAuthorElement.innerText = 'All Authors'
    authorsHtml.appendChild(firstAuthorElement)
    
    for (const [id, name] of Object.entries(authors)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        authorsHtml.appendChild(element)
    }
    
    selectAndOrAppend('[data-search-authors]', authorsHtml)
    
    selectAndOrAppend('[data-list-button]', null).innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
    selectAndOrAppend('[data-list-button]', null).disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0
    
    selectAndOrAppend('[data-list-button]', null).innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    if (theme === 'night') {
        document.querySelector('[data-settings-theme]').value = 'night';
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }

    addEventListeners();
}

function addEventListeners(){

    selectAndOrAppend('[data-search-cancel]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-search-overlay]', null).open = false
    })
    
    selectAndOrAppend('[data-settings-cancel]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-settings-overlay]', null).open = false
    })
    
    selectAndOrAppend('[data-header-search]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-search-overlay]', null).open = true 
        selectAndOrAppend('[data-search-title]', null).focus()
    })
    
    selectAndOrAppend('[data-header-settings]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-settings-overlay]', null).open = true 
    })
    
    selectAndOrAppend('[data-list-close]', null).addEventListener('click', () => {
        selectAndOrAppend('[data-list-active]', null).open = false
    })
    
    selectAndOrAppend('[data-settings-form]', null).addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const { theme } = Object.fromEntries(formData)
    
        localStorage.setItem('theme', theme);

        if (theme === 'night') {
            document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
            document.documentElement.style.setProperty('--color-light', '10, 10, 20');
        } else {
            document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
            document.documentElement.style.setProperty('--color-light', '255, 255, 255');
        }
        
        selectAndOrAppend('[data-settings-overlay]', null).open = false
    })
    
    selectAndOrAppend('[data-search-form]', null).addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const filters = Object.fromEntries(formData)
        const result = []
    
        for (const book of books) {
            let genreMatch = filters.genre === 'any'
    
            for (const singleGenre of book.genres) {
                if (genreMatch) break;
                if (singleGenre === filters.genre) { genreMatch = true }
            }
    
            if (
                (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
                (filters.author === 'any' || book.author === filters.author) && 
                genreMatch
            ) {
                result.push(book)
            }
        }
    
        page = 1;
        matches = result
    
        if (result.length < 1) {
            selectAndOrAppend('[data-list-message]', null).classList.add('list__message_show')
        } else {
            selectAndOrAppend('[data-list-message]', null).classList.remove('list__message_show')
        }
    
        selectAndOrAppend('[data-list-items]', null).innerHTML = ''
        const newItems = document.createDocumentFragment()
    
        for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)
        
            element.innerHTML = `
                <img
                    class="preview__image"
                    src="${image}"
                />
                
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `
    
            newItems.appendChild(element)
        }
    
        selectAndOrAppend('[data-list-items]', newItems)
        selectAndOrAppend('[data-list-button]', null).disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1
    
        selectAndOrAppend('[data-list-button]', null).innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
        `
    
        window.scrollTo({top: 0, behavior: 'smooth'});
        selectAndOrAppend('[data-search-overlay]', null).open = false
    })
    
    selectAndOrAppend('[data-list-button]', null).addEventListener('click', () => {
        const fragment = document.createDocumentFragment()
    
        for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
            const element = document.createElement('button')
            element.classList = 'preview'
            element.setAttribute('data-preview', id)
        
            element.innerHTML = `
                <img
                    class="preview__image"
                    src="${image}"
                />
                
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            `
    
            fragment.appendChild(element)
        }
    
        selectAndOrAppend('[data-list-items]', fragment)
        page += 1
    })
    
    selectAndOrAppend('[data-list-items]', null).addEventListener('click', (event) => {
        const pathArray = Array.from(event.path || event.composedPath())
        let active = null
    
        for (const node of pathArray) {
            if (active) break
    
            if (node?.dataset?.preview) {
                let result = null
        
                for (const singleBook of books) {
                    if (result) break;
                    if (singleBook.id === node?.dataset?.preview) result = singleBook
                } 
            
                active = result
            }
        }
        
        if (active) {
            selectAndOrAppend('[data-list-active]', null).open = true
            selectAndOrAppend('[data-list-blur]', null).src = active.image
            selectAndOrAppend('[data-list-image]', null).src = active.image
            selectAndOrAppend('[data-list-title]', null).innerText = active.title
            selectAndOrAppend('[data-list-subtitle]', null).innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
            selectAndOrAppend('[data-list-description]', null).innerText = active.description
        }
    })
}

initializePage()