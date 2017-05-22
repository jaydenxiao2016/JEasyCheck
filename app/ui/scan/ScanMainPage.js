/**
 * Created by hisign on 2017/5/19.
 * 扫码主界面
 */
import React, {Component} from "react";
import {Image, StyleSheet, View} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import BaseCommon from "../../common/BaseCommon";
import GlobalStyles from "../../res/styles/GlobalStyles";
import ViewUtils from "../../util/ViewUtils";

export default class ScanMainPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.state = {
            canGoBack: false,
            title: this.props.title,
        }
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    render() {
        return (
            <View style={GlobalStyles.listView_container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={this.props.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                    title={this.state.title}
                />
            </View>
        );
    }

}
const styles = StyleSheet.create({

})