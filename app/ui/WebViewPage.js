/**
 * Created by hisign on 2017/5/24.
 */
import React, {Component} from "react";
import {View, WebView} from "react-native";
import NavigationBar from "../common/NavigationBar";
import BaseCommon from "../common/BaseCommon";
import GlobalStyles from "../res/styles/GlobalStyles";
import ViewUtils from "../util/ViewUtils";
const WEBVIEW_REF = 'webview';


export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        this.state = {
            canGoBack: false,
        }
    }
    componentDidMount(){
        this.baseCommon.componentDidMount();
    }
    componentWillUnmount(){
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        if (this.state.canGoBack) {
            this.refs[WEBVIEW_REF].goBack();
        } else {
            this.props.navigator.pop();
            return true;
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    render() {
        return (
            <View style={GlobalStyles.listView_container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={this.props.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                    title={this.props.title}
                />
                <WebView
                    ref={WEBVIEW_REF}
                    startInLoadingState={true}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                    onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
                    source={{uri: this.props.url}}/>
            </View>

        );
    }
}
