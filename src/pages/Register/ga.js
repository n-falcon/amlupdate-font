import ReactGA from 'react-ga'

ReactGA.initialize('UA-156566165-1')

export default {
  saveCurrentPage: () => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  },

  saveRiskChanges: (filterName, filterOption, filterValue) => {
    if (filterName === 'amlStatus') {
      if (filterOption === 'BLACK' && filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Enable - Critical ( Black )',
          label: 'Switch'
        })
      }

      if (filterOption === 'BLACK' && !filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Disable - Critical ( Black )',
          label: 'Switch'
        })
      }

      if (filterOption === 'RED' && filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Enable - High ( Red )',
          label: 'Switch'
        })
      }

      if (filterOption === 'RED' && !filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Disable - High ( Red )',
          label: 'Switch'
        })
      }

      if (filterOption === 'YELLOW' && filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Enable - Medium ( Yellow )',
          label: 'Switch'
        })
      }

      if (filterOption === 'YELLOW' && !filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Disable - Medium ( Yellow )',
          label: 'Switch'
        })
      }

      if (filterOption === 'GREEN' && filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Enable - Low ( Green )',
          label: 'Switch'
        })
      }

      if (filterOption === 'GREEN' && !filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Disable - Low ( Green )',
          label: 'Switch'
        })
      }

      if (filterOption === 'NA' && filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Enable - Not Processed ( Grey )',
          label: 'Switch'
        })
      }

      if (filterOption === 'NA' && !filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Risk Filters Item Disable - Not Processed ( Grey )',
          label: 'Switch'
        })
      }
    }
  },

  saveLeftFiltersChanges: (filterName, filterOption, filterValue) => {
    if (filterName === 'grupos') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Groups Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Groups Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'types') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Types Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Types Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'estados') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Status Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Status Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'estadoMalla') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Request Status Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Request Status Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'estadoFormulario') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Form Status Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Form Status Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'estadoPlazo') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Time Limit Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Time Limit Filters Item Disable',
          label: 'Switch'
        })
      }
    }

    if (filterName === 'estadoVerif') {
      if (filterValue) {
        ReactGA.event({
          category: 'Register',
          action: 'Verification Filters Item Enable',
          label: 'Switch'
        })
      } else {
        ReactGA.event({
          category: 'Register',
          action: 'Verification Filters Item Disable',
          label: 'Switch'
        })
      }
    }
  }
}
