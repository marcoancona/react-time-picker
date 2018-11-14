import React, { Component } from 'react';
import { render } from 'react-dom';
import TimePicker from 'react-time-picker';

import './Sample.less';

export default class Sample extends Component {
  state = {
    value: new Date(),
  }

  onChange = value => {
    console.log('NEW VALUE:', value);
    this.setState({ value })
	}

	componentDidMount() {
    setTimeout(() => {
      this.setState({value: new Date('2010-01-01T18:32:00')})
    }, 5000)
  }

  render() {
    const { value } = this.state;

    return (
      <div className="Sample">
        <header>
          <h1>react-time-picker sample page</h1>
        </header>
        <div className="Sample__container">
          <main className="Sample__container__content">
            <TimePicker
              onChange={this.onChange}
              value={value}
              minTime='12:15:00'
              maxTime='18:15:00'
            />
          </main>
        </div>
      </div>
    );
  }
}

render(<Sample />, document.getElementById('react-container'));
