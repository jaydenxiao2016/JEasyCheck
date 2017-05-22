/**
 * Created by hisign on 2017/5/19.
 * 查询主界面
 */
import React, {Component} from "react";
import {Image, ListView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import BaseCommon from "../../common/BaseCommon";
import GlobalStyles from "../../res/styles/GlobalStyles";
import CompanyModel from "../../model/CompanyModel";
import Colors from "../../res/Colors";
import Constants from "../../res/Constants";
import ViewUtils from "../../util/ViewUtils";
import CompanyPage from "./CompanyPage";
import SearchResultPage from "./SearchResultPage";
import QRScannerPage from "../scan/QRScannerPage";
import TracesDataDao from "../../dao/TracesDataDao";
var allCompanyDatas = require('../../../LocalData/CompanyData.json');
var tracesDataDao = new TracesDataDao();

export default class SearchMainPage extends Component {
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        this.state = {
            canGoBack: false,
            title: this.props.title,
            expNo: this.props.expNo,
            companyData: null,
            dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
        }
    }

    componentDidMount() {
        this.baseCommon.componentDidMount();
        // 单号识别获取快递列表
        if (this.state.expNo) {
            this._getExpressData(this.state.expNo);
        }
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    render() {
        // 删除按钮
        let deleteView = this.state.expNo ? <TouchableOpacity
            style={styles.deleteViewStyles}
            onPress={() => this._deleteViewClick()}><Image
            source={require('../../res/images/ic_delete.png')}
            style={{
                width: 20,
                height: 20,
            }}
        /></TouchableOpacity> : null;
        return (
            <View style={GlobalStyles.listView_container}>
                {/*标题*/}
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={this.props.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                    title={this.state.title}
                />
                {/*输入框和扫描图标*/}
                <View style={styles.scanContainerStyle}>
                    <TextInput
                        style={[styles.inputStyle, {borderColor: this.props.theme.themeColor}]}
                        underlineColorAndroid='transparent'
                        placeholder={"请输入或扫描运单号"}
                        onfocus={true}
                        multiline={true}
                        keyboardType={'numeric'}
                        placeholderTextColor={Colors.gray}
                        onChangeText={(text) => {
                            this.setState({
                                expNo: text,
                            });
                            //单号识别获取快递列表
                            this._getExpressData(text);
                        }
                        }
                        value={this.state.expNo}
                    />
                    {/*删除图标*/}
                    {deleteView}
                    {/*扫描按钮*/}
                    <TouchableOpacity onPress={() => this._scanClick()}>
                        <Image source={require('../../res/images/ic_scan.png')}
                               style={[{
                                   width: 35,
                                   height: 35,
                                   marginRight: 5
                               }, this.props.theme.styles.tabBarSelectedIcon]}/>
                    </TouchableOpacity>
                </View>
                {/*快递列表*/}
                {this.renderExpressListView()}
            </View>
        );
    }

    /**
     * 符合的快递公司列表
     * @returns {XML}
     */
    renderExpressListView() {

        let renderExpressListView = this.state.companyData ? <ListView
            dataSource={this.state.dataSource}
            renderRow={(e) => this.renderRow(e)}
        /> : null;

        let otherExpressView = this.state.expNo ?
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => this._onClickOther()}>
                <Text style={{padding: 8, color: this.props.theme.themeColor}}>选择其他快递公司</Text>
            </TouchableOpacity> : null;

        return <View>
            {renderExpressListView}
            {otherExpressView}
        </View>
    }

    /**
     * 符合的快递列表
     * @param rowData
     * @param sectionId
     * @param rowID
     */
    renderRow(rowData, sectionId, rowID) {
        let logo = rowData.logo ? {uri: Constants.LogoBaseUrl + rowData.logo} : require('../../res/images/ic_logo_default.png');
        return <TouchableOpacity style={styles.itemStyle} onPress={() => this._onclickItem(rowData)}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginRight: 10}}>
                <Image source={logo}
                       style={{width: 34, height: 34, margin: 5, borderRadius: 17}}/>
                <Text>{rowData.ShipperName}</Text>
            </View>
            <Image source={require('../../res/images/ic_cell_rightarrow.png') }
                   style={{width: 8, height: 13, marginRight: 8, marginLeft: 5}}/>
        </TouchableOpacity>
    }

    /**
     * 清空内容
     * @private
     */
    _deleteViewClick() {
        this.setState({
            expNo: null,
        })
    }

    /**
     * 扫描点击
     * @private
     */
    _scanClick() {
        this.props.navigator.push({
            component: QRScannerPage,
            params: {
                'title': "扫码",
                'theme': this.props.theme,
                'callback': (result) => {
                    this.setState({
                        expNo: result,
                    });
                }
            }
        })
    }

    /**
     * 点击了快递公司
     * @private
     */
    _onclickItem(rowData) {
        let companyModel = new CompanyModel(rowData.ShipperCode, rowData.ShipperName, rowData.logo, this.state.expNo);
        this.props.navigator.push({
            component: SearchResultPage,
            params: {
                'title': "物流详情",
                'theme': this.props.theme,
                'companyModel': companyModel,
            }
        })
    }

    /**
     * 点击选择其他快递公司
     * @private
     */
    _onClickOther() {
        this.props.navigator.push({
            component: CompanyPage,
            params: {
                'title': "选择快递公司",
                'theme': this.props.theme,
                'expNo': this.state.expNo,
            }
        })
    }

    /**
     * 单号识别获取快递公司列表
     * @param expNo
     * @private
     */
    _getExpressData(expNo) {
        tracesDataDao._getExpressData(expNo)
            .then((responseJson) => {
                    if (responseJson && responseJson.Success && responseJson.Shippers.length > 0) {
                        for (let i = 0; i < responseJson.Shippers.length; i++) {
                            responseJson.Shippers[i].logo = this._filterCompanyLogo(responseJson.Shippers[i].ShipperCode);
                        }
                        // 更新数据源
                        this.setState({
                            companyData: responseJson.Shippers,
                            dataSource: this.state.dataSource.cloneWithRows(responseJson.Shippers)
                        });
                    } else {
                        this.setState({
                            companyData: null,
                            dataSource: this.state.dataSource.cloneWithRows([])
                        });
                    }
                }
            ).catch((error) => {
            this.setState({
                companyData: null,
                dataSource: this.state.dataSource.cloneWithRows([])
            });
            console.log("接口访问错误" + error)
        });
    }

    /**
     * 获取快递公司logo
     * @private
     */
    _filterCompanyLogo(code) {
        // 遍历
        for (var i = 0; i < allCompanyDatas.length; i++) {
            let company = allCompanyDatas[i].company;
            let logoUrl = null;
            // 4. 遍历所有的车数组
            for (var j = 0; j < company.length; j++) {
                if (code == company[j].code) {
                    logoUrl = company[j].logo;
                    break;
                }
            }
            return logoUrl;
        }
    }

}
const styles = StyleSheet.create({
    scanContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deleteViewStyles: {
        position: "absolute",
        right: 65
    },
    inputStyle: {
        textAlignVertical: 'center',
        paddingLeft: 8,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 40,
        fontSize: 16,
        height: 40,
        width: GlobalStyles.window_width - 70,
        borderWidth: 1,
        margin: 10,
        borderRadius: 2
    }
    ,
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        padding: 5,
        borderColor: Colors.lightgray
    }
})