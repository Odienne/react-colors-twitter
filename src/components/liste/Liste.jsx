import React from 'react';
import PropTypes from "prop-types";

export class Liste extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {

        let renderListe = null;

        if (this.state.items) {
            renderListe = this.state.items.map((color) => {
                let style = {
                    color: "#fff",
                    backgroundColor: color.hex.value
                };
                return (
                    <div style={style} key={color.hex.value}>
                        {color.hex.value}
                    </div>
                );
            });
        }

        console.log(this.state.items);
        return <div> {renderListe} </div>;
    }
}