import React from 'react';
import PropTypes from 'prop-types';
import classes from "./Count.css";

export class Count extends React.Component {
    static propTypes = {
        count: PropTypes.number.isRequired,
        defaultStep: PropTypes.number.isRequired,
        onChange: PropTypes.func
    };

    static defaultProps = {
        count: 0,
        defaultStep: 1
    };

    constructor(props) {
        super(props);

        this.state = {
            step: props.defaultStep
        };

        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.onChangeStep = this.onChangeStep.bind(this);
    }

    componentDidUpdate() {
        if (this.props.count > 20) {
            setTimeout(() => {
                this.props.onChange(0)
            }, 4000);
        }
    }

    increment() {
        const {count, onChange} = this.props;
        const {step} = this.state;
        onChange(count + step);
    }

    decrement() {
        const {count, onChange} = this.props;
        const {step} = this.state;
        onChange(count - step);
    }

    onChangeStep(event) {
        const {value} = event.target;
        this.setState({
            step: value ? parseInt(value) : 0
        });
    }

    render() {
        const {count} = this.props;
        const {step} = this.state;

        const countLabel = count > 20 ? 'Stop !' : count;
        const countColor = count > 15 ? 'red' : null;

        if (count > 20) {
            return null;
        }

        return (
            <div className={classes.counter}>

                <div className={classes.buttons}>
                    <button className={classes.btn} onClick={this.decrement}>
                        -
                    </button>
                    <p style={{color: countColor}}>Count: {countLabel}</p>
                    <button className={classes.btn} onClick={this.increment}>
                        +
                    </button>
                </div>
                <div>
                    <label htmlFor="step">Step: <input className={classes.countInput} id="step" type="number" value={step} onChange={this.onChangeStep}/></label>
                </div>
            </div>
        );
    }
}