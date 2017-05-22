/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * hisign
 */

import React from "react";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import GlobalStyles from "../../res/styles/GlobalStyles";
// 引入外部的json数据
var AdData = require('../../../LocalData/AdData.json');

var JAdView = React.createClass({
    getInitialState(){
        return {
            activePage: 0,
            timer: 3000,
        }
    },
    render(){
        return (
            <View style={styles.container}>
                <ScrollView
                    ref='scrollView'
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onMomentumScrollEnd={this._onScrollAnimationEnd}
                    onScrollEndDrag={this._onScrollEndDrag}
                    onScrollBeginDrag={this._onScrollBeginDrag}
                >
                    {this._renderScrollItem()}
                </ScrollView>
                {/*指示点*/}
                <View style={styles.indicatorViewStyle}>
                    {this._renderIndicator()}
                </View>
                {/*广告标题*/}
                <Text numberOfLines={1} style={styles.adTitleStyle}>{AdData.data[this.state.activePage].title}</Text>
            </View>
        );
    },
    componentDidMount(){
        this._startTimer()
    },
    componentWillUnmount(){
        clearInterval(this.timer);
    },
    _renderScrollItem(){
        // 组件数组
        var itemArr = [];
        // 颜色数组 ---> 数据数组
        var dataArr = AdData.data;
        // 遍历创建组件
        for (var i = 0; i < dataArr.length; i++) {
            itemArr.push(
                <TouchableOpacity key={i}
                                  onPress={() => this._onClickAd(dataArr[this.state.activePage].url, dataArr[this.state.activePage].title)}>
                    <Image source={{uri: dataArr[i].imageUrl}} style={styles.adImageStyles} resizeMode={'cover'}/>
                </TouchableOpacity>
            );
        }
        // 返回组件数组
        return itemArr;
    },
    _renderIndicator(){
        // 指示器数组
        var indicatorArr = [], style;
        // 遍历创建组件
        for (var i = 0; i < AdData.data.length; i++) {
            // 设置圆点的样式
            style = (i === this.state.activePage) ? {color: this.props.theme.themeColor} : {color: 'gray'}
            indicatorArr.push(
                <Text key={i} style={[{fontSize: 22}, style]}>&bull;</Text>
            );
        }
        // 返回数组
        return indicatorArr;
    },
    /**
     * 监听scrollview滑动
     * @param e
     */
    _onScrollAnimationEnd(e){
        var page = Math.floor(e.nativeEvent.contentOffset.x / GlobalStyles.window_width);
        this.setState({
            activePage: page
        });
    },
    _onScrollEndDrag(){
        this._startTimer();
    },

    _onScrollBeginDrag(){
        clearInterval(this.timer);
    },
    /**
     *
     */
    _startTimer(){
        var scrollView = this.refs.scrollView;
        var imagesCount = AdData.data.length;

        this.timer = setInterval(() => {
            // 设置临时页码
            var activePage;
            if ((this.state.activePage + 1) >= imagesCount) {
                activePage = 0;
            } else {
                activePage = this.state.activePage + 1;
            }
            ;
            var currentX = activePage * GlobalStyles.window_width;
            scrollView.scrollResponderScrollTo({x: currentX, y: 0, animated: true});
            this.setState({
                activePage: activePage
            });
        }, this.state.timer)
    },
    _onClickAd(url, title){

        // 判断
        if (this.props.onClickAd == null) return;
        // 执行回调函数
        this.props.onClickAd(url, title);
    }
})
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    indicatorViewStyle: {
        // 改变主轴的方向
        flexDirection: 'row',
        // 水平居中
        justifyContent: 'center',
        position: 'absolute',
        width: GlobalStyles.window_width,
        bottom: 6,
    },
    adImageStyles: {
        width: GlobalStyles.window_width,
        height: 100,
        backgroundColor: "white"
    },
    adTitleStyle:{
        fontSize: 12,
        color: 'white',
        position: 'absolute',
        bottom: 0,
        textAlign:'center',
        width: GlobalStyles.window_width,
        backgroundColor: 'rgba(52, 52, 52, 0.2)',
        paddingBottom: 3,
        paddingTop:5,
        paddingRight:5,
        paddingLeft:5
    }
});
module.exports = JAdView;

