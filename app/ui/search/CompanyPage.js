/**
 * 选择快递公司
 */

import React, {Component} from "react";
import {ListView, StyleSheet, Text, TouchableOpacity, View,Image} from "react-native";
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../util/ViewUtils";
import Constants from "../../res/Constants";
import BaseCommon from "../../common/BaseCommon";
import CompanyModel from "../../model/CompanyModel";
import SearchResultPage from "./SearchResultPage";

var Companys = require('../../../LocalData/CompanyData.json');

export default class CompanyPage extends Component {

    // 初始化模拟数据
    constructor(props) {
        super(props);
        this.baseCommon = new BaseCommon({...props, backPress: (e) => this.onBackPress(e)});
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        }
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        }
        this.state = {
            canGoBack: false,
            title: this.props.title,
            expNo:this.props.expNo,
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData, // 获取组中数据
                getRowData: getRowData, // 获取行中的数据
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged:(s1, s2) => s1 !== s2
            })
        };
    }
    componentDidMount() {
        this.loadDataFromJson();
        this.baseCommon.componentDidMount();
    }

    componentWillUnmount() {
        this.baseCommon.componentWillUnmount();
    }

    onBackPress(e) {
        this.props.navigator.pop();
        return true;
    }

    loadDataFromJson() {
        // 定义一些变量
        var dataBlob = {},
            sectionIDs = [],
            rowIDs = [],
            company = [];

        // 遍历
        for (var i = 0; i < Companys.length; i++) {
            // 1. 把组号放入sectionIDs数组中
            sectionIDs.push(i);

            // 2.把组中内容放入dataBlob对象中
            dataBlob[i] = Companys[i].title

            // 3. 取出该组中所有的车
            company = Companys[i].company;
            rowIDs[i] = [];

            // 4. 遍历所有的车数组
            for (var j = 0; j < company.length; j++) {
                // 把行号放入rowIDs
                rowIDs[i].push(j);
                // 把每一行中的内容放入dataBlob对象中
                dataBlob[i + ':' + j] = company[j];
            }
        }

        // 更新状态
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
        });
    }

    render() {
        return (
            <View style={styles.outerViewStyle}>
                {/*标题*/}
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={this.props.theme.styles.navBar}
                    leftButton={ViewUtils.getLeftButton(() => this.onBackPress())}
                    title={this.state.title}
                />
                {/*ListView*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderSectionHeader={this.renderSectionHeader.bind(this)}
                />
            </View>
        );
    }

    // 每一行的数据
    renderRow(rowData) {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{
                this._onClickCompany(rowData)
            }} >
                <View style={styles.rowStyle}>
                    <Image source={{uri: Constants.LogoBaseUrl+rowData.logo} }style={styles.rowImageStyle}/>
                    <Text style={{marginLeft: 5}}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    // 每一组中的数据
    renderSectionHeader(sectionData, sectionID) {
        return (
            <View style={styles.sectionHeaderViewStyle} >
                <Text style={{marginLeft: 8, color: 'red'}}>{sectionData}</Text>
            </View>
        );
    }

    /**
     * 点击快递公司
     * @param rowData
     * @private
     */
    _onClickCompany(rowData){
        let companyModel=new CompanyModel(rowData.code,rowData.name,rowData.logo,this.state.expNo);
        this.props.navigator.push({
            component: SearchResultPage,
            params: {
                'title': "物流详情",
                'theme': this.props.theme,
                'companyModel':companyModel,
            }
        })
    }
};

// 设置样式
const styles = StyleSheet.create({
    outerViewStyle: {
        //占满窗口
        flex: 1
    },

    headerViewStyle: {
        height: 44,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center'
    },

    rowStyle: {
        // 设置主轴的方向
        flexDirection: 'row',
        // 侧轴方向居中
        alignItems: 'center',
        padding: 10,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5
    },

    rowImageStyle: {
        width: 50,
        height: 50,
        borderRadius:25
    },

    sectionHeaderViewStyle: {
        backgroundColor: '#e8e8e8',
        height: 25,
        justifyContent: 'center'
    }
});

