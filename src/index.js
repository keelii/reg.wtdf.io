// import codemirror from 'codemirror'
// import { doSearch, clearSearch, findNext } from './search.js'

// import { initSearch } from './search.js'

import Mark from '../node_modules/mark.js/dist/mark.es6.js'

// require('../node_modules/codemirror/lib/codemirror.css')
// require('../node_modules/codemirror/addon/dialog/dialog.js')
// require('../node_modules/codemirror/addon/search/searchcursor.js')
// require('../node_modules/codemirror/addon/search/search.js')
// require('../node_modules/codemirror/addon/search/jump-to-line.js')

// require('../node_modules/codemirror/mode/xml/xml.js')
// require('../node_modules/codemirror/mode/javascript/javascript.js')
// require('../node_modules/codemirror/addon/display/placeholder.js')


window.addEventListener('DOMContentLoaded', () => {
    let timer = null
    let content = document.querySelector('#content')
    let text = content.innerText
    let input = document.querySelector('#query')
    let inputs = document.querySelectorAll('.form input')
    let getFlags = function() {
        let flags = []
        inputs.forEach(inp => {
            if (inp.checked) flags.push(inp.name)
        })
        return flags.join('')
    }

    window.mi = new Mark(document.querySelector('#content'))

    input.addEventListener('input', performMark)
    content.addEventListener('keyup', () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            performMark()
            localStorage.setItem('content', content.innerText)
        }, 10)
    })
    inputs.forEach(input => 
        input.addEventListener('change', performMark))


    let cache = localStorage.getItem('content')
    if (cache) content.innerText = cache

    function performMark() {
        let keyword = input.value
        if (keyword === '\\') return false

        mi.unmark({
            done: function () {
                try {
                    const flags = getFlags()
                    const re = new RegExp(keyword, flags)
                    console.log(re)
                    mi.markRegExp(new RegExp(keyword, flags), {
                    })
                } catch (error) {
                    console.info(error.message)
                }
            }
        })
    }
})
