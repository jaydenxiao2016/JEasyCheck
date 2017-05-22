/**
 * Created by hisign on 2017/5/19.
 * 全局样式
 */
import {
    Dimensions,
} from 'react-native'
import Colors from "../../res/Colors";
const {height, width} = Dimensions.get('window');

module.exports ={
    line: {
        flex: 1,
        height: 0.4,
        opacity:0.5,
        backgroundColor: 'darkgray',
    },
    cell_container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor:Colors.lightgray,
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor:Colors.gray,
        shadowOffset: {width:0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation:2
    },
    listView_container:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    backgroundColor: Colors.white,
    listView_height:(height-(20+40)),
    window_height:height,
    window_width:width,
    nav_bar_height_ios:44,
    nav_bar_height_android:50,

};