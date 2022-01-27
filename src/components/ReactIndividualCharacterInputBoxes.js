import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fillPolyfill from './fillPolyfill'
import InputBox from './InputBox'
import _ from 'lodash'

class ReactIndividualCharacterInputBoxes extends Component {
  constructor (props) {
    super(props)
    // this.state = { 
    //     characterArray: Array(props.amount).fill(null) ,
    //     colourArray: Array(props.amount).fill('black')
    // }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount () {
    if (this.props.autoFocus) {
      this.props.values.inputElements['input0'].select()
    }
  }

  shouldComponentUpdate (nextProps) {
    if (!nextProps.values) {
      return true;
    }
    if (
      !_.isEqual(this.props.values.colourArray, nextProps.values.colourArray) ||
      this.props.amount !== nextProps.amount ||
      this.props.inputRegExp !== nextProps.inputRegExp
    ) {
      return true
    }
    return false
  }

  renderItems () {
    let items = []
    if (!this.props.values) {
      return items;
    }
    for (let i = 0; i < this.props.amount; i++) {
      items.push(
        <InputBox
          type={this.props.password ? 'password' : 'text'}
          key={`row${this.props.index}inputbox${i}`}
          handleKeyDown={this.handleKeyDown}
          handleFocus={this.handleFocus}
          handleChange={this.handleChange}
          handleClick={(e) => this.handleClick(e, i)}
          colour={this.props.values.colourArray[i]}
          name={'input' + i}
          index={i}
          inputProps={this.props.inputProps && this.props.inputProps[i]}
          inputRef={el => {
            if (!el) return
            this.props.values.inputElements[el.name] = el
          }}
        />
      )
    }

    return items
  }

  render () {
    return (
      <div>
        <div>{this.renderItems()}</div>
      </div>
    )
  }

  handleClick (e, index) {
      let newColourArray = [...this.props.values.colourArray];
      const { colourArray } = this.props.values;
      if (colourArray[index] === 'black') {
         newColourArray[index] = 'yellow';
      } else if (colourArray[index] === 'yellow') {
          newColourArray[index] = 'green';
      } else {
          newColourArray[index] = 'black';
      }
      this.props.setColours(newColourArray);
  }

  handleChange ({ target }) {
    if (target.value.match(this.props.inputRegExp)) {
      this.focusNextChar(target)
      this.props.setModuleOutput(target)
    } else {
      target.value = this.props.values.characterArray[target.name.replace('input', '')]
    }
  }

  handleKeyDown ({ target, key }) {
    if (key === 'Backspace') {
      if (target.value === '' && target.previousElementSibling !== null) {
        target.previousElementSibling.value = ''
        this.focusPrevChar(target)
      } else {
        target.value = ''
      }
      this.props.setModuleOutput(target)
    } else if (key === 'ArrowLeft') {
      this.focusPrevChar(target)
    } else if (key === 'ArrowRight' || key === ' ') {
      this.focusNextChar(target)
    }
  }

  handleFocus ({ target }) {
    var el = target
    // In most browsers .select() does not work without the added timeout.
      el.select()
  }

  focusPrevChar (target) {
    if (target.previousElementSibling !== null) {
      target.previousElementSibling.focus()
    }
  }

  focusNextChar (target) {
    if (target.nextElementSibling !== null) {
      target.nextElementSibling.focus()
    }
  }

//   setModuleOutput () {
//     this.setState(prevState => {
//       let updatedCharacters = prevState.characterArray.map((character, number) => {
//         return this.inputElements['input' + number].value
//       })
//       return {characterArray: updatedCharacters}
//     }, () => this.props.handleOutputString(this.state.characterArray.join('')))
//   }
}

ReactIndividualCharacterInputBoxes.defaultProps = {
  amount: 5,
  autoFocus: false,
  inputRegExp: /^[0-9]$/,
  password: false
}
ReactIndividualCharacterInputBoxes.propTypes = {
  amount: PropTypes.number,
  autoFocus: PropTypes.bool,
  inputRegExp: PropTypes.instanceOf(RegExp),
  password: PropTypes.bool,
  handleOutputString: PropTypes.func.isRequired
}

export default ReactIndividualCharacterInputBoxes