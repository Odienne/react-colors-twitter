import React from 'react';
import {CirclePicker} from 'react-color';
import {Link} from "react-router-dom";
import {getPrimaryColor} from 'src/pages/twitter/getColor.js';
import {getSecondaryColor} from 'src/pages/twitter/getColor.js';
import classes from "./Colors.css";


import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'

library.add(faTrashAlt)

export class Colors extends React.Component {

    constructor(props) {
        super(props);

        const colorsList = localStorage.getItem('colors') ? JSON.parse(localStorage.getItem('colors')) : [];
        this.state = {
            color: '45e',
            colorsList,
            filteredList: null,
            searchValue: null,
            primaryColor: getPrimaryColor(),
            secondaryColor: getSecondaryColor()

        };

        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.addColor = this.addColor.bind(this);
        this.onChangeSearch = this.onChangeSearch.bind(this);
    }

    handleChangeColor = (color) => {
        this.setState({color: color.hex.replace('#', '')});
    };

    onChangeSearch(event) {
        this.setState(
            {
                searchValue: event.currentTarget.value
            }
        );

    }

    addColor() {
        let {color, colorsList} = this.state;

        let present = colorsList.find(elem => elem.hex.clean === color.toUpperCase());

        if (present) {
            alert("Cette couleur a déjà été ajoutée !");
            return;
        }

        fetch('http://www.thecolorapi.com/id?hex=' + color)
            .then(res => res.json())
            .then(data => {
                data.primary = false;
                data.secondary = false;
                colorsList = [data, ...colorsList];
                this.setState(
                    {
                        colorsList: colorsList
                    },
                    () => {
                        localStorage.setItem('colors', JSON.stringify(colorsList));
                    });
            })
    }

    setPrimaryColor = (color) => {
        let {colorsList} = this.state;

        colorsList = colorsList.map(elem =>
            ({
                ...elem,
                primary: elem.hex.value === color.hex.value
            })
        );

        this.setState(
            {
                colorsList,
                primaryColor: color.hex.value
            },
            () => {
                localStorage.setItem('colors', JSON.stringify(colorsList));
            }
        );
    };

    setSecondaryColor = (color) => {
        let {colorsList} = this.state;

        colorsList = colorsList.map(elem => ({
            ...elem,
            secondary: elem.hex.value === color.hex.value
        }));

        this.setState(
            {
                colorsList,
                secondaryColor: color.hex.value
            },
            () => {
                localStorage.setItem('colors', JSON.stringify(colorsList));
            }
        );
    };

    removeColor(codeHex) {
        const {colorsList} = this.state;

        let result = colorsList.filter(color => color.hex.value !== codeHex);

        this.setState(
            {
                colorsList: result
            },
            () => {
                localStorage.setItem('colors', JSON.stringify(result));
            }
        );
    }

    filterColorList = (color) => {
        const {searchValue} = this.state;

        if (!searchValue) {
            return color;
        }

        const colorName = color.name.value.toLowerCase();
        const customColorName = color.customName ? color.customName : '';

        return (colorName.indexOf(searchValue.toLowerCase()) !== -1 || customColorName.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1);
    }

    render() {
        const {colorsList, color, primaryColor, secondaryColor} = this.state;
        let liste = null;
        console.log(colorsList);
        if (colorsList) {
            liste = colorsList.filter(this.filterColorList).map((color) => {
                let style = {
                    color: color.hex.value,
                    // backgroundColor: color.hex.value
                };
                return (
                    <div key={color.hex.value}>
                        <div className={classes.colorItem}>
                            <Link to={`/Showcolor/${color.hex.clean}`} style={style} >
                                <div className={classes.colorView}>
                                    <p>{color.hex.value}</p>
                                    <p style={{marginRight: "20px"}}>
                                        <img style={{height: "20px", width: "30px"}} src={color.image.bare}/>
                                    </p>
                                </div>
                                <div className={classes.colorInfos}>
                                    <p>Nom : {color.name.value}</p>
                                    <p>Custom Name : {color.customName}</p>
                                </div>
                            </Link>

                            <span className={classes.roundButton} onClick={() => this.removeColor(color.hex.value)}
                                  style={{top: "-12.5px"}}>
                                    <FontAwesomeIcon icon="trash-alt"/>
                                </span>

                            <span className={classes.roundButton} onClick={() => this.setPrimaryColor(color)}
                                  style={{top: "50%"}}>
                                    <p>1</p>
                                </span>

                            <span className={classes.roundButton} onClick={() => this.setSecondaryColor(color)}
                                  style={{bottom: "-12.5px"}}>
                                    <p>2</p>
                                </span>

                        </div>

                    </div>
                );
            });
        }

        return (
            <div className={classes.page}>
                <div className={classes.leftSide}>
                    <div className={classes.colorPicker}>
                        <CirclePicker color={`#${color}`} onChange={this.handleChangeColor}/>
                    </div>
                    <div>
                        <input type="submit" value="Ajouter" style={{backgroundColor: `#${color}`}}
                               className={classes.inputAddColor} onClick={this.addColor}/>
                    </div>
                    <div className={classes.mainColors}>
                        {colorsList && (
                            <div>
                                <h4>Couleur principale : <span style={{color: primaryColor}}>{primaryColor}</span></h4>

                                <h4>Couleur secondaire : <span style={{color: secondaryColor}}>{secondaryColor}</span></h4>
                            </div>
                        )
                        }
                    </div>
                </div>

                <div className={classes.rightSide}>
                    <div className={classes.searchBox}>
                        <input type={"text"} onChange={this.onChangeSearch} placeholder="Filtrer les couleurs"/>
                        <p>{liste.length} couleur(s)</p>
                    </div>
                    <div className={classes.colorList}>
                        {liste}
                    </div>
                </div>
            </div>
        );
    }
}