import React from 'react';
import PropTypes from 'prop-types';

export class OldCount extends React.Component {

    static propTypes = {
        count: PropTypes.number.isRequired,
        step: PropTypes.number,
        onChange: PropTypes.func
    };

    static defaultProps =
        {
            firstName: "Adam",
            lastName: "Odienne"
        };

    constructor(props) {
        super(props);

        this.state = {
            count: props.count,
            step: props.step
        };

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.onChangeStep = this.onChangeStep.bind(this);
    }

    increment() {
        const {count, step} = this.state;
        this.setState({
            count: (count + step > 20) ? 20 : count + step
        });
    }

    decrement() {
        const {count, step} = this.state;
        this.setState({
            count: (count - step < 0) ? 0 : count - step

        });
    }

    onChangeStep(event) {
        this.setState({
            step: event.target.value ? parseInt(event.target.value) : 1
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.count >= 20) {
            setTimeout(() => {
                this.setState(
                    {
                        count: this.props.count
                    }
                );
            }, 5000)
        }

        if (prevState.count !== this.state.count) {
            this.props.onChange(this.state.count);
        }
    }

    render() {
        const {count, step} = this.state;
        const {firstName, lastName} = this.props;

        const countValue = count > 20 ? 'Stop !' : count;
        const style = count > 15 ? {color: "red"} : null;

        if (count >= 20) {
            return null
        }

        return (
            <div>
                <div>
                    <p>Hello {firstName}, {lastName}</p>
                </div>

                <div>Step : <input type="number" className="step" value={step} onChange={this.onChangeStep} step="1"
                                   min="1" max="20"/>
                </div>

                <div style={style}>Count : {countValue}</div>
                <div className="buttons">
                    {count < 20 &&
                    <button onClick={this.increment}>+</button>
                    }
                    {count > 0 &&
                    <button onClick={this.decrement}>-</button>
                    }
                </div>
            </div>
        );

    }
}