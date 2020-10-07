import React, { Component } from 'react'
import {convertFronBTCtoUSD} from "../lib/Utils";

export default class CurrencyExchangeBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bitcoinAmount: 0,
            USDAmount: 0
        }
    }

    updateRate = () => {
        const {bitcoinAmount} = this.state;
        convertFronBTCtoUSD()
        .then(response => response.json())
        .then((jsonData) => {
            console.log(jsonData.bpi.USD.rate_float);
            console.log(bitcoinAmount);
            this.setState({
                USDAmount:  jsonData.bpi.USD.rate_float * bitcoinAmount
            });
        })
        .catch((error) => {
            throw new Error('there is an error!');
        });
    }

    handleBTCAmountChange = (e) => {
        this.setState({
            bitcoinAmount: e.target.value
        });
    }

    render() {
        const {USDAmount} = this.state;
        const {icon, title} = this.props;
        return (
            <div className="currency-exchange-box-container">
                <div className="currency-exchange-box">
                    <div className="currency-exchange-meta">
                        <div className="currency-exchange-icon"><img src={icon} /></div>
                        <div className="currency-exchange-title">{title}</div>
                    </div>
                    <div className="currency-exchange-inputs-section">
                        <div className="currency-exchange-input">
                            <input type="number" min="0"  placeholder="please insert BTC amount" onKeyUp={this.handleBTCAmountChange}  /><p>BTC</p>
                        </div>
                        <div className="currency-exchange-value">
                        <p>{USDAmount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p><p>USD</p>
                        </div>
                    </div>
                    <div className="currency-exchange-actions">
                        <button className="currency-action-button" onClick={() => this.updateRate()}>Convert</button>
                    </div>
                </div>
            </div>
        )
    }
}
