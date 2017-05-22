/**
 * AboutPage
 * 关于
 * hisign
 */

import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ListView,
    Platform,
    PixelRatio,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Share
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import BaseCommon from '../../common/BaseCommon'
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import Constants from '../../res/Constants'

export default class AboutCommon {
    constructor(props, updateState) {
        this.props = props;
        this.baseCommon=new BaseCommon({...props,backPress:(e)=>this.onBackPress(e)});
        this.updateState = updateState;
    }
    onBackPress(e){
        this.props.navigator.pop();
        return true;
    }
    componentDidMount() {
        this.baseCommon.componentDidMount();
    }
    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    /**
     * 分享
     */
    onShare() {
        Share.share({
            message: Constants.ShareContent,
            url: Constants.ShareUrl,
            title:Constants.ShareTitle
        });
    };

    getParallaxRenderConfig(params) {
        let config = {};
        let avatar=typeof(params.avatar)==='string' ? {uri:params.avatar}:params.avatar;
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );
        config.renderForeground = () => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={styles.avatar} source={avatar}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        );
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );
        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(()=>this.props.navigator.pop())}
                <TouchableOpacity  onPress={()=>{
                    this.onShare();
                }} >
                <Image source={require('../../res/images/ic_share.png')} resizeMode='stretch'
                       style={[{opacity: .9, width: 18, height: 18, marginRight: 10, tintColor: 'white'}]}/>
                </TouchableOpacity>

            </View>
        );
        return config;
    }

    render(contentView,params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                contentBackgroundColor={GlobalStyles.backgroundColor}
                backgroundColor={this.props.theme.themeColor}
                headerBackgroundColor="#333"
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT =(Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios+20:GlobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20:0,
        alignItems: 'center',
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 8,
        paddingTop: (Platform.OS === 'ios') ? 20:0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fixedSectionText: {
        color: 'white',
        fontSize: 20,
        opacity: .9,
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 60
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: 5,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
});
