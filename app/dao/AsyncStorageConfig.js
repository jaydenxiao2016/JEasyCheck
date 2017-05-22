/**
 * Created by hisign on 2017/5/25.
 */
import Storage from "react-native-storage";
import {AsyncStorage} from "react-native";
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
})
global.storage = storage;