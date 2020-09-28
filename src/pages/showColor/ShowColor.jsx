import React from 'react';
import classes from "./ShowColor.css";

export class ShowColor extends React.Component {

    constructor(props) {
        super(props);

        const allColors = JSON.parse(localStorage.getItem('colors'));
        const myColor = allColors.find(col => col.hex.clean === props.match.params.hex);

        this.state = {
            // hex: props.match.params.hex,
            allColors: allColors,
            color: myColor,
        };

        this.onChangeCustomName = this.onChangeCustomName.bind(this);
    }

    onChangeCustomName = event => {
        const {value} = event.target;
        this.setState(
            {
                color: {
                    ...this.state.color,
                    customName: value
                }
            },
            () => {
                const colorsStr = localStorage.getItem('colors');
                const colors = JSON.parse(colorsStr);

                const nextColors = colors.map(currentColor => {
                    if (currentColor.hex.clean === this.state.color.hex.clean) {
                        return this.state.color;
                    }

                    return currentColor;
                });

                const nextColorsStr = JSON.stringify(nextColors);
                localStorage.setItem('colors', nextColorsStr);
            }
        );
    };

    render() {
        let {color} = this.state;

        return (
            <div className={classes.colorPage}>
                <div>
                    <p>Nom : {color.name.value}</p>
                    <p>(Nom perso : <input type={"text"} value={color.customName} placeholder={"Définir un nom custom"}
                                           onChange={this.onChangeCustomName}/>)</p>
                </div>
                <p>
                    {color.hex.value} {color.rgb.value}
                </p>
                <img style={{height: "200px", width: "300px"}} src={color.image.bare}/>
            </div>
        );
    }
}