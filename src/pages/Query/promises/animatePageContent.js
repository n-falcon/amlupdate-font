export default {
  grow: (resultsNum) => {
    const pageContent = document.getElementsByClassName('page-content')[0]
    const pageContentInner = document.getElementsByClassName('page-content-inner')[0]

    if (pageContent !== null && pageContentInner !== null) {
      pageContent.classList.remove('shrink')
      pageContent.classList.remove('grow-15')
      pageContent.classList.remove('grow-10')
      pageContent.classList.remove('grow-5')
      pageContentInner.classList.remove('fade-out')

      pageContent.className += ' grow-' + resultsNum
    }

    return new Promise(resolve => {
      resolve()
    }, 1000)
  },

  shrink: () => {
    const pageContent = document.getElementsByClassName('page-content')[0]
    const pageContentInner = document.getElementsByClassName('page-content-inner')[0]

    pageContent.className += ' shrink'
    pageContentInner.className += ' fade-out'

    return new Promise(resolve => {
      window.setTimeout(() => {
        if (pageContent !== null && pageContentInner !== null) {
          pageContent.classList.remove('shrink')
          pageContent.classList.remove('grow-15')
          pageContent.classList.remove('grow-10')
          pageContent.classList.remove('grow-5')
          pageContentInner.classList.remove('fade-out')          
        }

        resolve()
      }, 800)
    })
  }
}
