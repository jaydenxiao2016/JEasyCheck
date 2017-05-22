/**
 * Created by hisign on 2017/5/25.
 * 快递查询历史
 */
import React, {Component} from "react";
import Constants from "../res/Constants";
import ThemeFactory,{ThemeFlags} from '../res/styles/ThemeFactory';
import moment from "moment";
import Colors from '../res/Colors';
export default class HistorySearchDao {
    constructor() {
    }
    /**
     * 保存查询记录到本地
     * @param id
     * @param traces
     */
    saveSearchDataToLocal(id ,companyModel){
        companyModel.RecentTime=moment().format('YYYY/MM/DD HH:mm:ss').valueOf();
        storage.save({
            key: Constants.SeachHistroyKey,   // Note: Do not use underscore("_") in key!
            id:id,
            data: companyModel,
            // if not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            expires: null
        });
    }
    /**
     *获取本地所有查询记录
     * @param key
     * @returns {Promise}
     */
    loadAllSearchDataFromLocal(key){
        return new Promise((resolve,reject)=>{
            storage.getAllDataForKey(key).then(companyModels => {
                resolve(companyModels);
            }).catch(err => {
                reject(err);
            });
        })
    }
    /**
     * 保存备注记录到本地
     * @param id
     * @param traces
     */
    saveRearkDataToLocal(id ,remark){
        storage.save({
            key: Constants.SeachRemarkKey,   // Note: Do not use underscore("_") in key!
            id:id,
            data: remark,
            // if not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            expires: null
        });
    }

    /**
     *获取本地备注记录
     * @param key
     * @returns {Promise}
     */
    loadRemarkDataFromLocalById(id){
        return new Promise((resolve,reject)=>{
            storage.load({
                key:Constants.SeachRemarkKey,
                id:id
            }).then(remark => {
                resolve(remark);
            }).catch(err => {
                reject(err);
            });
        })
    }
    /**
     * 保存主题记录到本地
     * @param id
     * @param traces
     */
    saveThemeDataToLocal(theme){
        console.log(theme);
        storage.save({
            key: Constants.SeachRemarkKey,   // Note: Do not use underscore("_") in key!
            id: Constants.SeachRemarkKey,
            data: theme,
            // if not specified, the defaultExpires will be applied instead.
            // if set to null, then it will never expire.
            expires: null
        });
    }
    /**
     *获取本地主题记录
     * @param key
     * @returns {Promise}
     */
    loadThemeDataFromLocal(){
        return new Promise((resolve,reject)=>{
            storage.load({
                key:Constants.SeachRemarkKey,
                id:Constants.SeachRemarkKey
            }).then(theme => {
                if(theme){
                    resolve(ThemeFactory.createTheme(theme));
                }else {
                    resolve(ThemeFactory.createTheme(ThemeFlags.Blue));
                }
            }).catch(err => {
                resolve(ThemeFactory.createTheme(ThemeFlags.Blue));
            });
        })
    }
    /**
     * 移除本地记录
     * @param key
     */
    removeLocalSearchDataByKey(key){
        storage.remove({
            key: key
        });
    }
    /**
     * 移除本地记录
     * @param key
     */
    removeLocalSearchDataByKeyId(key,id){
        storage.remove({
            key: key,
            id:id
        });
    }
}