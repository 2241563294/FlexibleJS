import React from 'react'
import { injectIntl } from 'react-intl'

import { FormControl } from 'react-bootstrap'

var Input = React.createClass({

  getDefaultValue: function() {
    switch (this.props.template.type) {
      case 'color':
        return '#000000'
      default:
        return ''
    }
  },

  getInitialState: function() {
    return {id: null, value: this.getDefaultValue(), pattern: null}
  },

  componentDidMount: function() {
    var self = this
    var input = $('input[name=' + this.props.template.id + ']')

    this.setState({id: this.props.template.id, value: this.props.value, pattern: this.props.template.pattern}, () => {
      if (this.props.handleValidationState) {
        this.getValidationState(function(validationState) {
          self.props.handleValidationState(validationState)
        })
      }
    })

    // Datepicker
    if (this.props.template.type === 'date' || this.props.template.type === 'datetime') {
      var format = (this.props.template.type === 'date') ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss'
      input.datetimepicker({
        format: format,
        viewMode: 'years',
        locale: moment.locale(),
        icons: {
          time: 'fa fa-clock-o',
          date: 'fa fa-calendar',
          up: 'fa fa-arrow-up',
          down: 'fa fa-arrow-down'
        }
      })
    }
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value, pattern: this.props.template.pattern})
  },

  componentDidUpdate(prevProps, nextProps) {
    var self = this
    if (prevProps.value !== nextProps.value) {
      if (this.props.handleValidationState) {
        this.getValidationState(function(validationState) {
          self.props.handleValidationState(validationState)
        })
      }
    }
  },

  getValidationState: function(callback) {
    var self = this
    var returnValue = null

    if (this.props.template.required && !this.state.value) {
      returnValue = {state: 'error', message: this.props.intl.formatMessage({id: 'validation.required'})}
      return callback(returnValue)
    }
    switch (this.props.template.type) {
      case 'email':
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!re.test(this.state.value)) {
          returnValue = {state: 'error', message: this.props.intl.formatMessage({id: 'validation.input.email'})}
          return callback(returnValue)
        }
        break
    }
    // If slug, make sure it is unique
    if (this.props.template.id === 'slug') {
      if (this.ajaxIsValidSlug) {
        this.ajaxIsValidSlug.abort()
      }
      this.ajaxIsValidSlug = $.getJSON('/api/pages/is-valid-slug', {site_id: this.props.site.id, slug: this.state.value})
        .done(function(page) {
          if (page && page._id !== self.props.component._id) {
            returnValue = {state: 'error', message: self.props.intl.formatMessage({id: 'validation.input.slug'})}
          } else {
            returnValue = {state: 'success'}
          }
          return callback(returnValue)
        })
    } else {
      returnValue = {state: 'success'}
      return callback(returnValue)
    }
  },

  handleChange: function(event) {
    if (this.state.pattern) {
      var re = new RegExp(this.state.pattern)
      if (!re.test(event.target.value)) {
        return false
      }
    }
    this.setState({value: event.target.value}, function() {
      this.props.handleChange(this.state)
    })
  },

  render() {
    var attrs = {}
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'title', 'help', 'header'].includes(prop)) {
        if (prop === 'type' && (this.props.template[prop] === 'date' || this.props.template[prop] === 'datetime')) {
          attrs[prop] = 'text'
        } else {
          attrs[prop] = this.props.template[prop]
        }
      }
    }

    return (
      <FormControl
        {...attrs}
        name={this.props.template.id}
        value={(this.state.value) ? this.state.value : this.getDefaultValue()}
        placeholder={this.props.template.placeholder}
        onChange={this.handleChange}
      />
    )
  }

})

module.exports = injectIntl(Input)
