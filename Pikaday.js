'use strict';

var objectAssign = require('object-assign');

var React = require('react');
var PropTypes = require('prop-types');

var Pikaday = require('pikaday');

var ReactPikaday = React.createClass({
	displayName: 'ReactPikaday',

	propTypes: {
		value: PropTypes.instanceOf(Date),
		onChange: PropTypes.func,
		initialOptions: PropTypes.object,

		valueLink: PropTypes.shape({
			value: PropTypes.instanceOf(Date),
			requestChange: PropTypes.func.isRequired
		})
	},

	getDefaultProps: function getDefaultProps() {
		return {
			initialOptions: {}
		};
	},

	getValueLink: function getValueLink(props) {
		return props.valueLink || {
			value: props.value,
			requestChange: props.onChange
		};
	},

	setDateIfChanged: function setDateIfChanged(newDate, prevDate) {
		var newTime = newDate ? newDate.getTime() : null;
		var prevTime = prevDate ? prevDate.getTime() : null;

		if (newTime !== prevTime) {
			if (newDate === null) {
				// Workaround for pikaday not clearing value when date set to falsey
				this.refs.pikaday.value = '';
			}
			this.picker.setDate(newDate, true); // 2nd param = don't call onSelect
		}
	},

	componentDidMount: function componentDidMount() {
		var el = this.refs.pikaday;

		this.picker = new Pikaday(objectAssign({
			field: el,
			onSelect: this.getValueLink(this.props).requestChange
		}, this.props.initialOptions));

		this.setDateIfChanged(this.getValueLink(this.props).value);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		var newDate = this.getValueLink(nextProps).value;
		var lastDate = this.getValueLink(this.props).value;

		this.setDateIfChanged(newDate, lastDate);
	},

	render: function render() {
		return React.createElement('input', { type: 'text', ref: 'pikaday', className: this.props.className, name: this.props.name,
			placeholder: this.props.placeholder, disabled: this.props.disabled, readOnly: this.props.readOnly, autoComplete: this.props.autoComplete });
	}
});

module.exports = ReactPikaday;
