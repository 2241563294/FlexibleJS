import React from 'react'

import ReactSummernote from 'react-summernote';

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: this.props.template.id, value: this.props.value};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: this.props.value});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  handleChange: function(value) {
    this.setState({value: value}, function() {
      this.props.handleChange(this.state);
    });
  },

  render() {

    var attrs = {};
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'title', 'help', 'header'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    return (
      <ReactSummernote
        componentClass="textarea"
        {...attrs}
        name={this.props.template.id}
        value={(this.state.value) ? this.state.value : ''}
        placeholder={this.props.template.placeholder}
        onChange={this.handleChange}
        options={{
          lang: 'fr-FR',
          height: 350,
          dialogsInBody: true,
          toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview']]
          ]
        }}
        />
    );

  }

})
