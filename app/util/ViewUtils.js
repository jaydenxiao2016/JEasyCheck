/**
 * ViewUtils
 * @flow
 **/

import React  from 'react';
import Colors from '../res/Colors';
import {
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class ViewUtils {
    static getSettingItem(callBack, icon, text, tintStyle, expandableIco) {
        return (
            <TouchableOpacity
                onPress={callBack}>
                <View style={[styles.setting_item_container]}>
                    <View style={{alignItems: 'center', flexDirection: 'row'}}>
                        {icon ?
                            <Image source={icon} resizeMode='stretch'
                                   style={[{opacity: 1, width: 16, height: 16, marginRight: 10,}, tintStyle]}/> :
                            <View style={{opacity: 1, width: 16, height: 16, marginRight: 10,}} />
                        }
                        <Text>{text}</Text>
                    </View>
                    <Image source={expandableIco ? expandableIco : require('../res/images/ic_righn_arrow.png')}
                           style={[{
                               marginRight: 10,
                               height: 22,
                               width: 22,
                               alignSelf: 'center',
                               opacity: 1
                           }, tintStyle]}/>
                </View>
            </TouchableOpacity>
        )
    }
    static getMoreButton(callBack) {
        return <TouchableOpacity
            ref='moreMenuButton'
            underlayColor='transparent'
            style={{padding:5}}
            onPress={callBack}>
            <View style={{paddingRight:8}}>
                <Image
                    style={{width: 24, height: 24, marginLeft: 5}}
                    source={require('../res/images/ic_more_vert_white_48pt.png')}
                />
            </View>
        </TouchableOpacity>
    }

    static getLeftButton(callBack) {
        return <TouchableOpacity
            style={{padding:8}}
            onPress={callBack}>
            <Image
                style={{width: 26, height: 26,}}
                source={require('../res/images/ic_arrow_back_white_36pt.png')}/>
        </TouchableOpacity>
    }
}

const styles = StyleSheet.create({
    setting_item_container: {
        backgroundColor:Colors.white,
        padding: 10, height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
})