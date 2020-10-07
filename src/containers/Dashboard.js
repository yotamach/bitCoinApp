import React, {Component} from "react";
import Etherium from "../assets/etherium.svg";
import Bitcoin from "../assets/bitcoin.svg";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import EtheriumBox from "../components/EtheriumBox";
import DaiBox from "../components/DaiBox";
import * as ApiHelper from "../lib/ApiHelper";
import * as B from "../lib/bInterface";
import {doApiAction, setUserInfo} from "../lib/Actions";
import EventBus from "../lib/EventBus";
import ModalContainer from "../components/ModalContainer";
import CurrencyExchangeBox from "../components/CurrencyExchangeBox";

let timeout;

export default class Dashboard extends Component {

    web3 = null;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userInfo : null,
            showConnect: false,
            loggedIn: false
        };

        EventBus.$on('run-action', this.runAction.bind(this));
    }

    onConnect = (web3, user) => {
        this.onHideConnect();
        this.web3 = web3;
        this.setState({user, loggedIn: true});
        this.getUserInfo();
    };

    getUserInfo = async () => {
        let userInfo = await B.getUserInfo(this.web3, this.state.user);
        const orgInfo = userInfo;
        userInfo = ApiHelper.Humanize(userInfo, this.web3);

        const ok = (this.web3.utils.toBN(userInfo.userWalletInfo.daiAllowance).toString(16) === "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
        setUserInfo(this.state.user, this.web3, userInfo, orgInfo);
        console.log(userInfo);
        this.setState({userInfo});
    };

    onAction = async (action, value, onHash) => {
        try {
            const res = await doApiAction(action, value, null, onHash);
            await this.getUserInfo();
            setTimeout(this.getUserInfo,15 * 1000);
            setTimeout(this.getUserInfo,30 * 1000);
            return res;
        } catch (error) {
            EventBus.$emit('action-failed', null, action);
            EventBus.$emit('app-error', null, action);
            console.log(error);
            return false;
        }
    };

    runAction = async(action, value, callback) => {
        if (!this.state.userInfo) return;
        try {
            const res = await action();
            this.getUserInfo();
            if (callback) callback(res);
            return res;
        } catch (error) {
            EventBus.$emit('action-failed', null, action);
            EventBus.$emit('app-error', null, action);
            console.log(error);
            return false;
        }
    };

    onShowConnect = () => {
        this.setState({showConnect : true});
        clearTimeout(timeout);
        timeout = setTimeout(this.onHideConnect,2000);
    };

    onHideConnect = () => {
        this.setState({showConnect: false});
    };

    render() {

        const {userInfo, loggedIn, showConnect} = this.state;

        return (
            <div className="App">
                <ModalContainer>

                </ModalContainer>
                <Sidebar userInfo={userInfo} />
                <div className="content">
                    <Header info={(loggedIn && userInfo !== null) && userInfo} onConnect={this.onConnect} showConnect={showConnect} />

                    <div className="container currency-container split">
                        <EtheriumBox userInfo={userInfo} onPanelAction={this.onAction} showConnect={this.onShowConnect} />
                        <DaiBox userInfo={userInfo} title={"DAI debt"} icon={Etherium} onPanelAction={this.onAction} showConnect={this.onShowConnect} />
                    </div>
                    <div className="container currency-container split">
                        <CurrencyExchangeBox icon={Bitcoin} title={"Currency exchange"} onPanelAction={this.onAction} />
                    </div>
                </div>
            </div>
        );
    }
}
