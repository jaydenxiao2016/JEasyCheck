/**
 * 欢迎页
 * @flow
 * **/
import React, {Component} from "react";
import {Image, StyleSheet, View} from "react-native";
import HistorySearchDao from "../dao/HistorySearchDao";
import HomePage from "./main/HomePage";
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
export default class WelcomePage extends Component {

    componentDidMount() {
        const {navigator} = this.props
        //获取主题颜色
        this.theme = new HistorySearchDao().loadThemeDataFromLocal().then((theme) => {
            this.theme = theme;
            console.log(theme)
        });
            this.timeOut = setTimeout(() => {
                navigator.resetTo({
                    component: HomePage,
                    name: 'HomePage',
                    params: {
                        theme: this.theme
                    }
                });
            }, 2000)
    }
componentWillUnmount(){
        clearTimeout(this.timeOut);
    }
	
    render() {
        return (
            <View style={styles.container}>
                <Image style={{width: width, height: height} } resizeMode={'contain'}
                       source={require('../res/images/ic_welcome_screen.png')}/>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})